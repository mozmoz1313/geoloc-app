import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import MapView, { Marker } from 'react-native-maps'
import { useEffect, useState } from 'react'
import { useLocation } from '../hooks/useLocation'
import { ecouterPosition } from '../services/location'

type ProchPosition = {
  latitude: number
  longitude: number
  user_id: string
} | null

export default function MapScreen() {
  const { position, erreur, chargement } = useLocation()
  const [prochPosition, setProchPosition] = useState<ProchPosition>(null)

  useEffect(() => {
    // Écouter la position d'un proche en live
    // Remplace USER_ID_DU_PROCHE par le vrai ID plus tard
    const unsub = ecouterPosition('USER_ID_DU_PROCHE', (pos) => {
      setProchPosition(pos)
    })

    return () => { unsub.unsubscribe() }
  }, [])

  if (chargement) {
    return (
      <View style={styles.centre}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.texte}>Récupération GPS...</Text>
      </View>
    )
  }

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
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Ta position */}
        <Marker
          coordinate={position!}
          title="Moi"
          pinColor="#4f46e5"
        />

        {/* Position du proche */}
        {prochPosition && (
          <Marker
            coordinate={prochPosition}
            title="Mon proche"
            pinColor="#ff4444"
          />
        )}

      </MapView>

      {/* Info en bas */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTexte}>
          📍 {position!.latitude.toFixed(5)}, {position!.longitude.toFixed(5)}
        </Text>
        <Text style={styles.infoTexte}>
          🔄 Mise à jour toutes les 5 min
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
    gap: 4,
  },
  infoTexte: {
    color: '#ffffff',
    fontSize: 13,
    textAlign: 'center',
  },
})
