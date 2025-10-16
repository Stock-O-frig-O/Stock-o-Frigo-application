# 🍕 Stock-o-Frigo Application

**Application de gestion intelligente de frigo** - Projet d'étude réalisé lors de notre formation à la Wild Code School en 2025.

Une application web complète permettant de gérer le contenu de son réfrigérateur, suivre les dates d'expiration, créer des listes de courses et découvrir des recettes en fonction des ingrédients disponibles.

## 📋 Table des matières

- [🎯 Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Technologies utilisées](#️-technologies-utilisées)
- [📦 Installation et lancement](#-installation-et-lancement)
- [⚙️ Configuration](#️-configuration)
- [🚀 Développement](#-développement)
- [📖 Documentation API](#-documentation-api)
- [🧪 Tests](#-tests)
- [🐳 Docker](#-docker)
- [🤝 Contribution](#-contribution)

## 🎯 Fonctionnalités

- **Gestion du stock** : Ajouter, modifier, supprimer des produits dans le frigo
- **Suivi des dates** : Alertes pour les produits proches de l'expiration
- **Liste de courses** : Génération automatique basée sur le stock
- **Scan de produits** : Reconnaissance par code-barres (fonctionnalité prévue)
- **Recettes suggérées** : Propositions basées sur les ingrédients disponibles
- **Gestion des favoris** : Sauvegarder ses recettes préférées
- **Authentification** : Système de connexion sécurisé avec JWT
- **Interface responsive** : Application optimisée mobile et desktop

## 🏗️ Architecture

### Vue d'ensemble
```
┌─────────────────┐     HTTP/REST     ┌─────────────────┐
│   Frontend      │ ◄────────────── ► │   Backend       │
│   Angular 19    │    (JSON/JWT)     │   Spring Boot   │
│   (Port 4200)   │                   │   (Port 8080)   │
└─────────────────┘                   └─────────────────┘
                                               │
                                               │ JPA/Hibernate
                                               ▼
                                       ┌─────────────────┐
                                       │   Database      │
                                       │   MySQL 8       │
                                       │   (Port 3306)   │
                                       └─────────────────┘
```

### Patterns d'architecture
- **Client-serveur** : Séparation claire frontend/backend
- **API REST** : Communication via HTTP/JSON
- **Architecture en couches** : Controller → Service → Repository
- **Authentification stateless** : JWT pour la gestion des sessions
- **Conteneurisation** : Docker pour l'environnement de développement

## 🛠️ Technologies utilisées

### Frontend
- **Angular 19** - Framework SPA
- **TypeScript** - Langage typé
- **PrimeNG** - Bibliothèque de composants UI
- **SCSS** - Préprocesseur CSS
- **RxJS** - Programmation réactive
- **JWT-decode** - Gestion des tokens JWT

### Backend
- **Spring Boot 3.4.4** - Framework Java
- **Java 21** - Langage de programmation
- **Spring Security** - Authentification et autorisation
- **Spring Data JPA** - Persistence des données
- **Hibernate** - ORM
- **MapStruct** - Mapping DTOs
- **SpringDoc OpenAPI** - Documentation API
- **JWT (jjwt)** - Gestion des tokens

### Base de données
- **MySQL 8** - Base de données relationnelle
- **Adminer** - Interface d'administration

### DevOps et outils
- **Docker & Docker Compose** - Conteneurisation
- **Maven** - Gestion des dépendances backend
- **npm** - Gestion des dépendances frontend
- **ESLint & Prettier** - Linting et formatage
- **PMD & Spotless** - Qualité de code Java

## 📦 Installation et lancement

### Prérequis
- **Node.js** (version 18+)
- **npm** ou **yarn**
- **Docker** et **Docker Compose**
- **Java 21** (optionnel, utilisé via Docker)

### 🚀 Lancement rapide avec Docker

1. **Cloner le repository**
```bash
git clone https://github.com/Stock-O-frig-O/Stock-o-Frigo-application.git
cd Stock-o-Frigo-application
```

2. **Configurer les variables d'environnement**
```bash
cd backend/environment
cp env.exmple.properties env.local.properties
# Éditer env.local.properties avec vos valeurs
```

3. **Lancer le backend avec Docker**
```bash
cd backend
docker-compose up -d
```

4. **Lancer le frontend**
```bash
cd frontend
npm install
npm start
```

5. **Accéder à l'application**
- Frontend : http://localhost:4200
- Backend API : http://localhost:8080
- Documentation API : http://localhost:8080/docs/swagger.html
- Adminer (DB) : http://localhost:8081

### 🛠️ Installation pour développement

#### Backend
```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

#### Frontend
```bash
cd frontend
npm install
npm run start
```

## ⚙️ Configuration

### Variables d'environnement

Créer les fichiers suivants dans `backend/environment/` :

#### `env.local.properties` (développement)
```properties
# Base de données
DB_USER=stockofrigo_user
DB_PASSWORD=your_secure_password
DB_NAME=stockofrigo_db
DB_HOST=localhost
DB_PORT=3306
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/stockofrigo_db?createDatabaseIfNotExist=true

# Configuration Spring
SPRING_PROFILES_ACTIVE=local
SPRING_JPA_HIBERNATE_DDL_AUTO=update

# JWT
JWT_SECRET_KEY=your_super_secret_key_change_this_in_production
JWT_EXPIRATION_TIME=86400000

# CORS
CORS_ALLOWED_ORIGIN=http://localhost:4200
```

#### `env.prod.properties` (production)
```properties
# Utiliser des valeurs sécurisées en production
DB_USER=${PROD_DB_USER}
DB_PASSWORD=${PROD_DB_PASSWORD}
# ... autres variables
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
```

### Configuration des profils Spring

- **local** : Développement avec H2 ou MySQL local
- **docker** : Utilisation avec docker-compose
- **prod** : Production avec configuration sécurisée

## 🚀 Développement

### Scripts disponibles

#### Frontend
```bash
npm start          # Démarrer le serveur de développement
npm run build      # Build de production
npm test           # Lancer les tests
npm run lint       # Vérifier le code avec ESLint
npm run format     # Formater le code avec Prettier
```

#### Backend
```bash
./mvnw spring-boot:run         # Démarrer l'application
./mvnw clean package           # Construire le JAR
./mvnw test                    # Lancer les tests
./mvnw spotless:apply          # Formater le code
./mvnw pmd:check              # Vérifier la qualité du code
```

### Structure du projet

```
backend/
├── src/main/java/com/stockofrigo/
│   ├── controller/           # Contrôleurs REST
│   ├── service/             # Logique métier
│   ├── repository/          # Accès aux données
│   ├── model/              # Entités JPA
│   ├── dto/                # Objects de transfert
│   ├── config/             # Configuration Spring
│   └── security/           # Configuration sécurité
├── src/main/resources/
│   ├── application.yml     # Configuration principale
│   └── data.sql           # Données d'exemple
└── environment/           # Variables d'environnement

frontend/
├── src/app/
│   ├── components/        # Composants réutilisables
│   ├── pages/            # Pages de l'application
│   ├── core/
│   │   ├── services/     # Services Angular
│   │   ├── guards/       # Guards de navigation
│   │   ├── interceptors/ # Intercepteurs HTTP
│   │   └── models/       # Modèles TypeScript
│   └── environments/     # Configuration environnement
```

## 📖 Documentation API

### Swagger UI
L'API est documentée automatiquement avec OpenAPI/Swagger :
- **URL** : http://localhost:8080/docs/swagger.html
- **JSON** : http://localhost:8080/docs

### Endpoints principaux

#### Authentification
- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/refresh` - Renouvellement token

#### Gestion du stock
- `GET /api/products` - Liste des produits
- `POST /api/products` - Ajouter un produit
- `PUT /api/products/{id}` - Modifier un produit
- `DELETE /api/products/{id}` - Supprimer un produit

#### Recettes et favoris
- `GET /api/recipes` - Liste des recettes
- `GET /api/recipes/suggestions` - Recettes suggérées
- `POST /api/favorites` - Ajouter aux favoris

## 🧪 Tests

### Backend
```bash
./mvnw test                    # Tous les tests
./mvnw test -Dtest=ClassName   # Test spécifique
```

### Frontend
```bash
npm test                       # Tests unitaires
npm run test:coverage          # Avec couverture
npm run e2e                    # Tests end-to-end
```

## 🐳 Docker

### Commandes utiles

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f app

# Reconstruire l'image
docker-compose build --no-cache

# Arrêter et nettoyer
docker-compose down -v
```

### Services Docker

- **app** : Application Spring Boot (port 8080)
- **db** : Base de données MySQL (port 3306)
- **adminer** : Interface d'administration DB (port 8081)

## 🤝 Contribution

### Workflow Git

1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** les changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Push** vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. **Ouvrir** une Pull Request

### Standards de code

- **Backend** : Google Java Style Guide (appliqué via Spotless)
- **Frontend** : ESLint + Prettier configuration
- **Commits** : Messages descriptifs en français
- **Tests** : Couverture minimale de 80%

### Règles de développement

- Toujours tester localement avant push
- Documenter les nouvelles API
- Mettre à jour ce README si nécessaire
- Respecter l'architecture en couches

---

## 📞 Contact

**Équipe Wild Code School 2025**
- Repository : [Stock-o-Frigo-application](https://github.com/Stock-O-frig-O/Stock-o-Frigo-application)
- Branch principale : `main`
- Branch de développement : `dev`

---

*Projet réalisé dans le cadre de la formation développeur web full-stack à la Wild Code School* 🎓
