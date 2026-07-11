# db

## dockerowa komenda

docker compose exec lotto node scripts/create-user.mjs adam.ksiazek.2024@gmail.com TwojeHaslo123

## Wykonywanie SQL z kontenera

 docker-compose exec lotto sh

 apk add --no-cache postgresql-client

 psql "$DATABASE_URL" -f db/migrations/002_draws_tables.sql

 psql postgres://39827248_adas_lab_2026:1dasL2bJe3tO4%3D2026%3B@serwer2516698.home.pl:5432/39827248_adas_lab_2026 -f db/migrations/002_draws_tables.sql