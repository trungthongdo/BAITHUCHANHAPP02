import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import Geolocation from '@react-native-community/geolocation';

Geolocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: 'whenInUse',
  locationProvider: 'auto',
});

AppRegistry.registerComponent(appName, () => App);
