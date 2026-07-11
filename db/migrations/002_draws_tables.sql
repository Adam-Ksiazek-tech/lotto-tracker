CREATE TABLE draws (
  id SERIAL PRIMARY KEY,
  draw_date DATE NOT NULL UNIQUE,
  numbers INTEGER[] NOT NULL, -- np. {3,17,22,28,41}
  draw_type TEXT DEFAULT 'lotto' -- gdybyś dodał inne gry
);

-- widok/materialized view do statystyk częstości
CREATE MATERIALIZED VIEW number_frequency AS
SELECT n AS number, COUNT(*) AS times_drawn
FROM draws, unnest(numbers) AS n
GROUP BY n
ORDER BY times_drawn DESC;