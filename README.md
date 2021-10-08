
# Identity wallet

## Deployment

### App Center
We use [App center](https://appcenter.ms/apps) to distribute to test groups and us as collaborators. App Center is also used to deploy to Google Play Store and Apple App Store. 

#### How to trigger new test apk build and distributiuon
- When pushing changes to `development` branch App Center will automatically build and sign new release APK and send email containing a downloadin link to testing group


## Color Theme
Using useContext and Material ui "standard":
  primary and secondary with variants, onPrimary, onSecondary, surface, background++

## Icons
- Use icons from [Google Fonts and Icons](https://fonts.google.com/icons)
- React native svg from [React Native svg](https://github.com/react-native-svg/react-native-svg)