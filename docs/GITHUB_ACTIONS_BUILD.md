# GitHub Actions Build Setup

This project is configured to build Android and iOS apps using GitHub Actions instead of EAS Build.

## Workflows

### 1. Android Build (`android-build.yml`)
- **Triggers**: Push to main/master, Pull requests, Manual dispatch
- **Output**: Unsigned APK and AAB files
- **Use case**: Development builds and testing

### 2. Android Release (`android-release.yml`)
- **Triggers**: Git tags (v*), Manual dispatch
- **Output**: Signed APK and AAB files (if keystore is configured)
- **Use case**: Production releases

### 3. iOS Build (`ios-build.yml`)
- **Triggers**: Push to main/master, Pull requests, Manual dispatch
- **Output**: iOS archive
- **Use case**: Development builds (requires additional setup for signing)

## Setup Instructions

### Prerequisites
1. Push your code to a GitHub repository
2. Enable GitHub Actions in your repository settings

### For Signed Android Builds (Production)

To build signed APKs, you need to set up the following GitHub Secrets:

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:

```
ANDROID_KEYSTORE_BASE64    # Base64 encoded keystore file
ANDROID_KEYSTORE_PASSWORD  # Keystore password
ANDROID_KEY_PASSWORD       # Key password
ANDROID_KEY_ALIAS         # Key alias
```

#### Creating the keystore secrets:

1. **Generate a keystore** (if you don't have one):
   ```bash
   keytool -genkey -v -keystore release.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Encode keystore to Base64**:
   ```bash
   base64 -i release.keystore | pbcopy  # macOS
   base64 release.keystore | xclip -selection clipboard  # Linux
   ```

3. **Add the Base64 string** to `ANDROID_KEYSTORE_BASE64` secret

### Local Testing

Before pushing to GitHub, you can test the build locally:

```bash
# Make sure the script is executable
chmod +x scripts/build-android.sh

# Run the build
./scripts/build-android.sh
```

## Manual Builds

You can trigger builds manually from the GitHub Actions tab:

1. Go to your repository on GitHub
2. Click on the "Actions" tab
3. Select the workflow you want to run
4. Click "Run workflow"

## Build Artifacts

After a successful build, you can download the APK/AAB files from:
- GitHub Actions → Your workflow run → Artifacts section

## Advantages over EAS Build

1. **Free**: GitHub Actions provides 2000 free minutes per month
2. **Faster**: No queue times for open source projects
3. **Customizable**: Full control over the build environment
4. **Integrated**: Works seamlessly with your Git workflow
5. **Transparent**: Full build logs are visible

## Troubleshooting

### Common Issues:

1. **Android SDK not found**: The workflow automatically sets up Android SDK
2. **Gradle build fails**: Check the Java version (workflow uses Java 17)
3. **Signing fails**: Verify your keystore secrets are correctly set
4. **iOS build fails**: Requires additional provisioning profile setup

### Getting Help:

- Check the GitHub Actions logs for detailed error messages
- Ensure all dependencies in `package.json` are up to date
- Verify that `expo prebuild` works locally before pushing

## Next Steps

1. Push this code to your GitHub repository
2. The workflows will automatically run on the next push
3. Check the Actions tab to see the build progress
4. Download your built APK from the artifacts

For production releases, create a git tag:
```bash
git tag v1.0.0
git push origin v1.0.0
```

This will trigger the release workflow with signed builds.
