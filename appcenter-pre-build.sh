echo $ANDROID_APPCENTER_SECRET | base64 --decode > "$APPCENTER_SOURCE_DIRECTORY/android/app/src/main/assets/appcenter-config.json"
echo "Updating iOS secret"
echo $IOS_APPCENTER_SECRET | base64 --decode > "$APPCENTER_SOURCE_DIRECTORY/ios/Glitz/AppCenter-Config.plist"
echo "Finished injecting secrets."