# 📖 Documentation Technique

## Architecture générale

```
┌─────────────────────────────────────────────┐
│         Application Electron                │
├─────────────────────────────────────────────┤
│                                             │
│  Main Process (Node.js)                     │
│  ├── IPC Main Handlers                      │
│  ├── File I/O (config.json)                 │
│  ├── Window Management                      │
│  └── Global Shortcuts                       │
│                           ↕ IPC             │
│  Preload Script (Sandboxed Bridge)          │
│  ├── contextBridge                          │
│  └── ipcRenderer                            │
│                           ↕ APIs            │
│  Renderer Process (React)                   │
│  ├── App Component                          │
│  ├── MusicPlayer (YouTube)                  │
│  ├── RadioSearchBar                         │
│  └── Configuration Service                  │
│                                             │
└─────────────────────────────────────────────┘
```

## Structure des dossiers

### `src/main/`
Processus principal Electron. Responsabilités :
- Création et gestion de la fenêtre
- IPC handlers pour config (load/save)
- Gestion des raccourcis clavier globaux
- Contrôle de la visibilité/overlay

**Fichiers clés :**
- `index.ts` — Point d'entrée, création de la fenêtre, IPC setup

### `src/preload/`
Scripts de préchargement pour l'isolation de contexte.

**Fichiers clés :**
- `index.ts` — Exposition sécurisée des APIs (configAPI, electronAPI)
- `index.d.ts` — Déclarations TypeScript pour les APIs globales

### `src/renderer/`
Application React côté interface.

**Fichiers clés :**
- `src/main.tsx` — Point d'entrée React
- `src/App.tsx` — Composant root, gestion du state global (overlay, videoID)
- `src/components/MusicPlayer.tsx` — Lecteur YouTube embed
- `src/components/RadioSearchBar.tsx` — Input de recherche/URL
- `src/components/TopBar.tsx` — Barre supérieure (close, minimize)
- `src/services/config.ts` — Service d'accès à la config IPC

## Communication IPC

### Main → Renderer

| Canal | Direction | Données |
|-------|-----------|---------|
| `toggle-overlay` | ipcRenderer.send | booléen isOverlay |

**Code :**
```typescript
// Main (src/main/index.ts)
mainWindow.webContents.send('toggle-overlay', isOverlay)

// Renderer (src/renderer/src/App.tsx)
window.electron.ipcRenderer.on('toggle-overlay', () => {
  setIsOverlay((prev) => !prev)
})
```

### Renderer → Main (Async)

| Handler | Params | Retour |
|---------|--------|--------|
| `config:load` | — | `AppConfig` (JSON) |
| `config:save` | `data: AppConfig` | void |

**Code :**
```typescript
// Preload (src/preload/index.ts)
contextBridge.exposeInMainWorld('configAPI', {
  load: () => ipcRenderer.invoke('config:load'),
  save: (data) => ipcRenderer.invoke('config:save', data)
})

// Renderer (src/renderer/src/services/config.ts)
export const configService = {
  loadConfig: async () => await window.configAPI.load(),
  saveConfig: async (data) => await window.configAPI.save(data)
}
```

## Configuration (config.json)

**Localisation :** `~/.config/YoutubeRadio/config.json` (platform-dependent)

**Format :**
```typescript
export type AppConfig = {
  lastVideoID: string
}
```

**Exemple :**
```json
{
  "lastVideoID": "jfKfPfyJRdk"
}
```

**Chargement :**
1. Au démarrage, App.tsx appelle `configService.loadConfig()`
2. Si le fichier n'existe pas, une config vide `{}` est retournée
3. Fallback : `lastVideoID` par défaut = `'jfKfPfyJRdk'`

**Sauvegarde :**
1. Lors du changement de vidéo dans MusicPlayer.tsx, `handleVideoChange()` est appelé
2. Appel à `configService.saveConfig({ lastVideoID: videoId })`
3. Écriture synchrone du JSON dans le fichier

## Parsing d'URL YouTube

Fonction utilitaire dans MusicPlayer.tsx :

```typescript
function youtube_parser(url: string): string | false {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(live\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[8].length == 11 ? match[8] : false
}
```

**Formats supportés :**
- `https://www.youtube.com/watch?v=xxxxx`
- `https://youtu.be/xxxxx`
- `https://www.youtube.com/embed/xxxxx`
- `https://www.youtube.com/live/xxxxx`

**Retour :** 
- ID de 11 caractères si valide
- `false` si invalide

## Raccourcis clavier globaux

Définis dans index.ts :

```typescript
const toggleOverlayHotKey = 'CommandOrControl+Shift+O'
globalShortcut.register(toggleOverlayHotKey, () => {
  isOverlay = !isOverlay
  mainWindow.setIgnoreMouseEvents(isOverlay)
  mainWindow.webContents.send('toggle-overlay', isOverlay)
})
```

**Comportement :**
- Mode normal : `setIgnoreMouseEvents(false)` — app cliquable
- Mode overlay : `setIgnoreMouseEvents(true)` — clics passent au-dessus
- Visibilité : opacité réduite à 40% en mode overlay

## Sécurité

### Context Isolation
- Enabled par défaut dans `BrowserWindow` options
- Sandbox : `false` (nécessaire pour l'accès aux fichiers locaux)

### Content Security Policy (CSP)
Défini dans index.html :
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self' https://www.youtube.com;
  script-src 'self' http://www.youtube.com https://www.youtube.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://i.ytimg.com data:
" />
```

### Single Instance Lock
Pour éviter les instances multiples :
```typescript
const isSingleInstance = app.requestSingleInstanceLock()
if (!isSingleInstance) {
  app.quit()
}
```

## Dépendances clés

| Package | Version | Usage |
|---------|---------|-------|
| `electron` | ^36.5.0 | Framework desktop |
| `react` | ^19.1.0 | UI components |
| `react-youtube` | ^10.1.0 | Lecteur YouTube embed |
| `tailwindcss` | ^4.1.10 | Styling |
| `electron-builder` | ^25.1.8 | Packaging/distribution |
| `electron-updater` | ^6.3.9 | Auto-updates |
| `typescript` | ^5.8.3 | Type safety |

## Build et distribution

### Configuration build (electron-builder.yml)

- **Windows :** NSIS installer
- **macOS :** DMG + notarization support
- **Linux :** AppImage, snap, deb

### Artifacts générés

```
dist/
├── YoutubeRadio-1.0.1-setup.exe     (Windows)
├── YoutubeRadio-1.0.1.dmg           (macOS)
├── YoutubeRadio-1.0.1.AppImage      (Linux)
└── ...
```

### Auto-updates

Configuré via GitHub releases (provider: github).

Voir dev-app-update.yml pour les détails.

## Événements Electron clés

| Événement | Comportement |
|-----------|-------------|
| `app.whenReady()` | Initialisation et création de fenêtre |
| `app.on('activate')` | macOS : recréation de fenêtre si nécessaire |
| `app.on('window-all-closed')` | Fermeture complète sauf macOS |
| `mainWindow.on('ready-to-show')` | Affichage de la fenêtre |

## Performance

- **Hot Module Reload (HMR)** : en développement via electron-vite
- **Tree-shaking** : code inutilisé supprimé au build
- **Lazy loading** : YouTube iframe chargé dynamiquement
- **Config lazy load** : chargement asynchrone de la config au démarrage

## Logs et debugging

### Mode développement
```bash
npm run dev
# F12 pour ouvrir DevTools
# Console : voir logs et erreurs renderer
# Network : voir appels YouTube
```

### Logs principales

**Main process :**
```typescript
console.log('Overlay is now enabled/disabled')
console.log(`Loading config from ${configPath}`)
console.log(`Saving config to ${configPath}`)
```

**Renderer :**
```typescript
console.log('MusicPlayer initialized with props:', props)
console.log('Config loaded:', config)
console.error('Invalid YouTube link')
```