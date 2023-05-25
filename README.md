## Quick Start
* To run database container: ``` docker-compose up -d ```
* To download required dependencies: ``` npm install ```
* To run application: ``` npm run dev ```
* To close database container: ``` docker-compose down ```
* Default .env config: 
```plaintext
DB_NAME = "films"

DB_USER = "postgres"

DB_PASSWORD = "password"

DB_HOST = "localhost"

DB_PORT = "5432"

APP_PORT = "8080"
```