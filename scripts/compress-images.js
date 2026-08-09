import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Pobierz ścieżkę z argumentu linii komend
const inputPath = process.argv[2];

if (!inputPath) {
  console.error('❌ Błąd: podaj ścieżkę do folderu ze zdjęciami');
  console.error('Użycie: node scripts/compress-images.js /ścieżka/do/zdjęć');
  process.exit(1);
}

// Sprawdź czy folder istnieje
if (!fs.existsSync(inputPath)) {
  console.error(`❌ Folder nie istnieje: ${inputPath}`);
  process.exit(1);
}

// Utwórz folder output w tym samym miejscu
const outputDir = path.join(inputPath, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`📁 Utworzono folder: ${outputDir}\n`);
}

// Konfiguracja
const quality = 80;

// Znajdź wszystkie JPEGi
const files = fs.readdirSync(inputPath)
  .filter(file => /\.(jpg|jpeg)$/i.test(file));

if (files.length === 0) {
  console.log('⚠️  Nie znaleziono plików JPEG');
  process.exit(0);
}

console.log(`📦 Znaleziono ${files.length} plików\n`);

(async () => {
  for (const file of files) {
    const inputFile = path.join(inputPath, file);
    const outputFile = path.join(outputDir, file.replace(/\.(jpg|jpeg)$/i, '.webp'));
    
    try {
      const stats = fs.statSync(inputFile);
      const originalSize = (stats.size / 1024 / 1024).toFixed(2);
      
      await sharp(inputFile)
        .webp({ quality })
        .toFile(outputFile);
      
      const newStats = fs.statSync(outputFile);
      const newSize = (newStats.size / 1024 / 1024).toFixed(2);
      const reduction = (((stats.size - newStats.size) / stats.size) * 100).toFixed(1);
      
      console.log(`✓ ${file}`);
      console.log(`  ${originalSize}MB → ${newSize}MB (${reduction}% oszczędzności)\n`);
    } catch (error) {
      console.error(`✗ ${file}: ${error.message}`);
    }
  }
  console.log('✅ Konwersja ukończona!');
  console.log(`📂 Pliki w: ${outputDir}`);
})();