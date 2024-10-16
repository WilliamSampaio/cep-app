import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import api from './src/services/api';

export default function App() {

  const INITIAL_REGION = {
    latitude: -8.06819,
    longitude: -56.21783,
    latitudeDelta: 15,
    longitudeDelta: 15
  };

  const [cep, setCep] = useState('');
  const [result, setResult] = useState(null);
  const [marker, setMarker] = useState(null);

  const map = useRef();

  useEffect(() => {
    map.current?.animateToRegion(!marker ? INITIAL_REGION : marker);
  }, [marker]);

  async function buscarCep() {
    if (!cep.trim().length || cep.length != 8) {
      alert('CEP não informado ou incompleto!');
      return;
    }

    if (result != null && result.cep.replace('-', '') == cep) {
      return;
    }

    const response = await api.get(`${cep}`);

    if (response.data.erro) {
      alert('CEP não encontrado!');
      return;
    }

    setResult(response.data);
    setMarker({
      latitude: parseFloat(response.data.lat),
      longitude: parseFloat(response.data.lng),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });

    Keyboard.dismiss();
  }

  function limpar() {
    setCep('');
    setResult(null);
    setMarker(null);
  }

  return (
    <View>

      <MapView
        style={styles.map}
        initialRegion={INITIAL_REGION}
        ref={map}
      >
        {marker != null && (
          <Marker key={1} coordinate={marker} />
        )}
      </MapView>

      <View style={styles.container}>
        <Text style={styles.title}>Buscador de CEP</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          maxLength={8}
          value={cep}
          onChangeText={(v) => setCep(v)}
        />
        <View style={styles.btnGroup}>
          <TouchableOpacity
            style={[styles.btn, styles.btnBuscar]}
            onPress={buscarCep}
          >
            <Text style={styles.btnLabel}>Buscar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, styles.btnLimpar]}
            onPress={limpar}
          >
            <Text style={styles.btnLabel}>Limpar</Text>
          </TouchableOpacity>
        </View>
        {result !== null && (
          <Text style={styles.textResult}>
            {result.address_type} {result.address_name}, {result.district}, {result.cep} {result.city} - {result.state}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '88%',
    margin: '6%',
    padding: 15,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,.5)',
    borderRadius: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white'
  },
  input: {
    padding: 10,
    backgroundColor: '#DDD',
    textAlign: 'center',
    color: 'black',
    borderRadius: 10,
    fontSize: 18,
    marginVertical: 8
  },
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
  },
  btnBuscar: {
    backgroundColor: 'green',
    marginEnd: 8
  },
  btnLimpar: {
    backgroundColor: 'red',
    marginStart: 8
  },
  btnLabel: {
    color: 'white',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  textResult: {
    padding: 10,
    backgroundColor: '#DDD',
    textAlign: 'center',
    marginTop: 8,
    borderRadius: 10,
    color: 'black',
    fontWeight: '500'
  },
  map: {
    width: '100%',
    height: '100%',
  }
});
