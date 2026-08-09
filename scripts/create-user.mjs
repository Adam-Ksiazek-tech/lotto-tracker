// Tworzy albo aktualizuje konto użytkownika z hasłem.
// Hasło podajesz jako argument w terminalu - skrypt je od razu hashuje
// (bcrypt) i zapisuje TYLKO hash w bazie. Samo hasło nigdy nie trafia
// do żadnego pliku ani do gita.
//
// Użycie (w kontenerze):
//   docker-compose exec lotto node scripts/create-user.mjs email@example.com MojeHaslo123 "Jan Kowalski"

import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

const [, , email, password, name] = process.argv;

if (!email || !password) {
  console.error(
    "Użycie: node scripts/create-user.mjs <email> <hasło> [imię i nazwisko]"
  );
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const hash = await bcrypt.hash(password, 12);

await pool.query(
  `INSERT INTO users (email, password_hash, name)
   VALUES ($1, $2, $3)
   ON CONFLICT (email) DO UPDATE
     SET password_hash = EXCLUDED.password_hash,
         name = COALESCE(EXCLUDED.name, users.name)`,
  [email.toLowerCase(), hash, name ?? null]
);

console.log(`Użytkownik ${email} zapisany/zaktualizowany.`);
await pool.end();