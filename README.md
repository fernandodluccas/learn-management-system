# 🎓 Learn Management System

Sistema de gerenciamento de cursos online desenvolvido com Next.js 15, Prisma, PostgreSQL e Better Auth.

## ✨ Funcionalidades

- 🔐 **Autenticação completa** com Better Auth (email/password)
- 📚 **Gestão de cursos** com disciplinas e aulas
- 🎥 **Upload de vídeos** com drag & drop
- 📱 **Interface responsiva** e moderna
- 🎨 **Dark mode** integrado
- ⚡ **Performance otimizada** com Next.js 15

## 🚀 Tecnologias

- **Framework:** Next.js 15.5.6 (App Router)
- **Linguagem:** TypeScript 5
- **Banco de Dados:** PostgreSQL com Prisma ORM 6.19
- **Autenticação:** Better Auth 1.3.34
- **UI:** Tailwind CSS 4 + Radix UI
- **Validação:** Zod + React Hook Form
- **Upload:** Sistema local com Multer

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js 18+ 
- npm ou yarn
- PostgreSQL 14+

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/fernandodluccas/learn-mamagements-system.git
cd learn-mamagements-system
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/learn_management"

# Better Auth
BETTER_AUTH_SECRET="sua-chave-secreta-aqui" # Gere com: openssl rand -base64 32
BETTER_AUTH_URL="http://localhost:3000/api/auth"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Importante:**
- Substitua `usuario` e `senha` pelas credenciais do seu PostgreSQL
- Gere uma `BETTER_AUTH_SECRET` forte usando: `openssl rand -base64 32`
- Em produção, ajuste as URLs para seu domínio

### 4. Configure o banco de dados

#### Crie o banco de dados PostgreSQL

```bash
# Acesse o PostgreSQL
psql -U postgres

# Crie o banco de dados
CREATE DATABASE learn_management;

# Saia do psql
\q
```

#### Execute as migrations do Prisma

```bash
npx prisma migrate dev --name init
```

Isso irá:
- Criar todas as tabelas necessárias
- Gerar o Prisma Client
- Aplicar o schema ao banco de dados

#### (Opcional) Visualize o banco com Prisma Studio

```bash
npx prisma studio
```

### 5. Crie a pasta de uploads

```bash
mkdir -p public/uploads/videos
```

### 6. Inicie o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📁 Estrutura do Projeto

```
learn-mamagements-system/
├── prisma/
│   ├── schema.prisma          # Schema do banco de dados
│   └── seed.js                # Dados iniciais (opcional)
├── public/
│   └── uploads/
│       └── videos/            # Vídeos enviados pelos usuários
├── src/
│   ├── app/                   # App Router do Next.js
│   │   ├── api/              # API Routes
│   │   │   ├── auth/         # Endpoints de autenticação
│   │   │   ├── courses/      # CRUD de cursos
│   │   │   └── upload/       # Upload de vídeos
│   │   ├── courses/          # Páginas de cursos
│   │   ├── create-course/    # Criar novo curso
│   │   ├── signin/           # Login
│   │   └── signup/           # Cadastro
│   ├── components/           # Componentes React
│   │   ├── ui/              # Componentes base (Radix UI)
│   │   ├── course-card.tsx
│   │   ├── course-sidebar.tsx
│   │   ├── header.tsx
│   │   └── ...
│   ├── lib/                  # Utilitários e configurações
│   │   ├── auth.ts          # Configuração Better Auth
│   │   ├── auth-client.ts   # Cliente de autenticação
│   │   └── utils.ts         # Funções auxiliares
│   └── generated/
│       └── prisma/          # Prisma Client gerado
├── .env                      # Variáveis de ambiente (não versionado)
├── .env.example             # Exemplo de variáveis
├── package.json
├── tsconfig.json
└── README.md
```

## 🗄️ Modelo de Dados

### User (Usuário)
- `id`, `name`, `email`, `password`
- Relacionamento: 1:N com Sessions e Accounts

### Course (Curso)
- `id`, `title`, `description`
- Relacionamento: 1:N com Disciplines

### Discipline (Disciplina/Módulo)
- `id`, `title`, `courseId`
- Relacionamento: 1:N com Lessons

### Lesson (Aula)
- `id`, `title`, `description`, `videoUrl`, `videoBlobId`, `videoFileName`
- Relacionamento: N:1 com Discipline

## 🔑 Principais Endpoints da API

### Autenticação
- `POST /api/auth/sign-up` - Criar conta
- `POST /api/auth/sign-in` - Login
- `POST /api/auth/sign-out` - Logout

### Cursos
- `GET /api/courses` - Listar todos os cursos
- `POST /api/courses` - Criar novo curso
- `GET /api/courses/[id]` - Buscar curso específico

### Upload
- `POST /api/upload` - Upload de vídeo (multipart/form-data)

## 🎨 Customização

### Cores e Tema

As cores podem ser customizadas em `src/app/globals.css`:

```css
@layer base {
  :root {
    --primary: /* sua cor primária */;
    --secondary: /* sua cor secundária */;
    /* ... */
  }
}
```

### Adicionar Seed Data

Edite `prisma/seed.js` para adicionar dados iniciais:

```javascript
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Crie usuários, cursos, etc.
}

main()
```

Execute com:
```bash
npx prisma db seed
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para o GitHub
2. Importe o projeto na Vercel
3. Configure as variáveis de ambiente
4. Deploy automático!

**Variáveis necessárias na Vercel:**
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`

### Outras plataformas

O projeto é compatível com qualquer plataforma que suporte Next.js:
- Railway
- Render
- AWS
- DigitalOcean

## 🐛 Troubleshooting

### Erro: "Can't reach database server"
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no `DATABASE_URL`
- Teste a conexão com: `npx prisma db push`

### Erro: "Module not found: prisma/client"
```bash
npx prisma generate
```

### Vídeos não aparecem
- Verifique se a pasta `public/uploads/videos` existe
- Confirme as permissões de escrita
- Veja os logs no console do navegador

### Erro de autenticação
- Verifique se o `BETTER_AUTH_SECRET` está configurado
- Confirme que as URLs do Better Auth estão corretas
- Limpe cookies e tente novamente

## 📝 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npx prisma studio    # Abre interface visual do banco
npx prisma migrate   # Cria nova migration
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido por [Fernando Lucas](https://github.com/fernandodluccas)

---

⭐ Se este projeto foi útil, considere dar uma estrela no GitHub!

