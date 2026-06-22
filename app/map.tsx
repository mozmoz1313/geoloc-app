import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useLocation } from '../hooks/useLocation'

export default function MapScreen() {
  const { position, erreur, chargement } = useLocation()

  // Pendant le chargement du GPS
  if (chargement) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.texte}>Récupération de ta position...</Text>
      </View>
    )
  }

  // Si erreur GPS
  if (erreur) {
    return (
      <View style={styles.centre}>
        <Text style={styles.erreur}>❌ {erreur}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.carte}
        initialRegion={{
          latitude: position!.latitude,
          longitude: position!.longitude,
          latitudeDelta: 0.01,  // zoom
          longitudeDelta: 0.01,
        }}
      >
        {/* Ton marqueur sur la carte */}
        <Marker
          coordinate={{
            latitude: position!.latitude,
            longitude: position!.longitude,
          }}
          title="Ma position"
          description="Mise à jour toutes les 5 min"
        />
      </MapView>

      {/* Affichage des coordonnées */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTexte}>
          📍 {position!.latitude.toFixed(6)}, {position!.longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carte: {
    flex: 1,
  },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f0f0f',
    gap: 16,
  },
  texte: {
    color: '#ffffff',
    fontSize: 16,
  },
  erreur: {
    color: '#ff4444',
    fontSize: 16,
  },
  infoBox: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#000000cc',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  infoTexte: {
    color: '#ffffff',
    fontSize: 14,
  },
})
