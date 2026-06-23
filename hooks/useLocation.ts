import { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import { envoyerPosition } from '../services/location'

type PositionData = {
  latitude: number
  longitude: number
} | null

export function useLocation() {
  const [position, setPosition] = useState<PositionData>(null)
  const [erreur, setErreur] = useState<string | null>(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout

    async function demarrer() {
      // 1. Demander permission GPS
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        setErreur('Permission GPS refusée')
        setChargement(false)
        return
      }

      // 2. Obtenir position immédiatement
      const loc = await Location.getCurrentPositionAsync({})
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      }

      setPosition(coords)
      setChargement(false)

      // 3. Envoyer sur Supabase immédiatement
      await envoyerPosition(coords.latitude, coords.longitude)

      // 4. Répéter toutes les 5 minutes
      interval = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({})
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        }
        setPosition(coords)

        // Envoyer la nouvelle position sur Supabase
        await envoyerPosition(coords.latitude, coords.longitude)

      }, 5 * 60 * 1000)
    }

    demarrer()

    // Nettoyage
    return () => clearInterval(interval)
  }, [])

  return { position, erreur, chargement }
