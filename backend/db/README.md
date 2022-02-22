# Creating the database

When creating your own instance of the PostgreSQL database, use the following in `psql` to set up the database:

```sql
CREATE DATABASE social_dist;
CREATE USER social_dist_user WITH ENCRYPTED PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE social_dist TO social_dist_user;
ALTER USER social_dist_user WITH SUPERUSER;
```