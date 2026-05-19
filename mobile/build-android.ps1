# Build PetAI Android APK locally
$ErrorActionPreference = "Stop"

# Setup environment
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.19.10-hotspot"
$env:ANDROID_HOME = "C:\Android"
$env:ANDROID_SDK_ROOT = "C:\Android"
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\cmdline-tools\latest\bin;$env:ANDROID_HOME\platform-tools;$env:Path"

Write-Output "=== Java version ==="
java -version

Write-Output "`n=== Accepting Android SDK licenses ==="
"y`ny`ny`ny`ny`ny`ny`ny`ny`n" | & "$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager.bat" --licenses

Write-Output "`n=== Installing SDK components ==="
& "$env:ANDROID_HOME\cmdline-tools\latest\bin\sdkmanager.bat" "platform-tools" "platforms;android-35" "build-tools;35.0.0"

Write-Output "`n=== Running expo prebuild ==="
cd C:\Users\PC\petai\mobile
npx expo prebuild --platform android --clean --no-install

Write-Output "`n=== Building debug APK ==="
cd C:\Users\PC\petai\mobile\android
.\gradlew.bat assembleDebug

Write-Output "`n=== APK location ==="
ls C:\Users\PC\petai\mobile\android\app\build\outputs\apk\debug\
