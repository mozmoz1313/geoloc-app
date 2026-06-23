import { useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { supabase } from '../services/supabase'

import HomeScreen from './index'
import MapScreen from './map'
import ContactsScreen from './contacts'

const Tab = createBottomTabNavigator()

export default function Layout() {
  const [user, setUser] = useState<any>(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setChargement(false)
    })

    // Écouter les changements de connexion
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Pendant le chargement
  if (chargement) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f0f0f',
        alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    )
  }

  // Si pas connecté → écran login
  if (!user) {
    return <HomeScreen />
  }

  // Si connecté → navigation avec onglets
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1a1a1a',
            borderTopColor: '#333',
          },
          tabBarActiveTintColor: '#4f46e5',
          tabBarInactiveTintColor: '#666',
        }}
      >
        <Tab.Screen
          name="Carte"
          component={MapScreen}
          options={{ tabBarLabel: '🗺️ Carte' }}
        />
        <Tab.Screen
          name="Contacts"
          component={ContactsScreen}
          options={{ tabBarLabel: '👥 Contacts' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
