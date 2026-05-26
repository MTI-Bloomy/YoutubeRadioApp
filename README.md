# 🏵️ YoutubeRadio 🏵️

Une application desktop Electron pour écouter YouTube en tant que lecteur audio overlay, avec support du mode transparent et des raccourcis clavier.

## Prérequis 💐

- **Node.js** : v18+ (LTS recommandé)
- **npm** ou **yarn** : pour la gestion des dépendances
- **Electron** : installé via npm
- Système d'exploitation supporté : Windows, macOS, Linux

### Vérifier votre installation

```bash
node --version    # v18.0.0 ou supérieur
npm --version     # ou yarn --version
```

## Installation rapide

### 1. Cloner et installer

```bash
git clone https://github.com/tsarahanael/YoutubeRadioApp.git
cd YoutubeRadioApp
npm install
# ou
yarn
```

### 2. Lancer en développement

```bash
npm run dev
# ou
yarn dev
```

L'application démarre avec hot-reload.

### 3. Builder l'application

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

Les executables se trouvent dans le dossier `dist/`.

## Utilisation

### Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl+Shift+O` (Windows/Linux/macOS) | Toggle overlay mode (opaque/transparent) |

### Features

- **Lecteur YouTube intégré** : collez un lien YouTube valide
- **Mode overlay** : affichez l'app en transparent par-dessus vos autres fenêtres
- **Persistence** : votre dernier lien est sauvegardé automatiquement
- **Auto-play** : la vidéo démarre automatiquement

## Structure du projet

```
YoutubeRadioApp/
├── src/
│   ├── main/           # Processus principal Electron
│   ├── preload/        # Scripts de préchargement (sécurité)
│   └── renderer/       # Interface React (UI)
├── docs/
│   ├── SETUP.md       # Guide de configuration de l'environnement
│   ├── TECHNICAL.md   # Documentation architecture
│   ├── runbooks/      # Guides opérationnels
│   └── post-mortems/  # Incidents et résolutions
├── build/             # Ressources pour le build (icônes, etc.)
├── Makefile.win       # Commandes utiles (Windows)
├── package.json       # Dépendances et scripts
└── electron.vite.config.ts  # Configuration build
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Démarre en mode développement |
| `npm run dev:watch` | Mode dev avec watch |
| `npm run build` | Compile TypeScript et crée les assets |
| `npm run build:win` | Compile + crée l'installer Windows |
| `npm run build:mac` | Compile + crée le .dmg macOS |
| `npm run build:linux` | Compile + crée les packages Linux |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run format` | Formate le code avec Prettier |
| `npm run typecheck` | Vérifie les types TypeScript |

## Configuration

La configuration est sauvegardée dans `~/.config/YoutubeRadio/config.json` (ou équivalent Windows/macOS).

Exemple de contenu :
```json
{
  "lastVideoID": "jfKfPfyJRdk"
}
```

## Troubleshooting

### L'app ne démarre pas
1. Vérifier qu'une autre instance n'est pas déjà active
2. Tuer le processus : `taskkill /im YoutubeRadio.exe /f` (Windows)
3. Relancer l'app

### La vidéo ne charge pas
1. Vérifier le lien YouTube (format : `https://www.youtube.com/watch?v=xxxxx`)
2. Vérifier la connexion internet
3. Ouvrir la console dev (F12) et vérifier les erreurs

### Le mode overlay ne fonctionne pas
1. Relancer l'app
2. Vérifier que le raccourci n'est pas déjà utilisé par une autre app

Pour plus de détails, consultez runbooks.

## Documentation

- Setup.md — Guide complet d'installation et configuration
- TECHNICAL.md — Architecture du projet et détails techniques
- Runbooks — Guides opérationnels pour les incidents
- Post-mortems — Historique des incidents