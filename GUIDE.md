# Guide d'Utilisation - Kuuni

## ✅ Le site est prêt !

Votre site web est maintenant en ligne sur : **http://localhost:3000**

## 📍 Pages Disponibles

### Pages Publiques

1. **Page d'accueil** - http://localhost:3000
   - Hero section avec image de fond
   - Description du projet
   - Dernières expériences mises en avant
   - Call-to-action

2. **À Propos** - http://localhost:3000/a-propos
   - Mission de l'entreprise
   - Services proposés
   - Valeurs de l'entreprise

3. **Liste des Expériences** - http://localhost:3000/experiences
   - Section Ouagadougou avec toutes les expériences et activités
   - Section Bobo-Dioulasso avec toutes les expériences et activités
   - Cartes cliquables pour chaque expérience

4. **Détails d'une Expérience** - http://localhost:3000/experiences/1
   - Images en galerie
   - Description complète
   - Points forts
   - Ce qui est inclus / non inclus
   - Formulaire de réservation

### Pages Administrateur

5. **Dashboard Admin** - http://localhost:3000/admin
   - Accès aux deux sections d'administration

6. **Gestion des Expériences** - http://localhost:3000/admin/experiences
   - Voir toutes les expériences
   - Ajouter de nouvelles expériences
   - Formulaire complet avec :
     - Titre, description, catégorie
     - Ville (Ouagadougou / Bobo-Dioulasso)
     - Type (Expérience / Activité)
     - Prix, durée
     - Images (URLs)
     - Points forts
     - Inclus / Non inclus
     - Option "mise en avant"

7. **Gestion des Réservations** - http://localhost:3000/admin/bookings
   - Voir toutes les demandes de réservation
   - Filtrer par statut (en attente, contacté, confirmé)
   - Liens directs pour email et téléphone
   - Informations complètes de chaque demande

## 🎯 Tester le Site

### Test du Formulaire de Réservation

1. Allez sur http://localhost:3000/experiences/1
2. Scrollez vers le bas jusqu'au formulaire
3. Remplissez vos informations :
   - Nom complet
   - Email
   - Téléphone
   - Nombre de personnes
   - Date souhaitée
   - Message (optionnel)
4. Cliquez sur "Envoyer la demande de réservation"
5. Un message de confirmation s'affichera
6. Allez sur http://localhost:3000/admin/bookings pour voir votre demande

### Test de l'Ajout d'Expérience

1. Allez sur http://localhost:3000/admin/experiences
2. Cliquez sur "+ Ajouter une expérience"
3. Remplissez le formulaire avec vos informations
4. Pour les images, utilisez des URLs d'Unsplash ou vos propres URLs
5. Cliquez sur "Ajouter l'expérience"
6. Votre nouvelle expérience apparaîtra dans la liste

## 📊 Expériences Pré-chargées

Le site contient déjà 6 expériences d'exemple :

**Ouagadougou :**
1. Visite Culturelle du Centre-Ville (25,000 FCFA)
2. Restaurant Le Verdoyant (8,000 FCFA)
3. Atelier de Poterie Traditionnelle (15,000 FCFA)

**Bobo-Dioulasso :**
1. Safari Urbain (30,000 FCFA)
2. Restaurant Chez Aicha (7,000 FCFA)
3. Atelier de Percussion Africaine (12,000 FCFA)

## 🎨 Personnalisation

### Changer les Images

Les images actuelles proviennent d'Unsplash. Pour utiliser vos propres images :

1. **Option 1 - Hébergement externe :**
   - Uploadez vos images sur un service comme Cloudinary, Imgur, etc.
   - Copiez les URLs
   - Utilisez-les dans le formulaire d'ajout d'expérience

2. **Option 2 - Images locales :**
   - Placez vos images dans le dossier `public/images/`
   - Utilisez le chemin `/images/votre-image.jpg`
   - Mettez à jour `next.config.ts` si nécessaire

### Modifier les Couleurs

Dans tous les fichiers, remplacez :
- `amber-600` par votre couleur primaire (ex: `blue-600`, `green-600`)
- `gray-800` par votre couleur secondaire

### Personnaliser le Footer

Modifiez le fichier `components/Footer.tsx` pour :
- Changer l'email de contact
- Changer le numéro de téléphone
- Ajouter vos réseaux sociaux

## ⚠️ Important à Savoir

1. **Données temporaires :** Les données sont stockées en mémoire. Si vous redémarrez le serveur, toutes les nouvelles expériences et réservations seront perdues. Les 6 expériences d'exemple seront toujours présentes.

2. **Pas d'authentification :** L'admin est accessible sans mot de passe. Pour la production, ajoutez une authentification (NextAuth, Clerk, etc.)

3. **Images externes :** Les images d'Unsplash sont utilisées pour la démo. Pour la production, utilisez vos propres images.

## 🚀 Prochaines Étapes

Pour mettre le site en production :

1. **Ajoutez une base de données :**
   - Supabase (gratuit, facile)
   - MongoDB Atlas (gratuit pour débuter)
   - PostgreSQL

2. **Ajoutez l'authentification admin :**
   - NextAuth.js
   - Clerk
   - Auth0

3. **Hébergez vos images :**
   - Cloudinary
   - AWS S3
   - Vercel Blob Storage

4. **Déployez le site :**
   - Vercel (recommandé, gratuit)
   - Netlify
   - Railway

5. **Configurez les emails :**
   - SendGrid
   - Resend
   - Mailgun

## 📞 Support

Si vous avez des questions ou besoin d'aide pour personnaliser le site, n'hésitez pas !

## 🎉 Bon à savoir

- Le site est entièrement responsive (fonctionne sur mobile, tablette, desktop)
- Tout le contenu est en français
- Les URLs sont SEO-friendly
- Le design est moderne et professionnel
- Navigation intuitive

Profitez de votre nouveau site ! 🇧🇫
