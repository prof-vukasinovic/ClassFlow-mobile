# ClassFlow-mobile
La partie mobile de l'appli ClassFlow (gestion de classe pour les professeurs)


#Configuration
1) Ouvrir l'invite de commande et taper "ipconfig"
2) Récupérer l'adresse IPv4
3) Ouvrir le fichier "constants/config" et déposer l'adresse IP


#Remarques
Il existe deux types de remarques: les remarques prédéfinis et les remarques écrites.
Les remarques écrites sont libre tandis que les remarques prédéfinis sont imposés pour plus de rapidité.
Il est possible d'ajouter modifier ou supprimer les remarques prédéfinis en modifiant la constante "const REMARQUES_PREDEFINIES" dans le fichier "predef.tsx"



#Installation de l'APK
Pour installer l'APK, il faut d'abord installer diverse ressources.
1) Installation de node.js:
- Aller sur : https://nodejs.org
- Télécharger la version LTS
- Installer
- Vérifier :
`node -v
npm -v`
2) Installation de Expo CLI:
Dans le dossier du projet :
`npm install`
Puis vérifier :
`npx expo --version`
3) Installation de EAS CLI:
commande: `npm install -g eas-cli`
Puis vérifier: `eas --version`
4) Connection à Expo
Vous devez créer un compte Expo : https://expo.dev/signup
Puis dans le terminal : `eas login`
5) Configuration de EAS dans le projet:
Dans le dossier du projet : `eas build:configure`
6) Finalement, la génération de l'APK: `eas build -p android --profile production`
7) Récupération de l'APK:
Une fois la build terminée, Expo affiche un lien : https://expo.dev/accounts/xxxx/projects/xxxx/builds/xxxx
Plus qu'a télécharger et transferer sur votre android.








