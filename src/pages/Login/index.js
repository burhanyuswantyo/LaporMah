import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {LOGO} from '../../assets';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Login = props => {
  const [loading, setLoading] = useState(false);
  const [nim, setNim] = useState('17.12.0087');
  const [password, setPassword] = useState('12345');

  const loginAction = async () => {
    setLoading(true);
    await axios
      .post('https://api-lapormah.akarmakna.com/api/auth/login', {
        nim,
        password,
      })
      .then(res => {
        AsyncStorage.setItem('userData', JSON.stringify(res.data.data.user));
        AsyncStorage.setItem(
          'userToken',
          JSON.stringify({
            type: res.data.data.token_type,
            token: res.data.data.access_token,
          }),
        );
        props.navigation.replace('home');
        ToastAndroid.show(res.data.meta.message, ToastAndroid.SHORT);
      })
      .catch(err => {
        console.log(err);
        ToastAndroid.show(err.response.data.data.message, ToastAndroid.SHORT);
      });
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#9e2a9b" />
          <Text style={styles.loadingText}>Loading</Text>
        </View>
      )}
      <View style={styles.container}>
        <Image source={LOGO} style={styles.logo} />
        <Text style={styles.title}>Login Mahasiswa</Text>
        <View style={styles.textInputView}>
          <Text style={styles.textInputLabel}>NIM</Text>
          <TextInput
            style={styles.textInput}
            keyboardType="number-pad"
            placeholder="Masukkan NIM"
            value={nim}
            onChangeText={setNim}
          />
        </View>
        <View style={styles.textInputView}>
          <Text style={styles.textInputLabel}>Password</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Masukkan password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={loginAction}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  loadingText: {marginTop: 5, fontWeight: '500', color: '#380038'},
  loading: {
    position: 'absolute',
    backgroundColor: '#ffd7f5',
    top: '40%',
    alignSelf: 'center',
    zIndex: 100,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  logo: {marginVertical: 50, resizeMode: 'contain'},
  textInputView: {width: '100%', marginBottom: 20},
  buttonLabel: {color: '#FFFFFF', fontSize: 16, fontWeight: '500'},
  button: {
    backgroundColor: '#9e2a9b',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#1e1a1d',
    fontSize: 16,
    borderColor: '#80747c',
  },
  textInputLabel: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 5,
  },
  container: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontWeight: '600',
    fontSize: 24,
    marginBottom: 20,
    color: '#1e1a1d',
  },
});
