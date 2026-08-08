// src/services/storageService.js
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const StorageService = {
  getLocalSettings: (defaultSettings) => {
    try {
      const stored = localStorage.getItem('vidente_agua_settings');
      return stored ? JSON.parse(stored) : defaultSettings;
    } catch (e) {
      console.error("Error al leer settings:", e);
      return defaultSettings;
    }
  },
  
  getLocalSaves: () => {
    try {
      const stored = localStorage.getItem('vidente_agua_saves');
      return stored ? JSON.parse(stored) : [null, null, null];
    } catch (e) {
      console.error("Error al leer saves:", e);
      return [null, null, null];
    }
  },
  
  saveLocal: (settings, saves) => {
    try {
      if (settings) localStorage.setItem('vidente_agua_settings', JSON.stringify(settings));
      if (saves) localStorage.setItem('vidente_agua_saves', JSON.stringify(saves));
    } catch (e) {
      console.error("Error guardando local:", e);
    }
  },
  
  syncWithCloud: async (currentUser, localSettings, localSaves, defaultSettings) => {
    if (!currentUser || !db) return { settings: localSettings, saves: localSaves };
    
    try {
      const docRef = doc(db, 'usuarios_progreso', currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const cloudSettings = data.settings || {};
        const cloudSaves = data.saves || [null, null, null];

        // Merge saves (most recent timestamp)
        const syncedSaves = [null, null, null];
        for (let i = 0; i < 3; i++) {
          const lSave = localSaves[i];
          const cSave = cloudSaves[i];
          if (lSave && cSave) {
            syncedSaves[i] = lSave.timestamp >= cSave.timestamp ? lSave : cSave;
          } else {
            syncedSaves[i] = lSave || cSave || null;
          }
        }

        // Merge settings
        const localTime = localSettings.lastUpdated || 0;
        const cloudTime = cloudSettings.lastUpdated || 0;
        const baseSettings = localTime >= cloudTime ? localSettings : cloudSettings;
        
        const syncedUnlocked = Array.from(new Set([
          ...(localSettings.unlockedNodes || ['cap_0']),
          ...(cloudSettings.unlockedNodes || ['cap_0'])
        ]));

        const syncedSettings = {
          ...defaultSettings,
          ...baseSettings,
          unlockedNodes: syncedUnlocked,
          lastUpdated: Math.max(localTime, cloudTime, Date.now())
        };

        StorageService.saveLocal(syncedSettings, syncedSaves);
        await setDoc(docRef, { settings: syncedSettings, saves: syncedSaves });
        
        return { settings: syncedSettings, saves: syncedSaves };
      } else {
        const initialSettingsForCloud = {
          ...localSettings,
          lastUpdated: localSettings.lastUpdated || Date.now()
        };
        StorageService.saveLocal(initialSettingsForCloud, localSaves);
        await setDoc(docRef, { settings: initialSettingsForCloud, saves: localSaves });
        return { settings: initialSettingsForCloud, saves: localSaves };
      }
    } catch (e) {
      console.error("Error sincronizando con la nube:", e);
      return { settings: localSettings, saves: localSaves };
    }
  },
  
  saveToCloud: async (currentUser, settings, saves) => {
    if (currentUser && db) {
      try {
        await setDoc(doc(db, 'usuarios_progreso', currentUser.uid), { settings, saves });
      } catch (e) {
        console.error("Error guardando en la nube:", e);
      }
    }
  }
};
