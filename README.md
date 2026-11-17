# libs4

Pinned dependencies for Sapiens4:

- `package.json`, `package-lock.json`: browser libraries and UI build tools.
- `purescript/`: compiler package set and browser bindings.
- `haskell/`: dependency pins, native bindings and vendored libsodium.
- `python/`: remote-client and relay requirements.
- `windows/`, `dotnet/`: WebView2 dependencies.

Rebuild browser assets with Node.js 22.5+:

```sh
npm ci
npm run build
```

`web/remote-vendor.js` exposes `RemoteVendor.nacl`, `jsQR` and `QRCode`.
Keep dependency pins, generated assets and license notices together.
Do not commit installed dependencies or caches.

[License](license/LICENSE.md) · [Browser notices](license/REMOTE_DEPENDENCIES.txt) · [PureScript notices](license/PURESCRIPT_DEPENDENCIES.txt)
