import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const OUTPUT = path.join(process.cwd(), 'dist', 'mBloxM3E.css');
const INPUT  = path.join(process.cwd(), 'src', 'design', 'tailwind.css');

console.log('🎨 Building CSS...');

try {
    execSync(
        `npx @tailwindcss/cli -i "${INPUT}" -o "${OUTPUT}" --minify`,
        { stdio: 'inherit' }
    );

    const bytes = fs.statSync(OUTPUT).size;
    const kb    = (bytes / 1024).toFixed(2);
    console.log(`✅ CSS build complete! dist/mBloxM3E.css → ${kb} kB (${bytes.toLocaleString()} bytes)`);
} catch (err) {
    console.error('❌ CSS build failed:', err.message);
    process.exit(1);
}
