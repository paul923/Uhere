import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage, AppState, Keyboard, TouchableWithoutFeedback } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Spinner from 'react-native-loading-spinner-overlay';
import Constants from "expo-constants";
const { manifest } = Constants;
import firebase from 'firebase';
import { backend } from './constants/Environment';

import MainAppNavigator from './navigation/MainAppNavigator';
import useLinking from './navigation/useLinking';
import LoginNavigator from './navigation/LoginNavigator';
import ProfileNavigator from './navigation/ProfileNavigator';

import AppIntroSlider from './screens/introSlider';
import SplashScreen from './screens/SplashScreen';

import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import LocationPermissionScreen from './screens/LocationPermissionScreen'
import { AppearanceProvider } from 'react-native-appearance';



const Stack = createStackNavigator();

import AuthContext from 'contexts/AuthContext';
import LoadingContext from 'contexts/LoadingContext';




export default function App(props) {
  const [showRealApp, setshowRealApp] = React.useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(true);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  const [isLocationPermissionGranted, _setLocationPermissionGranted] = React.useState(false);
  const isLocationPermissionGrantedRef = React.useRef(isLocationPermissionGranted);
  React.useEffect(() => {
    checkLocationPermissionAsync();
  }, []);

  // first time installing app gives you 'undetermined' == ask Next Time
  async function checkLocationPermissionAsync() {
    const { status, ios, android } = await Location.requestPermissionsAsync();
    console.log('status', status);
    console.log('ios', ios == null ? 'not ios' : ios.scope);
    console.log('android', android == null ? 'not android' : android.scope);
    // first time installing give you undetermined
    if (Platform.OS === 'ios' ? (status === 'granted' && ios.scope === 'always') : (status === 'granted' && android.scope === 'fine')) {
      setLocationPermissionGranted(true);
    } else {
      setLocationPermissionGranted(false);
    }
  }
  const setLocationPermissionGranted = (value) => {
    isLocationPermissionGrantedRef.current = value;
    _setLocationPermissionGranted(value);
  }

  const [appState, _setAppState] = React.useState(AppState.currentState);
  const appStateRef = React.useRef(appState);

  React.useEffect(() => {
    AppState.addEventListener('change', handleAppStatechange);
  }, []);

  const handleAppStatechange = (nextAppState) => {
    if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      checkLocationPermissionAsync();
    }
    setAppState(nextAppState);
  };
  const setAppState = (nextAppState) => {
    appStateRef.current = nextAppState;
    _setAppState(nextAppState);
  }


  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            fetchToken: false
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isLoggedIn: true,
            userToken: action.token,
            skipProfile: action.skipProfile
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLoggedIn: false,
            userToken: null,
          };
        case 'SKIP_PROFILE':
          return {
            ...prevState,
            skipProfile: true
          }
        case 'SHOW_LOADING_SCREEN':
          return {
            ...prevState,
            showLoadingScreen: true
          }
        case 'HIDE_LOADING_SCREEN':
          return {
            ...prevState,
            showLoadingScreen: false
          }
      }
    },
    {
      fetchToken: true,
      showLoadingScreen: false,
      isLoggedIn: false,
      userToken: null,
      skipProfile: false
    }
  );

  const authContext = React.useMemo(
    () => ({
      restoreToken: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      },
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        let response = await fetch(`http://${backend}:3000/user/${data}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        let responseJson = await response.json();
        console.log(responseJson);
        if (responseJson.status === 200) {
          dispatch({ type: 'SIGN_IN', token: data, skipProfile: true });
        } else {
          dispatch({ type: 'SIGN_IN', token: data, skipProfile: false });
        }
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: data });
      },
      skipProfile: () => {
        dispatch({ type: 'SKIP_PROFILE' })
      }
    }),
    []
  );

  const loadingContext = React.useMemo(
    () => ({
      showLoadingScreen: () => dispatch({ type: 'SHOW_LOADING_SCREEN' }),
      hideLoadingScreen: () => dispatch({ type: 'HIDE_LOADING_SCREEN' }),
    })
  );

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {

    // Fetch the token from storage then navigate to our appropriate place
    async function restoreUserTokenAsync() {
      let userToken;

      try {
        AsyncStorage.getItem('userToken').then(userToken => {
          if (!userToken) {
            dispatch({ type: 'RESTORE_TOKEN', token: userToken })
          }
        });
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.

    };

    async function checkIfFirstLaunchedAsync() {
      try {
        let isFirstLaunch = await AsyncStorage.getItem('isFirstLaunch') === 'false' ? false : true;
        setIsFirstLaunch(isFirstLaunch);
      } catch (e) {
        // Restoring token failed
      }
    }

    async function loadFontAsync() {
      try {

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState());

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
      }
    }
    function loadAsyncData() {
      checkIfFirstLaunchedAsync();
      restoreUserTokenAsync();
    }
    loadAsyncData();
    loadFontAsync();
  }, []);

  storeIsFirstLaunch = async (flag) => {
    await AsyncStorage.setItem('isFirstLaunch', JSON.stringify(flag));
  }
  if (isFirstLaunch && !showRealApp) {
   return <AppIntroSlider
     slides={slides}
     onDone={() => {setshowRealApp(true); storeIsFirstLaunch(false)}}
     onSkip={() => {setshowRealApp(true); storeIsFirstLaunch(false)}}
     showSkipButton
     activeDotStyle={{backgroundColor: 'rgba(0, 0, 0, .9)'}}
     />;
 }  else if (!isLocationPermissionGranted) {
   return (
     <LocationPermissionScreen
     updateLocationGranted={setLocationPermissionGranted}
     />
   );
 } else if (state.fetchToken) {
   return <SplashScreen/>
 } else {
    return (
      <AppearanceProvider>
      <LoadingContext.Provider value={loadingContext}>
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <Spinner
          visible={state.showLoadingScreen}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
        <AuthContext.Provider value={authContext}>
          <Stack.Navigator
            headerMode="none">
            {!state.isLoggedIn && state.userToken == null ? (
              <Stack.Screen name="LoginNavigator" component={LoginNavigator} />
            ) : (
                !state.skipProfile ? (
                  <Stack.Screen name="ProfileNavigator" component={ProfileNavigator} />
                ) : (
                  <Stack.Screen name="MainApp" component={MainAppNavigator} />
                )
            )}
          </Stack.Navigator>
          </AuthContext.Provider>
        </NavigationContainer>
        {Platform.OS === 'ios' && <KeyboardSpacer/>}

      </View>
      </LoadingContext.Provider>
      </AppearanceProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});


// Slider contents
const slides = [
  {
    key: 'Dummy1',
    title: 'Dummy 1',
    text: 'Please sign in to\ncontinue.',
    image: require('./assets/images/robot-dev.png'),
    backgroundColor: '#ffffff',
    titleStyle: {
      color: '#000000'
    },
    textStyle: {
      color: '#0f0f0f',
    }
  },
  {
    key: 'Dummy2',
    title: 'Dummy 2',
    text: 'Please sign in to\ncontinue.',
    image: require('./assets/images/robot-dev.png'),
    backgroundColor: '#ffffff',
    titleStyle: {
      color: '#000000'
    },
    textStyle: {
      color: '#0f0f0f',
    }
  },
  {
    key: 'Dummy3',
    title: 'Dummy 3',
    text: 'Please sign in to\ncontinue.',
    image: require('./assets/images/robot-dev.png'),
    backgroundColor: '#ffffff',
    titleStyle: {
      color: '#000000'
    },
    textStyle: {
      color: '#0f0f0f'
    }
  }
];
