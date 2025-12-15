# 📘 Sicronweb Backend - Documentação Completa

Esta documentação descreve detalhadamente o funcionamento, arquitetura e fluxos do Backend do Sicronweb.

---

## 🏗️ 1. Visão Geral e Arquitetura

O sistema é construído sobre **Node.js** com **TypeScript**, utilizando o framework **Express**. A arquitetura segue o padrão **MVC (Model-View-Controller)** adaptado para API REST.

### Stack Tecnológica
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Linguagem:** TypeScript
*   **ORM:** TypeORM
*   **Banco de Dados:** MySQL (Compatível com PlanetScale)
*   **Segurança:** Helmet, Rate Limit, CORS, Cookie-Parser, BCrypt

### Estrutura de Pastas
```
src/
├── config/         # Configurações (ex: Conexão com Banco de Dados)
├── controllers/    # Lógica de entrada/saída das rotas (O "C" do MVC)
├── entities/       # Definição das Tabelas do Banco (O "M" do MVC)
├── middlewares/    # Interceptadores de requisição (Segurança, Logs)
├── repositories/   # Camada de Acesso a Dados (Data Access Layer)
├── routers/        # Definição das Rotas e URLs
├── services/       # Serviços utilitários (Token, Criptografia)
└── server.ts       # Ponto de entrada (Entrypoint)
```

---

## 🔐 2. Autenticação e Segurança (O Coração do Sistema)

O sistema utiliza uma estratégia robusta de **Dual Tokens** (Access + Refresh) armazenados em **Cookies HTTP-Only** para máxima segurança contra XSS.

### Fluxo de Login (`UserController.login`)
1.  Recebe `email` e `password`.
2.  Busca usuário no banco.
3.  Valida senha hash (`CryptService`).
4.  Gera par de tokens (`TokenService`):
    *   **AccessToken**: Curta duração (15 min).
    *   **RefreshToken**: Longa duração (7 dias).
5.  Armazena hash do RefreshToken no banco (`RefreshService`) para permitir revogação.
6.  Envia cookies para o navegador com flags de segurança: `HttpOnly`, `Secure`, `SameSite: Strict`.

### Middlewares de Proteção

#### 1. `loginChecker`
*   Verifica passivamente se existe um token válido.
*   Se sim, popula `req.user` e `req.logged = true`.
*   Usado em rotas públicas que mudam comportamento se logado.

#### 2. `loginRequire`
*   **Bloqueia** a requisição se o usuário não estiver logado.
*   Retorna `401 Unauthorized` se falhar.

#### 3. `loginPrivillege` (⚠️ CRÍTICO - Lógica de Alvo)
Este middleware decide **quem** será alterado ou deletado. Ele resolve a ambiguidade entre ID Numérico (Legado/Admin) e UUID (Novo Padrão).

**Lógica de Resolução de Alvo (`req.target`):**
1.  Verifica se há um parâmetro na URL (`/:uuid`).
2.  **Se for Número (ex: "18"):** Busca usuário pelo `id` (INT).
3.  **Se for Texto (ex: "abc-123"):** Busca usuário pelo `uuid` (STRING).
4.  **Se não houver parâmetro:** O alvo é o próprio usuário logado (`req.user`).
5.  **Validação de Permissão:**
    *   Se o usuário logado NÃO for Admin E tentar alterar OUTRA PESSOA -> **Bloqueia (403)**.

---

## 📡 3. API Reference (Rotas)

### 👤 Usuários (`/user`)

#### `POST /user` (Cadastro)
*   Cria um novo usuário.
*   **Body:** `{ username, email, password, role? }`
*   **Regras de Acesso:**
    *   **Público (Guest):** Qualquer um pode criar conta (role sempre será 'User').
    *   **Admin Logado:** Pode criar contas para terceiros e definir o campo `role` (ex: criar outro Admin ou ONG Manager).
    *   **User Comum Logado:** Bloqueado (403).

#### `POST /user/auth/login` (Login)
*   Autentica e define cookies.

#### `GET /user` (Listagem/Query)
*   **Filtros (Query Params):** `?email=...`, `?uuid=...`, `?name=...`
*   **Segurança:** Usuários comuns só veem detalhes públicos. Admins veem tudo.

#### `PATCH /user/:uuid` (Atualização)
*   **Middlewares:** `loginRequire`, `loginPrivillege`
*   **Compatibilidade:** Aceita tanto chaves novas quanto antigas no body.
    *   `newUsername` OU `username`
    *   `newEmail` OU `email`
    *   `newPassword` OU `password`
*   **Gestão de Roles:** Se o solicitante for **ADMIN**, pode enviar o campo `role` no body para promover/rebaixar o usuário alvo.

#### `DELETE /user/:uuid` (Exclusão)
*   **Middlewares:** `loginRequire`, `loginPrivillege`
*   Remove o usuário alvo (`req.target`) identificado pelo ID ou UUID na URL.

---

### 🏢 ONGs (`/ngo`)

#### `POST /ngo` (Solicitação de Cadastro)
*   Cria uma ONG com status `PENDING`.
*   O usuário logado torna-se o `manager_uuid` automaticamente.

#### `GET /ngo` (Listagem)
*   Retorna ONGs.
*   **Filtros:** `status`, `name`, `area`.

#### `PATCH /ngo` (Atualização)
*   Edita dados da ONG.
*   Somente o **Manager** ou **Admin** pode editar.
*   Somente **Admin** pode aprovar/reprovar (`status`).

---

## 🗄️ 4. Banco de Dados (TypeORM)

### Entidade `User` (`usertbl`)
| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `id` | INT (PK) | Auto Incremento (Legado/Interno) |
| `uuid` | VARCHAR | Identificador Público Único |
| `username` | VARCHAR | Nome de exibição |
| `email` | VARCHAR | Único, usado login |
| `password` | VARCHAR | Hash (nunca texto plano) |
| `role` | ENUM | 'user', 'admin', 'ongManager', etc. |

### Entidade `NGO` (`ngotbl`)
| Coluna | Tipo | Notas |
| :--- | :--- | :--- |
| `uuid` | VARCHAR (PK) | Chave Primária |
| `manager_uuid` | VARCHAR | UUID do dono (User) |
| `status` | ENUM | PENDING, APPROVED, REJECTED |
| `wallet` | NUMBER | Saldo da carteira |

---

## 🛠️ 5. Desenvolvimento e Debug

*   **Logs Detalhados:** O sistema possui logs (`console.log` com prefixo `[DEBUG]`) em todos os controllers e middlewares críticos auth para rastrear o fluxo exato de cada requisição.
*   **Rodar Local:** `npm run dev` (porta 3000).
