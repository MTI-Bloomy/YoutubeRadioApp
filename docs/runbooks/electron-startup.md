# 📛 App Electron ne démarre pas

## Symptôme
- L’application ne s’ouvre pas
- Seul un message dans la console : `Another instance is already running. Exiting this instance.`
- Ou bien la fenêtre ne s’affiche jamais

## Diagnostic
- Vérifier si une instance existante tourne déjà
- Sur Windows : ouvrir le gestionnaire de tâches, chercher `youtuberadio` / `electron`
- Vérifier les logs de démarrage du processus
- Vérifier que le lock `app.requestSingleInstanceLock()` n’est pas bloqué par un crash antérieur

## Résolution
1. Fermer l’ancienne instance / tuer le processus Electron
2. Relancer l’app
3. Si l’erreur persiste, redémarrer la machine
4. Si le problème est récurrent, ajouter un fallback dans index.ts autour du lock

## Contact
- Nom : Sarah
- Slack : @pichou08