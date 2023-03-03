import { SafeAreaView, View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import SplashScreen from 'react-native-splash-screen'
import FirstView from './src/screen/FirstView'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SecondScreen from './src/screen/SecondScreen'

import Calllogs from './src/screen/Calllogs'
import AllContacts from './src/screen/AllContacts'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from "@react-native-firebase/app";

const App = () => {
  const [show1st, setShow1st] = useState(true)
  const [user, setUser] = useState(firebase.auth().currentUser)
  console.log("app.jsx console: ", user)
  useEffect(() => {
    try {
      AsyncStorage.getItem('FirstLogin').then((res) => {
        if (res == 'done') {
          // alert("Click hai");
          setShow1st(false)
        }
      })
    } catch (error) {
      console.log(error)
    }
    SplashScreen.hide();
  }, [])

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  // tab navigation 
  function Final() {
    return (<Tab.Navigator screenOptions={{
      headerShown: false
    }}>
      <Tab.Screen name='CallLogs' component={Calllogs} options={{
        tabBarLabel: 'Call Logs',
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="md-call" color={color} size={size} />
        ),
      }} />
      <Tab.Screen name='AllContacts' component={AllContacts} options={{
        tabBarLabel: 'Contacts',
        tabBarIcon: ({ color, size }) => (
          <MaterialIcons name="contacts" color={color} size={size} />
        ),
      }} />

    </Tab.Navigator>)
  }



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer >
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}
          initialRouteName={show1st ? 'First' : user == null ? 'Second' : 'Final'}>
          {show1st ? <Stack.Screen name='First' component={FirstView} /> : null}
          <Stack.Screen name='Second' component={SecondScreen} />
          <Stack.Screen name='Final' component={Final} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default App