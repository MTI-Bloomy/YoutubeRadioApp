# Guide de configuration de l'environnement

## Prérequis système

### Windows
- Windows 10 ou supérieur
- **RAM :** 4 GB minimum (8 GB recommandé)
- **Disque :** 2 GB libres

### macOS
- macOS 10.13 ou supérieur
- Xcode Command Line Tools (optionnel)
- **RAM :** 4 GB minimum

### Linux
- Debian/Ubuntu, Fedora, ou Arch-based distros
- Build essentials : `build-essential`, `python3`
- **RAM :** 4 GB minimum

## Installation de l'environnement

### 1. Node.js et npm

#### Windows
**Option 1 : Installez depuis nvm-windows (recommandé)**
```bash
# Télécharger depuis https://github.com/coreybutler/nvm-windows/releases
# Installer nvm-setup.exe

nvm install 20.11.0
nvm use 20.11.0
```

**Option 2 : Installez depuis nodejs.org**
1. Aller sur https://nodejs.org/
2. Télécharger LTS (20.x ou supérieur)
3. Exécuter l'installeur

**Vérification :**
```bash
node --version    # v20.11.0 ou supérieur
npm --version     # 10.x ou supérieur
```

#### macOS (Homebrew)
```bash
brew install node
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm
node --version
npm --version
```

#### Linux (Fedora)
```bash
sudo dnf install nodejs npm
```

### 2. Git

Nécessaire pour cloner le repo.

#### Windows
```bash
# Télécharger depuis https://git-scm.com/download/win
# Ou via Chocolatey :
choco install git
```

#### macOS
```bash
brew install git
```

#### Linux
```bash
# Ubuntu
sudo apt install git

# Fedora
sudo dnf install git
```

**Vérification :**
```bash
git --version
```

### 3. Yarn (optionnel mais recommandé)

Plus rapide et fiable que npm pour ce projet.

```bash
npm install -g yarn

# Vérifier l'installation
yarn --version
```

### 4. Visual Studio Code (optionnel mais recommandé)

Pour développer confortablement :
1. Télécharger depuis https://code.visualstudio.com/
2. Extensions recommandées :
   - **ESLint** (dbaeumer.vscode-eslint)
   - **Prettier** (esbenp.prettier-vscode)
   - **TypeScript Vue Plugin** (Vue.volar)
   - **React Native Tools** (msjsdiag.vscode-react-native)

### 5. Dépendances de build (optionnel)

Nécessaire seulement si vous buildez depuis les sources.

#### Windows
```bash
# Via Visual Studio Community avec C++ desktop workload
# Ou installez les build tools directement
npm install --global windows-build-tools
```

#### macOS
```bash
xcode-select --install
```

#### Linux
```bash
# Ubuntu
sudo apt install build-essential python3

# Fedora
sudo dnf install gcc gcc-c++ make python3
```

## Configuration du projet

### 1. Cloner le repository

```bash
git clone https://github.com/MTI-Bloomy/YoutubeRadioApp.git
cd YoutubeRadioApp
```

### 2. Installer les dépendances

```bash
npm install
# ou
yarn install
```

Cela installe toutes les dépendances listées dans package.json.

### 3. Configurer Git (local)

```bash
git config user.name "Votre Nom"
git config user.email "votre.email@example.com"
```

### 4. Générer les fichiers de config (optionnel)

```bash
npm run build
```

Cela compile TypeScript et génère les fichiers dans `out/`.

## Vérifications

### Vérifier l'installation

```bash
# Vérifier les versions
node -v
npm -v
git -v

# Tester le linting
npm run lint

# Tester la compilation TypeScript
npm run typecheck

# Lancer l'app
npm run dev
```

### Vérifier que tout marche

1. Lancer l'app : `npm run dev`
2. Vérifier que la fenêtre s'ouvre
3. Tester un lien YouTube : `https://www.youtube.com/watch?v=jfKfPfyJRdk`
4. Tester le raccourci : `Ctrl+Shift+O` (Windows) ou `Cmd+Shift+O` (macOS)

## Environnements

### Développement

```bash
npm run dev
# Ou avec watch :
npm run dev:watch
```

- Hot reload activé
- DevTools disponibles (F12)
- Sources TypeScript visibles

### Production/Build

```bash
npm run build:win      # Windows
npm run build:mac      # macOS
npm run build:linux    # Linux
```

Génère des exécutables optimisés dans `dist/`.

## Variables d'environnement

Aucune variable d'environnement requise actuellement.

Si vous en avez besoin, créez un fichier `.env` à la racine :
```env
VITE_API_URL=http://localhost:3000
DEBUG=1
```

Et importez-les dans votre code :
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## Troubleshooting installation

### `npm install` échoue

```bash
# Nettoyer le cache npm
npm cache clean --force

# Réinstaller
rm -rf node_modules package-lock.json
npm install
```

### Port 5173 déjà utilisé (dev)

```bash
# Lancer sur un port différent (modifiez electron.vite.config.ts)
# Ou tuez le processus qui utilise le port

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :5173
kill -9 <PID>
```

### Module TypeScript introuvable

```bash
# Nettoyer et réinstaller
npm run clean
npm install
npm run typecheck
```

### Electron ne démarre pas

```bash
# Supprimer les artifacts de build
rm -rf out dist

# Recompiler
npm run build
npm run dev
```

## Configuration IDE (VS Code)

Créer un fichier settings.json si inexistant :

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

Fichier extensions.json recommandé :

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "Vue.volar",
    "msjsdiag.vscode-react-native"
  ]
}
```

## Prochaines étapes

1. Environnement configuré
2. → Lancer `npm run dev`
3. → Consulter TECHNICAL.md pour l'architecture
4. → Consulter [../README.md](.README.md) pour l'utilisation

## Support

Pour des problèmes spécifiques, consultez :
- Runbooks opérationnels
- Post-mortems des incidents
- [Issues GitHub](https://github.com/MTI-Bloomy/YoutubeRadioApp/issues)
