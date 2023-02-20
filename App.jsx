import { SafeAreaView, View, Text } from 'react-native'
import React, { useEffect } from 'react'
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


const App = () => {
  useEffect(() => {
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
        }}>
          <Stack.Screen name='First' component={FirstView} />
          <Stack.Screen name='Second' component={SecondScreen} />
          <Stack.Screen name='Final' component={Final} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default App