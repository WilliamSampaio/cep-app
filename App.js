import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import MapView from 'react-native-maps';
import apiViaCep from './src/services/apiViaCep';
import apiMaps from './src/services/apiMaps';
import { MAPS_API_KEY } from '@env';

export default function App() {

  const [cep, setCep] = useState('69060660');
  const [result, setResult] = useState(null);

  async function buscarCep() {
    if (!cep.trim().length || cep.length != 8) {
      alert('CEP não informado ou incompleto!');
      return;
    }

    if (result != null && result.cep.replace('-', '') == cep) {
      return;
    }

    const response = await apiViaCep.get(`${cep}/json`);

    if (response.data.erro) {
      alert('CEP não encontrado!');
      return;
    }

    setResult(response.data);

    // const mapsResponse = await apiMaps.post('', {
    //   textQuery: `${response.data.logradouro}, ${response.data.bairro}, ${response.data.cep} ${response.data.localidade} - ${response.data.uf}`
    // }, {
    //   headers: {
    //     'X-Goog-Api-Key': MAPS_API_KEY
    //   }
    // });

    // console.log(mapsResponse.data);
    // if (mapsResponse.data && mapsResponse.data.places && mapsResponse.data.places.length > 0) {
    //   console.log(mapsResponse.data);
    //   if (mapsResponse.data.places[0].location) {
    //     console.log(mapsResponse.data.places[0].location);
    //   }
    // }

    Keyboard.dismiss();
  }

  function limpar() {
    setCep('');
    setResult(null);
  }

  return (
    <View>

      <MapView
        style={styles.map}
      >
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
            {result.logradouro}, {result.bairro}, {result.cep} {result.localidade} - {result.uf}
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
