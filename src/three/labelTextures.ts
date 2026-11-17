import * as THREE from 'three';
import type { FlavourKey } from '../data/catalog';

interface FlavourTextureSpec {
  title: string;
  subtitle: string;
  accent: string;
  accentDark: string;
  badgeLabel: string;
}

const FLAVOUR_SPECS: Record<FlavourKey, FlavourTextureSpec> = {
  strawberry: {
    title: 'FRESH STRAWBERRY',
    subtitle: 'CRISP FRUIT REFRESHMENT',
    accent: '#FF4D7E',
    accentDark: '#99123B',
    badgeLabel: 'CHILLED BERRY BLEND',
  },
  cola: {
    title: 'DARK SPARKLING COLA',
    subtitle: 'BOLD CLASSIC FIZZ',
    accent: '#FFD33F',
    accentDark: '#5C2A14',
    badgeLabel: '355ML · 500ML · 1.5L',
  },
  wine: {
    title: 'SPARKLING WINE',
    subtitle: 'VINEYARD GRAPE EXPRESSION',
    accent: '#FFD33F',
    accentDark: '#6A1B4D',
    badgeLabel: 'CELEBRATION RESERVE',
  },
};

export function createBodyLabelTexture(flavour: FlavourKey, maxAnisotropy: number): THREE.CanvasTexture {
  const spec = FLAVOUR_SPECS[flavour];
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Deep Royal Purple base
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 512);
    bgGrad.addColorStop(0, '#21063D');
    bgGrad.addColorStop(0.5, '#35105F');
    bgGrad.addColorStop(1, '#21063D');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 512);

    // Lime Green top & bottom trim stripes
    ctx.fillStyle = '#C8F52C';
    ctx.fillRect(0, 0, 1024, 18);
    ctx.fillRect(0, 494, 1024, 18);

    // Subtle geometric accent waves on sides
    ctx.fillStyle = 'rgba(200, 245, 44, 0.08)';
    ctx.beginPath();
    ctx.arc(140, 256, 170, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(884, 256, 170, 0, Math.PI * 2);
    ctx.fill();

    // Central emblem shield (centred at x=512 so front faces camera)
    ctx.save();
    ctx.translate(512, 95);
    ctx.fillStyle = '#C8F52C';
    ctx.beginPath();
    ctx.moveTo(26, -34);
    ctx.bezierCurveTo(4, -32, -22, -16, -26, 12);
    ctx.bezierCurveTo(-28, 24, -18, 34, -4, 32);
    ctx.bezierCurveTo(22, 26, 36, 0, 26, -34);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#21063D';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-16, 22);
    ctx.quadraticCurveTo(4, 2, 20, -20);
    ctx.stroke();

    ctx.fillStyle = '#FFD33F';
    ctx.beginPath();
    ctx.arc(-22, -20, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Bold LABAN wordmark
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 108px "Outfit", system-ui, sans-serif';
    ctx.fillText('LABAN', 512, 205);

    // Flavour banner bar
    ctx.fillStyle = '#C8F52C';
    const barW = 460;
    const barH = 56;
    const barX = 512 - barW / 2;
    const barY = 278;
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 12);
    ctx.fill();

    ctx.fillStyle = '#21063D';
    ctx.font = '800 30px "Outfit", system-ui, sans-serif';
    ctx.fillText(spec.title, 512, barY + barH / 2 + 1);

    // Subtitle & slogan
    ctx.fillStyle = spec.accent;
    ctx.font = '700 22px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(spec.subtitle, 512, 376);

    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    ctx.font = '600 19px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('REFRESHMENT FOR EVERY MOMENT', 512, 422);

    // Side panel brand details (visible when rotated 360°)
    ctx.save();
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '700 20px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('LABAN DRINK', 155, 225);
    ctx.fillStyle = '#C8F52C';
    ctx.font = '700 17px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText(spec.badgeLabel, 155, 265);
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = '600 16px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('SERVE CHILLED', 155, 305);

    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = '700 20px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('LABAN DRINK', 869, 225);
    ctx.fillStyle = '#FFD33F';
    ctx.font = '700 17px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('NIGERIA', 869, 265);
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    ctx.font = '600 16px "Plus Jakarta Sans", system-ui, sans-serif';
    ctx.fillText('36 STATES & FCT', 869, 305);
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, maxAnisotropy);
  texture.needsUpdate = true;
  return texture;
}

export function createNeckCollarTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#35105F';
    ctx.fillRect(0, 0, 512, 128);

    ctx.fillStyle = '#C8F52C';
    ctx.fillRect(0, 0, 512, 14);
    ctx.fillRect(0, 114, 512, 14);

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 44px "Outfit", system-ui, sans-serif';
    ctx.fillText('LABAN', 256, 66);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, maxAnisotropy);
  texture.needsUpdate = true;
  return texture;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 124);
    grad.addColorStop(0, 'rgba(12, 3, 24, 0.72)');
    grad.addColorStop(0.55, 'rgba(12, 3, 24, 0.32)');
    grad.addColorStop(1, 'rgba(12, 3, 24, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createStrawberrySkinTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#dc143c');
    grad.addColorStop(0.5, '#c8102e');
    grad.addColorStop(1, '#8b0023');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    // Offset rows of golden achenes (strawberry seeds)
    for (let row = 0; row < 12; row++) {
      const y = 12 + row * 20;
      const offset = (row % 2) * 10;
      for (let col = 0; col < 12; col++) {
        const x = 8 + offset + col * 21;
        ctx.fillStyle = 'rgba(75, 0, 18, 0.55)';
        ctx.beginPath();
        ctx.ellipse(x, y + 1, 3.2, 4.4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#f6d365';
        ctx.beginPath();
        ctx.ellipse(x, y, 1.8, 2.8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(4, maxAnisotropy);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}
