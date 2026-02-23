# Análise Técnica do Projeto "Recuerda"

**Data da Análise:** 23 de Fevereiro de 2026

## 1. Visão Geral e Objetivo do Projeto

O "Recuerda" é uma plataforma para a criação de memoriais online. O objetivo do MVP (Produto Mínimo Viável) é permitir que usuários se cadastrem, criem memoriais com informações e fotos, e gerenciem esses memoriais através de um painel de controle (dashboard). A aplicação deve ser visualmente agradável e responsiva, com dados persistidos através do Supabase.

## 2. Estado Atual do Projeto

O projeto encontra-se na fase de protótipo funcional no lado do cliente. As principais interfaces estão construídas em HTML, CSS e JavaScript puro, e toda a persistência de dados está sendo simulada através do `localStorage` do navegador.

### Tecnologias Utilizadas
- **Frontend:** HTML5, CSS3, JavaScript (ES6+).
- **Estrutura:** Aplicação de Múltiplas Páginas (MPA - Multiple-Page Application).
- **Banco de Dados (Simulado):** `localStorage`.

### Arquitetura do Frontend
- **Estrutura de Arquivos:** O código é bem organizado, com separação clara entre `styles`, `scripts` e `components`.
- **Componentização (Simulada):** O projeto utiliza uma abordagem interessante para componentização sem um framework. O `dashboard.js` carrega dinamicamente partes do HTML (`dash-*.html`) via `fetch`, simulando um sistema de abas e carregamento de conteúdo sob demanda. A barra de navegação (`navbar.html`) provavelmente é reutilizada da mesma forma ou via script.
- **Manipulação de Dados:** Toda a lógica de CRUD (Criar, Ler, Atualizar, Deletar) para usuários e memoriais está implementada em JavaScript, mas opera sobre o `localStorage`.
  - `scripts/login-handler.js`: Gerencia o cadastro e login de usuários.
  - `scripts/memorial-creation.js`: Cuida da criação de novos memoriais.
  - `scripts/memorial-page.js`: Exibe um memorial específico.
  - `scripts/dashboard.js`: Orquestra o painel do usuário.

## 3. Funcionalidades Implementadas (Visualmente)

As seguintes funcionalidades estão "visualmente" prontas, mas não conectadas a um backend real:

- **Cadastro e Login de Usuários:** A página `login-page.html` possui formulários para registro e login. A lógica em `login-handler.js` simula a autenticação, mas salva os dados do usuário (incluindo a senha em texto plano) no `localStorage`.
- **Criação de Memoriais:** O formulário `create.html` permite ao usuário inserir nome, datas, descrição e uma foto de perfil. O script `memorial-creation.js` processa esses dados, converte a imagem para o formato WebP (um ótimo toque de otimização) e salva tudo no `localStorage`.
- **Visualização de Memorial:** A página `memorial.html` busca os dados do `localStorage` usando um ID na URL e os exibe dinamicamente.
- **Dashboard de Usuário:** A página `dashboard.html` funciona como um contêiner para diferentes seções que são carregadas dinamicamente. A estrutura para gerenciar memoriais, mídias e subscrições está presente.

## 4. O Que Falta para o MVP

Esta é a seção mais crítica. Para atingir o objetivo do MVP, os seguintes itens precisam ser desenvolvidos do zero ou completamente refatorados.

- **1. Integração com Supabase (Prioridade Máxima):**
  - **Configuração:** Nenhum código relacionado ao Supabase existe. É preciso instalar o cliente Supabase (`supabase-js`) e configurar a conexão (URL do projeto e `anon key`).
  - **Autenticação:** Substituir toda a lógica de `login-handler.js`.
    - O cadastro deve usar `supabase.auth.signUp()`.
    - O login deve usar `supabase.auth.signInWithPassword()`.
    - É preciso gerenciar a sessão do usuário e redirecioná-lo com base no estado de autenticação.
  - **Banco de Dados (Tabelas):** É necessário modelar e criar as tabelas no Supabase. No mínimo, serão necessárias:
    - Uma tabela `memorials` (memoriais), com colunas para nome, datas, descrição, `user_id` (chave estrangeira para o dono do memorial), e talvez um link para a imagem.
    - O Supabase já gerencia a tabela `users` internamente.
  - **Segurança (Row Level Security):** Implementar políticas de RLS nas tabelas do Supabase é **crucial**.
    - Usuários só devem poder ver seus próprios memoriais no dashboard.
    - Usuários só devem poder criar, atualizar e deletar seus próprios memoriais.
    - Memoriais públicos devem ser legíveis por todos.

- **2. Refatoração do CRUD para usar o Supabase:**
  - **Criar Memorial:** `memorial-creation.js` deve, em vez de salvar no `localStorage`, fazer um `supabase.from('memorials').insert(...)`.
  - **Ler Memorial:** `memorial-page.js` e o dashboard devem buscar dados com `supabase.from('memorials').select(...)`.
  - **Atualizar/Deletar Memorial:** A lógica para isso, provavelmente no dashboard, precisará ser criada e deve usar `update()` e `delete()` do Supabase.

- **3. Upload de Mídia (Supabase Storage):**
  - O script `memorial-creation.js` atualmente converte a imagem para base64 e a salva no `localStorage`. Isso não é escalável.
  - A imagem deve ser enviada para o **Supabase Storage**.
  - O script deve:
    1. Fazer o upload do arquivo para um bucket no Supabase Storage.
    2. Obter a URL pública (ou assinada) do arquivo.
    3. Salvar essa URL na tabela `memorials` junto com os outros dados.

- **4. Responsividade:**
  - O usuário mencionou isso como um requisito. É preciso uma análise detalhada dos arquivos CSS (`*.css`) para verificar o uso de `media queries` e garantir que a aplicação se adapte bem a telas de diferentes tamanhos (mobile, tablet, desktop).

## 5. Análise Técnica e Perspectivas

### Pontos Fortes
- **Código Limpo e Organizado:** A estrutura de pastas e a separação de responsabilidades são boas, o que facilitará a refatoração.
- **Lógica de UI Pronta:** A maior parte do trabalho de manipulação do DOM e fluxo de usuário já está desenhada, economizando tempo.
- **Otimização Precoce:** A conversão de imagem para WebP mostra uma preocupação com a performance, o que é excelente.

### Pontos de Risco e Recomendações
- **Segurança:** A implementação atual com `localStorage` é **totalmente insegura**. A migração para o Supabase com RLS é a única forma de tornar o projeto seguro.
- **Gerenciamento de Estado:** Para um projeto em JavaScript puro, o gerenciamento do estado do usuário (logado/deslogado) e dos dados pode se tornar complexo. Crie um módulo JavaScript simples (`auth.js` ou `session.js`) para centralizar a lógica de verificação de sessão com `supabase.auth.getSession()`.
- **Chaves de Acesso:** Ao integrar o Supabase, as chaves de API (especialmente a `anon key`) ficarão visíveis no código do cliente. Isso é **normal e esperado** para a `anon key`. A segurança não vem de esconder essa chave, mas sim das **políticas de Row Level Security** bem definidas no backend.

### Próximos Passos (Roadmap Sugerido)

1.  **Configurar o Supabase:** Crie o projeto no Supabase, defina as tabelas (`memorials`) e configure o Storage.
2.  **Implementar Autenticação:** Refatore `login-handler.js` para usar o `supabase.auth`. Crie as páginas/rotas de proteção.
3.  **Implementar CRUD de Memoriais:** Refatore os scripts `memorial-creation.js` e `memorial-page.js` para usarem o banco de dados do Supabase.
4.  **Implementar Upload de Imagem:** Altere o fluxo de criação de memorial para enviar a imagem para o Supabase Storage.
5.  **Revisão de Responsividade:** Teste e ajuste o CSS em todas as páginas para garantir a compatibilidade com múltiplos dispositivos.
6.  **Dashboard Funcional:** Implemente a lógica de listagem e exclusão de memoriais no painel do usuário.

Este documento deve servir como um guia claro para o próximo desenvolvedor assumir o projeto e levá-lo à conclusão do MVP. O trabalho feito até agora é uma excelente base visual e lógica.
