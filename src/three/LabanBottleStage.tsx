import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { ChevronDown, ChevronUp, Layers, Pause, Play, RotateCcw } from 'lucide-react';
import { LABAN_PRODUCTS, type FlavourKey } from '../data/catalog';
import { buildLabanBottleRig, type LabanBottleRig } from './bottleBuilder';

interface LabanBottleStageProps {
  activeFlavour: FlavourKey;
  onFlavourChange: (flavour: FlavourKey) => void;
  onEnquireFlavour?: (flavour: FlavourKey) => void;
  compact?: boolean;
}

type CameraPreset = 'hero' | 'label' | 'crown';

const CAMERA_PRESETS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  hero: { pos: [0.35, 0.35, 4.45], target: [0, -0.08, 0] },
  label: { pos: [0.0, -0.45, 2.95], target: [0, -0.58, 0] },
  crown: { pos: [1.4, 2.05, 2.75], target: [0, 0.72, 0] },
};

const FLAVOUR_LIGHTS: Record<FlavourKey, number> = {
  strawberry: 0xff3b78,
  cola: 0xffb020,
  wine: 0xb83280,
};

const _camTargetPos = new THREE.Vector3();
const _camTargetLook = new THREE.Vector3();

export function LabanBottleStage({
  activeFlavour,
  onFlavourChange,
  onEnquireFlavour,
  compact = false,
}: LabanBottleStageProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<LabanBottleRig | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);

  const [exploded, setExploded] = useState(false);
  const [autoSpin, setAutoSpin] = useState(true);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('hero');
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  const explodedRef = useRef(exploded);
  const autoSpinRef = useRef(autoSpin);
  const activeTransitionRef = useRef(false);
  const spinImpulseRef = useRef(0);

  explodedRef.current = exploded;
  autoSpinRef.current = autoSpin;

  useEffect(() => {
    rigRef.current?.setFlavour(activeFlavour);
    spinImpulseRef.current = Math.PI * 1.1;
    if (rimLightRef.current) {
      rimLightRef.current.color.setHex(FLAVOUR_LIGHTS[activeFlavour]);
    }
  }, [activeFlavour]);

  useEffect(() => {
    const preset = CAMERA_PRESETS[cameraPreset];
    _camTargetPos.set(...preset.pos);
    _camTargetLook.set(...preset.target);
    activeTransitionRef.current = true;
  }, [cameraPreset]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    const width = container.clientWidth || 560;
    const height = container.clientHeight || 520;

    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglUnavailable(true);
    };
    const handleContextRestored = () => {
      setWebglUnavailable(false);
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    scene.background = null;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTex = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    scene.environment = envTex;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 45);
    camera.position.set(...CAMERA_PRESETS.hero.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 2.4;
    controls.maxDistance = 6.8;
    controls.minPolarAngle = Math.PI * 0.18;
    controls.maxPolarAngle = Math.PI * 0.62;
    controls.target.set(...CAMERA_PRESETS.hero.target);
    controls.update();

    const onControlStart = () => {
      activeTransitionRef.current = false;
    };
    controls.addEventListener('start', onControlStart);

    // 3-Point Studio Lighting + RectAreaLight softboxes on GPU
    const hemiLight = new THREE.HemisphereLight(0xd8b4fe, 0x1e0537, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff4dc, 2.15);
    keyLight.position.set(3.5, 5.2, 4.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 16;
    const d = 2.6;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const limeRimLight = new THREE.DirectionalLight(0xc8f52c, 1.35);
    limeRimLight.position.set(-4.0, 2.2, -3.5);
    scene.add(limeRimLight);

    const flavourRim = new THREE.PointLight(FLAVOUR_LIGHTS[activeFlavour], 3.2, 9, 1.5);
    flavourRim.position.set(2.2, -0.2, -2.4);
    scene.add(flavourRim);
    rimLightRef.current = flavourRim;

    if (!isSoftwareGl) {
      RectAreaLightUniformsLib.init();
      const softboxLeft = new THREE.RectAreaLight(0xffffff, 2.4, 2.2, 3.8);
      softboxLeft.position.set(-3.2, 0.8, 2.6);
      softboxLeft.lookAt(0, 0, 0);
      scene.add(softboxLeft);
    }

    // Floating Composite Procedural LABAN Bottle Rig (zero opaque plinth/background)
    const rig = buildLabanBottleRig(isSoftwareGl, renderer.capabilities.getMaxAnisotropy());
    rig.setFlavour(activeFlavour);
    scene.add(rig.root);
    rigRef.current = rig;

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    let explodeProgress = 0;

    function tick() {
      if (disposed) return;
      const delta = Math.min(0.05, clock.getDelta());
      const elapsed = clock.getElapsedTime();

      if (activeTransitionRef.current) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, _camTargetPos.x, 5.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, _camTargetPos.y, 5.5, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, _camTargetPos.z, 5.5, delta);
        controls.target.x = THREE.MathUtils.damp(controls.target.x, _camTargetLook.x, 5.5, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, _camTargetLook.y, 5.5, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, _camTargetLook.z, 5.5, delta);
        if (camera.position.distanceTo(_camTargetPos) < 0.025) {
          activeTransitionRef.current = false;
        }
      }

      if (!prefersReducedMotion) {
        if (spinImpulseRef.current > 0.01) {
          const step = Math.min(spinImpulseRef.current, delta * 5.2);
          rig.bottleGroup.rotation.y += step;
          spinImpulseRef.current -= step;
        } else if (autoSpinRef.current) {
          rig.bottleGroup.rotation.y += delta * 0.42;
        }
      }

      explodeProgress = THREE.MathUtils.damp(explodeProgress, explodedRef.current ? 1 : 0, 6, delta);
      rig.update(prefersReducedMotion ? 0 : elapsed, delta, explodeProgress);

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    if (isSoftwareGl) {
      renderer.render(scene, camera);
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    const handleResize = () => {
      if (!container || disposed) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      rig.dispose();
      envTex.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const currentProduct = LABAN_PRODUCTS.find((p) => p.id === activeFlavour) || LABAN_PRODUCTS[0];

  return (
    <div
      className={`relative w-full ${
        compact ? 'h-[400px] sm:h-[460px]' : 'h-[460px] sm:h-[520px] lg:h-[560px]'
      } overflow-hidden bg-transparent`}
    >
      {/* Dedicated Isolated WebGL Canvas Container (100% transparent background, zero overlay text) */}
      {!webglUnavailable ? (
        <div
          ref={mountRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          aria-label={`Interactive 3D floating bottle of ${currentProduct.name}`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center p-6">
          <img
            src={currentProduct.image}
            alt={currentProduct.imageAlt}
            referrerPolicy="no-referrer"
            className="max-h-full rounded-xl object-contain"
          />
        </div>
      )}

      {/* Collapsible Bottom Control Dock */}
      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center transition-transform duration-200"
        style={{
          width: 'min(96%, 640px)',
          transform: dockCollapsed ? 'translate(-50%, calc(100% - 34px))' : 'translate(-50%, 0)',
        }}
      >
        <button
          type="button"
          onClick={() => setDockCollapsed((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-t-lg bg-[#1A0430] border border-b-0 border-white/20 text-[11px] font-bold text-white/90 hover:text-[#C8F52C]"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Show 3D Controls
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Hide Controls
            </>
          )}
        </button>

        <div className="w-full rounded-xl bg-[#1A0430]/95 border border-white/20 p-2.5 shadow-xl flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1 bg-white/10 p-1 rounded-lg">
            {LABAN_PRODUCTS.map((prod) => {
              const active = prod.id === activeFlavour;
              return (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => onFlavourChange(prod.id)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#C8F52C] text-[#21063D]'
                      : 'text-white/85 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {prod.name.replace('LABAN ', '')}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['hero', 'label', 'crown'] as CameraPreset[]).map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCameraPreset(preset)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors whitespace-nowrap shrink-0 ${
                  cameraPreset === preset
                    ? 'bg-white text-[#21063D]'
                    : 'bg-white/10 text-white/85 hover:bg-white/20'
                }`}
              >
                {preset}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setExploded((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                exploded ? 'bg-[#FFD33F] text-[#21063D]' : 'bg-white/10 text-white/85 hover:bg-white/20'
              }`}
              title="Toggle exploded packaging view"
            >
              <Layers className="w-3.5 h-3.5" />
              Explode
            </button>

            <button
              type="button"
              onClick={() => setAutoSpin((prev) => !prev)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20"
              aria-label={autoSpin ? 'Pause turntable spin' : 'Resume turntable spin'}
              title={autoSpin ? 'Pause spin' : 'Auto-spin'}
            >
              {autoSpin ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setCameraPreset('hero');
                setExploded(false);
                setAutoSpin(true);
                spinImpulseRef.current = Math.PI * 2;
              }}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-white hover:bg-white/20"
              aria-label="Reset 3D camera"
              title="Reset view"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {onEnquireFlavour && (
              <button
                type="button"
                onClick={() => onEnquireFlavour(activeFlavour)}
                className="px-3 py-1.5 rounded-lg bg-[#35105F] border border-[#C8F52C]/50 text-[#C8F52C] text-xs font-bold hover:bg-[#4b1a82] whitespace-nowrap shrink-0"
              >
                Enquire
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
