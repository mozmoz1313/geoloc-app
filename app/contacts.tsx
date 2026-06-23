import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'
import { useState, useEffect } from 'react'
import { supabase } from '../services/supabase'

type Contact = {
  id: string
  email: string
  user_id: string
}

export default function ContactsScreen() {
  const [email, setEmail] = useState('')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [erreur, setErreur] = useState<string | null>(null)

  // Charger les contacts au démarrage
  useEffect(() => {
    chargerContacts()
  }, [])

  async function chargerContacts() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('contacts')
      .select('*')
      .eq('owner_id', user.id)

    if (data) setContacts(data)
  }

  async function ajouterContact() {
    setErreur(null)

    // Chercher l'utilisateur par email
    const { data: profil } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (!profil) {
      setErreur('Utilisateur introuvable')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Ajouter le contact
    await supabase
      .from('contacts')
      .insert({
        owner_id: user.id,
        user_id: profil.id,
        email: profil.email,
      })

    setEmail('')
    chargerContacts()
  }

  async function supprimerContact(id: string) {
    await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    chargerContacts()
  }

  return (
    <View style={styles.container}>

      <Text style={styles.titre}>👥 Mes proches</Text>

      {/* Ajouter un contact */}
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Email du proche"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.boutonAjouter}
          onPress={ajouterContact}
        >
          <Text style={styles.boutonTexte}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Erreur */}
      {erreur && (
        <Text style={styles.erreur}>❌ {erreur}</Text>
      )}

      {/* Liste des contacts */}
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactCard}>
            <Text style={styles.contactEmail}>📍 {item.email}</Text>
            <TouchableOpacity
              onPress={() => supprimerContact(item.id)}
            >
              <Text style={styles.supprimer}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vide}>
            Aucun proche ajouté pour l'instant
          </Text>
        }
      />

    </View>
  )
}

const styles = StyleSheet.create({
