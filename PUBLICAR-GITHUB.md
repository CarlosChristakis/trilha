# Publicar o código no GitHub sem perder as pastas

O Next.js aceita src/app/. Não crie outra pasta app vazia.

Na raiz do repositório devem existir:

```
package.json
package-lock.json
tsconfig.json
postcss.config.mjs
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    interface.css
    api/ai/route.ts
  components/
  lib/
public/
scripts/
```

1. Extraia Trilha-GitHub-Corrigido.zip no computador.
2. Use uma cópia local do repositório no GitHub Desktop. Antes da substituição, preserve uma cópia dos arquivos antigos.
3. Substitua o código desorganizado pelo conteúdo extraído, incluindo as pastas completas. Não selecione todos os arquivos de dentro de cada pasta para enviar na raiz. Não envie apenas o ZIP: o GitHub não extrai ZIPs.
4. No GitHub Desktop, revise as alterações, faça o commit e envie com Push origin.
5. Confira no GitHub se consegue abrir src → app → page.tsx.
6. Na hospedagem com suporte a Next.js/Node.js, selecione a pasta que contém package.json como diretório raiz. Instale com npm ci, compile com npm run build e inicie com npm start. Se colocou o pacote dentro de estudo-inovacao, essa é a pasta raiz do projeto na hospedagem.

O pacote contém apenas código e arquivos públicos, sem .next, node_modules, HTML compilado ou segredos. Não misture Trilha-Hostinger.zip com o código-fonte: ele é a versão estática pronta e vai diretamente para a pasta pública da hospedagem, sem executar next build.

O erro de pasta ausente não é resolvido alterando GLIBC. Se o erro GLIBC persistir após corrigir a estrutura, será necessário verificar o ambiente Linux/Node da hospedagem e o log completo. O build local não valida a compatibilidade do servidor remoto.
