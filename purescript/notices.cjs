/* Preserve license notices for the pinned PureScript dependency build plan. */
const fs = require('node:fs');
const path = require('node:path');
const lock = JSON.parse(fs.readFileSync(path.join(__dirname, 'spago.lock'), 'utf8'));
let notices = 'PureScript libraries available to the compiled Sapiens4 UI.\nVersions and source integrity are pinned in purescript/spago.lock.\n\n';
for (const [name, pkg] of Object.entries(lock.packages).sort(([a],[b]) => a.localeCompare(b))) {
  const source = path.join(__dirname, '.spago/p', `${name}-${pkg.version}`);
  const licenses = fs.readdirSync(source).filter(file => /^(license|copying)(\.|$)/i.test(file)).sort();
  if (!licenses.length) throw new Error(`Missing license for ${name}@${pkg.version}`);
  notices += `${name} ${pkg.version}\n${'-'.repeat(60)}\n`;
  for (const file of licenses) notices += fs.readFileSync(path.join(source, file), 'utf8').replace(/[ \t]+$/gm, '').trim() + '\n\n';
}
fs.writeFileSync(path.join(__dirname, '../license/PURESCRIPT_DEPENDENCIES.txt'), notices.trimEnd() + '\n');
