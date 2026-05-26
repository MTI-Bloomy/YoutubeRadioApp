# 📛 Échec de lecture ou écriture de `config.json`

## Symptôme
- L’application reste bloquée sur `Loading Radio`
- Le dernier radioID n’est pas restauré
- Erreurs dans la console `JSON.parse` ou `ENOENT`
- Le profil utilisateur semble corrompu

## Diagnostic
- Vérifier que le fichier existe à `app.getPath('userData')/config.json`
- Vérifier les permissions du répertoire utilisateur
- Vérifier le contenu du fichier : JSON valide ?
- Regarder les logs `Loading config from ...`

## Résolution
1. Sauvegarder le contenu actuel de `config.json`
2. Si JSON invalide, remplacer par `{}` ou conserver uniquement `{"lastVideoID":"jfKfPfyJRdk"}`
3. Vérifier que l’application redémarre correctement
4. Ajouter validation / try-catch autour de `JSON.parse` dans index.ts
5. Documenter le cas comme « config corrompue »

## Contact
- Nom : Sarah
- Slack : @pichou08