import {StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native';
import React, {useEffect} from 'react';
import {LOGO} from '../../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = props => {
  useEffect(() => {
    checkLogin();
  });

  const checkLogin = () => {
    setTimeout(() => {
      AsyncStorage.getItem('userToken')
        .then(res => {
          res
            ? props.navigation.replace('home')
            : props.navigation.replace('login');
        })
        .catch(err => {
          console.log(err);
        });
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <Image source={LOGO} />
      <ActivityIndicator size="large" color="#9e2a9b" />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});
