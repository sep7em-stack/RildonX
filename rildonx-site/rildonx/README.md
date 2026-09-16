# RildonX

Ecossistema digital da Rildon — protótipo de interface web estático (HTML, CSS e JavaScript puro, sem build e sem dependências).

## Estrutura

```
.
├── index.html          # Início
├── mural.html          # Mural (feed de notícias)
├── mensagens.html      # Mensagens (messenger)
├── calendario.html     # Calendário
├── tarefas.html        # Tarefas
├── projetos.html       # Projetos
├── documentos.html     # Documentos
├── meu-espaco.html     # Meu espaço
├── grupos.html         # Grupos e Pessoas
├── assets/
│   ├── css/styles.css  # Folha de estilo única (design tokens + componentes)
│   ├── js/app.js       # Navegação, modais, toasts e formulários
│   └── img/favicon.svg
├── .nojekyll           # Impede o Jekyll de processar o site no GitHub Pages
└── .gitignore
```

Cada página é um arquivo HTML independente que compartilha o mesmo CSS e JS. A barra lateral e o cabeçalho são idênticos em todas elas, e o item ativo do menu é destacado automaticamente a partir do atributo `data-page` no `<body>`.

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub e envie estes arquivos para a branch `main`:

   ```bash
   git init
   git add .
   git commit -m "RildonX: versão inicial"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```

2. No repositório, vá em **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/ (root)`, e clique em **Save**.
5. Em alguns instantes o site estará disponível em
   `https://SEU-USUARIO.github.io/SEU-REPOSITORIO/`.

## Como rodar localmente

Como não há etapa de build, basta abrir o `index.html` no navegador. Para um ambiente mais próximo do real (caminhos relativos e `sessionStorage`), sirva a pasta:

```bash
python3 -m http.server 8000
```

E acesse `http://localhost:8000`.

## Funcionalidades implementadas

- **Navegação** entre as nove páginas, com destaque do item ativo e menu lateral retrátil (drawer) em telas menores.
- **Nova tarefa** — formulário completo (nome, prazo, etapa, prioridade, checklist dinâmica e participantes). Criada a partir de qualquer página, a tarefa é entregue à página de Tarefas via `sessionStorage`.
- **Links rápidos** do Início, cada um com seu próprio card:
  - *Setor pessoal* — quatro tipos de solicitação ao RH/DP.
  - *Suporte de TI* — categoria + descrição limitada a 150 caracteres.
  - *Reserva de sala* — formulário com validação de horário e **bloqueio de horários já ocupados**, seguido de card de confirmação.
  - *Políticas internas* — lista de documentos institucionais.
- **Notificações** em pop-up (toast) confirmando cada solicitação, com usuário, opção escolhida, data e hora.
- **Central de notificações** no cabeçalho, com a atividade recente.
- **Layout responsivo**, incluindo a página Início ajustada à altura da janela em telas grandes.

## Observações

Este é um protótipo de front-end: os dados são estáticos e as ações (solicitações, reservas, envios) são simuladas no navegador, sem back-end. O `sessionStorage` é usado apenas para transportar uma tarefa recém-criada entre páginas e é limpo ao fechar a aba.
