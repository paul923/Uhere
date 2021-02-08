import * as React from 'react';
import { Modal, Platform, StatusBar, StyleSheet, View, AsyncStorage, AppState, Keyboard, TouchableWithoutFeedback, TouchableHighlight } from 'react-native';

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['ListItem']);

import * as Font from 'expo-font';
import { useFonts,
  OpenSans_400Regular,
  OpenSans_600SemiBold
} from '@expo-google-fonts/open-sans';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';


import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Spinner from 'react-native-loading-spinner-overlay';
import Constants from "expo-constants";
const { manifest } = Constants;
import firebase from 'firebase';
import firebaseObject from 'config/firebase';
import { backend } from './constants/Environment';

import MainAppNavigator from './navigation/MainAppNavigator';
import useLinking from './navigation/useLinking';
import LoginNavigator from './navigation/LoginNavigator';
import ProfileNavigator from './navigation/ProfileNavigator';

import AppIntroSlider from './screens/introSlider';
import SplashScreen from './screens/SplashScreen';


import LocationPermissionScreen from './screens/LocationPermissionScreen'
import NotificationPermissionScreen from './screens/NotificationPermissionScreen'
import { AppearanceProvider } from 'react-native-appearance';
import * as userapi from 'api/user';


import { Image, Button, Text, Input, Icon, Divider } from 'react-native-elements';
const Stack = createStackNavigator();

import AuthContext from 'contexts/AuthContext';
import GlobalContext from 'contexts/GlobalContext';




export default function App(props) {
  const [showRealApp, setshowRealApp] = React.useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(true);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  const [isLocationPermissionGranted, _setLocationPermissionGranted] = React.useState(false);
  const [isNotificationPermissionGranted, _setNotificationPermissionGranted] = React.useState(false);
  const isLocationPermissionGrantedRef = React.useRef(isLocationPermissionGranted);
  const isNotificationPermissionGrantedRef = React.useRef(isNotificationPermissionGranted);
  React.useEffect(() => {
    registerForPushNotificationsAsync();
    checkLocationPermissionAsync();
    firebaseObject.auth().onAuthStateChanged((user) => {
      if (user && !user.email) {
        console.log("We are authenticated now!");
        authContext.signIn(user.uid);
      } else if (user && user.email && user.emailVerified) {
        console.log("We are authenticated now!");
        authContext.signIn(user.uid);
      } else if (user && !user.emailVerified) {
        alert("Email is not verified. Please verify the email");
        firebaseObject.auth().signOut();
      }
    });

  }, []);

  let [fontsLoaded] = useFonts({
    OpenSans_400Regular,
    OpenSans_600SemiBold
  });



  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        setNotificationPermissionGranted(false)
        //alert('Failed to get push token for push notification!');
        return;
      }
      setNotificationPermissionGranted(true)

    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  // first time installing app gives you 'undetermined' == ask Next Time
  async function checkLocationPermissionAsync() {
    const { status, permissions } = await Permissions.askAsync(Permissions.LOCATION);
    console.log('status', status);
    console.log('permissions', permissions.location.scope);
    // first time installing give you undetermined
    if (Platform.OS === 'ios' ? (status === 'granted' && permissions.location.scope === 'always') : (status === 'granted' && permissions.location.scope === 'always')) {
      setLocationPermissionGranted(true);
    } else {
      setLocationPermissionGranted(false);
    }
  }
  const setLocationPermissionGranted = (value) => {
    isLocationPermissionGrantedRef.current = value;
    _setLocationPermissionGranted(value);
  }
  const setNotificationPermissionGranted = (value) => {
    isNotificationPermissionGrantedRef.current = value;
    _setNotificationPermissionGranted(value);
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
      registerForPushNotificationsAsync();
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
            fetchToken: false,
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
        case 'SHOW_ERROR_SCREEN':
          return {
            ...prevState,
            showErrorScreen: true,
            errorMessage: action.message
          }
        case 'HIDE_ERROR_SCREEN':
          return {
            ...prevState,
            showErrorScreen: false,
            errorMessage: ''
          }
      }
    },
    {
      fetchToken: true,
      showErrorScreen: false,
      errorMessage: '',
      showLoadingScreen: false,
      isLoggedIn: false,
      userToken: null,
      skipProfile: false,
      autoLogin: false,
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
      getUserInfo: async data => {
        let user = await userapi.getUserByUserId(data);
        if (user !== null) {
          return user;
        }
      },
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        let user = await userapi.getUserByUserId(data);
        AsyncStorage.setItem('userToken', data);
        const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
        await userapi.updatePushToken(data, expoPushToken);
        if (user && user.Username) {
          dispatch({ type: 'SIGN_IN', token: data, skipProfile: true });
        } else {
          dispatch({ type: 'SIGN_IN', token: data, skipProfile: false });
        }
      },
      signOut: () => {
        AsyncStorage.removeItem('userToken');
        dispatch({ type: 'SIGN_OUT' });
      },
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

  const globalContext = React.useMemo(
    () => ({
      showLoadingScreen: () => dispatch({ type: 'SHOW_LOADING_SCREEN' }),
      hideLoadingScreen: () => dispatch({ type: 'HIDE_LOADING_SCREEN' }),
      showErrorScreen: (message) => dispatch({ type: 'SHOW_ERROR_SCREEN', message: message}),
      hideErrorScreen: () => dispatch({ type: 'HIDE_ERROR_SCREEN'}),
    })
  );

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {

    // Fetch the token from storage then navigate to our appropriate place
    async function restoreUserTokenAsync() {
      let userToken;

      try {
        AsyncStorage.getItem('userToken').then(async userToken => {
          if (userToken) {
            let user = await userapi.getUserByUserId(userToken);
            AsyncStorage.setItem('userToken', userToken);
            const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
            await userapi.updatePushToken(userToken, expoPushToken);
            if (user && user.Username) {
              dispatch({ type: 'SIGN_IN', token: userToken, skipProfile: true });
            } else {
              dispatch({ type: 'SIGN_IN', token: userToken, skipProfile: false });
            }
          }
          dispatch({ type: 'RESTORE_TOKEN'});
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
     activeDotStyle={{backgroundColor: 'rgba(21, 205, 202, .9)'}}
     />;
 }  else if (!isLocationPermissionGranted) {
   return (
     <LocationPermissionScreen
     updateLocationGranted={setLocationPermissionGranted}
     />
   );
 }  else if (!isNotificationPermissionGranted) {
   return (
     <NotificationPermissionScreen
     updateNotificationGranted={setNotificationPermissionGranted}
     />
   );
 } else if (state.fetchToken || !fontsLoaded) {
   return <SplashScreen/>
 } else {
    return (
      <AppearanceProvider>
      <GlobalContext.Provider value={globalContext}>
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <Modal
          animationType="fade"
          transparent={true}
          visible={state.showErrorScreen}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{state.errorMessage}</Text>

              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                onPress={() => {
                  globalContext.hideErrorScreen();
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <Spinner
          color="white"
          overlayColor="#15CDCA"
          visible={state.fetchToken}
          textContent={'Fetching User Information...'}
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
      </GlobalContext.Provider>
      </AppearanceProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  spinnerTextStyle: {
    color: 'white'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    height: 300,
    width: 200,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "OpenSans_600SemiBold"
  }
});


// Slider contents
const slides = [
  {
    key: 'Penalize!',
    title: 'Penalize!',
    text: 'Play the game if there are\nmultiple freinds who are late!',
    image: require('./assets/images/tutorials/uhereonboarding1.png'),
    backgroundColor: '#ffffff',
    titleStyle: {
      color: '#15CDCA'
    },
    textStyle: {
      color: '#0f0f0f',
    }
  },
  {
    key: 'Check!',
    title: 'Check!',
    text: 'Use Uhere to find and see\nwhere your friends are!',
    image: require('./assets/images/tutorials/uhereonboarding2.png'),
    backgroundColor: '#ffffff',
    titleStyle: {
      color: '#15CDCA'
    },
    textStyle: {
      color: '#0f0f0f',
    }
  },
  {
    key: 'Create!',
    title: 'Create!',
    text: 'Invite your friends and set\nup the location and penalty for the losers!',
    image: require('./assets/images/tutorials/uhereonboarding3.png'),
    backgroundColor: '#ffffff',
    titleStyle: {
      color: '#15CDCA'
    },
    textStyle: {
      color: '#0f0f0f'
    }
  }
];
