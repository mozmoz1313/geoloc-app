import { useState, useEffect } from 'react'
import * as Location from 'expo-location'

// Ce que le hook va retourner
type LocationData = {
  latitude: number
  longitude: number
} | null

export function useLocation() {
  const [position, setPosition] = useState<LocationData>(null)
  const [erreur, setErreur] = useState<string | null>(null)
  const [chargement, setChargement] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout

    async function demarrerLocalisation() {
      // 1. Demander la permission à l'utilisateur
      const { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        setErreur('Permission GPS refusée')
        setChargement(false)
        return
      }

      // 2. Obtenir la position immédiatement
      const loc = await Location.getCurrentPositionAsync({})
      setPosition({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      })
      setChargement(false)

      // 3. Actualiser toutes les 5 minutes
      interval = setInterval(async () => {
        const loc = await Location.getCurrentPositionAsync({})
        setPosition({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        })
      }, 5 * 60 * 1000) // 5 minutes en millisecondes
    }

    demarrerLocalisation()

    // Nettoyage quand le composant se ferme
    return () => clearInterval(interval)
  }, [])

  return { position, erreur, chargement }
}
