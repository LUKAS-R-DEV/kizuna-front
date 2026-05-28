<div align="center">
  <h1>KIZUNA</h1>
  <h3>Interface Web Industrial</h3>

  <p>
    <img src="https://img.shields.io/badge/React-19-000000?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
    <img src="https://img.shields.io/badge/TypeScript-5.9-000000?style=for-the-badge&logo=typescript&logoColor=3178C6" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/Vite-5-000000?style=for-the-badge&logo=vite&logoColor=646CFF" alt="Vite"/>
    <img src="https://img.shields.io/badge/Tailwind_CSS-3-000000?style=for-the-badge&logo=tailwindcss&logoColor=06B6D4" alt="Tailwind"/>
    <img src="https://img.shields.io/badge/Keycloak-OAuth2-000000?style=for-the-badge&logo=keycloak&logoColor=4690FF" alt="Keycloak"/>
  </p>

  <p>
    SPA corporativa para operação, planejamento e governança da plataforma KIZUNA.<br/>
    Repositório dedicado à camada de apresentação — consome as APIs do <strong>backend</strong> via gateway.
  </p>
</div>

---

## Visão geral

O **KIZUNA Frontend** é a interface operacional da plataforma de gestão industrial. Concentra fluxos de chão de fábrica, planejamento, estoque, qualidade, relatórios executivos e administração do sistema, com autenticação centralizada em **Keycloak** e autorização por **papéis (RBAC)**.

A aplicação foi desenhada para:

- **Ambiente Docker (produção local):** nginx na porta `80`, proxy reverso para microsserviços e Keycloak na mesma origem.
- **Desenvolvimento:** Vite com hot reload e proxy para o gateway (`localhost:8080`) e Keycloak (`localhost:8081`).

> Este repositório contém **apenas** o frontend. Infraestrutura, microsserviços e `docker-compose` do stack completo ficam no repositório backend.

---

## Módulos da aplicação

| Módulo | Rota | Papéis típicos |
| :--- | :--- | :--- |
| Home | `/home` | Autenticado |
| Dashboard executivo | `/dashboard` | `EXECUTIVE` |
| Ordens de produção | `/production-orders` | `PLANNER`, `OPERATOR` |
| Fila de produção | `/production-queue` | `PLANNER` |
| Painel do operador | `/production-panel` | `OPERATOR` |
| Receitas / fórmulas | `/recipes` | `PLANNER` |
| Inventário | `/inventory` | `INVENTORY_MANAGER` |
| Movimentações de estoque | `/inventory/movements` | `INVENTORY_MANAGER` |
| Inspeção de qualidade | `/quality` | `INSPECTOR` |
| Notificações | `/notifications` | Autenticado |
| Relatórios | `/reports` | `EXECUTIVE` |
| Auditoria | `/audit` | `AUDITOR` |
| TAKA (IA) | `/ai` | `EXECUTIVE` |
| Saúde do sistema | `/admin/health` | `ADMIN` |
| Chaves de integração | `/admin/integration-keys` | `ADMIN` |

O papel **`ADMIN`** tem acesso global às rotas protegidas no frontend.

---

## Stack tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| UI | React 19, TypeScript |
| Build / dev | Vite 5 |
| Estilo | Tailwind CSS, componentes Radix/shadcn |
| Roteamento | React Router 7 |
| HTTP | Axios (interceptors JWT) |
| Autenticação | Keycloak JS (PKCE, realm `Kizuna`, client `kizuna-app`) |
| Tempo real | STOMP + SockJS (notificações e produção) |
| Gráficos | Recharts |
| Animações | Framer Motion |
| Produção | nginx (imagem Docker multi-stage) |

---

## Arquitetura de integração

### Prefixos de API (via gateway)

O cliente HTTP centraliza os serviços em `src/lib/api.ts`:

| Prefixo no browser | Serviço backend |
| :--- | :--- |
| `/api-core` | Core (OP, estoque, receitas, qualidade) |
| `/api-iam` | IAM / usuários |
| `/api-data` | Dados, relatórios, integração |
| `/api-audit` | Auditoria |
| `/api-notification` | Notificações (WebSocket) |
| `/api-ai` | TAKA / LLM |

Em **desenvolvimento**, o `vite.config.ts` encaminha esses prefixos para `http://localhost:8080`. Em **Docker**, o `nginx.conf` faz o mesmo encaminhamento para os containers da rede KIZUNA.

### Autenticação

- Login obrigatório (`login-required`) com refresh automático do access token.
- Rotas sensíveis (ex.: admin de API keys) forçam token atualizado e validam role `ADMIN` no payload JWT.
- Ações críticas (desativar inventário, arquivar receita, cancelar OP, etc.) usam **`ConfirmModal`** com reautenticação por senha via IAM.

### Keycloak — URL base

Resolução automática em `src/lib/auth.ts`:

1. `VITE_KEYCLOAK_URL` (se definida)
2. Mesma origem na porta `80` (nginx Docker)
3. Fallback dev: `http://localhost:8081`

---

## Pré-requisitos

- **Node.js** 20+
- **npm** 10+
- Backend KIZUNA em execução (gateway + Keycloak + microsserviços)

Para stack completo em Docker, suba primeiro o repositório **backend** e, em seguida, este frontend (ou use apenas `npm run dev` com proxy).

---

## Desenvolvimento local

```bash
# Instalar dependências
npm install

# Servidor de desenvolvimento (porta padrão Vite: 5173)
npm run dev
```

Certifique-se de que o **gateway** responde em `http://localhost:8080` e o **Keycloak** em `http://localhost:8081` (ou ajuste o proxy no `vite.config.ts`).

Opcional — Keycloak em URL customizada:

```bash
export VITE_KEYCLOAK_URL=http://localhost:8081
npm run dev
```

### Scripts disponíveis

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Dev server com HMR e proxy de APIs |
| `npm run build` | Typecheck + build de produção em `dist/` |
| `npm run preview` | Preview local do build |
| `npm run lint` | ESLint |

---

## Docker

Build e execução isolados (requer rede Docker do backend, ex.: `kizuna-network`):

```bash
docker build -t kizuna_frontend:latest .
docker run -d --name kizuna-frontend \
  --network kizuna-network \
  -p 80:80 \
  kizuna_frontend:latest
```

Acesso: **http://localhost**

O nginx serve os assets estáticos e faz proxy de `/api-*`, `/realms` e `/resources` para os serviços do stack backend.

---

## Estrutura do projeto

```text
src/
├── components/       # UI compartilhada (Sidebar, ConfirmModal, …)
├── contexts/         # Toast, health check global
├── layouts/          # MainLayout, AuthLayout
├── lib/              # API, auth Keycloak, roles, utilitários
├── pages/            # Módulos por domínio (inventory, orders, admin, …)
├── mocks/            # Dados de apoio / desenvolvimento
├── App.tsx           # Rotas e guards
└── main.tsx          # Bootstrap + init Keycloak
```

---

## Segurança

- **Não** commite arquivos `.env` com segredos, tokens ou senhas SMTP.
- Credenciais de integração e bootstrap de API keys são gerenciadas no **backend** (`data-service`).
- O frontend envia apenas o **Bearer token** obtido do Keycloak; não armazena senhas além do fluxo pontual do modal de confirmação.

---

## Repositórios relacionados

| Repositório | Conteúdo |
| :--- | :--- |
| [kizuna-front](https://github.com/LUKAS-R-DEV/kizuna-front) | Este projeto (UI) |
| [kizuna-back](https://github.com/LUKAS-R-DEV/kizuna-back) | Microsserviços, gateway, Compose, Keycloak |

---

## Licença

Uso interno / projeto KIZUNA — consulte o mantenedor do repositório para termos de distribuição.
