# Creating the database

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

If you are updating the schema file, run `npx prisma migrate dev --name COMMENT ON YOUR CHANGES HERE` to create a new migration, then push the migration file to Github.
