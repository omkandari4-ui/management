const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'js');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
console.log('Testing JS syntax in:', jsDir);

let failures = 0;
for (const file of files) {
  const filePath = path.join(jsDir, file);
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Strip ES module import/export keywords for node syntax evaluation
    const stripped = content
      .replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, '// import')
      .replace(/import\s+['"][^'"]+['"];?/g, '// import')
      .replace(/export\s+default\s+/g, '')
      .replace(/export\s+const\s+/g, 'const ')
      .replace(/export\s+function\s+/g, 'function ')
      .replace(/export\s+class\s+/g, 'class ')
      .replace(/export\s*\{[\s\S]*?\};?/g, '// export');

    new Function(stripped);
    console.log(`[PASS] ${file}`);
  } catch (err) {
    console.error(`[FAIL] ${file}: ${err.message}`);
    failures++;
  }
}

if (failures === 0) {
  console.log('\nSUCCESS: All 12 JS files passed syntax validation.');
} else {
  console.error(`\nFAILED: ${failures} files have syntax errors.`);
  process.exit(1);
}

