# 🚀 Guide de Configuration Supabase

## Étape 1 : Créer un Compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Créez un compte (gratuit) avec GitHub ou email

## Étape 2 : Créer un Nouveau Projet

1. Dans le dashboard Supabase, cliquez sur "New Project"
2. Remplissez les informations :
   - **Name** : `burkina-experiences` (ou le nom de votre choix)
   - **Database Password** : Choisissez un mot de passe fort (notez-le !)
   - **Region** : Choisissez la région la plus proche (ex: `Europe West (London)`)
   - **Pricing Plan** : Free (gratuit)
3. Cliquez sur "Create new project"
4. Attendez 2-3 minutes que le projet soit créé

## Étape 3 : Configurer la Base de Données

1. Dans votre projet Supabase, allez dans l'onglet **SQL Editor** (icône </> dans la barre latérale)
2. Cliquez sur "+ New query"
3. Copiez tout le contenu du fichier `supabase-setup.sql` 
4. Collez-le dans l'éditeur SQL
5. Cliquez sur "Run" (ou Ctrl+Enter)
6. Vous devriez voir un message de succès ✅

## Étape 4 : Récupérer les Clés API

1. Allez dans **Settings** (⚙️ dans la barre latérale)
2. Cliquez sur **API** dans le menu de gauche
3. Vous verrez deux informations importantes :

   - **Project URL** : `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public** key : Une longue clé commençant par `eyJ...`

## Étape 5 : Configurer les Variables d'Environnement

1. Ouvrez le fichier `.env.local` dans votre projet
2. Remplacez les valeurs :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

3. Sauvegardez le fichier

## Étape 6 : Redémarrer le Serveur

```bash
# Arrêtez le serveur (Ctrl+C si en cours)
# Puis relancez :
npm run dev
```

## ✅ Vérification

1. Allez dans Supabase > **Table Editor**
2. Vous devriez voir 2 tables :
   - `experiences` (avec 6 lignes de données)
   - `booking_requests` (vide pour l'instant)

3. Testez votre site :
   - Allez sur http://localhost:3000
   - Les expériences devraient s'afficher normalement
   - Faites une réservation test
   - Vérifiez dans Supabase > Table Editor > `booking_requests` que la réservation apparaît

## 📊 Visualiser vos Données

Dans Supabase, vous pouvez :
- **Table Editor** : Voir et modifier vos données en mode tableau
- **SQL Editor** : Exécuter des requêtes SQL personnalisées
- **Database** : Voir le schéma de votre base de données

## 🔐 Sécuriser l'Admin (Optionnel mais Recommandé)

Pour protéger les routes admin, vous pouvez :

1. Activer l'authentification Supabase
2. Créer un compte admin
3. Protéger les routes `/admin/*` avec un middleware

Voulez-vous que je configure l'authentification aussi ?

## 🆘 Problèmes Courants

### Erreur "Invalid API key"
- Vérifiez que vous avez bien copié les clés depuis Supabase
- Assurez-vous qu'il n'y a pas d'espaces avant/après dans `.env.local`
- Redémarrez le serveur

### Les données n'apparaissent pas
- Vérifiez que le script SQL s'est bien exécuté
- Allez dans Table Editor pour confirmer que les données sont là
- Vérifiez les logs du serveur pour des erreurs

### "Failed to fetch"
- Vérifiez votre connexion internet
- Vérifiez que l'URL Supabase est correcte

## 📝 Notes Importantes

- ✅ Le plan gratuit inclut : 500 MB de stockage, 2 GB de bande passante
- ✅ Les données sont sauvegardées et persistent (contrairement au stockage en mémoire)
- ✅ Vous pouvez accéder à vos données depuis n'importe où
- ✅ Backup automatique des données

## 🎉 Prochaines Étapes

Une fois Supabase configuré, vous pouvez :
1. Ajouter l'authentification pour protéger l'admin
2. Uploader des images directement dans Supabase Storage
3. Ajouter des webhooks pour les notifications email
4. Déployer sur Vercel avec vos variables d'environnement
