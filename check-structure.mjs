import {existsSync} from 'node:fs';
const required=['src/app/page.tsx','src/app/layout.tsx','src/app/globals.css','src/components/StudyIllustration.tsx','public/sw.js','tsconfig.json'];
const missing=required.filter(p=>!existsSync(p));
if(missing.length){console.error('Estrutura incompleta. Preserve as pastas do ZIP e execute o build na pasta que contém package.json e src/. Faltam:\n'+missing.join('\n'));process.exit(1)}
if(existsSync('page.tsx')||existsSync('layout.tsx')){console.error('Foram encontrados arquivos de página soltos na raiz. Use a estrutura src/app/ do pacote original.');process.exit(1)}
console.log('Estrutura Next.js verificada: src/app/ e public/ presentes.');
