# Publicar o Trilha na Hostinger

## Diagnóstico verificado em 29/09/2026

- Endereço informado: https://magenta-narwhal-630768.hostingersite.com/
- A consulta ao endereço retornou **403 Forbidden**.
- Repositório: https://github.com/CarlosChristakis/trilha, branch `main`.
- Na revisão `6d1eadda5cb2426124bd51b576df677824242482`, o repositório contém arquivos como `page.tsx`, `engine.ts` e `layout.tsx` todos na raiz, sem as pastas originais `src/app`, `src/lib` e `public`.
- Não há `index.html` nem o aplicativo compilado nesse repositório. Isso impede usar esse conteúdo diretamente como um site HTML e é compatível com o 403 observado. Outras configurações do servidor ainda podem precisar de ajuste.
- A integração GitHub disponível nesta conversa informou permissão de leitura (`pull: true`) e **sem permissão de envio** (`push: false`). Não foi feita alteração remota.

## Pacote pronto: Trilha-Hostinger.zip

Este arquivo contém o **site já compilado**: HTML, JavaScript, CSS e imagens. Não exige Node.js na Hostinger e mantém ensinamentos, 138 questões, tutor local, revisão, simulados, editor pessoal, backups e reinício da trilha.

O arquivo de entrada é `index.html`. A pasta `_next` contém os recursos do aplicativo e deve ser preservada com suas subpastas. O pacote não inclui código de servidor, chaves privadas ou API de IA.

### Caminho mais direto: enviar o ZIP à Hostinger

1. Abra no hPanel o site correspondente ao endereço acima.
2. Entre no gerenciador de arquivos e identifique a **pasta de documentos desse site/subdomínio**. Não presuma que seja a pasta do domínio principal.
3. Guarde uma cópia dos arquivos que já estão nessa pasta antes de substituir qualquer arquivo.
4. Se há publicação automática pelo GitHub, pause-a enquanto corrige o repositório; caso contrário, outra publicação poderá substituir os arquivos novos pelos antigos.
5. Envie `Trilha-Hostinger.zip` e extraia **nessa pasta**, preservando todos os diretórios.
6. Confira se `index.html` e a pasta `_next` ficaram diretamente na raiz do site, e não dentro de uma pasta adicional chamada `Trilha-Hostinger` ou `hostinger-site`.
7. Abra o endereço em HTTPS. Depois teste no celular. Apague o ZIP enviado quando concluir, sem apagar os arquivos extraídos.

O `.htaccess` incluído indica `index.html` como página inicial e solicita revalidação de cache para o HTML e o service worker. Se a instalação já tiver um `.htaccess` personalizado, guarde uma cópia e revise as regras existentes antes de substituí-lo.

### Manter a ligação GitHub → Hostinger

Para a integração Git comum que apenas copia arquivos, o repositório/branch conectado deve conter os **arquivos compilados** na pasta publicada:

```text
index.html
_next/
  static/
    ...
icon-192.png
icon-512.png
manifest.webmanifest
sw.js
.htaccess
...demais arquivos extraídos
```

Envie o conteúdo extraído do ZIP, incluindo a pasta `_next` com sua estrutura. Não envie somente o ZIP e não junte todos os arquivos em uma única pasta. Depois use **Redeploy** na integração Git da Hostinger. Mantenha o código-fonte completo em uma branch ou repositório separado do conteúdo compilado para não misturar as duas formas de publicação.

O pacote `Trilha-MVP.zip` contém o código-fonte correto, com as pastas preservadas. Ele serve para desenvolvimento e compilação; o pacote `Trilha-Hostinger.zip` serve para publicação direta em hospedagem HTML.

## Gerar novas versões a partir do código-fonte

```sh
npm ci
npm run build:hostinger
```

O comando gera `hostinger-site/`. Publique o **conteúdo** dessa pasta na raiz do endereço web. Ele cria uma cópia temporária sem as rotas de servidor, preservando o projeto Next.js original.

O workflow `.github/workflows/hostinger.yml` executa a compilação no GitHub e disponibiliza o arquivo para download em **Actions → Gerar site para Hostinger → Artifacts**. O workflow deve estar na raiz do repositório, dentro de `.github/workflows/`. Ele gera o pacote, mas **não envia automaticamente à Hostinger**. Não requer senhas de hospedagem para compilar.

Para conferir os arquivos publicados localmente:

```sh
npm run preview:hostinger
```

Abra http://127.0.0.1:3108. Essa prévia usa um servidor simples de arquivos, sem executar o Next.js ou APIs no servidor.

## Progresso e celular

O progresso local pertence ao navegador e ao endereço usado. O histórico do `localhost` não aparece automaticamente no endereço público. Exporte em **Conta e dados → Exportar backup** no endereço antigo e importe no novo.

Esta entrega não ativa conta compartilhada/Supabase. A conexão permanece opcional. Ao configurá-la futuramente, forneça as variáveis públicas do Supabase ao processo de compilação e gere uma nova versão. Nunca coloque chave privada ou `service_role` no pacote público.

Após o primeiro carregamento online em HTTPS, aguarde a preparação offline e use “Adicionar à tela inicial” no celular. Sem Supabase configurado, cada aparelho guarda seu próprio progresso.

## Validação

Foram aprovados 18 testes de navegador em computador e celular, cobrindo aprendizado, tutor, editor, retomada, simulado, relatório, revisão, reset, offline e navegação da biblioteca. Também passaram 12 testes das regras do aplicativo. A interface inclui biblioteca com busca e filtro, navegação inferior no celular e endereço por tela. A API paga não existe nesta exportação.

A publicação remota ainda depende de acesso de escrita ou do envio do pacote. Não foi declarado que o endereço público já foi corrigido.

Referências: [Exportação estática Next.js](https://nextjs.org/docs/app/guides/static-exports), [Git na Hostinger](https://www.hostinger.com/support/1583302-how-to-deploy-a-git-repository-in-hostinger/), [Erro 403 na Hostinger](https://www.hostinger.com/support/1583304-how-to-fix-a-403-forbidden-error-at-hostinger/).
