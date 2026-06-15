# Bipah Simples

Um sistema de gestão desktop moderno e intuitivo para pequenos negócios, desenvolvido com Tauri, React e TypeScript.

## 📋 Descrição

Bipah Simples é uma aplicação de desktop cross-platform que oferece funcionalidades completas para gerenciar:
- **Clientes** - Cadastro e gerenciamento de informações de clientes
- **Produtos** - Controle de estoque e catálogo de produtos
- **PDV (Ponto de Venda)** - Sistema de ponto de venda integrado
- **Financeiro** - Controle financeiro e relatórios
- **Configurações** - Personalização da aplicação

## 🛠️ Tecnologias

### Frontend
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI prontos
- **React Hook Form** - Gerenciamento de formulários
- **Zustand** - State management
- **React Query** - Gerenciamento de data fetching
- **Radix UI** - Componentes acessíveis

### Backend/Desktop
- **Tauri** - Framework para aplicações desktop
- **Drizzle ORM** - ORM para TypeScript
- **Rust** - Backend do Tauri

### Outras dependências
- **Lucide React** - Ícones
- **Sonner** - Notificações toast
- **next-themes** - Gerenciamento de temas
- **Decimal.js** - Operações matemáticas precisas

## 📁 Estrutura do Projeto

```
src/
├── components/           # Componentes React
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── clientesUi/     # Componentes do módulo Clientes
│   ├── produtosUi/     # Componentes do módulo Produtos
│   ├── pdvUi/          # Componentes do módulo PDV
│   ├── financeiroUi/   # Componentes do módulo Financeiro
│   ├── configuracoesUi/# Componentes do módulo Configurações
│   └── app-sidebar.tsx # Sidebar principal
├── db/                  # Configuração e schema do banco de dados
│   └── schema/         # Definições de tabelas (Drizzle)
├── hooks/              # React hooks customizados
├── lib/                # Utilitários e helpers
├── stores/             # Estado da aplicação (Zustand)
├── utils/              # Funções utilitárias
├── App.tsx             # Componente raiz
└── main.tsx            # Ponto de entrada

src-tauri/              # Código Tauri (Rust)
├── src/
│   └── main.rs         # Entrada Rust
└── tauri.conf.json     # Configuração Tauri
```

## 🚀 Como Começar

### Pré-requisitos
- Node.js (v18+)
- Bun (gerenciador de pacotes)
- Rust (para compilar Tauri)

### Instalação

1. Clone o repositório:
```bash
cd /home/kadu/projetos/bipah-simples
```

2. Instale as dependências:
```bash
bun install
```

3. Configure o banco de dados:
```bash
bun run db:generate
```

## 📖 Comandos Disponíveis

### Desenvolvimento
```bash
# Inicia o servidor de desenvolvimento
bun run dev

# Faz build e preview
bun run preview

# Type checking
bun run typecheck
```

### Build & Deploy
```bash
# Build para produção
bun run build

# Build para Windows
bun run build:windows
```

### Code Quality
```bash
# Lint do código
bun run lint

# Formata o código
bun run format
```

### Banco de Dados
```bash
# Gera migrações Drizzle
bun run db:generate
```

## 📦 Modules

### Clientes
Gerenciamento completo de clientes com:
- Cadastro e edição de informações
- Listagem com filtros
- Diálogo de adição/edição
- Toolbar com ações

### Produtos
Sistema de produtos com:
- Cadastro e edição de produtos
- Tabela com listagem
- Diálogo para criar/editar
- Gerenciamento de inventário

### PDV (Ponto de Venda)
Sistema de vendas com:
- Tabela de produtos
- Carrinho de compras
- Processamento de vendas
- Footer com informações de transação

### Financeiro
Controle financeiro com:
- Gráficos de análise
- Tabela de transações
- Diálogo de lançamentos
- Relatórios

### Configurações
Personalização da aplicação:
- Configurações do sistema
- Preferências de usuário
- Opções de tema

## 🎨 Temas

A aplicação suporta temas claros e escuros, implementados com:
- **next-themes** para gerenciamento de temas
- **Tailwind CSS** para aplicação de estilos

## 🔐 Estado da Aplicação

Estado global gerenciado com **Zustand**:
- `navigation` - Navegação entre módulos
- `search` - Filtros de busca
- `edit-produto` - Estado de edição de produtos

## 📝 Notas de Desenvolvimento

- Use `@/` para imports absolutos
- Componentes UI ficam em `src/components/ui/`
- Componentes específicos de features ficam em sua pasta respectiva
- Mantenha schemas Drizzle organizados em `src/db/schema/`
- Use TypeScript para melhor type safety

## 📄 Licença

Proprietary - Todos os direitos reservados

---

**Desenvolvido com ❤️ usando React, TypeScript e Tauri**
