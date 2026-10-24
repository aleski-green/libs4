/* Preserve license notices for the pinned PureScript dependency build plan. */
const fs = require('node:fs');
const path = require('node:path');
const lock = JSON.parse(fs.readFileSync(path.join(__dirname, 'spago.lock'), 'utf8'));
let notices = 'PureScript libraries available to the compiled Sapiens4 UI.\nVersions and source integrity are pinned in purescript/spago.lock.\n\n';
for (const [name, pkg] of Object.entries(lock.packages).sort(([a],[b]) => a.localeCompare(b))) {
  const revision = pkg.version || pkg.rev;
  const checkout = pkg.type === 'git' ? path.join(__dirname, '.spago/p', name, pkg.rev) : path.join(__dirname, '.spago/p', `${name}-${revision}`);
  const source = checkout;
  const licenses = fs.readdirSync(source).filter(file => /^(license|copying)(\.|$)/i.test(file)).sort();
  notices += `${name} ${revision}\n${'-'.repeat(60)}\n`;
  if (!licenses.length) {
    const metadata = JSON.parse(fs.readFileSync(path.join(source, 'package.json'), 'utf8'));
    if (!metadata.license) throw new Error(`Missing license for ${name}@${revision}`);
    notices += `Upstream package.json declares license: ${metadata.license}.\nThis revision does not supply a standalone license file.\n\n`;
  }
  for (const file of licenses) notices += fs.readFileSync(path.join(source, file), 'utf8').replace(/[ \t]+$/gm, '').trim() + '\n\n';
}
// Deku's Pursx HTML parser is bundled by esbuild alongside the PureScript output.
const visited = new Set();
function npmNotice(name, from) {
  let directory = path.dirname(require.resolve(name, {paths:[from]}));
  while (!fs.existsSync(path.join(directory, 'package.json'))) directory = path.dirname(directory);
  const metadata = JSON.parse(fs.readFileSync(path.join(directory, 'package.json'), 'utf8'));
  const identity = `${metadata.name} ${metadata.version}`;
  if (visited.has(identity)) return;
  visited.add(identity);
  const files = fs.readdirSync(directory).filter(file => /^(license|copying)(\.|$)/i.test(file));
  if (!files.length) throw new Error(`Missing npm license for ${identity}`);
  notices += `${identity} (npm)\n${'-'.repeat(60)}\n`;
  for (const file of files) notices += fs.readFileSync(path.join(directory,file),'utf8').replace(/[ \t]+$/gm,'').trim() + '\n\n';
  for (const dependency of Object.keys(metadata.dependencies || {}).sort()) npmNotice(dependency, directory);
}
npmNotice('htmlparser2', path.join(__dirname, '..'));
fs.writeFileSync(path.join(__dirname, '../license/PURESCRIPT_DEPENDENCIES.txt'), notices.trimEnd() + '\n');
