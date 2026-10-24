# Assemble the pinned embedded Python runtime for a Sapiens4 Windows release.
param(
    [Parameter(Mandatory=$true)][ValidateSet('win-x64','win-arm64')][string]$Runtime,
    [Parameter(Mandatory=$true)][string]$TargetDirectory,
    [string]$PythonArchive,
    [string]$BuildPython = 'python'
)
$ErrorActionPreference = 'Stop'
$arch = if ($Runtime -eq 'win-arm64') { 'arm64' } else { 'amd64' }
$hash = if ($arch -eq 'arm64') { 'CBA392BD5C7AED68B26D1B523822CC3D80802C085481DFDE79262EBFC7179D26' } else { '91D828C2DA3A029B41699E918674A0CB379C02CF20DAB9C501306885F837402A' }
if (-not $PythonArchive) {
    $cache = Join-Path $PSScriptRoot '.cache'
    New-Item -ItemType Directory -Force $cache | Out-Null
    $PythonArchive = Join-Path $cache "python-3.13.9-embed-$arch.zip"
    if (-not (Test-Path $PythonArchive)) { Invoke-WebRequest "https://www.python.org/ftp/python/3.13.9/python-3.13.9-embed-$arch.zip" -OutFile $PythonArchive }
}
if ((Get-FileHash -LiteralPath $PythonArchive -Algorithm SHA256).Hash -ne $hash) { throw 'Embedded Python checksum mismatch' }
Expand-Archive -LiteralPath $PythonArchive -DestinationPath $TargetDirectory -Force
[IO.File]::WriteAllText((Join-Path $TargetDirectory 'python313._pth'), "python313.zip`n.`n..`nimport site`n", [Text.UTF8Encoding]::new($false))
$wheelPlatform = if ($Runtime -eq 'win-arm64') { 'win_arm64' } else { 'win_amd64' }
$packages = Join-Path $TargetDirectory 'Lib/site-packages'
if (Test-Path -LiteralPath $packages) { Remove-Item -LiteralPath $packages -Recurse -Force }
& $BuildPython -m pip install --disable-pip-version-check --only-binary=:all: --platform $wheelPlatform --python-version 3.13 --implementation cp --abi cp313 --upgrade --target $packages -r (Join-Path $PSScriptRoot 'remote-client-requirements.txt')
if ($LASTEXITCODE -ne 0) { throw 'Packaged Python dependencies failed' }
