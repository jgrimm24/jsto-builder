# Mobile Preview Setup

This project can be wrapped as an iOS and Android app with Capacitor while reusing the current HTML, CSS, and JavaScript files.

## First-time setup

Run these from the repository folder on your Mac:

```sh
npm install
npm run cap:add:ios
npm run cap:add:android
npm run cap:sync
```

## Open the app shells

```sh
npm run cap:open:ios
npm run cap:open:android
```

The iOS command opens Xcode. The Android command opens Android Studio.

## What to expect in this first preview

The first mobile version is a wrapper around the existing JSTO Builder website. It is meant to show the app frame, phone sizing, file picker behavior, and basic navigation before any deeper native work.

## Likely follow-up passes

- Tune the layout for narrow phone screens.
- Confirm image upload and saved state behavior on iOS and Android.
- Decide whether PDF export should use the current Render service or a mobile-native share/save flow.
- Add app icons, splash screens, privacy text, and store-ready metadata.
