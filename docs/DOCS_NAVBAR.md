# Documentação da Lógica de Navegação (Navbar)

Este documento explica **linha por linha** como o arquivo `mobile-nav.js` funciona. O objetivo é que você entenda a lógica por trás da responsividade e da interatividade, mesmo sem conhecimento prévio de JavaScript.

---

## 1. Selecionando os "Atores" (Variáveis)

O JavaScript precisa saber com quem ele vai interagir no HTML. Usamos `document.querySelector` para buscar elementos na página e damos "apelidos" (variáveis) para eles.

```javascript
const navbar = document.querySelector("nav");
const navcta = document.querySelector(".nav-cta");
const navButton = navbar.querySelector("button");
```

*   **`const`**: Define uma constante (um valor que não vai mudar de nome).
*   **`document.querySelector("nav")`**: O JS vasculha o HTML e pega a primeira tag `<nav>` que encontrar.
*   **`navbar.querySelector("button")`**: Aqui, procuramos um botão *apenas dentro* da navbar que já encontramos antes.

---

## 2. Configurações (O Painel de Controle)

Em vez de espalhar números e textos mágicos pelo código, agrupamos tudo no topo. Se você quiser mudar o ponto de quebra ou o ícone, muda aqui e o código todo se atualiza.

```javascript
const MOBILE_BREAKPOINT = 1000;
const HAMBURGER_ICON = "☰";
const CLOSE_ICON = "✕";
const ORIGINAL_BUTTON_TEXT = "Menu";
```

*   **`MOBILE_BREAKPOINT`**: Define em qual largura (em pixels) o site deixa de ser Desktop e vira Mobile.
*   **`HAMBURGER_ICON`**: O caractere que aparece quando o menu está fechado.

---

## 3. O Cérebro da Operação: `handleResize`

Esta função é o "gerente". Ela decide qual modo o site deve usar baseada no tamanho da tela.

```javascript
function handleResize() {
  // Pergunta ao navegador: "A largura da janela é menor que 1000px?"
  // O resultado (true ou false) é guardado na variável isMobile
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

  if (isMobile) {
    activateMobileMode(); // Se for verdade, ativa o modo celular
  } else {
    deactivateMobileMode(); // Se for mentira, ativa o modo PC
  }
}
```

---

## 4. Ativando o Modo Mobile (`activateMobileMode`)

Essa função prepara o terreno para o celular. Ela não abre o menu, apenas configura o layout para *ser* mobile.

```javascript
function activateMobileMode() {
  // 1. Troca o ID da navbar.
  // Isso faz o CSS aplicar as regras de #nav-mobile (fixo embaixo, escondido, etc)
  navbar.id = "nav-mobile";

  // 2. Adiciona um preenchimento no fim da página.
  // Como a navbar mobile é fixa no chão, ela cobriria o rodapé. Isso cria um espaço vazio.
  document.body.style.paddingBottom = "5rem";

  // 3. Verifica se o menu está aberto ou fechado para decidir qual ícone mostrar.
  // classList.contains verifica se a classe "open" existe no elemento.
  const isOpen = navbar.classList.contains("open");
  
  // Operador Ternário (uma forma curta de if/else):
  // "Está aberto? Se sim, use X. Se não, use ☰".
  navButton.innerText = isOpen ? CLOSE_ICON : HAMBURGER_ICON;

  // 4. Esconde o botão "Eternizar Agora" original se ele existir,
  // pois no mobile ele pode atrapalhar ou ser reposicionado.
  if (navcta) navcta.style.display = "none";
}
```

---

## 5. Ativando o Modo Desktop (`deactivateMobileMode`)

Essa função limpa a bagunça e volta o site ao normal quando a tela é grande.

```javascript
function deactivateMobileMode() {
  // 1. Troca o ID para ativar o CSS de desktop (barra no topo, horizontal).
  navbar.id = "nav-desktop";

  // 2. Garante que o menu não fique com a classe "open" presa se o usuário redimensionar a tela.
  navbar.classList.remove("open");

  // 3. Remove o espaço extra do rodapé, pois no desktop a barra fica no topo.
  document.body.style.paddingBottom = "0";

  // 4. Restaura o texto original do botão (caso ele apareça em algum momento).
  navButton.innerText = ORIGINAL_BUTTON_TEXT;

  // 5. Traz de volta o botão de ação principal.
  if (navcta) navcta.style.display = "block";
}
```

---

## 6. A Interação: `toggleMenu`

Essa função roda toda vez que você clica no botão redondo do menu.

```javascript
function toggleMenu() {
  // Segurança: Só faz algo se estivermos no modo mobile.
  // No desktop, esse botão nem deveria aparecer, mas é bom garantir.
  if (window.innerWidth < MOBILE_BREAKPOINT) {
    
    // O comando .toggle faz o seguinte:
    // Se a classe "open" existe, ele tira. Se não existe, ele coloca.
    // É isso que faz o menu subir e descer (graças ao CSS transition).
    navbar.classList.toggle("open");

    // Chama a função de ativar mobile de novo.
    // Por que? Para atualizar o ícone (de ☰ para ✕ e vice-versa).
    activateMobileMode();
  }
}
```

---

## 7. Os Ouvidos (Event Listeners)

O código acima são apenas definições. Nada acontece até que a gente conecte essas funções a eventos reais do navegador.

```javascript
// "Ei navegador, toda vez que o usuário mudar o tamanho da janela (resize),
// rode a função handleResize".
window.addEventListener("resize", handleResize);

// "Ei botão, toda vez que alguém clicar (click) em você,
// rode a função toggleMenu".
navButton.addEventListener("click", toggleMenu);
```

---

## 8. O Pontapé Inicial

```javascript
// Roda a função uma vez assim que a página carrega.
// Sem isso, o site poderia carregar bugado e só arrumar quando você mexesse no tamanho da janela.
handleResize();
```

---
