# 📛 Mode overlay / hotkey qui ne fonctionne pas

## Symptôme
- `CommandOrControl+Shift+O` n’active pas l’overlay
- L’application ne devient pas cliquable/transparent correctement
- Le bouton de fermeture/minimiser ne répond pas

## Diagnostic
- Vérifier que `globalShortcut.register(toggleOverlayHotKey, ...)` a bien réussi
- Vérifier si la fenêtre est rendue et si `mainWindow.setIgnoreMouseEvents()` est appelée
- Regarder si `ipcMain`/`ipcRenderer` échangent bien le message `toggle-overlay`
- Vérifier si une erreur de contexte d’isolation bloque la communication

## Résolution
1. Redémarrer l’application
2. Tester si d’autres raccourcis globaux fonctionnent
3. Vérifier la console main/renderer pour les logs `Overlay is now enabled`
4. Si l’IPC ne passe pas, corriger l’exposition dans index.ts

## Contact
- Nom : Sarah
- Slack : @pichou08