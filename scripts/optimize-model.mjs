// Optimizes public/models/cayenne.glb in place:
// resize textures to <=1024, WebP (supports alpha), prune, dedup, Meshopt (EXT_meshopt_compression).
// Usage: node scripts/optimize-model.mjs [input.glb] [output.glb]
// Run against the ORIGINAL 8 MB file (re-running on the optimized file would re-encode lossy textures).
import { execFileSync } from 'node:child_process';
import { mkdtempSync, copyFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const input = resolve(process.argv[2] ?? 'public/models/cayenne.glb');
const output = resolve(process.argv[3] ?? input);
const bin = resolve('node_modules/.bin/gltf-transform');
const dir = mkdtempSync(join(tmpdir(), 'cayenne-'));
const a = join(dir, 'a.glb');
const b = join(dir, 'b.glb');
const run = (...args) => execFileSync(bin, args, { stdio: 'inherit' });

copyFileSync(input, a);
run('prune', a, b, '--keep-attributes', 'true', '--keep-leaves', 'true'); // keep nodes/names intact
run('dedup', b, a);
run('resize', a, b, '--width', '1024', '--height', '1024'); // only ever downsizes
run('webp', b, a, '--quality', '80', '--effort', '90'); // WebP keeps alpha for BLEND textures
run('meshopt', a, b, '--level', 'medium');
copyFileSync(b, output);
rmSync(dir, { recursive: true, force: true });
console.log(`${input} -> ${output}: ${(statSync(output).size / 1024).toFixed(0)} KB`);
