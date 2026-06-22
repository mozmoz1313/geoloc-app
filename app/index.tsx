import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { useState } from 'react'

export default function HomeScreen() {
  // useState → on stocke si l'user est connecté ou pas
  const [connecte, setConnecte] = useState(false)

  return (
    <View style={styles.container}>

      <Text style={styles.titre}>
        📍 GeolocApp
      </Text>

      <Text style={styles.sousTitre}>
        Suis tes proches en temps réel
      </Text>

      <TouchableOpacity
        style={styles.bouton}
        onPress={() => setConnecte(!connecte)}
      >
        <Text style={styles.boutonTexte}>
          {connecte ? "✅ Connecté" : "Se connecter"}
        </Text>
      </TouchableOpacity>

    </View>
  )
}

// Les styles → comme du CSS mais en JavaScript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titre: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  sousTitre: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 40,
  },
  bouton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  boutonTexte: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
