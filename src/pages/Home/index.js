import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NO_IMAGE} from '../../assets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Home = props => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [laporan, setLaporan] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    await getToken();
    await getProfile();
  };

  const getProfile = async () => {
    await AsyncStorage.getItem('userData')
      .then(res => {
        res = JSON.parse(res);
        setProfile({nama: res.nama, nim: res.nim});
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getToken = async () => {
    await AsyncStorage.getItem('userToken')
      .then(res => {
        res = JSON.parse(res);
        let token = res.type + ' ' + res.token;
        getLaporan(token);
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const getLaporan = async token => {
    await axios
      .get(
        'https://api-lapormah.akarmakna.com/api/laporan/get-laporan-by-mahasiswa',
        {params: {nim: profile.nim}, headers: {Authorization: token}},
      )
      .then(async res => {
        await setLaporan(res.data.data.list_laporan);
        console.log(res.data.data.list_laporan);
      })
      .catch(async err => {
        console.log(err);
        if (err.response.status === 401) {
          await AsyncStorage.clear();
          props.navigation.navigate('login');
        }
      });
    setLoading(false);
  };

  const logout = async () => {
    await AsyncStorage.clear();
    props.navigation.replace('login');
  };

  useEffect(() => {
    props.navigation.setOptions({
      title: 'Dashboard',
      headerRight: () => (
        <TouchableOpacity style={{marginRight: 5}} onPress={() => logout()}>
          <Text style={{color: '#ffffff'}}>Logout</Text>
        </TouchableOpacity>
      ),
    });
    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#9e2a9b" />
          <Text style={styles.loadingText}>Loading</Text>
        </View>
      )}
      <View style={styles.container}>
        <Text style={styles.title}>Profil</Text>
        <View style={styles.card}>
          <View>
            <Text style={{color: '#4e444b'}}>Nama : {profile.nama}</Text>
            <Text style={{color: '#4e444b'}}>NIM : {profile.nim}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => props.navigation.navigate('create_laporan')}>
            <Text style={styles.buttonLabel}>Buat Laporan</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Daftar Laporan</Text>
        </View>
        {laporan.length > 0 ? (
          laporan.map((item, key) => {
            return (
              <View style={styles.card} key={key}>
                <Image source={NO_IMAGE} style={styles.reportImage} />
                <Text style={{fontWeight: '500'}}>
                  Kode laporan : {item.code}
                </Text>
                <Text style={{textAlign: 'justify'}}>{item.description}</Text>
              </View>
            );
          })
        ) : (
          <View style={styles.card}>
            <Text style={{fontWeight: '500', textAlign: 'center'}}>
              Tidak ada laporan
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Home;

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
  buttonLabel: {color: '#ffffff', fontWeight: '500', fontSize: 16},
  button: {
    backgroundColor: '#9e2a9b',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  reportImage: {
    height: 80,
    width: 80,
    marginBottom: 10,
    borderRadius: 5,
  },
  card: {
    backgroundColor: '#eedee7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    maxHeight: 200,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e1a1d',
    textAlign: 'center',
    marginBottom: 10,
  },
  container: {
    backgroundColor: 'rgb(255, 251, 255)',
    height: '100%',
    padding: 20,
  },
});
