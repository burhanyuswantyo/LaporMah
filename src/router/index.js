import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {CreateLaporan, Home, Login, Splash} from '../pages';

const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="splash">
      <Stack.Group screenOptions={{headerShown: false}}>
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="login" component={Login} />
      </Stack.Group>
      <Stack.Group
        screenOptions={{
          headerStyle: {backgroundColor: '#9b24b3'},
          headerTintColor: '#FFFFFF',
        }}>
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="create_laporan" component={CreateLaporan} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default Router;
