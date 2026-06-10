---
name: bipah-pdv-workflow
description: "Create and evolve a simple, modern PDV app for mercearias, mercados e emporios using shadcn, React, Tailwind CSS, and Tauri."
---

This skill captures a repeatable workflow for designing and implementing `bipah simples`, a compact point-of-sale system with keyboard-first checkout, modern UI, and SQLite-backed storage via Tauri.

## When to use
- You want to design or implement the PDV interface, settings, and storage model.
- You need a clean component/page separation for maintainability.
- You want the checkout page to work primarily by keyboard without a mouse.
- You need Tauri + SQLite integration for local storage and performance.

## Workflow
1. Understand the app scope
   - Frente de caixa com teclado completo
   - Sangria e fechamento de caixa
   - Gráficos de vendas
   - Configurações: impressora térmica, tamanho de papel, CNPJ, nome, endereço
   - Dados armazenados em SQLite pelo Tauri
   - Interface simples, moderna e intuitiva, não parecida com PDVs antigos
2. Define the app structure
   - separar páginas em componentes distintos
   - criar páginas para `PDV`, `Financeiro`, `Produtos`, `Configurações`
   - criar componentes reutilizáveis para `input`, `button`, `card`, `dialog`, `table`, `chart`
3. Build the checkout page
   - garantir navegação por teclado em toda a página PDV
   - priorizar atalhos para abrir produto, inserir quantidade, aplicar desconto, finalizar venda
   - manter a interface limpa e rápida
4. Build configuration UI
   - incluir campos de impressora térmica, tamanho de papel, CNPJ, nome do estabelecimento e rua
   - persistir configurações no SQLite ou no armazenamento local do Tauri
5. Add business features
   - registrar vendas, sangrias e fechamento de caixa no banco SQLite
   - gerar relatórios básicos de vendas e gráficos
   - exibir histórico de caixa e totais por turno
6. Review UX and polish theme
   - manter visual leve e espaçado
   - evitar aparência datada de PDV antigo
   - usar Tailwind e tokens de design do shadcn

## Quality criteria
- Layout de páginas separado em arquivos/componentes claros
- Página de PDV navegável por teclado sem mouse
- Configurações completas e persistentes
- Banco SQLite acessado via Tauri
- UI moderna, simples e intuitiva

## Example prompts
- "Use this skill to criar a arquitetura do app `bipah simples` com páginas separadas e frontend React + Tauri."
- "Escreva o plano de implementação do checkout keyboard-first para `bipah simples`."
- "Liste os componentes shadcn necessários para `bipah simples` e defina quais dados vão para SQLite."
