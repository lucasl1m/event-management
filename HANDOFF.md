# Handoff de Prompts — Painel de Gestão de Eventos

> Sequência de prompts prontos para usar com Claude Code (ou outro agente de IA) no desenvolvimento do teste técnico.
> A ordem importa: cada etapa assume que a anterior foi concluída.

---

## Como usar este handoff

1. Crie o repositório vazio no GitHub.
2. Clone localmente.
3. Coloque o `AGENTS.md` (arquivo separado) na raiz **antes do primeiro prompt**.
4. Abra o Claude Code apontando para o repositório.
5. Execute os prompts **em ordem**, um por vez. Confira o resultado, faça commit, e só então passe para o próximo.
6. Após cada prompt, rode `pnpm typecheck && pnpm lint` antes de seguir.

---

## Prompt 0 — Contexto inicial (cole sempre que iniciar uma sessão nova)

```
Você está trabalhando em um teste técnico de front-end: um Painel de Gestão de Eventos.

ANTES DE QUALQUER COISA: leia o arquivo AGENTS.md na raiz do repositório. Ele é a fonte da verdade
sobre stack, convenções, regras de negócio e estrutura. Siga-o à risca.

Stack confirmada:
- Next.js (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui (tema dark padrão)
- TanStack Query (server state) + Zustand (client state) + nuqs (URL state)
- json-server local na pasta /server (mesmo monorepo)
- Playwright + @axe-core/playwright
- ESLint + Prettier
- pnpm como gerenciador

Regras de trabalho:
- Commits pequenos no padrão Conventional Commits.
- Sem any implícito. Strict TypeScript.
- Toda regra de negócio fica em features/*/rules.ts (funções puras, testáveis).
- Estados obrigatórios em toda lista/detalhe: loading, empty, error.

Quando eu pedir uma etapa, faça SOMENTE o que foi pedido. Não antecipe etapas futuras.
No final de cada etapa, liste os arquivos criados/modificados e sugira a mensagem de commit.
```

---

## Prompt 1 — Bootstrap do projeto

```
Inicialize o projeto seguindo o AGENTS.md.

Tarefas:
1. Inicialize um projeto Next.js 14+ com App Router, TypeScript, Tailwind, ESLint, src/, alias @/*.
   Use pnpm. Não use Turbopack por enquanto (estabilidade).
2. Configure Prettier (.prettierrc com singleQuote, semi, printWidth 100, trailingComma all)
   e integre com ESLint (eslint-config-prettier).
3. Adicione scripts no package.json:
   - dev (concurrently rodando dev:web e dev:api)
   - dev:web (next dev)
   - dev:api (json-server --watch server/db.json --port 3001 --routes server/routes.json)
   - build, start, lint, format, typecheck
   - test:e2e, test:e2e:ui
4. Crie .env.example com NEXT_PUBLIC_API_URL=http://localhost:3001 e .env.local idêntico.
5. Atualize .gitignore para incluir: .next, node_modules, playwright-report, test-results, .env.local
6. Configure Tailwind com tema dark como padrão (darkMode: "class") e adicione "dark" no <html> em layout.tsx.
7. Faça o primeiro commit: "chore: bootstrap next.js + tailwind + tooling"

Não instale shadcn ainda. Não crie páginas além da default. Não crie o json-server ainda.
```

---

## Prompt 2 — Backend mock (json-server)

```
Configure o backend mock conforme AGENTS.md seção 6.

Tarefas:
1. Crie a pasta /server na raiz com:
   - db.json: dados iniciais com pelo menos 5 eventos cobrindo os edge cases:
     * EVT-001: status "active", VIPs e normais misturados, vários check-ins
     * EVT-002: status "closed" — não aceita novos check-ins
     * EVT-003: status "active", apenas participantes normais
     * EVT-004: status "cancelled", checkin_count = 0, entry_rate = 0
     * EVT-005: status "active", muitos participantes para testar performance
   - routes.json: rewrites se necessário (manter padrão json-server por enquanto)
2. Cada evento precisa ter: id, name, date (ISO 8601), location, status, description,
   expected_count, checkin_count, error_count, entry_rate.
3. Crie array participants e checkins em db.json (separados, não aninhados).
4. Inclua VIPs com checkin_count > 1 e histórico alternado entry/exit.
5. Inclua participantes normais com status "outside" e checkin_count = 0,
   e outros com checkin_count = 1 e status "inside".
6. Adicione json-server como devDependency. Adicione concurrently também.
7. Documente no README a forma de rodar (mesmo que README ainda esteja básico).
8. Teste manualmente: pnpm dev:api e curl http://localhost:3001/events.
9. Commit: "feat(api): add json-server with seed data covering edge cases"

Os dados precisam ser realistas e cobrir TODOS os edge cases do enunciado do teste.
```

---

## Prompt 3 — shadcn/ui + tema dark

```
Configure shadcn/ui com tema dark seguindo AGENTS.md.

Tarefas:
1. Inicialize shadcn (pnpm dlx shadcn@latest init) com:
   - Style: new-york
   - Base color: zinc
   - CSS variables: yes
2. Em src/app/globals.css, ajuste as variáveis CSS para tema dark moderno
   (mantenha a paleta zinc como base, mas garanta contraste AA).
3. Instale os componentes que vamos usar:
   - button, input, card, badge, dialog, dropdown-menu, select, table,
     tabs, toast (sonner), tooltip, skeleton, separator, sheet, scroll-area,
     avatar, progress
4. Crie src/components/shared/:
   - empty-state.tsx (ícone + título + descrição + CTA opcional)
   - error-state.tsx (variante de empty para erros, com botão "Tentar novamente")
   - loading-skeleton.tsx (variantes: card, table, dashboard)
5. Configure o Sonner (toaster) no layout raiz.
6. Garanta que <html> tenha class="dark" e que o body use bg-background text-foreground.
7. Crie src/lib/utils.ts (já vem do shadcn) e confirme que cn() está exportado.
8. Commit: "feat(ui): add shadcn/ui with dark theme and shared states"

Não crie ainda telas de evento. Foco é apenas a base de UI.
```

---

## Prompt 4 — Camada de dados (tipos, API client, React Query)

```
Configure a camada de dados conforme AGENTS.md seções 4 e 6.

Tarefas:
1. Crie src/types/api.ts com os tipos: Event, EventStatus, Participant, ParticipantType,
   ParticipantStatus, Checkin, CheckinAction, CheckinErrorReason.
2. Crie src/lib/api-client.ts: wrapper sobre fetch (ou axios — escolha fetch para evitar dep)
   que usa NEXT_PUBLIC_API_URL, lança erro em status >= 400 e retorna JSON tipado.
3. Crie src/lib/query-client.ts exportando uma factory de QueryClient com defaults sensatos
   (staleTime 30s, retry: 1 exceto em 404).
4. Crie src/app/providers.tsx ("use client") com QueryClientProvider e <Toaster /> do sonner.
   Use no layout raiz.
5. Crie src/features/events/:
   - schemas.ts: schemas Zod para Event e detalhes (validar resposta da API).
   - api.ts: getEvents(params), getEvent(id) — usam api-client e validam com Zod.
   - hooks.ts: useEvents(params), useEvent(id) — wrappers React Query.
   - types.ts: re-exporta tipos do @/types/api relevantes.
6. Crie src/features/checkins/:
   - rules.ts: função pura validateCheckIn conforme AGENTS.md seção 5. Cobre todos os casos.
   - api.ts: createCheckin, updateParticipant, updateEventMetrics.
   - hooks.ts: useCheckIn() — mutation que orquestra valida → POST → PATCH → invalidate.
7. Adicione @tanstack/react-query, zod, sonner às deps (sonner já veio do shadcn).
8. Commit: "feat(data): add api client, zod schemas and react-query hooks"

NÃO renderize telas ainda. Apenas a camada de dados pura, com tudo tipado e validado.
A função validateCheckIn precisa estar coberta por testes unitários simples (Vitest opcional aqui,
ou apenas via Playwright depois). Por ora, deixe-a pura e exportada para teste futuro.
```

---

## Prompt 5 — Tela de listagem de eventos

```
Implemente a tela de listagem (rota: /).

Requisitos do enunciado:
- Cards/linhas com: nome, data, local, status (badge colorido), participantes esperados.
- Busca por nome (com debounce).
- Filtro por status (active | closed | cancelled | all).
- Ordenação por data (asc/desc).
- Estados: loading (skeleton), empty (EmptyState), error (ErrorState com retry).
- Navegação para /events/[id] ao clicar.

Implementação:
1. Use nuqs para sincronizar busca, status e ordenação na URL (?q=&status=&sort=).
   Instale nuqs e configure o NuqsAdapter no providers.tsx.
2. Para debounce na busca: use o throttleMs do nuqs OU implemente useDebouncedValue.
   Documente a escolha.
3. Crie src/components/events/:
   - event-card.tsx: card de evento com badge de status, data formatada (date-fns ou Intl).
   - event-list.tsx: grid responsivo (1 col mobile, 2 col tablet, 3 col desktop).
   - event-filters.tsx: input de busca + select de status + toggle de ordenação.
   - status-badge.tsx: badge colorido por status (active=verde, closed=cinza, cancelled=vermelho).
4. A página src/app/page.tsx é Server Component apenas para layout; a parte interativa
   é um Client Component (events-page-client.tsx).
5. Filtragem/ordenação: aplique no client em cima do resultado da query (a API é simples).
   Documente que em produção isso iria como query params para a API.
6. Acessibilidade: input de busca com label, select com label, cards com role="link" + tabIndex
   ou usando <Link> do Next que já é acessível.
7. Responsividade: mobile mostra cards empilhados, desktop mostra grid.
8. Commit em duas partes:
   - "feat(events): add events list with filters and url state"
   - "feat(events): add loading, empty and error states"

Use Intl.DateTimeFormat com pt-BR para formatar datas. Sem moment, sem dayjs.
```

---

## Prompt 6 — Tela de detalhe / dashboard

```
Implemente a tela de detalhe (/events/[id]) com dashboard completo.

Requisitos do enunciado:
- 4 cards de métrica: Participantes Esperados, Check-ins Realizados, Tentativas com Erro, Taxa de Entrada (%).
- Pelo menos 1 visualização gráfica: evolução de entradas no tempo OU proporção sucesso/erro.
- Lista/tabela de participantes com nome, type (vip/normal), status (inside/outside) e ação.
- Botão "Check-in" (entrada) e, para VIPs com status inside, botão "Saída".
- Estados: loading, empty (sem participantes), error.

Implementação:
1. Escolha de gráfico: use Recharts (já permitido pelo enunciado, leve, integra bem com React).
   Crie 2 gráficos pequenos:
   - Linha/área: entradas acumuladas ao longo do tempo (a partir de checkins[]).
   - Pizza ou donut: sucessos vs erros.
2. src/components/dashboard/:
   - metric-card.tsx: card com label, valor grande, ícone (lucide-react).
   - metrics-grid.tsx: grid de 4 cards (1 col mobile, 2 col sm, 4 col lg).
   - entries-over-time-chart.tsx
   - success-error-chart.tsx
   - participants-table.tsx: tabela responsiva (em mobile vira lista de cards).
   - checkin-actions.tsx: botões com a lógica de habilitar/desabilitar.
3. Botões de check-in:
   - Disabled (com tooltip explicando) quando event.status === "closed" || "cancelled".
   - Disabled para Normal com checkin_count >= 1.
   - VIP com status "inside" mostra botão "Saída"; com "outside" mostra "Entrada".
4. Mutation: useCheckIn() do prompt 4. Em sucesso, mostre toast verde; em erro,
   toast vermelho com a mensagem do error_reason mapeada para PT-BR.
5. Layout do dashboard:
   - Header com nome, data, local, status badge.
   - Grid de métricas no topo.
   - Gráficos lado a lado em desktop, empilhados em mobile.
   - Tabela/lista de participantes com filtro rápido (inside/outside/all).
6. Acessibilidade: tabela com <caption> sr-only, botões com aria-label quando ícone-only,
   focus visible em todos os interativos.
7. Commit em partes:
   - "feat(event-detail): add metrics grid and event header"
   - "feat(event-detail): add charts (entries over time, success vs error)"
   - "feat(event-detail): add participants table with checkin actions"
   - "feat(checkins): wire up mutation with toast feedback"

A taxa de entrada deve ser calculada como (checkin_count / expected_count) * 100, formatada
com Intl.NumberFormat (pt-BR, 1 casa decimal). Trate divisão por zero.
```

---

## Prompt 7 — Estado global UI (Zustand)

```
Adicione Zustand para estado de UI conforme AGENTS.md.

Tarefas:
1. Crie src/stores/ui-store.ts com:
   - sidebarOpen (mobile)
   - lastVisitedEventId (para "voltar para o último evento" se quiser)
   - participantsFilter local da tabela (inside/outside/all) — opcional, pode estar em nuqs também.
2. Use o store apenas onde fizer sentido. Não duplique server state ali.
3. Se houver header com menu mobile, use o store para abrir/fechar Sheet.
4. Persista (zustand/middleware persist) só o que faz sentido (ex: lastVisitedEventId).
5. Commit: "feat(ui): add zustand store for client-side UI state"

Se ao revisar o projeto nada justificar Zustand, documente isso no README e remova a dep.
A regra é: não usar bibliotecas só porque foram listadas.
```

---

## Prompt 8 — Testes E2E com Playwright + axe-core

```
Configure Playwright e escreva os testes conforme AGENTS.md seção 7.

Tarefas:
1. Instale @playwright/test e @axe-core/playwright.
2. Configure playwright.config.ts:
   - testDir: "tests/e2e"
   - webServer: { command: "pnpm dev", url: "http://localhost:3000", reuseExistingServer: true, timeout: 120000 }
   - Browsers: chromium e webkit (mobile viewport).
3. Escreva os testes:
   a) tests/e2e/events-list.spec.ts:
      - Lista carrega e mostra os eventos do db.json.
      - Filtro por status "closed" mostra apenas eventos closed.
      - Busca filtra por nome (testa o debounce — espera ~400ms).
      - Estado vazio: mocka rota para retornar [] e verifica EmptyState.
      - Estado de erro: mocka rota para retornar 500 e verifica ErrorState com botão retry.
   b) tests/e2e/checkin-rules.spec.ts:
      - VIP entra → status vira "inside", botão muda para "Saída".
      - VIP sai → status vira "outside", botão volta para "Entrada".
      - Normal entra com sucesso na 1ª vez.
      - Normal tenta entrar 2ª vez → toast de erro aparece, status não muda.
      - Evento closed: botões disabled, tooltip aparece no hover.
   c) tests/e2e/a11y.spec.ts:
      - Roda axe na home: 0 violações serious/critical.
      - Roda axe em /events/EVT-001: 0 violações serious/critical.
      - Navega por teclado (Tab) na home e verifica que os cards são focáveis.
4. Use page.route() para mockar quando precisar testar empty/error sem alterar db.json.
5. Adicione GitHub Action (.github/workflows/ci.yml) rodando typecheck, lint e Playwright.
6. Commit em partes:
   - "test(e2e): setup playwright and config"
   - "test(e2e): add events list tests"
   - "test(e2e): add checkin rules tests"
   - "test(a11y): add axe-core checks on main routes"
   - "ci: add github actions workflow"

IMPORTANTE: os testes devem ser determinísticos. Se o db.json é modificado pelo json-server
durante os testes (POST /checkins persiste), considere:
opção A: resetar db.json antes de cada teste (script de reset);
opção B: rodar json-server com --no-cors e seed em memória;
opção C: usar page.route para interceptar mutations nos testes que precisam de estado isolado.
Documente a escolha no README.
```

---

## Prompt 9 — Acessibilidade e polimento final

```
Faça uma passada final de acessibilidade e UX.

Checklist:
1. Todos os botões ícone-only têm aria-label.
2. Todos os inputs têm <label> (visível ou sr-only).
3. Skip-link "Pular para o conteúdo" no topo do layout.
4. Focus ring visível em TODOS os elementos interativos (já vem do shadcn, confirme).
5. Navegação por teclado funciona em: lista de eventos, filtros, detalhe, tabela de participantes.
6. Roles ARIA corretos em tabelas, dialogs, tooltips.
7. Contraste: rode axe localmente (ou DevTools Lighthouse) e corrija o que aparecer.
8. Responsividade:
   - Mobile (375px): cards empilhados, tabela vira lista, métricas em 1 ou 2 colunas.
   - Tablet (768px): grid de 2 colunas.
   - Desktop (1280px+): grid completo, tabela expandida.
9. Loading skeletons para listagem e detalhe (não use spinner global).
10. Toasts: posição top-right desktop, top-center mobile (sonner permite via prop position).
11. Adicione meta tags básicas (title, description) por rota usando metadata API do Next.

Commit: "polish: a11y improvements, responsive fixes and metadata"

Depois rode pnpm test:e2e completo e garanta que tudo passa.
```

---

## Prompt 10 — README e documentação final

```
Escreva o README.md final seguindo o que o enunciado pede (seção 8).

Estrutura obrigatória:
1. Título e descrição curta.
2. Stack utilizada (com badges opcionais).
3. Pré-requisitos (Node 20+, pnpm).
4. Como rodar localmente (passo a passo, copy-paste friendly):
   - clone
   - pnpm install
   - cp .env.example .env.local
   - pnpm dev (sobe frontend e backend juntos)
   - URLs: http://localhost:3000 e http://localhost:3001
5. Scripts disponíveis (tabela).
6. Estrutura de pastas (árvore comentada).
7. Decisões técnicas e justificativas:
   - Por que Next.js App Router
   - Por que React Query + Zustand + nuqs (cada um para um tipo de estado)
   - Por que shadcn/ui em vez de MUI/Chakra
   - Por que json-server local em vez da opção GitHub Pages
   - Por que Playwright em vez de Jest+RTL
   - Por que Recharts
   - Como as regras de negócio foram isoladas (rules.ts puras)
8. Regras de negócio implementadas (resumo da seção 5 do AGENTS.md).
9. Como rodar os testes (E2E e a11y separados).
10. Edge cases tratados.
11. Como utilizei IA durante o desenvolvimento (esta seção é importante!):
    - Quais agentes/ferramentas (Claude Code, Cursor, etc.).
    - Que tipo de tarefa foi delegada (boilerplate, testes, refatoração).
    - O que foi revisado manualmente (regras de negócio, decisões arquiteturais).
    - Mencione o AGENTS.md como guia que o agente seguia.
12. Melhorias com mais tempo:
    - Endpoint atômico para check-in (atualmente são 3 requests).
    - Testes unitários para validateCheckIn com Vitest.
    - Storybook para os componentes do design system.
    - Internacionalização (i18n).
    - Otimistic updates nas mutations.
    - PWA / offline first.
    - Real-time via WebSocket para múltiplos usuários simultâneos.
13. Licença / contato.

Commit: "docs: add comprehensive README"

Confirme que o link do repositório está público antes de entregar.
```

---

## Prompt 11 — Checklist final antes da entrega

```
Faça uma revisão final antes da entrega. Para cada item, reporte OK ou o que falta:

1. pnpm install funciona em diretório limpo.
2. pnpm dev sobe frontend (3000) e backend (3001) sem erros.
3. pnpm typecheck passa sem erros.
4. pnpm lint passa sem warnings.
5. pnpm test:e2e passa 100%.
6. Build de produção (pnpm build) funciona.
7. Os 3 estados (loading/empty/error) aparecem em listagem e detalhe.
8. Regras de negócio:
   - VIP múltiplas entradas/saídas: OK
   - Normal apenas 1 check-in: OK
   - Evento closed bloqueia: OK
9. Responsividade testada em 375px, 768px, 1280px.
10. Acessibilidade: axe sem violações serious/critical.
11. README está completo e os comandos funcionam exatamente como descritos.
12. AGENTS.md está atualizado com qualquer mudança feita durante o desenvolvimento.
13. .env.example existe; .env.local NÃO está commitado.
14. Histórico de commits é limpo e descritivo (cada commit conta uma história).
15. Não há console.logs esquecidos, TODOs críticos, ou código comentado.

Se algo falhar, conserte ANTES de marcar como pronto.
Commit final (se necessário): "chore: final polish before delivery"
```

---

## Apêndice A — Prompts auxiliares (use sob demanda)

### Quando algo der errado em um teste

```
O teste {NOME_DO_TESTE} está falhando com: {ERRO}.
Investigue a causa raiz (não mascare com waitForTimeout).
Considere: seletor errado, timing de mutation, estado não invalidado, db.json desatualizado.
Conserte tanto o código (se for bug real) quanto o teste (se for flaky).
```

### Refatoração pontual

```
Olhando para {ARQUIVO}, identifique:
1. Responsabilidades misturadas que deveriam estar separadas.
2. Lógica duplicada que poderia virar utilitário.
3. Tipos que poderiam ser mais estritos.
Proponha o refactor antes de executar. Não mude comportamento, só estrutura.
```

### Adicionar componente novo

```
Preciso de um componente {NOME} que faz {DESCRIÇÃO}.
Antes de codar:
1. Confirme onde ele entra na estrutura (components/ui, components/events, etc.).
2. Liste props e variantes.
3. Mostre um esqueleto.
Aí eu aprovo e você implementa.
```

---

## Apêndice B — Ordem de commits sugerida (para o avaliador ver evolução)

```
1.  chore: bootstrap next.js + tailwind + tooling
2.  feat(api): add json-server with seed data covering edge cases
3.  feat(ui): add shadcn/ui with dark theme and shared states
4.  feat(data): add api client, zod schemas and react-query hooks
5.  feat(events): add events list with filters and url state
6.  feat(events): add loading, empty and error states
7.  feat(event-detail): add metrics grid and event header
8.  feat(event-detail): add charts (entries over time, success vs error)
9.  feat(event-detail): add participants table with checkin actions
10. feat(checkins): wire up mutation with toast feedback
11. feat(ui): add zustand store for client-side UI state
12. test(e2e): setup playwright and config
13. test(e2e): add events list tests
14. test(e2e): add checkin rules tests
15. test(a11y): add axe-core checks on main routes
16. ci: add github actions workflow
17. polish: a11y improvements, responsive fixes and metadata
18. docs: add comprehensive README
19. chore: final polish before delivery
```

Cada commit conta um capítulo da história. Avaliadores adoram isso.
