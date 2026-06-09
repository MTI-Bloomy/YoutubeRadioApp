# 📛 Lecture YouTube cassée / vidéo non chargée

## Symptôme
- Le lecteur reste vide
- Le message d’erreur `Invalid YouTube link`
- La vidéo ne démarre pas même avec un lien valide
- Le contenu ne s’affiche pas à cause de la CSP de index.html

## Diagnostic
- Vérifier que l’URL saisie est bien une URL YouTube et que `youtube_parser()` extrait un ID de 11 caractères
- Vérifier la console du renderer pour les erreurs de `react-youtube`
- Vérifier la politique de contenu dans index.html
- Vérifier la connexion internet et l’accès à `https://www.youtube.com`

## Résolution
1. Tester un lien YouTube standard comme `https://www.youtube.com/watch?v=jfKfPfyJRdk`
2. Si la vidéo ne charge pas, essayer d’ouvrir directement YouTube dans un browser
3. Si la CSP bloque, ajuster index.html
4. Si l’iframe est bloqué par YouTube, vérifier qu’aucun bloqueur ou pare-feu ne gêne

## Contact
- Nom : Sarah
- Slack : @pichou08