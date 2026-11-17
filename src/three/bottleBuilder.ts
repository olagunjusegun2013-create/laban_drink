import * as THREE from 'three';
import type { FlavourKey } from '../data/catalog';
import {
  createBodyLabelTexture,
  createNeckCollarTexture,
} from './labelTextures';

export interface BubbleParticle {
  angle: number;
  radius: number;
  y: number;
  speed: number;
  scale: number;
}

export interface GarnishOrbiter {
  mesh: THREE.Object3D;
  baseRadius: number;
  baseY: number;
  phase: number;
  speed: number;
}

export interface LabanBottleRig {
  root: THREE.Group;
  bottleGroup: THREE.Group;
  glassMesh: THREE.Mesh;
  liquidMesh: THREE.Mesh;
  labelMesh: THREE.Mesh;
  neckMesh: THREE.Mesh;
  capGroup: THREE.Group;
  dropletsMesh: THREE.InstancedMesh;
  bubblesMesh: THREE.InstancedMesh;
  bubbles: BubbleParticle[];
  garnishGroup: THREE.Group;
  garnishOrbiters: GarnishOrbiter[];
  setFlavour: (flavour: FlavourKey) => void;
  update: (elapsed: number, delta: number, explodeFactor: number) => void;
  dispose: () => void;
}

const LIQUID_COLORS: Record<FlavourKey, { color: number; emissive: number; attenuation: number }> = {
  strawberry: { color: 0xe11d58, emissive: 0x3b0719, attenuation: 0xd81b60 },
  cola: { color: 0x2c1106, emissive: 0x160702, attenuation: 0x5c2a14 },
  wine: { color: 0x5e0f3b, emissive: 0x220416, attenuation: 0x6a1b4d },
};

const _dummy = new THREE.Object3D();
const _targetColor = new THREE.Color();
const _targetEmissive = new THREE.Color();

export function buildLabanBottleRig(isSoftwareGl: boolean, maxAnisotropy: number): LabanBottleRig {
  const root = new THREE.Group();
  const bottleGroup = new THREE.Group();
  // Bottom-center pivot offset so bottle sits flush above studio plinth
  bottleGroup.position.set(0, 0, 0);
  root.add(bottleGroup);

  const disposableGeometries: THREE.BufferGeometry[] = [];
  const disposableMaterials: THREE.Material[] = [];
  const disposableTextures: THREE.Texture[] = [];

  // 1. Outer Glass Silhouette (LatheGeometry)
  const glassProfile: THREE.Vector2[] = [
    new THREE.Vector2(0.0, -1.52),
    new THREE.Vector2(0.46, -1.52),
    new THREE.Vector2(0.56, -1.44),
    new THREE.Vector2(0.58, -1.32),
    new THREE.Vector2(0.58, 0.14),
    new THREE.Vector2(0.56, 0.32),
    new THREE.Vector2(0.42, 0.62),
    new THREE.Vector2(0.24, 0.96),
    new THREE.Vector2(0.21, 1.38),
    new THREE.Vector2(0.245, 1.44),
    new THREE.Vector2(0.245, 1.5),
    new THREE.Vector2(0.19, 1.52),
    new THREE.Vector2(0.18, 1.44),
  ];
  const glassGeo = new THREE.LatheGeometry(glassProfile, 48);
  glassGeo.computeVertexNormals();
  disposableGeometries.push(glassGeo);

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.06,
    metalness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    ior: 1.52,
    reflectivity: 1.0,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    envMapIntensity: 1.75,
  });
  disposableMaterials.push(glassMat);

  const glassMesh = new THREE.Mesh(glassGeo, glassMat);
  glassMesh.renderOrder = 3;
  glassMesh.castShadow = true;
  bottleGroup.add(glassMesh);

  // 2. Inner Sparkling Liquid Core (LatheGeometry)
  const liquidProfile: THREE.Vector2[] = [
    new THREE.Vector2(0.0, -1.42),
    new THREE.Vector2(0.51, -1.42),
    new THREE.Vector2(0.535, -1.3),
    new THREE.Vector2(0.535, 0.12),
    new THREE.Vector2(0.51, 0.3),
    new THREE.Vector2(0.37, 0.6),
    new THREE.Vector2(0.21, 0.92),
    new THREE.Vector2(0.175, 1.06),
    new THREE.Vector2(0.0, 1.06),
  ];
  const liquidGeo = new THREE.LatheGeometry(liquidProfile, 40);
  liquidGeo.computeVertexNormals();
  disposableGeometries.push(liquidGeo);

  const liquidMat = new THREE.MeshPhysicalMaterial({
    color: LIQUID_COLORS.strawberry.color,
    emissive: LIQUID_COLORS.strawberry.emissive,
    emissiveIntensity: 0.45,
    roughness: 0.14,
    metalness: 0.04,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.1,
  });
  disposableMaterials.push(liquidMat);

  const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
  liquidMesh.renderOrder = 1;
  bottleGroup.add(liquidMesh);

  // 3. Curved Wrap-Around Brand Label (CylinderGeometry open-ended)
  const labelTextures: Record<FlavourKey, THREE.CanvasTexture> = {
    strawberry: createBodyLabelTexture('strawberry', maxAnisotropy),
    cola: createBodyLabelTexture('cola', maxAnisotropy),
    wine: createBodyLabelTexture('wine', maxAnisotropy),
  };
  disposableTextures.push(labelTextures.strawberry, labelTextures.cola, labelTextures.wine);

  const labelGeo = new THREE.CylinderGeometry(0.586, 0.586, 1.12, 48, 1, true);
  // Rotate so centre of texture faces +Z camera
  labelGeo.rotateY(Math.PI);
  disposableGeometries.push(labelGeo);

  const labelMat = new THREE.MeshStandardMaterial({
    map: labelTextures.strawberry,
    roughness: 0.42,
    metalness: 0.08,
    envMapIntensity: 0.75,
  });
  disposableMaterials.push(labelMat);

  const labelMesh = new THREE.Mesh(labelGeo, labelMat);
  labelMesh.position.y = -0.62;
  labelMesh.renderOrder = 4;
  labelMesh.castShadow = true;
  bottleGroup.add(labelMesh);

  // 4. Tapered Neck Collar Sleeve
  const neckTex = createNeckCollarTexture(maxAnisotropy);
  disposableTextures.push(neckTex);

  const neckGeo = new THREE.CylinderGeometry(0.214, 0.252, 0.28, 36, 1, true);
  neckGeo.rotateY(Math.PI);
  disposableGeometries.push(neckGeo);

  const neckMat = new THREE.MeshStandardMaterial({
    map: neckTex,
    roughness: 0.38,
    metalness: 0.14,
  });
  disposableMaterials.push(neckMat);

  const neckMesh = new THREE.Mesh(neckGeo, neckMat);
  neckMesh.position.y = 1.15;
  neckMesh.renderOrder = 4;
  bottleGroup.add(neckMesh);

  // 5. Metallic Crown Cap Group (Top disc + crimped skirt + accent ring)
  const capGroup = new THREE.Group();
  capGroup.position.y = 1.52;
  bottleGroup.add(capGroup);

  const capTopGeo = new THREE.CylinderGeometry(0.245, 0.255, 0.09, 24);
  const capSkirtGeo = new THREE.TorusGeometry(0.248, 0.025, 10, 24);
  capSkirtGeo.rotateX(Math.PI / 2);
  const capRingGeo = new THREE.TorusGeometry(0.18, 0.014, 8, 24);
  capRingGeo.rotateX(Math.PI / 2);
  disposableGeometries.push(capTopGeo, capSkirtGeo, capRingGeo);

  const capGoldMat = new THREE.MeshStandardMaterial({
    color: 0xffd33f,
    metalness: 0.88,
    roughness: 0.22,
    envMapIntensity: 1.4,
  });
  const capPurpleMat = new THREE.MeshStandardMaterial({
    color: 0x35105f,
    metalness: 0.72,
    roughness: 0.28,
  });
  disposableMaterials.push(capGoldMat, capPurpleMat);

  const capTop = new THREE.Mesh(capTopGeo, capGoldMat);
  capTop.position.y = 0.02;
  const capSkirt = new THREE.Mesh(capSkirtGeo, capGoldMat);
  capSkirt.position.y = -0.025;
  const capAccent = new THREE.Mesh(capRingGeo, capPurpleMat);
  capAccent.position.y = 0.068;
  capGroup.add(capTop, capSkirt, capAccent);

  // 6. Chilled External Condensation Micro-Droplets (InstancedMesh)
  const dropletCount = 72;
  const dropletGeo = new THREE.SphereGeometry(0.017, 8, 8);
  disposableGeometries.push(dropletGeo);

  const dropletMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.06,
    metalness: 0.05,
    transparent: true,
    opacity: 0.72,
    clearcoat: 1.0,
  });
  disposableMaterials.push(dropletMat);

  const dropletsMesh = new THREE.InstancedMesh(dropletGeo, dropletMat, dropletCount);
  dropletsMesh.renderOrder = 5;
  for (let i = 0; i < dropletCount; i++) {
    const angle = (i * 2.39996) % (Math.PI * 2);
    const band = i % 3;
    const y = band === 0 ? -1.25 + (i % 9) * 0.05 : band === 1 ? 0.02 + (i % 7) * 0.045 : 0.45 + (i % 6) * 0.06;
    const r = y > 0.2 ? 0.56 - (y - 0.2) * 0.45 : 0.586;
    _dummy.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);
    const s = 0.65 + ((i * 7) % 10) * 0.08;
    _dummy.scale.set(s, s * 1.25, s);
    _dummy.updateMatrix();
    dropletsMesh.setMatrixAt(i, _dummy.matrix);
  }
  dropletsMesh.instanceMatrix.needsUpdate = true;
  dropletsMesh.computeBoundingSphere();
  bottleGroup.add(dropletsMesh);

  // 7. Rising Carbonation Fizz Bubbles inside Liquid Core (InstancedMesh)
  const bubbleCount = 48;
  const bubbleGeo = new THREE.SphereGeometry(0.018, 8, 8);
  disposableGeometries.push(bubbleGeo);

  const bubbleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.4,
    roughness: 0.1,
    transparent: true,
    opacity: 0.65,
  });
  disposableMaterials.push(bubbleMat);

  const bubblesMesh = new THREE.InstancedMesh(bubbleGeo, bubbleMat, bubbleCount);
  bubblesMesh.frustumCulled = false;
  bubblesMesh.renderOrder = 2;

  const bubbles: BubbleParticle[] = [];
  for (let i = 0; i < bubbleCount; i++) {
    bubbles.push({
      angle: (i * 1.71) % (Math.PI * 2),
      radius: 0.1 + ((i * 13) % 100) * 0.0036,
      y: -1.35 + ((i * 29) % 100) * 0.022,
      speed: 0.28 + ((i * 17) % 10) * 0.045,
      scale: 0.5 + ((i * 11) % 8) * 0.12,
    });
  }
  bottleGroup.add(bubblesMesh);

  // 8. Orbital Floating 3D Flavour Garnishes
  const garnishGroup = new THREE.Group();
  root.add(garnishGroup);
  const garnishOrbiters: GarnishOrbiter[] = [];

  const iceGeo = new THREE.BoxGeometry(0.24, 0.24, 0.24);
  const grapeGeo = new THREE.SphereGeometry(0.085, 14, 14);
  const splashRingGeo = new THREE.TorusGeometry(0.18, 0.032, 12, 28);
  disposableGeometries.push(iceGeo, grapeGeo, splashRingGeo);

  const iceMat = new THREE.MeshPhysicalMaterial({
    color: 0xe6f7ff,
    roughness: 0.12,
    metalness: 0.05,
    clearcoat: 1.0,
    transparent: true,
    opacity: 0.78,
  });
  const grapeMat = new THREE.MeshPhysicalMaterial({
    color: 0x4c0d3d,
    roughness: 0.22,
    clearcoat: 0.8,
  });
  const colaSplashMat = new THREE.MeshPhysicalMaterial({
    color: 0xb45309,
    emissive: 0x451a03,
    emissiveIntensity: 0.35,
    roughness: 0.12,
    clearcoat: 1.0,
  });
  disposableMaterials.push(iceMat, grapeMat, colaSplashMat);

  function populateGarnishes(flavour: FlavourKey) {
    while (garnishGroup.children.length > 0) {
      garnishGroup.remove(garnishGroup.children[0]);
    }
    garnishOrbiters.length = 0;

    if (flavour === 'strawberry') {
      for (let i = 0; i < 4; i++) {
        const cube = new THREE.Mesh(iceGeo, iceMat);
        garnishGroup.add(cube);
        garnishOrbiters.push({
          mesh: cube,
          baseRadius: 1.24,
          baseY: -0.75 + i * 0.52,
          phase: i * 1.55,
          speed: 0.42,
        });
      }
    } else if (flavour === 'cola') {
      for (let i = 0; i < 5; i++) {
        const cube = new THREE.Mesh(iceGeo, iceMat);
        garnishGroup.add(cube);
        garnishOrbiters.push({
          mesh: cube,
          baseRadius: 1.15 + (i % 2) * 0.18,
          baseY: -0.85 + i * 0.44,
          phase: i * 1.25,
          speed: 0.5,
        });
      }
      for (let i = 0; i < 2; i++) {
        const ring = new THREE.Mesh(splashRingGeo, colaSplashMat);
        garnishGroup.add(ring);
        garnishOrbiters.push({
          mesh: ring,
          baseRadius: 1.05,
          baseY: -0.15 + i * 0.65,
          phase: i * 3.1,
          speed: 0.68,
        });
      }
    } else {
      // Wine: vineyard grape clusters & crystal ring
      for (let c = 0; c < 3; c++) {
        const cluster = new THREE.Group();
        const offsets = [
          [0, 0, 0],
          [0.09, -0.06, 0.05],
          [-0.08, -0.07, 0.04],
          [0.02, -0.14, -0.05],
          [0.06, 0.08, -0.03],
        ];
        offsets.forEach(([ox, oy, oz]) => {
          const g = new THREE.Mesh(grapeGeo, grapeMat);
          g.position.set(ox, oy, oz);
          cluster.add(g);
        });
        garnishGroup.add(cluster);
        garnishOrbiters.push({
          mesh: cluster,
          baseRadius: 1.18,
          baseY: -0.55 + c * 0.55,
          phase: c * 2.08,
          speed: 0.45,
        });
      }
      const crystalRing = new THREE.Mesh(splashRingGeo, iceMat);
      garnishGroup.add(crystalRing);
      garnishOrbiters.push({
        mesh: crystalRing,
        baseRadius: 1.08,
        baseY: 0.55,
        phase: 1.1,
        speed: 0.55,
      });
    }
  }

  let currentFlavour: FlavourKey = 'strawberry';
  populateGarnishes('strawberry');

  function setFlavour(flavour: FlavourKey) {
    currentFlavour = flavour;
    labelMat.map = labelTextures[flavour];
    labelMat.needsUpdate = true;
    populateGarnishes(flavour);
  }

  function update(elapsed: number, delta: number, explodeFactor: number) {
    const spec = LIQUID_COLORS[currentFlavour];
    _targetColor.setHex(spec.color);
    _targetEmissive.setHex(spec.emissive);
    liquidMat.color.lerp(_targetColor, Math.min(1, delta * 6));
    liquidMat.emissive.lerp(_targetEmissive, Math.min(1, delta * 6));

    // Smooth exploded-view layer separation
    const capYTarget = 1.52 + explodeFactor * 0.72;
    const neckYTarget = 1.15 + explodeFactor * 0.42;
    const labelZTarget = explodeFactor * 0.52;
    const liquidYTarget = -explodeFactor * 0.28;

    capGroup.position.y = THREE.MathUtils.damp(capGroup.position.y, capYTarget, 8, delta);
    neckMesh.position.y = THREE.MathUtils.damp(neckMesh.position.y, neckYTarget, 8, delta);
    labelMesh.position.z = THREE.MathUtils.damp(labelMesh.position.z, labelZTarget, 8, delta);
    liquidMesh.position.y = THREE.MathUtils.damp(liquidMesh.position.y, liquidYTarget, 8, delta);

    // Subtle celebratory levitation bob
    bottleGroup.position.y = Math.sin(elapsed * 1.45) * 0.06;

    // Animate rising carbonation bubbles inside the liquid core
    for (let i = 0; i < bubbleCount; i++) {
      const b = bubbles[i];
      b.y += b.speed * delta;
      if (b.y > 0.96) {
        b.y = -1.36;
      }
      const wobble = Math.sin(elapsed * 2.4 + i) * 0.018;
      const maxR = b.y > 0.2 ? Math.max(0.08, 0.45 - (b.y - 0.2) * 0.38) : b.radius;
      const r = Math.min(b.radius, maxR);
      _dummy.position.set(Math.cos(b.angle + wobble) * r, b.y + liquidMesh.position.y, Math.sin(b.angle + wobble) * r);
      _dummy.scale.setScalar(b.scale);
      _dummy.rotation.set(0, 0, 0);
      _dummy.updateMatrix();
      bubblesMesh.setMatrixAt(i, _dummy.matrix);
    }
    bubblesMesh.instanceMatrix.needsUpdate = true;

    // Animate orbital 3D flavour garnishes
    for (let i = 0; i < garnishOrbiters.length; i++) {
      const o = garnishOrbiters[i];
      const theta = elapsed * o.speed * 0.45 + o.phase;
      const radius = o.baseRadius + explodeFactor * 0.25;
      o.mesh.position.set(
        Math.cos(theta) * radius,
        o.baseY + Math.sin(elapsed * 1.6 + o.phase) * 0.1,
        Math.sin(theta) * radius
      );
      o.mesh.rotation.x = elapsed * 0.55 + o.phase;
      o.mesh.rotation.y = elapsed * 0.75 + o.phase;
    }
  }

  function dispose() {
    disposableGeometries.forEach((g) => g.dispose());
    disposableMaterials.forEach((m) => m.dispose());
    disposableTextures.forEach((t) => t.dispose());
  }

  return {
    root,
    bottleGroup,
    glassMesh,
    liquidMesh,
    labelMesh,
    neckMesh,
    capGroup,
    dropletsMesh,
    bubblesMesh,
    bubbles,
    garnishGroup,
    garnishOrbiters,
    setFlavour,
    update,
    dispose,
  };
}
