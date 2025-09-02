#!/bin/bash

# Local Android Build Script
# This script helps you build the Android APK locally before pushing to GitHub

set -e

echo "🚀 Starting local Android build..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  Warning: ANDROID_HOME not set. Trying to detect Android SDK..."
    
    # Common locations for Android SDK on macOS
    POSSIBLE_PATHS=(
        "$HOME/Library/Android/sdk"
        "$HOME/Android/Sdk"
        "/usr/local/android-sdk"
        "/opt/android-sdk"
    )
    
    for path in "${POSSIBLE_PATHS[@]}"; do
        if [ -d "$path" ]; then
            export ANDROID_HOME="$path"
            echo "✅ Found Android SDK at: $ANDROID_HOME"
            break
        fi
    done
    
    if [ -z "$ANDROID_HOME" ]; then
        echo "❌ Error: Android SDK not found. Please install Android Studio or set ANDROID_HOME."
        echo "   You can install Android Studio from: https://developer.android.com/studio"
        exit 1
    fi
fi

# Add Android SDK tools to PATH
export PATH="$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH"

# Prebuild the native Android project
echo "🔧 Prebuilding Android project..."
npx expo prebuild --platform android --clean

# Create local.properties if it doesn't exist
if [ ! -f "android/local.properties" ]; then
    echo "📝 Creating android/local.properties..."
    echo "sdk.dir=$ANDROID_HOME" > android/local.properties
fi

# Make gradlew executable
chmod +x android/gradlew

# Build the APK
echo "🔨 Building Android APK..."
cd android
./gradlew assembleRelease

echo "✅ Build completed successfully!"
echo "📱 APK location: android/app/build/outputs/apk/release/app-release.apk"

# Check if APK was created
if [ -f "app/build/outputs/apk/release/app-release.apk" ]; then
    APK_SIZE=$(du -h app/build/outputs/apk/release/app-release.apk | cut -f1)
    echo "📊 APK size: $APK_SIZE"
else
    echo "⚠️  Warning: APK file not found at expected location"
fi
