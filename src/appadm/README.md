
# Júlio's Pizza House - Painel Administrativo

Aplicação independente para gerenciamento de orçamentos e contratos da Júlio's Pizza House.

## Funcionalidades

- Login administrativo independente
- Gerenciamento de orçamentos (formulários de contato)
- Criação e gerenciamento de contratos e recibos
- Download de contratos e recibos em PDF
- Filtros por nome/CPF e data do evento
- Interface responsiva com tema escuro

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI / Shadcn/ui
- Supabase (banco de dados)
- React Router DOM
- jsPDF (geração de PDFs)

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:8081`

## Build

```bash
npm run build
```

## Estrutura

- `/src/pages` - Páginas da aplicação (Login, Dashboard)
- `/src/components` - Componentes React
- `/src/components/ui` - Componentes de interface (Shadcn/ui)
- `/src/integrations` - Integrações com Supabase
- `/src/hooks` - React Hooks customizados
- `/src/lib` - Utilitários

## Acesso

Use as mesmas credenciais de administrador da aplicação principal para acessar o painel.
