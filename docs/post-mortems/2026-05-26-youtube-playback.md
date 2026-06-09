# 🔍 Incident du 26 mai – Lecture YouTube KO

## Résumé
- Problème de parsing / lecture de liens YouTube
- L’application ne chargeait plus la vidéo dans l’iframe pendant 10 min

## Chronologie
- 14h05 : incident signalé par l’utilisateur
- 14h07 : console renderer montre `Invalid YouTube link`
- 14h10 : reproduction avec un lien validé
- 14h13 : bug lié à l’extraction d’ID de vidéo confirmé
- 14h15 : déploiement d’un patch de validation

## Causes profondes
- `youtube_parser()` ne gère pas tous les formats d’URL YouTube
- Pas de fallback en cas d’erreur de parsing
- Pas d’alerte utilisateur claire ni de correction automatique

## Actions correctives
✅ Ajouter une validation robuste du lien YouTube  
✅ Ajouter un message d’erreur plus explicite  
✅ Documenter ce scénario dans le runbook  
✅ Ajouter des tests unitaires sur `youtube_parser()`