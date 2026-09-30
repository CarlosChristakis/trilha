# Trilha — Inovação e Competitividade

MVP executável em **Next.js 16 + TypeScript + Tailwind 4**, com integração opcional a **Supabase/PostgreSQL** e tutor de conteúdo **sem API paga**. O provedor OpenAI foi preservado no código, mas está desativado por padrão e não é chamado pela interface. Interface em português, responsiva e PWA.

## Hostinger e subdomínio

A versão sem API pode ser publicada como site estático. Use `npm run build:hostinger` e envie o conteúdo de `hostinger-site/`, ou use o pacote pronto **Trilha-Hostinger.zip**. Consulte [HOSTINGER.md](HOSTINGER.md) para publicação direta, ligação GitHub e diagnóstico do 403.

## Rodar em 3 passos

Requisito: Node.js 20.9 ou superior (validado com Node 24).

1. Abra um terminal nesta pasta.
2. Execute `npm ci`.
3. Execute `npm run dev -- --port 3107` e abra **http://localhost:3107**.

O estudo local funciona sem chaves, sem conta e sem configurar banco. O navegador guarda progresso, questões pessoais e sessões. Apagar dados do navegador também apaga esses dados; use **Conta e dados → Exportar backup**.

Para usar a PWA e o modo offline:

```sh
npm run build
npm start -- --port 3107
```

O service worker é registrado apenas na versão de produção. Após a primeira visita online, aguarde alguns segundos para concluir a preparação offline.

## O que já funciona

- 138 questões: três por cada um dos 46 assuntos (conceito, caso prático e identificação de uma confusão), com quatro alternativas, gabarito, justificativas e identificação de origem.
- Ensinamentos ampliados: conceito, explicação simples, exemplo e aprofundamento, disponíveis offline.
- Quatro trilhas, cobertura por unidade e domínio por assunto.
- Aprender, Praticar, Revisar Erros, Aleatório, Simulado e Revisão Rápida. No modo Aprender, cada etapa começa pelo conceito e exemplo prático; a pergunta de fixação só aparece após tocar em Vamos praticar. O ensinamento pode ser reaberto durante a resposta.
- Uma questão por vez; feedback após tentativa, exceto durante o simulado.
- Simulados de 10, 20 ou 30 questões **sem repetição**, limitados ao total disponível no filtro escolhido. O banco tem 39 questões na Unidade 1, 42 na Unidade 2, 33 na Unidade 3 e 24 na Unidade 4. Para um simulado de 30 na Unidade 4, o aplicativo usa as 24 disponíveis.
- Correção completa, assuntos acertados/errados e relatório salvo por sessão.
- Histórico, revisão dos erros ainda pendentes e retomada após fechar/recarregar.
- Prática adaptativa: assuntos com dificuldade recebem peso 4, não estudados peso 2 e demais peso 1, sem repetição na sessão.
- Domínio: três acertos consecutivos; último erro ou menos de 60% nas últimas cinco tentativas indica revisão. É heurística de estudo, não prova de competência.
- Professor local em três níveis, aprofundamento e explicação das confusões comuns, sem requisições de IA.
- Faça outra pergunta parecida seleciona uma questão já preparada do mesmo assunto, preserva a fila e não repete questões já respondidas na sessão. Quando as três acabam, informa isso sem inventar uma nova questão.
- Para dúvidas livres, o tutor oferece um contexto que você pode copiar e levar à sua conversa no ChatGPT. Nada é enviado automaticamente.
- Cadastro/edição do banco pessoal, busca, exportação/importação de backup validado.
- Zerar e recomeçar: na tela inicial ou em Conta e dados, escolha toda a trilha ou uma unidade, guarde um backup se desejar e confirme. O aplicativo limpa o progresso escolhido e inicia uma sessão de aprendizado. Nome e questões pessoais são preservados. Relatórios mistos que incluem a unidade zerada são removidos por inteiro; tentativas das outras unidades permanecem. A sessão em andamento é encerrada. O backup remoto só muda ao salvar novamente na nuvem.
- PWA com ícones, manifesto e estudo offline. Apenas o backup opcional na nuvem exige conexão no fluxo atual.

## Limite da base de conteúdo

`sources/` estava vazia na criação. Foram recuperadas duas páginas recentes da conversa “Estudo Unidade 1 Inovação”, além do briefing detalhado fornecido pelo usuário; **não houve leitura integral de todo o histórico nem acesso à apostila**.

A base em `src/lib/content.ts` é uma **síntese editorial inicial**. Trechos sustentados pelas explicações recuperadas são identificados; as demais entradas são propostas editoriais que devem ser conferidas com o material oficial. O aplicativo exibe esse aviso e a origem de cada questão. Não é um banco de questões oficial da UniBrasil.

Pontos que exigem conferência com a apostila: formulação atribuída a Stoeckicht; edição da classificação do IBGE; sequência/numeração das gerações de inovação; dimensões específicas do Innovation Scorecard. O chain-link é tratado por suas interações e feedbacks, sem declarar uma numeração universal de geração.

O tutor local lê os textos salvos em `content.ts` e `lessons.ts`. Os exemplos adicionais são casos didáticos fictícios, não relatos factuais. O provedor de IA opcional, se reativado futuramente, recebe somente a entrada selecionada da base editorial no servidor. **Ainda não é possível garantir aderência exclusiva ao livro da disciplina sem incorporar o livro.** Para isso, substitua/complete os textos de `content.ts` por trechos autorizados, com identificação de unidade/página, e revise o banco de questões. A marca `verified` significa apenas correspondência com a conversa recuperada, não validação acadêmica independente.

## Conectar Supabase

Nenhum banco remoto foi modificado. O projeto existente “Receitas” não foi usado.

1. Crie ou escolha um projeto Supabase dedicado.
2. Execute `supabase/schema.sql` no SQL Editor uma vez. Ele cria `study_state`, ativa RLS e restringe SELECT/INSERT/UPDATE/DELETE ao proprietário `auth.uid() = user_id`.
3. Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
4. Reinicie o servidor (ou reconstrua a versão de produção).
5. Em **Conta e dados**, crie uma conta e confirme o e-mail se exigido pelo projeto.
6. **Recuperar da nuvem** ao trocar de dispositivo; **Salvar na nuvem** ao terminar. A sincronização deste MVP é manual e usa revisão para detectar concorrência, sem sobrescrever silenciosamente outro aparelho.

Cada conta e o perfil visitante usam armazenamentos locais separados. Para migrar progresso de visitante, exporte antes de entrar e importe após entrar. Se houver um backup remoto, recupere-o primeiro; depois importe o arquivo local desejado e salve conscientemente.

O banco guarda um snapshot JSONB por usuário (histórico, sessões, questões pessoais). Isso simplifica o MVP; para catálogos grandes, gestão institucional e múltiplas disciplinas simultâneas, evolua para tabelas `courses`, `topics`, `questions`, `attempts` e `sessions`. O catálogo editorial, motor de estudo, validação, interface e provedor de IA já estão separados para essa evolução.

O painel atual gerencia **a coleção pessoal de cada aluno**, não um catálogo global compartilhado. Um administrador institucional e revisão editorial centralizada são evolução posterior.

## Treinamento sem cobrança de API

Não é necessário cadastrar chave, instalar um modelo local ou contratar um provedor. A interface usa os ensinamentos e o banco salvo; o botão de pergunta semelhante não gera conteúdo por IA.

O endpoint `/api/ai` responde com indisponibilidade enquanto `AI_ENABLED` não for exatamente `true`, inclusive se houver uma chave OpenAI configurada. O valor padrão documentado é `AI_ENABLED=false`. Nenhum botão da interface atual chama esse endpoint.

O código desacoplado do provedor foi mantido para uma possível evolução. Reativá-lo exige uma mudança deliberada de configuração, integração da interface, chave de API e, em produção, autenticação Supabase. Isso poderia gerar cobranças; não faz parte do treinamento atual.

O tutor de conteúdo não interpreta perguntas livres nem inventa respostas novas. Para tirar uma dúvida fora das explicações preparadas, use “Quero tirar uma dúvida no ChatGPT”, copie o contexto e complete sua pergunta na conversa escolhida.

## Celular e publicação

Na mesma rede, pode-se abrir `http://IP_DO_COMPUTADOR:3107`, com computador e servidor ligados e acesso permitido pelo firewall. Não foram alteradas regras de firewall. HTTP em endereço de rede não oferece a instalação/offline da PWA em todos os navegadores.

Para estudar fora dessa rede e instalar a PWA, publique o projeto em hospedagem compatível com Next.js, configure as variáveis e use **HTTPS**. Em seguida, escolha “Adicionar à tela inicial” no navegador do celular. Este projeto **não foi publicado na internet**.

## Testes

```sh
npm test
npm run typecheck
npm run build
npm start -- --port 3107
# Em outro terminal:
npx playwright install chromium
npm run test:e2e
```

Testes de lógica cobrem validade do banco, não duplicação de respostas, domínio, revisão, seleção adaptativa, backups e contrato do provedor de IA. Os testes do navegador cobrem telas de 1440 px e 390 px, aprendizado, explicação local, persistência, editor, simulado, relatório, revisão e offline.

**Não validados contra serviços reais:** login/RLS/sincronização Supabase e chamada paga ao modelo OpenAI, pois as credenciais não foram configuradas. O teste do provedor usa resposta simulada e o teste HTTP confirma que a API paga está desativada. Foram aprovados 12 testes de lógica e 16 testes de navegador, incluindo três questões do mesmo assunto e explicações offline, com zero chamadas ao endpoint de IA.

## Estrutura

```text
src/app/page.tsx          Interface e fluxos
src/app/globals.css       Sistema visual responsivo
src/app/api/ai/route.ts   Autenticação, limite e endpoint de IA
src/lib/content.ts       Conteúdo, proveniência e questões
src/lib/lessons.ts       Ensinamentos ampliados, casos e confusões comuns
src/lib/engine.ts        Seleção adaptativa, respostas e domínio
src/lib/ai.ts            Contrato e provedor desacoplado
src/lib/validation.ts    Validação de questões e backups
src/lib/supabase.ts      Cliente Supabase
supabase/schema.sql     Estrutura PostgreSQL com RLS
public/                 Manifesto, ícones e service worker
tests/                  Testes unitários e de navegador
```

Documentação consultada: [Next.js](https://nextjs.org/docs/app/getting-started/installation), [Supabase Auth](https://supabase.com/docs/reference/javascript/auth-signinwithpassword) e [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).
