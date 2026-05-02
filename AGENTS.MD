# AGENTS.md

> Guia operacional para agentes de IA (Claude Code, Cursor, Copilot, Codex etc.) trabalhando neste repositório.
> Este arquivo é a **fonte da verdade** sobre como o código deve ser escrito, testado e entregue.

---

## 1. Visão geral do projeto

**Painel de Gestão de Eventos** — aplicação full-stack (frontend + mock backend) para acompanhamento de eventos, controle de acesso de participantes e visualização de métricas em dashboard.

| Camada         | Tecnologia                                                        |
| -------------- | ----------------------------------------------------------------- |
| Framework      | Next.js (App Router) + React + TypeScript (`strict: true`)        |
| Estilo         | Tailwind CSS v4 + shadcn/ui (tema dark, base zinc, CSS variables) |
| Estado server  | TanStack Query v5                                                 |
| Estado cliente | Zustand v5                                                        |
| URL state      | nuqs v2                                                           |
| Gráficos       | Recharts                                                          |
| Animações      | @number-flow/react                                                |
| Backend mock   | json-server (mesmo monorepo, `/server`, porta 3001)               |
| Validação      | Zod                                                               |
| Testes E2E     | Playwright + @axe-core/playwright                                 |
| Lint/Format    | ESLint (flat config) + Prettier + eslint-plugin-jsx-a11y          |
| Git hooks      | Lefthook (pre-commit: lint-staged; pre-push: typecheck)           |
| CI             | GitHub Actions                                                    |
| Gerenciador    | pnpm                                                              |

---

## 2. Estrutura do repositório

A estrutura segue convenções fixas. Novos arquivos devem respeitar o lugar certo — não crie pastas fora deste esquema.

### Raiz

Arquivos de configuração ficam na raiz: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc`, `playwright.config.ts`, `lefthook.yml`, `components.json`, `postcss.config.mjs`.

### `/server`

Backend mock com json-server. Apenas `db.json`, `db.seed.json` (cópia imutável para CI) e `routes.json`.

### `/src/app`

App Router do Next.js. Server Components por padrão; `"use client"` apenas quando necessário.

- Cada rota pode ter `page.tsx`, `loading.tsx` (skeleton automático) e `layout.tsx`.
- `providers.tsx` centraliza `QueryClientProvider`, `NuqsAdapter` e `Toaster`.
- `globals.css` contém variáveis de tema e estilos base — sem CSS adicional fora daqui.

### `/src/components`

Dividido por domínio, não por tipo de componente:

- `ui/` — primitivos shadcn/ui. Gerados via CLI e editáveis.
- `shared/` — componentes reutilizáveis sem domínio (`EmptyState`, `ErrorState`, `AnimatedNumber`, `StatusBadge`).
- `layout/` — estrutura de shell (`Sidebar`, `TopBar`, `MobileNav`).
- Por feature/tela — ex: `home/`, `events/`, `events/details/`. Componentes que servem uma tela específica ficam na pasta dela.

### `/src/features`

Lógica por domínio, isolada da UI:

- `events/` — `api.ts` (fetchers + Zod), `hooks.ts` (React Query), `schemas.ts`, `types.ts`.
- `checkins/` — `rules.ts` (lógica pura), `api.ts`, `hooks.ts`.

Regras de negócio **nunca** ficam em componentes. Sempre em `features/*/rules.ts`.

### `/src/stores`

Zustand stores para estado de UI (sidebar, isMobile). Nunca duplique server state aqui.

### `/src/lib`

Utilitários agnósticos: `api-client.ts`, `query-client.ts`, `format.ts`, `utils.ts`.

### `/src/hooks`

Hooks customizados reutilizáveis sem domínio (ex: `use-debounced-value.ts`).

### `/src/types`

Tipos globais compartilhados entre features (`api.ts`). Tipos específicos de feature ficam em `features/*/types.ts`.

### `/tests/e2e`

Testes Playwright organizados por feature/cenário.

---

## 3. Setup e comandos

### Instalação

```bash
pnpm install
```

> O `prepare` script instala os hooks do Lefthook automaticamente.

### Desenvolvimento

```bash
pnpm dev          # frontend (3000) + json-server (3001) via concurrently
pnpm dev:web      # apenas Next.js
pnpm dev:api      # apenas json-server
```

### Build e produção

```bash
pnpm build
pnpm start
```

### Qualidade (rodar antes de marcar como pronto)

```bash
pnpm typecheck    # tsc --noEmit
pnpm lint         # ESLint
pnpm format:check # Prettier em modo verificação
```

### Testes

```bash
pnpm test:e2e         # Playwright headless (todos os projetos)
pnpm test:e2e:ui      # Playwright com UI mode (debug)
pnpm test:e2e --project=chromium  # apenas Chromium
```

---

## 4. Convenções de código

### TypeScript

- `strict: true` sempre. Sem `any` implícito.
- Prefira `type` para union/intersection; `interface` para contratos públicos extensíveis.
- Use Zod para validar respostas da API antes de entregar ao app.
- Sem `// @ts-ignore`. Se inevitável, use `// @ts-expect-error` com comentário explicando.

### React / Next.js

- App Router. Server Components por padrão; `"use client"` apenas quando necessário (hooks, eventos, browser APIs).
- Data fetching via React Query no client (filtros, busca, mutations tornam SSR impraticável aqui).
- Sempre tipar props. Componentes em PascalCase, arquivos em `kebab-case.tsx`.
- Hooks customizados começam com `use`.

### Estilo (Tailwind + shadcn)

- Tema **dark por padrão**, com alternância **Light / Dark / Sistema** via `next-themes` (`ThemeProvider` em `providers.tsx`, toggle na `top-bar`). Tokens em `globals.css` para `:root` (light) e `.dark`.
- Use os tokens do tema (`bg-background`, `text-foreground`, `border-border`) em vez de cores cruas.
- shadcn/ui é **copiado** para `src/components/ui` — pode editar à vontade.
- Nada de CSS-in-JS. Tailwind + classes utilitárias. Variantes via `cva` (já vem com shadcn).
- Use `cn()` (clsx + tailwind-merge) para concatenar classes condicionais.

### Estado

| Tipo de estado                              | Onde fica   |
| ------------------------------------------- | ----------- |
| Dados remotos (API, cache, mutations)       | React Query |
| UI global entre rotas (sidebar, isMobile)   | Zustand     |
| Filtros, busca, ordenação (compartilháveis) | nuqs (URL)  |

Nunca duplique server state no Zustand.

### Padrão de chamadas à API

- Centralize em `src/lib/api-client.ts`.
- Base URL via `process.env.NEXT_PUBLIC_API_URL` (default `http://localhost:3001`).
- Cada feature tem `api.ts` (funções puras) + `hooks.ts` (wrappers React Query).

### Tratamento de erros

- Toda query renderiza 3 estados: **loading** (skeleton), **empty** (`EmptyState`), **error** (`ErrorState` com retry).
- `retry` configurado de forma sensata — sem retry em 404.
- Mutations dão feedback via toast (sonner).

### Acessibilidade

- Elementos semânticos (`<button>`, `<nav>`, `<main>`, `<table>`).
- Toda interação acessível por teclado.
- `aria-label` em elementos ícone-only.
- Contraste mínimo AA. Os tokens dark do shadcn já passam — não invente cores fora do tema.
- axe-core nos testes E2E para validação automática.

### Animações de números

Use `AnimatedNumber` de `@/components/shared/animated-number` em vez de `NumberFlow` diretamente. O wrapper inicia em `0` e anima até o valor real via `requestAnimationFrame`, garantindo a transição após o skeleton.

---

## 5. Regras de negócio (críticas)

Vivem exclusivamente em `src/features/checkins/rules.ts`. **Nunca duplique em componentes.**

### Participante VIP

- Pode entrar e sair múltiplas vezes.
- Status alterna `inside ↔ outside`. Cada ação gera registro em `checkins`.

### Participante Normal

- Apenas **um** check-in (`entry`) com sucesso. Exit não é permitido.
- Segunda tentativa → erro `already_checked_in` com toast explicativo.

### Evento `closed` ou `cancelled`

- Bloqueia **todas** as ações.
- Botões ficam `disabled` com tooltip explicando o motivo.

### Função de validação

```ts
validateCheckIn(intent: { participant, event, action }): { ok: true } | { ok: false; reason: CheckinErrorReason }
```

Toda mutation passa por essa função antes de qualquer request.

---

## 6. Integração com a API

Backend mock: **json-server local** (opção B). Permite mutations reais sem CORS nem HTTPS.

### Endpoints disponíveis

| Método  | Endpoint                                                      | Descrição                        |
| ------- | ------------------------------------------------------------- | -------------------------------- |
| `GET`   | `/events`                                                     | Lista eventos                    |
| `GET`   | `/events/:id`                                                 | Detalhe do evento                |
| `GET`   | `/participants?event_id=EVT-001`                              | Participantes do evento          |
| `GET`   | `/checkins?event_id=EVT-001&_sort=timestamp&_order=desc`      | Histórico de check-ins           |
| `POST`  | `/checkins`                                                   | Registra check-in                |
| `PATCH` | `/participants/:id`                                           | Atualiza status do participante  |
| `PATCH` | `/events/:id`                                                 | Atualiza métricas do evento      |

### Fluxo de check-in (mutation)

1. `validateCheckIn` → se inválido, toast de erro e abort.
2. `POST /checkins` com `{ event_id, participant_id, timestamp, success, action, error_reason }`.
3. Se sucesso: `PATCH /participants/:id` (atualiza `status`, `checkin_count`).
4. `PATCH /events/:id` recalculando métricas agregadas.
5. `queryClient.invalidateQueries` para refetch.

> São 3 requests sequenciais por design do teste. Documente como melhoria futura no README (endpoint atômico).

### Resetar o banco

```bash
git checkout server/db.json
```

---

## 7. Testes

### Estratégia

- **Isolamento**: `page.route()` intercepta mutations (POST `/checkins`, PATCH `/participants/**`, PATCH `/events/**`). O `db.json` nunca é modificado durante os testes — sem reset de banco, sem json-server em memória.
- Use `getByRole`, `getByText`, `getByLabel` antes de `data-testid`. Seletores semânticos são mais resilientes.

### Specs

| Arquivo                   | O que cobre                                                          |
| ------------------------- | -------------------------------------------------------------------- |
| `events-list.spec.ts`     | Listagem, filtros, busca com debounce, empty/error states, navegação |
| `checkin-rules.spec.ts`   | VIP entra/sai, Normal único check-in, evento closed, tooltips        |
| `a11y.spec.ts`            | axe-core nas rotas principais (0 violações serious/critical)         |

---

## 8. Workflow do agente de IA

### Antes de codar

1. Leia este arquivo inteiro.
2. Se a tarefa toca regra de negócio, releia a seção 5.
3. Se toca API, releia a seção 6.

### Durante

- Commits pequenos. Conventional Commits: `feat:`, `fix:`, `chore:`, `test:`, `refactor:`, `docs:`.
- Um commit = uma mudança coerente. Evite commits-monstro.
- Rode `pnpm typecheck && pnpm lint` antes de marcar como pronto.

### Depois

- Atualize o README se mudou setup, scripts ou decisões arquiteturais.
- Se algo neste AGENTS.md ficou desatualizado, corrija.

### Não faça

- Não adicione bibliotecas sem justificar.
- Não acople regra de negócio a componente.
- Não invente endpoints que não existem em `db.json`.
- Não desabilite testes para "passar o CI". Conserte o código ou o teste.
- Não suba `.next`, `playwright-report`, `node_modules` no Git.
- Não chame `setState` sincronicamente no body de `useEffect` — use um callback (RAF, handler).

---

## 9. Variáveis de ambiente

`.env.local` (não commitado) e `.env.example` (commitado, sem segredos):

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 10. Glossário rápido

- **Evento**: entidade principal com `status: active | closed | cancelled`.
- **Participante**: `type: vip` (múltiplas entradas/saídas) ou `normal` (única entrada).
- **Check-in**: registro de `action: entry | exit` com timestamp e resultado.
- **Taxa de entrada (`entry_rate`)**: `checkin_count / expected_count`.

---

**Última atualização:** 2026-05-02 — estrutura genérica, stack atualizada (Tailwind v4, lefthook, @number-flow/react, recharts), comandos corrigidos.
