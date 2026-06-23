import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native'
import { useState } from 'react'
import { connexion, inscription } from '../services/auth'

export default function HomeScreen() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)
  const [mode, setMode] = useState<'connexion' | 'inscription'>('connexion')

  async function handleSubmit() {
    setChargement(true)
    setErreur(null)

    const result = mode === 'connexion'
      ? await connexion(email, motDePasse)
      : await inscription(email, motDePasse)

    if (result.erreur) {
      setErreur(result.erreur)
    }

    setChargement(false)
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titre}>📍 GeolocApp</Text>
      <Text style={styles.sousTitre}>
        {mode === 'connexion' ? 'Connecte toi' : 'Crée ton compte'}
      </Text>

      {/* Champ email */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Champ mot de passe */}
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor="#666"
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
      />

      {/* Message erreur */}
      {erreur && (
        <Text style={styles.erreur}>❌ {erreur}</Text>
      )}

      {/* Bouton principal */}
      <TouchableOpacity
        style={styles.bouton}
        onPress={handleSubmit}
        disabled={chargement}
      >
        {chargement
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.boutonTexte}>
              {mode === 'connexion' ? 'Se connecter' : "S'inscrire"}
            </Text>
        }
      </TouchableOpacity>

      {/* Switcher connexion/inscription */}
      <TouchableOpacity
        onPress={() => setMode(mode === 'connexion' ? 'inscription' : 'connexion')}
      >
        <Text style={styles.switchTexte}>
          {mode === 'connexion'
            ? 'Pas de compte ? Inscris toi'
            : 'Déjà un compte ? Connecte toi'}
        </Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  titre: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  sousTitre: {
    fontSize: 16,
    color: '#888',
    marginBottom: 32,
  },
  input: {
    width: '100%',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  bouton: {
    width: '100%',
    backgroundColor: '#4f46e5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  boutonTexte: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  erreur: {
    color: '#ff4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  switchTexte: {
    color: '#4f46e5',
    fontSize: 14,
  },
})
