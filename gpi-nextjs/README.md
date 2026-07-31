# GPI — Groupe Projet International — Site vitrine

Site vitrine du projet **Plateforme Étudiante GPI**, développé avec **Next.js 14 (App Router)**, **React 18**, **TypeScript** et **Tailwind CSS**.

Ce projet correspond aux livrables de la **Personne 1 (Frontend / UI)** de la répartition des tâches : design system, header/footer, pages statiques, pages services dynamiques, pages Alternances/Stages, et interface de l'espace connecté (dashboard).

## 🚀 Installation

Prérequis : [Node.js](https://nodejs.org) version 18.18 ou plus récente.

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

Le site est ensuite accessible sur [http://localhost:3000](http://localhost:3000).

## 📁 Structure du projet

```
app/                      → Pages (App Router)
  page.tsx                → Accueil
  a-propos/                → À propos
  services/                → Liste des services
  services/[slug]/         → Détail dynamique d'un service (avi, adl, campus-france, bourses, verificateur)
  alternances/              → Recherche d'alternances (dynamique, filtres)
  stages/                   → Recherche de stages (dynamique, filtres)
  mediatheque/               → Galerie photo
  temoignages/                → Témoignages
  contact/                    → Formulaire de contact
  espace/                      → Espace connecté (dashboard étudiant)
  legal/[type]/                 → Mentions légales / CGV / Confidentialité
  layout.tsx                     → Layout racine (polices, Header, Footer)
  globals.css                     → Design system (couleurs, composants)

components/
  Header.tsx, Footer.tsx, Logo.tsx, Toaster.tsx
  ui/                        → Composants réutilisables (cartes, carrousel, dashboard, recherche...)

lib/
  data.ts                     → Données du site (services, offres, témoignages...)
  toast.ts                     → Utilitaire de notifications

public/
  logo-icon.png, logo-full.png → Logo GPI
```

## 🎨 Design system

Les couleurs, typographies et composants (`.btn`, `.card`, `.field`, `.tag`...) sont définis dans `app/globals.css` et pilotés par des variables CSS harmonisées avec le logo GPI (navy `#0f1b33` + rouge `#e4212b`). Trois polices Google Fonts sont utilisées : **Fraunces** (titres), **Inter** (texte), **JetBrains Mono** (détails/mono).

## 🔌 Prochaine étape : brancher le backend

Toutes les interactions (connexion, formulaires, recherche d'alternances/stages, vérificateur, newsletter) sont pour l'instant **simulées côté client** (aucune donnée n'est persistée, conformément au périmètre de la Personne 1). Pour les rendre fonctionnelles, il faudra :

1. Remplacer les données statiques de `lib/data.ts` par des appels à l'API de la Personne 2 (endpoints REST).
2. Remplacer la logique de connexion simulée dans `components/ui/Dashboard.tsx` par NextAuth + JWT.
3. Brancher le vérificateur (`components/ui/Verificateur.tsx`) sur l'endpoint public de la Personne 3.
4. Connecter les formulaires (`ContactForm`, `QuickRequestForm`) à l'API pour l'envoi réel des données.

## 📦 Build de production

```bash
npm run build
npm run start
```

## 🌐 Déploiement

Ce projet est prêt à être déployé sur [Vercel](https://vercel.com) (recommandé pour Next.js) ou tout hébergeur compatible Node.js.
