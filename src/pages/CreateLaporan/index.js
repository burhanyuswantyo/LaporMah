import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  ToastAndroid,
  View,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

const CreateLaporan = props => {
  const [loading, setLoading] = useState(false);
  const [kategori, setKategori] = useState([]);
  const [open, setOpen] = useState(false);

  const [selectedKategori, setSelectedKategori] = useState(null);
  const [deskripsi, setDeskripsi] = useState(null);
  const [nim, setNim] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    props.navigation.setOptions({title: 'Buat Laporan'});
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await AsyncStorage.getItem('userData')
      .then(async result => {
        result = JSON.parse(result);
        setNim(result.nim);
      })
      .catch(err => {
        console.log(err);
      });

    await AsyncStorage.getItem('userToken')
      .then(async result => {
        result = JSON.parse(result);
        setToken(result.type + ' ' + result.token);
        await axios
          .get(
            'https://api-lapormah.akarmakna.com/api/category/get-all-categories',
            {headers: {Authorization: result.type + ' ' + result.token}},
          )
          .then(response => {
            console.log(response);
            let temp_kategori = [];
            response.data.data.kategori_laporan.map(item => {
              temp_kategori.push({label: item.nama_kategori, value: item.kode});
            });
            setKategori(temp_kategori);
          })
          .catch(err => {
            console.log(err);
          });
      })
      .catch(err => {
        console.log(err);
      });
    setLoading(false);
  };

  const sendData = async () => {
    setLoading(true);
    axios
      .post(
        'https://api-lapormah.akarmakna.com/api/laporan/create-laporan',
        {nim: nim, description: deskripsi, code_category: selectedKategori},
        {headers: {Authorization: token}},
      )
      .then(res => {
        console.log(res);
        ToastAndroid.show(res.data.meta.message, ToastAndroid.SHORT);
      })
      .catch(err => {
        console.log(err);
      });
    setLoading(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      nestedScrollEnabled={true}>
      {loading && (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#9e2a9b" />
          <Text style={styles.loadingText}>Loading</Text>
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.textInputView}>
          <Text style={styles.textInputLabel}>Kategori</Text>
          <DropDownPicker
            open={open}
            value={selectedKategori}
            items={kategori}
            setOpen={setOpen}
            setValue={setSelectedKategori}
            setItems={setKategori}
          />
        </View>
        <View style={styles.textInputView}>
          <Text style={styles.textInputLabel}>Deskripsi</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Masukkan deskripsi"
            multiline={true}
            numberOfLines={3}
            value={deskripsi}
            onChangeText={setDeskripsi}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={sendData}>
          <Text style={styles.buttonLabel}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CreateLaporan;

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
  textInputView: {width: '100%', marginBottom: 20},
  textInput: {
    textAlignVertical: 'top',
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
