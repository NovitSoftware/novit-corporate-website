param([string]$Message = "Actualiza la vista previa")
# Publishes the working tree — committed or not — to the shareable preview:
# https://novitsoftware.github.io/novit-web-preview/
#
# The preview is its own repository, NovitSoftware/novit-web-preview, served
# by GitHub Pages from its `main` branch. GitHub Pages gives a repository one
# site, so a branch of this repo would replace production; a separate repo is
# the only way to show work without touching www.novitsoftware.com. It holds
# the built site only, marked noindex, and must never get a CNAME file or a
# custom domain — that could pull the production domain away from this repo.
$ErrorActionPreference = 'Stop'
$repo = Split-Path $PSScriptRoot -Parent
$clone = Join-Path $env:TEMP "novit-web-preview"

if (-not (Test-Path (Join-Path $clone ".git"))) {
  git clone -q https://github.com/NovitSoftware/novit-web-preview.git $clone
} else {
  git -C $clone pull -q
}

# Through cmd so node's warnings on stderr don't count as PowerShell errors.
$log = Join-Path $env:TEMP "novit-web-preview-build.log"
Push-Location $repo
try {
  $env:NEXT_PUBLIC_BASE_PATH = '/novit-web-preview'
  cmd /c "npm run -s build > `"$log`" 2>&1"
  $code = $LASTEXITCODE
} finally {
  Remove-Item Env:\NEXT_PUBLIC_BASE_PATH -ErrorAction SilentlyContinue
  Pop-Location
}
if ($code -ne 0) { Get-Content $log -Tail 30; throw "build failed" }

Get-ChildItem $clone -Force | Where-Object { $_.Name -ne '.git' } | Remove-Item -Recurse -Force
Copy-Item "$repo\out\*" $clone -Recurse -Force
New-Item -ItemType File "$clone\.nojekyll" -Force | Out-Null
foreach ($f in Get-ChildItem $clone -Recurse -Filter *.html) {
  $t = [IO.File]::ReadAllText($f.FullName)
  [IO.File]::WriteAllText($f.FullName, $t.Replace('<head>', '<head><meta name="robots" content="noindex, nofollow"/>'))
}
if (Get-ChildItem $clone -Recurse -Filter CNAME*) { throw "a CNAME file would claim a custom domain; not publishing" }

git -C $clone add -A
if (-not (git -C $clone status --porcelain)) { "nothing changed"; return }
git -C $clone commit -q -m $Message
# HTTP/1.1 and a large buffer: the default push hung on the clips.
git -C $clone -c http.version=HTTP/1.1 -c http.postBuffer=524288000 push -q origin main
"published: https://novitsoftware.github.io/novit-web-preview/"
