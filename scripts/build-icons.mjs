import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// 从 public/favicon.svg 派生 PWA manifest 需要的 PNG 图标。
// 换了 favicon.svg 之后重跑一遍：npm run build:icons

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const svg = readFileSync(path.join(publicDir, 'favicon.svg'), 'utf8');

// maskable 图标要求背景铺满整个画布，圆角交给系统按目标形状裁切，
// 所以这里去掉源 svg 的圆角矩形背景，其余图形不变。
const maskableSvg = svg.replace(/\srx="6"/, '');

async function render(source, size, outFile) {
  await sharp(Buffer.from(source))
    .resize(size, size)
    .png()
    .toFile(path.join(publicDir, outFile));
  console.log(`✓ public/${outFile}`);
}

await render(svg, 192, 'icon-192.png');
await render(svg, 512, 'icon-512.png');
await render(maskableSvg, 512, 'icon-maskable-512.png');
