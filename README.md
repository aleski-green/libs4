# libs4

Pinned third-party dependencies consumed by Sapiens4 as a Git submodule.
The generated `web/remote-vendor.js` is checked in so runtime installations and
release packages do not require Node.js or npm.

## Browser API

Load the bundle before application code. It exposes `window.RemoteVendor`:

- `nacl`: TweetNaCl 1.0.3, including authenticated box encryption and key generation.
- `jsQR`: jsQR 1.4.0, decoding QR codes from RGBA image data.
- `QRCode`: qrcode 1.5.4, generating QR codes, including `toCanvas`.

The qrcode dependency also includes dijkstrajs 1.0.3. The complete dependency
resolution and integrity hashes are pinned in `package-lock.json`.

## Rebuild

With Node.js 20.9 or newer:

```sh
npm ci --ignore-scripts
npm run build
```

Commit dependency updates, the lockfile, regenerated bundle, and any updated
license notices together. Then update Sapiens4's `libs4` submodule commit.
Routine application changes should inspect this API and the build entrypoint
instead of reading or editing the generated bundle.

## Test and native dependencies

Language-specific packages are separate because each ecosystem needs its own
installer. Sapiens4 keeps application and test source; this repo owns the pins:

- `package.json` / `package-lock.json`: browser libraries, DOM test packages,
  esbuild, and sharp for icon generation. `npm ci --ignore-scripts` installs them
  into `node_modules/` here.
- `ruby/Gemfile` / `ruby/Gemfile.lock`: RSpec, WEBrick, and SQLite dependencies.
  From the Sapiens4 root, run `ruby libs4/ruby/bundle.rb install`, then
  `ruby libs4/ruby/bundle.rb exec rspec`. The wrapper retains the caller's working
  directory and installs gems in `ruby/.gems/` here.
- `python/*-requirements.txt`: remote client and relay requirements, also used by tests. Create a virtual environment in `python/.venv/` and install the
  relevant requirements with that interpreter. The Ruby wrapper uses this
  interpreter for tests unless `SAPIENS_PYTHON` is supplied.
- `python/package-windows.ps1`: pinned embedded Python download, checksum
  verification, and architecture-specific wheel installation for release builds.
- `dotnet/WebView2.props`: the pinned WebView2 NuGet dependency, imported by
  Sapiens4's Windows application and accessibility probe projects.

Installed packages, virtual environments, and caches remain ignored. Do not
commit them. Release builders copy the browser bundle and license notices;
Node/Ruby test dependencies are not included in the application package.

## Licenses

Bundled third-party libraries retain their original licenses; required notices
are in [license/REMOTE_DEPENDENCIES.txt](license/REMOTE_DEPENDENCIES.txt).
The build integration was extracted from Sapiens4 at `70daf72` and retains its
[Sustainable Use License](license/LICENSE.md). That license does not replace
the licenses of the bundled libraries.

## PureScript UI dependencies

`purescript/spago.yaml` and `purescript/spago.lock` pin the PureScript libraries
used by Sapiens4. The compiler (0.15.16) and Spago (0.93.44) are pinned npm development
dependencies. Use Node.js 20.9 or newer and `npm ci` so the compiler installer runs.
Application `.purs` files remain in Sapiens4; compiler output and package downloads
remain ignored under `purescript/`. There is no PureScript test suite: RSpec owns
all new test cases and assertions.

From the Sapiens4 repository, run `node web/shell/build.cjs` to compile and bundle
its browser modules. Bundled assets are checked in for runtime installations that
have no Node.js toolchain. After changing the pinned PureScript libraries, run
`node libs4/purescript/notices.cjs` to refresh their bundled license notices.
