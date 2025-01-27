# Backend Bridge for Digital Realty Website

## Development
Create a copy of config/default.json named config/development.json and replace the values as needed

## Postgres
Recommended use is a docker container `docker run --name dgr_postgres -e POSTGRES_USER=dgr_user -e POSTGRES_DB=pdx -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres` and then changing the above development.json to reflect the values used here

## Initial database config
You can run `npm run migrate` to create the initial database and to update it after any changes the db/migrations/migrate.js file should be kept up to date with sync commands for all models for this to work