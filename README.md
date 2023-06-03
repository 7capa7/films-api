## Films Rest Api
* Api that connects with swapi.dev
* GET /films - This endpoint is responsible for reading the video list from the public API (https://swapi.dev) and send the user a processed list of films.
* POST /favorites - In the body of this request, the user can provide any number of movie IDs obtained with the previous query and any name for the list. As a result, an element describing the list is to be created in the database, the service is to read the details of each of these movies and save them in the database.
* GET /favorites - The result of this query is to be a list of all lists added with the previous request. This endpoint supports pagination and searching by list name.
* GET /favorites/:id - This endpoint return the details and elements of the favorite list.
GET /favorites/:id/file - The last endpoint is supposed to send the favorites list details as an Excel file.

## Quick Start
* To run database container: ``` docker-compose up -d ```
* To download required dependencies: ``` npm install ```
* To run application: ``` npm run start ```
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
