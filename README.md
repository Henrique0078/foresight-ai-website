# Foresight AI Website

Sistema de análise e cadastro de manchas com integração ao Databricks.

## 📋 Requisitos do Sistema

### Versões Necessárias
- **Node.js**: 18.17.0 ou superior
- **npm**: 9.0.0 ou superior (incluído com Node.js)
- **Databricks**: Cluster ativo com acesso JDBC

### Verificar Versões Instaladas
\`\`\`bash
node --version
npm --version
\`\`\`

## 🚀 Instalação e Configuração

### 1. Clone o Repositório
\`\`\`bash
git clone https://github.com/fontetech/foresight-ai-website.git
cd foresight-ai-website
\`\`\`

### 2. Instale as Dependências
\`\`\`bash
npm install
\`\`\`

### 3. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo e configure suas credenciais:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edite o arquivo `.env.local` com suas credenciais do Databricks:
\`\`\`env
DATABRICKS_SERVER_HOSTNAME=your-databricks-hostname.cloud.databricks.com
DATABRICKS_HTTP_PATH=/sql/1.0/warehouses/your-warehouse-id
DATABRICKS_ACCESS_TOKEN=your-access-token
DATABRICKS_CATALOG=your-catalog-name
DATABRICKS_SCHEMA=your-schema-name
\`\`\`

### 4. Configure o Banco de Dados

Execute o script de criação da tabela no Databricks:
\`\`\`sql
CREATE TABLE IF NOT EXISTS spots (
  id STRING,
  nome STRING,
  localizacao STRING,
  tamanho DOUBLE,
  cor STRING,
  formato STRING,
  textura STRING,
  e1 STRING,
  e2 STRING,
  e3 STRING,
  e4 STRING,
  observacoes STRING,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
) USING DELTA;
\`\`\`

### 5. Execute o Projeto
\`\`\`bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
\`\`\`

O projeto estará disponível em: `http://localhost:3000`

## 🎯 Funcionalidades

### Tela Inicial
- **Filtro por Nome**: Campo de busca no topo para filtrar gráficos
- **Gráficos Principais**: Área de 80% da largura com iframes para dashboards
- **Indicadores**: Área de 20% da largura com iframes para métricas
- **Menu Vermelho**: Navegação principal com design em vermelho

### Tela de Cadastro de Manchas
- **Formulário Completo**: Todos os campos necessários para cadastro
- **Tooltips Informativos**: Campos E1-E4 com explicações detalhadas
- **Validação**: Campos obrigatórios com feedback visual
- **Confirmação Dupla**: Sistema de confirmação em duas etapas
- **Grid de Dados**: Visualização tabular dos registros
- **Operações CRUD**: Criar, ler, atualizar e deletar registros

## 🔧 Estrutura do Projeto

\`\`\`
foresight-ai-website/
├── app/
│   ├── api/spots/          # APIs REST para operações CRUD
│   ├── cadastro/           # Página de cadastro de manchas
│   ├── globals.css         # Estilos globais
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Tela inicial
├── components/
│   ├── spots-form.tsx      # Formulário de cadastro
│   ├── spots-grid.tsx      # Grid de dados
│   └── ui/                 # Componentes de interface
├── lib/
│   ├── databricks.ts       # Conexão com Databricks
│   └── utils.ts            # Utilitários
└── README.md               # Esta documentação
\`\`\`

## 🔌 Integração com Databricks

### Configuração do Token
1. Acesse seu workspace do Databricks
2. Vá em **User Settings** > **Access Tokens**
3. Clique em **Generate New Token**
4. Copie o token e adicione no arquivo `.env.local`

### Configuração do HTTP Path
1. No Databricks, vá em **SQL Warehouses**
2. Selecione seu warehouse
3. Na aba **Connection Details**, copie o **HTTP Path**
4. Adicione no arquivo `.env.local`

## 🎨 Personalização

### Cores do Sistema
- **Menu Principal**: Vermelho (#dc2626)
- **Fundo**: Tons de cinza e branco
- **Acentos**: Cinza escuro para contraste

### URLs dos Dashboards
Para configurar os iframes dos gráficos, edite o arquivo `app/page.tsx`:
\`\`\`typescript
const dashboardData = [
  {
    id: 1,
    nome: "Seu Dashboard",
    url: "https://sua-url-do-dashboard.com"
  }
  // Adicione mais dashboards conforme necessário
];
\`\`\`

## 🚨 Solução de Problemas

### Erro de Conexão com Databricks
- Verifique se o token está correto
- Confirme se o HTTP Path está no formato correto
- Teste a conectividade com o cluster

### Erro de Dependências
\`\`\`bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Erro de Build
\`\`\`bash
# Execute o build com logs detalhados
npm run build -- --verbose
\`\`\`

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento

## 🔄 Atualizações

Este projeto é sincronizado automaticamente com [v0.app](https://v0.app). Mudanças feitas na plataforma v0 são automaticamente refletidas neste repositório.

**Link do Projeto v0**: [https://v0.app/chat/projects/f5bxMjmKGDq](https://v0.app/chat/projects/f5bxMjmKGDq)

**Deploy Vercel**: [https://vercel.com/fontetech/v0-foresight-ai-website](https://vercel.com/fontetech/v0-foresight-ai-website)
