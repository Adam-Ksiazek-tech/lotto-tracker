-- widok/materialized view do statystyk częstości
CREATE MATERIALIZED VIEW number_frequency AS
SELECT n AS number, COUNT(*) AS times_drawn
FROM draws, unnest(numbers) AS n
GROUP BY n
ORDER BY times_drawn DESC;