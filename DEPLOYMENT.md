# Déploiement Stock'O Frig'O

## Configuration des Secrets GitHub

Pour que le déploiement automatique fonctionne correctement, configurez les secrets suivants dans GitHub :

`https://github.com/Stock-O-frig-O/Stock-o-Frigo-application/settings/secrets/actions`

### Secrets requis :

- **`SERVER_HOST`** : `51.68.58.88` (adresse IP du serveur)
- **`SERVER_USER`** : `wns_student`
- **`SERVER_SSH_KEY`** : Clé privée SSH pour la connexion (contenu de `~/.ssh/github_actions_deploy`)
- **`DB_USER`** : Nom d'utilisateur de la base de données
- **`DB_PASSWORD`** : Mot de passe de la base de données
- **`DB_NAME`** : `stockofrigo_db`
- **`SPRING_DATASOURCE_URL`** : `jdbc:mysql://db:3306/stockofrigo_db?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false`
- **`JWT_SECRET_KEY`** : Clé secrète JWT (générer une clé sécurisée)
- **`JWT_EXPIRATION_TIME`** : `7200` (en secondes)
- **`CORS_ALLOWED_ORIGIN`** : ⚠️ **`https://stockofrigo.huntcraft.fr`** (très important!)

## Déploiement manuel

```bash
cd /var/www/stocko-frigo
git pull origin main
docker compose down
docker compose up -d --build
```

## Vérification

- Frontend : https://stockofrigo.huntcraft.fr
- API Backend : https://api.stockofrigo.huntcraft.fr
- Dashboard Traefik : http://51.68.58.88:8080
