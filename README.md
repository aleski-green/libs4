# libs4

Pinned third-party browser libraries consumed by Sapiens4 as a Git submodule.
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

With Node.js 20 or newer:

```sh
npm ci --ignore-scripts
npm run build
```

Commit dependency updates, the lockfile, regenerated bundle, and any updated
license notices together. Then update Sapiens4's `libs4` submodule commit.
Routine application changes should inspect this API and the build entrypoint
instead of reading or editing the generated bundle.

## Licenses

Bundled third-party libraries retain their original licenses; required notices
are in [license/REMOTE_DEPENDENCIES.txt](license/REMOTE_DEPENDENCIES.txt).
The build integration was extracted from Sapiens4 at `70daf72` and retains its
[Sustainable Use License](license/LICENSE.md). That license does not replace
the licenses of the bundled libraries.
