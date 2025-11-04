#!/bin/bash

echo "Clearing Metro and React Native caches..."

# Kill any running Metro bundler
pkill -f "react-native start" || true
pkill -f "metro" || true

# Clear Metro cache
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Clear Watchman cache
watchman watch-del-all 2>/dev/null || echo "Watchman not available"

# Clear React Native cache
rm -rf /tmp/metro-* 2>/dev/null || true
rm -rf /tmp/haste-* 2>/dev/null || true

echo "Cache cleared! Now run: npx react-native start --reset-cache"

