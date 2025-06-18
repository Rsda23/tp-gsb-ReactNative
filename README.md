# TP GSB - Application de gestion de tickets de support

Ce projet est une application mobile réalisée avec **React Native (Expo)** et **Firebase** dans le cadre d'un TP.

---

## Fonctionnalités réalisées

### Authentification
- Création de compte utilisateur (nom, email, mot de passe, rôle, etc.)
- Connexion avec vérification des identifiants
- Redirection automatique en cas de succès ou d'échec
- Données stockées dans Firestore (`users`)
- Déconnexion fonctionnelle

### Profil
- Affichage des informations utilisateur (rôle, email, département…)
- Déconnexion depuis le profil

### Tickets
- Création d’un ticket avec :
  - titre, description, priorité, catégorie, échéance, localisation, appareil

---

## Commande

```bash
npx create-expo-app tp-gsb --template app
pnpm install firebase
npm install expo-router
pnpm add @react-native-picker/picker
npx expo start
npx expo start --clear



