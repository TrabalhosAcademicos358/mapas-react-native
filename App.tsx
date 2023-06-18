import { 
  View,
  Text
} from 'react-native';
import { 
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  LocationAccuracy,
  watchPositionAsync
} from "expo-location";
import { 
  useEffect, 
  useState,
  useRef
} from 'react';
import MapView, { Marker } from 'react-native-maps';

import { styles } from './style';

export default function App() {
  const [position, setPosition] = useState<LocationObject | null>(null);

  const mapRef = useRef<MapView>(null);

  const requestPermission = async () => {
    const { granted } = await requestForegroundPermissionsAsync();
    
    // grated diz se a permisão foi dada
    if (granted) {
      // Aqui pega a possição do usuário
      const currentPosition = await getCurrentPositionAsync();
      setPosition(currentPosition);

      console.log("localização atual -> ", currentPosition);
    }
  } 

  useEffect(() => {
    requestPermission();

    // Isso retira a posição atual do cara a cada 1 segundo, depois atualizar os dados
    // watchPositionAsync({
    //   accuracy: LocationAccuracy.Highest,
    //   timeInterval: 1000,
    //   distanceInterval: 1
    // }, (response) => {
    //   console.log("Nova localização => ", response);
    //   setPosition(response);

    //   // manda o mapa acompanhar o Mark
      // mapRef.current?.animateCamera({
      //   center: response?.coords
      // })
    // })
  },[]);

// Isso faz com que o obj Marker acompanhe a tela
// const onRegionChange = region => {
//   setPosition({
//     ...position,
//     coords: { 
//       ...position.coords,
//       ...region
//     }
//   });
// }


  return (
    <View style={styles.container}>
      {
        position ?
        <MapView 
          ref={mapRef}
          onRegionChange={onRegionChange}
          style={styles.map}
          initialRegion={{
            latitude: position?.coords?.latitude,
            longitude: position?.coords?.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        >
          <Marker 
            coordinate={{
              latitude: position?.coords?.latitude,
              longitude: position?.coords?.longitude,
            }}
          />
        </MapView>
        :
        <Text>Libera a permissão de possição aí</Text>
      }
    </View>
  );
}