# Ponto Certo

SaaS de ponto eletrônico com reconhecimento facial. Sistema de gestão de jornada de trabalho, aprovações hierárquicas e relatórios, voltado para empresas que precisam controlar ponto de forma centralizada e auditável.

> **Status:** backend em desenvolvimento ativo. Frontend ainda não iniciado (planejado em Next.js).

## Stack

- **Runtime:** Node.js + Express 5 + TypeScript
- **Banco de dados:** PostgreSQL, hospedado via Supabase (usado apenas como banco — autenticação e storage são feitos manualmente, sem os serviços de Auth/Storage do Supabase)
- **ORM:** Prisma, com gerador customizado (`prisma-client`, não o padrão `prisma-client-js`) — o client gerado fica em `src/generated/prisma`
- **Autenticação:** JWT (`jsonwebtoken`) + `bcryptjs`
- **Validação:** Zod
- **Upload de arquivos:** Multer (armazenamento local em `uploads/` por enquanto; migração para Cloudflare R2 está no backlog)
- **Logs:** Pino (+ `pino-http` para logs de requisição, `pino-pretty` em desenvolvimento)
- **Relatórios:** PDFKit (PDF) e ExcelJS (Excel)
- **Testes:** Jest + ts-jest + Supertest

## Arquitetura do backend

O backend é organizado **por domínio**, não por tipo de arquivo. Cada módulo de negócio vive em `src/modules/<nome>/` e segue sempre a mesma cadeia de responsabilidade:

```
<nome>.routes.ts  →  <nome>.validator.ts  →  <nome>.controller.ts  →  <nome>.service.ts  →  <nome>.repository.ts
```

Regras de dependência entre as camadas:

- O **Controller** nunca importa o Prisma diretamente — só chama o Service.
- O **Service** nunca importa Express (`req`/`res`) — recebe dados, aplica regra de negócio, devolve dados.
- O **Repository** é a única camada que importa o Prisma Client (`src/config/database.ts`).
- Toda validação de entrada roda no **Validator**, como middleware, antes do Controller.

Módulos existentes: `funcionarios`, `pontos`, `aprovacoes`, `dashboard`, `relatorios`, além de `auth` (login) e infraestrutura compartilhada em `src/shared/` e `src/middlewares/`.

## Modelo de dados

Definido em `prisma/schema.prisma`, com 5 entidades principais:

- **Funcionario** — cadastro e login unificados, com papel (`ADMINISTRADOR`, `GESTOR`, `RH`, `FUNCIONARIO`) e hierarquia via auto-relacionamento (`gestorId`)
- **FotoReferenciaFacial** — até 3 fotos de referência por funcionário
- **HistoricoCargoSetor** — histórico automático de cargo/estabelecimento (`dataFim` nulo = registro atual)
- **Ponto** — cada marcação de ponto, com foto de auditoria
- **Aprovacao** — decisão do gestor sobre um ponto pendente, com motivo de rejeição opcional

## Como rodar localmente

### Pré-requisitos

- Node.js
- Uma instância PostgreSQL acessível (o projeto usa Supabase, mas qualquer Postgres funciona)

### Passo a passo

```bash
cd backend
npm install
```

Copie o arquivo de exemplo de variáveis de ambiente e preencha os valores reais:

```bash
cp .env.example .env
```

| Variável       | Descrição                                                                 |
|----------------|-----------------------------------------------------------------------------|
| `PORT`         | Porta em que o servidor Express sobe (padrão: `3333`)                      |
| `NODE_ENV`     | `development`, `production` ou `test`                                      |
| `JWT_SECRET`   | Segredo para assinar tokens JWT — obrigatório, a aplicação não sobe sem ele |
| `DATABASE_URL` | Connection string do PostgreSQL (formato `postgresql://usuario:senha@host:porta/banco?schema=public`) |

Gere o Prisma Client e aplique o schema no banco:

```bash
npx prisma generate
npx prisma db push
```

Popule o banco com dados iniciais (opcional, útil em desenvolvimento):

```bash
npm run seed
```

Suba o servidor em modo desenvolvimento (recarrega automaticamente a cada alteração):

```bash
npm run dev
```

## Scripts disponíveis

| Comando         | O que faz                                      |
|-----------------|-------------------------------------------------|
| `npm run dev`   | Sobe o servidor em modo desenvolvimento          |
| `npm run build` | Compila o TypeScript para produção               |
| `npm run test`  | Roda a suíte de testes (Jest)                    |
| `npm run seed`  | Popula o banco com dados de exemplo              |

## Testes

```bash
npm run test
```

Os testes usam `NODE_ENV=test` (definido automaticamente em `jest.setup.js`), que silencia os logs do Pino durante a execução. Testes de rota (via Supertest) fazem requisições reais contra o banco configurado em `DATABASE_URL` — não há banco de testes isolado ainda.

## Frontend

Ainda não iniciado. Planejado em **Next.js + TypeScript**, consumindo a API REST deste backend.

## Roadmap

- [x] Módulos de backend: funcionários, pontos, aprovações, dashboard, relatórios
- [x] Autenticação (JWT)
- [x] Tratamento de erros centralizado e logs estruturados
- [x] Suíte de testes automatizados
- [ ] Documentação da API (Swagger)
- [ ] Frontend (Next.js)
- [ ] Reconhecimento facial automático (atualmente a foto é só de auditoria/registro)
- [ ] Migração de upload de arquivos para Cloudflare R2