# Kuuni

Un site web Next.js pour promouvoir et réserver des expériences authentiques au Burkina Faso.

## 🌍 À Propos

Kuuni est une plateforme qui permet aux visiteurs de découvrir et réserver des expériences culturelles, gastronomiques et artisanales à Ouagadougou et Bobo-Dioulasso.

## ✨ Fonctionnalités

### Pour les Visiteurs
- **Page d'accueil** : Présentation des expériences récentes et mises en avant
- **Page À Propos** : Découvrez notre mission et nos valeurs
- **Liste d'expériences** : Parcourez toutes les expériences disponibles organisées par ville (Ouagadougou et Bobo-Dioulasso)
- **Détails d'expérience** : Consultez les informations détaillées et réservez
- **Formulaire de réservation** : Soumettez une demande de réservation avec vos coordonnées

### Pour les Administrateurs
- **Gestion des expériences** : Ajoutez de nouvelles expériences et activités
- **Gestion des réservations** : Consultez et gérez toutes les demandes de réservation
- **Filtres et statuts** : Organisez les réservations par statut (en attente, contacté, confirmé)

## 🚀 Technologies

- **Next.js 15** avec App Router
- **TypeScript** pour la sûreté des types
- **Tailwind CSS** pour le design responsive
- **API Routes** pour la gestion des données

## 📦 Installation et Lancement

1. Les dépendances sont déjà installées. Si besoin, réinstallez-les :
```bash
npm install
```

2. Lancez le serveur de développement :
```bash
npm run dev
```

3. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## 📁 Structure du Projet

```
jose/
├── app/
│   ├── page.tsx                    # Page d'accueil
│   ├── layout.tsx                  # Layout principal
│   ├── a-propos/
│   │   └── page.tsx               # Page À Propos
│   ├── experiences/
│   │   ├── page.tsx               # Liste des expériences
│   │   └── [id]/
│   │       └── page.tsx           # Détails d'une expérience
│   ├── admin/
│   │   ├── page.tsx               # Dashboard admin
│   │   ├── experiences/
│   │   │   └── page.tsx           # Gestion des expériences
│   │   └── bookings/
│   │       └── page.tsx           # Gestion des réservations
│   └── api/
│       ├── experiences/
│       │   └── route.ts           # API des expériences
│       └── bookings/
│           └── route.ts           # API des réservations
├── components/
│   ├── Header.tsx                  # En-tête de navigation
│   ├── Footer.tsx                  # Pied de page
│   └── BookingForm.tsx            # Formulaire de réservation
├── lib/
│   └── data.ts                    # Données d'exemple
└── types/
    └── index.ts                   # Types TypeScript
```

## 🎨 Personnalisation

### Modifier les Couleurs

Les couleurs principales du thème sont définies avec Tailwind CSS :
- **Couleur primaire** : `amber-600` (peut être changée dans les fichiers)
- **Couleur secondaire** : `gray-800`

### Ajouter des Expériences

1. Allez sur `/admin/experiences`
2. Cliquez sur "Ajouter une expérience"
3. Remplissez le formulaire avec toutes les informations
4. Soumettez pour créer l'expérience

### Gérer les Réservations

1. Allez sur `/admin/bookings`
2. Consultez toutes les demandes de réservation
3. Filtrez par statut (en attente, contacté, confirmé)
4. Contactez directement les clients par email ou téléphone

## 🔄 Prochaines Étapes Recommandées

1. **Base de données** : Intégrer une vraie base de données (MongoDB, PostgreSQL, Supabase, etc.)
2. **Authentication** : Ajouter une authentification pour protéger l'admin
3. **Upload d'images** : Implémenter un système d'upload d'images
4. **Paiement** : Intégrer un système de paiement en ligne
5. **Email** : Configurer l'envoi automatique d'emails de confirmation
6. **Multilingue** : Ajouter le support de plusieurs langues (français/anglais)

## 📝 Notes Importantes

- Les données sont actuellement stockées en mémoire et seront perdues au redémarrage
- Aucune authentification n'est requise pour accéder à l'admin (à ajouter en production)
- Les images proviennent d'Unsplash (vous pouvez les remplacer par vos propres images)

## 🚀 Déploiement

Le moyen le plus simple de déployer votre application Next.js est d'utiliser [Vercel](https://vercel.com/new).

Consultez la [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.
