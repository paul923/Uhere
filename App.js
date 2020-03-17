import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { SplashScreen } from 'expo';
import * as Font from 'expo-font';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screens/LoginScreen';

import MainAppNavigator from './navigation/MainAppNavigator';
import useLinking from './navigation/useLinking';

import AppIntroSlider from './screens/introSlider';



const Stack = createStackNavigator();

import AuthContext from './contexts/AuthContext';


export default function App(props) {
  const [showRealApp, setshowRealApp] = React.useState(false);
  const [initialNavigationState, setInitialNavigationState] = React.useState();
  const containerRef = React.useRef();
  const { getInitialState } = useLinking(containerRef);

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isLoggedIn: true,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isLoggedIn: false,
            userToken: null,
          };
      }
    },
    {
      isLoggedIn: false,
      userToken: null,
    }
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        dispatch({ type: 'SIGN_IN', token: data });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: data });
      },
    }),
    []
  );

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {

    // Fetch the token from storage then navigate to our appropriate place
    async function bootstrapAsync() {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
    async function loadResourcesAndDataAsync() {
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

    loadResourcesAndDataAsync();
  }, []);


  if(showRealApp){
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
        <AuthContext.Provider value={authContext}>
          <Stack.Navigator
            headerMode="none">
            {state.userToken == null ? (
              <Stack.Screen name="Login" component={LoginScreen} />
            ) : (
              <Stack.Screen name="MainApp" component={MainAppNavigator} />
            )}
          </Stack.Navigator>
          </AuthContext.Provider>
        </NavigationContainer>
      </View>
    );
  } else {
    return <AppIntroSlider
            slides={slides}
            onDone={() => {setshowRealApp(true);}}
            showSkipButton
            activeDotStyle={{backgroundColor: 'rgba(0, 0, 0, .9)'}}
            />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    textStyle : {
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
    textStyle : {
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
    textStyle : {
      color: '#0f0f0f'
    }
  }
 ];
