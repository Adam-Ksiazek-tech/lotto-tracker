
-- Stwórz nową tabelę z email zamiast uuid
CREATE TABLE user_settings (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  api_source TEXT NOT NULL DEFAULT 'lottostats.pl',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indeks na email dla szybkich zapytań
CREATE INDEX idx_user_settings_email ON user_settings(email);