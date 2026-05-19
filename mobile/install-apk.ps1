# PetAI APK Install Script
$ErrorActionPreference = "Continue"
$apkPath = "C:\Users\PC\petai\mobile\android\app\build\outputs\apk\release\app-release.apk"

if (-not (Test-Path $apkPath)) {
    Write-Host "APK not found at $apkPath" -ForegroundColor Red
    exit 1
}

$apkSize = [math]::Round((Get-Item $apkPath).Length / 1MB, 1)
Write-Host "APK found: $apkPath ($apkSize MB)" -ForegroundColor Green

$adb = "C:\Android\platform-tools\adb.exe"
$devices = & $adb devices 2>&1

if ($devices -notmatch "\sdevice\s*$") {
    Write-Host "No Android device connected!" -ForegroundColor Yellow
    Write-Host "1. Connect phone via USB" -ForegroundColor Cyan
    Write-Host "2. Enable USB Debugging (Settings → Developer Options)" -ForegroundColor Cyan
    Write-Host "3. Run this script again" -ForegroundColor Cyan
    exit 1
}

Write-Host "Installing on device..." -ForegroundColor Cyan
& $adb install -r $apkPath
Write-Host "Done!" -ForegroundColor Green
