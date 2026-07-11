# Przydatne agregacje

### unnest |  jak często wypadła każda liczba
```
SELECT unnest(numbers) AS liczba, COUNT(*) AS ile_razy
FROM draws
GROUP BY liczba
ORDER BY ile_razy DESC;
```
### czy liczba 24 jest w tablicy numbers?
SELECT * FROM draws WHERE 24 = ANY(numbers);

### czy tablica zawiera wszystkie te liczby?
SELECT * FROM draws WHERE numbers @> ARRAY[3, 24];

### czy tablice się nakładają (mają wspólny element)?
SELECT * FROM draws WHERE numbers && ARRAY[7, 8, 9];