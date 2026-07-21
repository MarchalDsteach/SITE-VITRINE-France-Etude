# API — Plateforme Étudiante

Squelette NestJS avec la sécurité de base déjà en place (voir `/mnt/user-data/outputs` pour les guides détaillés infra, sécurité, paiements/CI-CD/monitoring/RGPD/sauvegardes).

## Ce qui est déjà branché

- ✅ **CORS** — whitelist explicite (`app.votredomaine.com`, `staging.votredomaine.com`, `localhost` en dev)
- ✅ **Rate limiting** — 100 req/min global via `@nestjs/throttler`, `@Throttle()` disponible pour des limites plus strictes par endpoint
- ✅ **Validation globale** — `class-validator` + `whitelist`/`forbidNonWhitelisted` (rejette les champs non déclarés)
- ✅ **Helmet** — headers de sécurité HTTP
- ✅ **Cookie parser** — prêt pour la gestion de session si NextAuth utilise des cookies
- ✅ **`/health`** — endpoint public pour Uptime Robot, exclu du préfixe `/api` et du rate limiting
- ✅ **CI** — lint + test + build sur chaque PR (`.github/workflows/ci.yml`)
- ✅ **Prisma** — schéma minimal (`Etudiant`, `Dossier`, `Paiement`) dans `prisma/schema.prisma`, à faire évoluer avec Personne 2
- ✅ **Module `verificateur`** — `GET /verificateur/:reference`, données minimisées, référence non-devinable (UUID), rate limiting renforcé (20/min)
- ✅ **Module `payments`** — `POST /payments` (création session), providers **Stripe**, **PayPal** et **Mobile Money** (via CinetPay) derrière une interface commune ; 3 endpoints webhook (`/payments/webhooks/stripe`, `/paypal`, `/mobile-money`) ; montant toujours recalculé côté serveur, idempotence gérée

## ⚠️ Étape obligatoire avant de lancer le projet

Ce squelette a été construit dans un environnement sandbox **sans accès réseau à `binaries.prisma.sh`**, donc `npx prisma generate` n'a pas pu être exécuté ici. Chez vous (ou en CI), c'est une commande standard sans souci :

```bash
npx prisma generate
```

Sans cette commande, le build échouera avec des erreurs `Property 'dossier' does not exist on type 'PrismaService'` — c'est normal, ça se résout uniquement avec `prisma generate`. Tout le reste du code (Stripe, controllers, validation, sécurité) a été compilé et testé avec succès de mon côté.

Vous aurez aussi besoin d'une vraie base PostgreSQL et de lancer la première migration :
```bash
npx prisma migrate dev --name init
```

## Démarrage

```bash
npm install
cp .env.example .env   # puis remplir les vraies valeurs
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

L'API démarre sur `http://localhost:3001`. Health check : `http://localhost:3001/health`.

## Scripts disponibles

| Commande | Effet |
|---|---|
| `npm run start:dev` | Démarre en mode watch (dev) |
| `npm run build` | Build de production (`dist/`) |
| `npm run start:prod` | Lance le build (`node dist/main.js`) |
| `npm run lint` | Lint + fix auto |
| `npm test` | Tests unitaires |
| `npm run test:e2e` | Tests end-to-end |

## Points d'attention sur les modules ajoutés

- **`tarifs.ts`** — grille de prix par type de document, c'est la seule source de vérité pour les montants ; ne jamais accepter un montant venant du frontend
- **`verificateur`** — les références Prisma sont des UUID (`@default(uuid())`) précisément pour empêcher l'énumération ; ne changez pas ce champ pour un id séquentiel
- **`payments`** — architecture par interface (`PaymentProvider`) : Stripe, PayPal et Mobile Money (CinetPay) implémentent tous la même interface ; il manque encore un guard d'auth (`TODO` dans `payments.controller.ts`) à brancher une fois le module `auth` de Personne 2 prêt
- **PayPal** — nécessite `PAYPAL_WEBHOOK_ID` (créé dans le Developer Dashboard > Webhooks) en plus des clés client ; la vérification de signature utilise 5 headers PayPal distincts, pas un seul comme Stripe
- **Mobile Money (CinetPay)** ⚠️ — la vérification de signature (`x-token` HMAC) dans `mobile-money.provider.ts` est écrite sur la base de la documentation CinetPay habituelle mais **doit être revérifiée contre leur doc à jour avant mise en prod** : l'ordre exact des champs concaténés pour le HMAC varie selon la version d'API. Ne pas déployer ce provider en prod sans ce contrôle. Autre point : CinetPay attend un montant en devise locale entière (XOF/XAF), pas en centimes — une conversion de devise est probablement nécessaire si vous facturez en EUR ailleurs

## Prochaines étapes

1. Brancher le module `auth` (JWT) côté Personne 2 — décider cookie vs header pour la stratégie CSRF
2. Ajouter le guard d'auth sur `POST /payments` (actuellement ouvert, marqué en TODO)
3. **Revérifier la signature webhook CinetPay contre leur doc officielle avant toute mise en prod** (voir avertissement ci-dessus)
4. Déployer sur Railway + connecter `api.votredomaine.com` (voir guide infra)
5. Brancher Sentry (voir guide monitoring)
