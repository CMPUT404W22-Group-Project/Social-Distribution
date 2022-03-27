# Deploying

1. In the frontend directory, run `npm run build` or `npm run build:windows` if on Windows.  This will build the React app and move the build folder to the backend.
2. Then run `npm start` in the backend directory.  This will serve both the backend and the frontend on the same port (8000).

## Deploying to Heroku

1. Ensure that the above steps have been completed
2. Make sure the `build` folder is not gitignored, then push to Heroku

# Creating the database and Migrations

When creating your own instance of the PostgreSQL database, use the following in `psql` to create the database (social_dist) and database user (social_dist_user):

```sql
CREATE DATABASE social_dist;
CREATE USER social_dist_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE social_dist TO social_dist_user;
ALTER USER social_dist_user WITH SUPERUSER;
```

## Pull Migrations

Then run `npm run migrate:dev` to update the database with the latest schema. Also use this command after pulling schema changes from Github.

## Push Migrations

If you are updating the schema file, run `npx prisma migrate dev --name COMMENT-ON-YOUR-CHANGES-HERE` to create a new migration, then push the migration file to Github.
