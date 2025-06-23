let currentLoggedInUser = null;
const allGames = [
  {
    id: "minecraft-copia",
    name: "Minecraft (Cópia)",
  },
];
document.addEventListener("DOMContentLoaded", function () {
  // --- Funções Auxiliares para o localStorage ---

  function getLocalStorageSizeInBytes() {
    let totalBytes = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      totalBytes += key.length * 2;
      totalBytes += value.length * 2;
    }
    return totalBytes;
  }

  // --- CONSOLE.LOG PARA MOSTRAR ESPAÇO RESTANTE NO LOCALSTORAGE ---
  const localStorageLimitMB = 10;
  let descontoPercentual = 0;
  function updateConsoleStorageInfo() {
    const sizeInBytes = getLocalStorageSizeInBytes();
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    const remainingSpaceMB = (
      localStorageLimitMB - parseFloat(sizeInMB)
    ).toFixed(2);

    console.log(`Espaço ocupado no armazenamento: ${sizeInMB} MB`);
    if (parseFloat(remainingSpaceMB) > 0) {
      console.log(
        `Espaço restante *ESTIMADO* no armazenamento: ${remainingSpaceMB} MB`
      );
    } else {
      console.warn(
        `(*ESTIMATIVA*) Você atingiu ou excedeu o limite de armazenamento. Favor, excluir contas não utilizadas.`
      );
    }
  }

  updateConsoleStorageInfo();

  // --- CONSOLE.LOG PARA MOSTRAR TODAS AS CONTAS CADASTRADAS (INTERATIVO) ---
  const DEBUG_PASSWORD = "Saulo7413"; // Senha de depuração

  function showDebugAccounts() {
    const enteredPassword = prompt(
      "Por favor, digite a senha de depuração para ver as contas:"
    );

    if (enteredPassword === DEBUG_PASSWORD) {
      const contasCadastradas =
        JSON.parse(localStorage.getItem("saulolabsContas")) || [];
      if (contasCadastradas.length > 0) {
        console.log("--- Contas Cadastradas ---");
        contasCadastradas.forEach((conta, index) => {
          console.log(`Conta ${index + 1}:`);
          console.log(`   Nome de Usuário: ${conta.username}`);
          console.log(`   E-mail: ${conta.email}`);
          console.log(`   Senha: ${conta.senha}`);
          console.log(
            `   Saldo: R$ ${
              conta.balance
                ? conta.balance.toFixed(2).replace(".", ",")
                : "0,00"
            }`
          );
          if (conta.redeemedGifts && conta.redeemedGifts.length > 0) {
            console.log(`   Gift Cards Resgatados:`);
            conta.redeemedGifts.forEach((gift) => {
              console.log(
                `      - Código: ${gift.code}, Descrição: ${
                  gift.description
                }, Data: ${new Date(gift.redeemedAt).toLocaleString()}`
              );
            });
          } else {
            console.log(`   Nenhum Gift Card resgatado.`);
          }
          if (conta.purchasedGames && conta.purchasedGames.length > 0) {
            console.log(
              `   Jogos Adquiridos: ${conta.purchasedGames.join(", ")}`
            );
          } else {
            console.log(`   Nenhum jogo adquirido.`);
          }
        });
        console.log("--------------------------");
      } else {
        console.log("Nenhuma conta cadastrada no armazenamento local.");
      }
    } else {
      console.error("Senha de depuração incorreta. Acesso negado.");
    }
  }

  window.showDebugAccounts = showDebugAccounts; // Torna a função acessível via console (showDebugAccounts())

  // --- Referências de Elementos HTML ---
  const criarContaBtn = document.getElementById("criarContaBtn");
  const entrarBtn = document.getElementById("entrarBtn");
  const topContent = document.querySelector(".top-left-content");
  const buttonContainer = document.getElementById("buttonContainer");
  const bottomPhrase = document.querySelector(".bottom-phrase");
  const topPhrase = document.querySelector(".top-phrase");

  const criarContaOverlay = document.getElementById("criarContaOverlay");
  const entrarOverlay = document.getElementById("entrarOverlay");
  const bibliotecaScreen = document.getElementById("bibliotecaScreen");
  const settingsScreen = document.getElementById("settingsScreen");
  const clearSpaceOverlay = document.getElementById("clearSpaceOverlay");
  const sacOverlay = document.getElementById("sacOverlay");
  const giftCardsScreen = document.getElementById("giftCardsScreen");
  const saldoScreen = document.getElementById("saldoScreen");
  // --- Referências de Elementos HTML ---
  // ... (suas referências existentes) ...

  const updatesScreen = document.getElementById("updatesScreen"); // NOVO: Overlay de Atualizações
  const updatesButton = document.getElementById("updatesButton"); // NOVO: Botão de Atualizações nas Configurações
  const backBtnUpdates = document.getElementById("backBtnUpdates"); // NOVO: Botão de Voltar do overlay de Atualizações

  // ... (o restante das suas referências) ...

  const remainingSpaceDisplay = document.getElementById(
    "remainingSpaceDisplay"
  );

  const cadastroForm = document.getElementById("cadastroForm");
  const loginForm = document.getElementById("loginForm");

  const backBtnCriarConta = document.getElementById("backBtnCriarConta");
  const backBtnEntrar = document.getElementById("backBtnEntrar");
  const backBtnSettings = document.getElementById("backBtnSettings");
  const backBtnClearSpace = document.getElementById("backBtnClearSpace");
  const backBtnSAC = document.getElementById("backBtnSAC");
  const backBtnGiftCards = document.getElementById("backBtnGiftCards");
  const backBtnSaldo = document.getElementById("backBtnSaldo");

  const rememberMeCheckbox = document.getElementById("rememberMe");

  // Referências para o perfil na TELA DA BIBLIOTECA
  const userProfileCornerBiblioteca = document.getElementById(
    "userProfileCornerBiblioteca"
  );
  const loggedInUsernameBiblioteca = document.getElementById(
    "loggedInUsernameBiblioteca"
  );
  const profileImageBiblioteca = document.getElementById(
    "profileImageBiblioteca"
  );
  const logoutMenuBiblioteca = document.getElementById("logoutMenuBiblioteca");
  const logoutButtonBiblioteca = logoutMenuBiblioteca
    ? logoutMenuBiblioteca.querySelector(".logout-button")
    : null;
  const settingsButtonBiblioteca = logoutMenuBiblioteca
    ? logoutMenuBiblioteca.querySelector(".settings-button")
    : null;
  const giftCardsBtnBiblioteca = document.getElementById(
    "giftCardsBtnBiblioteca"
  );
  const saldoBtnBiblioteca = document.getElementById("saldoBtnBiblioteca");

  // Referências para o perfil na TELA DE CONFIGURAÇÕES
  const userProfileCornerSettings = document.getElementById(
    "userProfileCornerSettings"
  );
  const loggedInUsernameSettings = document.getElementById(
    "loggedInUsernameSettings"
  );
  const profileImageSettings = document.getElementById("profileImageSettings");
  const logoutMenuSettings = document.getElementById("logoutMenuSettings");
  const logoutButtonSettings = logoutMenuSettings
    ? logoutMenuSettings.querySelector(".logout-button")
    : null;
  const settingsButtonSettings = logoutMenuSettings
    ? logoutMenuSettings.querySelector(".settings-button")
    : null;
  const giftCardsBtnSettings = document.getElementById("giftCardsBtnSettings");
  const saldoBtnSettings = document.getElementById("saldoBtnSettings");

  // Referências para a tela de Gift Cards
  const giftCardCodeInput = document.getElementById("giftCardCodeInput");
  const redeemGiftCardBtn = document.getElementById("redeemGiftCardBtn");
  const giftCardMessage = document.getElementById("giftCardMessage");

  // Referências para a tela de Saldo
  const currentBalanceDisplay = document.getElementById(
    "currentBalanceDisplay"
  );

  const changePhotoButton = document.getElementById("changePhotoButton");
  const clearSpaceButton = document.getElementById("clearSpaceButton");
  const SACButton = document.getElementById("SACButton");
  const accountList = document.getElementById("accountList");
  const updatesList = document.getElementById("updatesList");

  // NOVAS REFERÊNCIAS PARA OS CARDS DE CONFIGURAÇÃO
  const giftCardsSettingsButton = document.getElementById(
    "giftCardsSettingsButton"
  );
  const saldoSettingsButton = document.getElementById("saldoSettingsButton");

  // --- NOVAS REFERÊNCIAS: BOTÕES DO SAC ---
  const reclamacoesBtn = document.getElementById("reclamacoesBtn");
  const ideiasBtn = document.getElementById("ideiasBtn");
  const elogiosBtn = document.getElementById("elogiosBtn");

  // Armazena o objeto completo do usuário logado

  // --- DADOS DOS GIFT CARDS MESTRES (NÃO SÃO SALVOS POR USUÁRIO) ---
  const masterGiftCards = [
    {
      code: "SAULOLABS10OFF",
      description: "10% OFF na sua próxima compra",
      type: "discount",
      amount: 10.0,
    },
    /*{
      code: "JOGOGRATISABC",
      description: "Acesso a um jogo beta exclusivo",
      type: "beta_access",
    },
    {
      code: "SUPERCARD50",
      description: "Créditos de R$50 para a loja",
      amount: 50.0,
      type: "balance",
    },
    {
      code: "SUPERGIFT100",
      description: "Créditos de R$100 para a loja",
      amount: 100.0,
      type: "balance",
    },*/
    {
      code: "MINECRAFTFREE",
      description: "Jogo Minecraft (Cópia) Grátis",
      type: "game",
      gameId: "minecraft-copia", // ID do jogo para o Gift Card
    },
    {
      code: "10ZÃONAMÃO",
      description: "Créditos de R$10 para a loja",
      type: "balance",
      amount: 10.0,
    },
  ];

  // Preço do Minecraft
  const MINECRAFT_PRICE_ORIGINAL = 0.99;
  // Remova ou comente esta linha existente:
  // const MINECRAFT_PRICE = MINECRAFT_PRICE_ORIGINAL - MINECRAFT_PRICE_ORIGINAL * (descontoPercentual / 100);

  // Adicione esta função logo abaixo de 'MINECRAFT_DOWNLOAD_URL' ou em um local de funções auxiliares:
  function getMinecraftPrice() {
    return (
      MINECRAFT_PRICE_ORIGINAL -
      MINECRAFT_PRICE_ORIGINAL * (descontoPercentual / 100)
    );
  }
  const MINECRAFT_DOWNLOAD_URL = "Downloads/minecraft-copia.zip";

  // --- Funções de Controle de Exibição de Telas ---

  function hideElement(element, delay = 300) {
    if (element) {
      element.classList.remove("is-active");
      setTimeout(() => {
        element.style.display = "none";
      }, delay);
    }
  }

  function showElement(element, displayType = "flex") {
    if (element) {
      element.style.display = displayType;
      // Usar requestAnimationFrame para garantir que a classe seja adicionada após o display ser atualizado
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Duplo requestAnimationFrame para garantia de repaint
          element.classList.add("is-active");
        });
      });
    }
  }

  function showMainScreen() {
    [
      criarContaOverlay,
      entrarOverlay,
      bibliotecaScreen,
      settingsScreen,
      clearSpaceOverlay,
      sacOverlay,
      giftCardsScreen,
      saldoScreen,
    ].forEach((screen) => {
      hideElement(screen);
    });

    hideElement(userProfileCornerBiblioteca);
    hideElement(logoutMenuBiblioteca);
    hideElement(userProfileCornerSettings);
    hideElement(logoutMenuSettings);

    showElement(topContent, "block");
    showElement(buttonContainer, "flex");
    bottomPhrase?.classList.remove("hidden");
    topPhrase?.classList.remove("hidden");

    currentLoggedInUser = null;
    localStorage.removeItem("saulolabsLoggedIn");
    localStorage.removeItem("saulolabsUsername");
    updateConsoleStorageInfo();
    applyGameStatus(); // Atualiza o status dos jogos para "deslogado"
  }

  function showAuthOverlay(targetOverlay) {
    hideElement(topContent, 0);
    hideElement(buttonContainer, 0);
    bottomPhrase?.classList.add("hidden");
    topPhrase?.classList.add("hidden");

    [
      bibliotecaScreen,
      settingsScreen,
      clearSpaceOverlay,
      sacOverlay,
      giftCardsScreen,
      saldoScreen,
    ].forEach((screen) => {
      hideElement(screen);
    });

    hideElement(userProfileCornerBiblioteca);
    hideElement(logoutMenuBiblioteca);
    hideElement(userProfileCornerSettings);
    hideElement(logoutMenuSettings);

    showElement(targetOverlay, "flex");
  }

  function showLibraryScreen(user) {
    currentLoggedInUser = user;

    if (loggedInUsernameBiblioteca) {
      loggedInUsernameBiblioteca.textContent = user.username;
    }

    const profileImageKey = `saulolabsProfileImage_${user.username}`;
    const storedProfileImage = localStorage.getItem(profileImageKey);

    if (storedProfileImage && profileImageBiblioteca) {
      profileImageBiblioteca.src = storedProfileImage;
    } else {
      profileImageBiblioteca.src = "Imagens/FotoPerfil.png";
    }

    hideElement(topContent, 0);
    hideElement(buttonContainer, 0);
    bottomPhrase?.classList.add("hidden");
    topPhrase?.classList.add("hidden");

    [
      criarContaOverlay,
      entrarOverlay,
      settingsScreen,
      clearSpaceOverlay,
      sacOverlay,
      giftCardsScreen,
      saldoScreen,
    ].forEach((overlay) => {
      hideElement(overlay);
    });

    hideElement(userProfileCornerSettings);
    hideElement(logoutMenuSettings);

    showElement(bibliotecaScreen, "flex");

    if (userProfileCornerBiblioteca) {
      showElement(userProfileCornerBiblioteca, "flex");
    }
    hideElement(logoutMenuBiblioteca);
    updateConsoleStorageInfo();
    applyGameStatus(); // Garante que o status dos jogos é atualizado ao exibir a biblioteca
  }

  function showSettingsScreen(user) {
    currentLoggedInUser = user;

    if (loggedInUsernameSettings) {
      loggedInUsernameSettings.textContent = user.username;
    }

    const profileImageKey = `saulolabsProfileImage_${user.username}`;
    const storedProfileImage = localStorage.getItem(profileImageKey);

    if (storedProfileImage && profileImageSettings) {
      profileImageSettings.src = storedProfileImage;
    } else {
      profileImageSettings.src = "Imagens/FotoPerfil.png";
    }

    hideElement(topContent, 0);
    hideElement(buttonContainer, 0);
    bottomPhrase?.classList.add("hidden");
    topPhrase?.classList.add("hidden");

    [
      criarContaOverlay,
      entrarOverlay,
      bibliotecaScreen,
      clearSpaceOverlay,
      sacOverlay,
      giftCardsScreen,
      saldoScreen,
      updatesScreen,
    ].forEach((overlay) => {
      hideElement(overlay);
    });

    hideElement(userProfileCornerBiblioteca);
    hideElement(logoutMenuBiblioteca);

    showElement(settingsScreen, "flex");

    if (userProfileCornerSettings) {
      showElement(userProfileCornerSettings, "flex");
    }
    hideElement(logoutMenuSettings);
    updateConsoleStorageInfo();
  }

  function showClearSpaceOverlay() {
    hideElement(topContent, 0);
    hideElement(buttonContainer, 0);
    bottomPhrase?.classList.add("hidden");
    topPhrase?.classList.add("hidden");

    [
      criarContaOverlay,
      entrarOverlay,
      bibliotecaScreen,
      settingsScreen,
      sacOverlay,
      giftCardsScreen,
      saldoScreen,
    ].forEach((overlay) => {
      hideElement(overlay);
    });

    hideElement(userProfileCornerBiblioteca);
    hideElement(logoutMenuBiblioteca);
    hideElement(userProfileCornerSettings);
    hideElement(logoutMenuSettings);

    showElement(clearSpaceOverlay, "flex");
    populateAccountList();

    const currentSizeInBytes = getLocalStorageSizeInBytes();
    const currentSizeInMB = (currentSizeInBytes / (1024 * 1024)).toFixed(2);
    const currentRemainingSpaceMB = (
      localStorageLimitMB - parseFloat(currentSizeInMB)
    ).toFixed(2);

    if (remainingSpaceDisplay) {
      remainingSpaceDisplay.textContent = `${currentRemainingSpaceMB} MB`;
    }
    updateConsoleStorageInfo();
  }
  function loadUserGamesForUpdates() {
    updatesList.innerHTML = "";
    updatesList.classList.add("account-list");

    if (!currentLoggedInUser) {
      console.warn("loadUserGamesForUpdates: Nenhum usuário logado.");
      const noGamesMessage = document.createElement("li");
      noGamesMessage.textContent = "Por favor, faça login para ver seus jogos.";
      noGamesMessage.style.color = "#ffcc00";
      noGamesMessage.style.textAlign = "center";
      updatesList.appendChild(noGamesMessage);
      return;
    }

    if (
      currentLoggedInUser.purchasedGames &&
      Array.isArray(currentLoggedInUser.purchasedGames) &&
      currentLoggedInUser.purchasedGames.length > 0
    ) {
      console.log(
        "Jogos comprados pelo usuário:",
        currentLoggedInUser.purchasedGames
      );

      currentLoggedInUser.purchasedGames.forEach((gameId) => {
        // >>> ENCONTRAR O OBJETO DO JOGO PELO ID <<<
        const gameInfo = allGames.find((game) => game.id === gameId);

        if (gameInfo) {
          // Se o jogo foi encontrado na lista 'allGames'
          const listItem = document.createElement("li");
          listItem.classList.add("account-item");

          const gameNameSpan = document.createElement("span");
          // >>> EXIBE O NOME DO JOGO <<<
          gameNameSpan.textContent = gameInfo.name; // Use o 'name' do objeto gameInfo
          gameNameSpan.classList.add("username");
          listItem.appendChild(gameNameSpan);

          const checkUpdateButton = document.createElement("button");
          checkUpdateButton.textContent = "Verificar Atualização";
          checkUpdateButton.classList.add("futuristic-button");
          checkUpdateButton.style.padding = "8px 12px";
          checkUpdateButton.style.fontSize = "0.9em";
          checkUpdateButton.style.width = "auto";
          checkUpdateButton.style.minHeight = "auto";
          checkUpdateButton.style.transform = "none";
          checkUpdateButton.style.boxShadow = "none";
          checkUpdateButton.style.transition =
            "background-color 0.3s ease-in-out, color 0.3s ease-in-out, box-shadow 0.3s ease-in-out";
          checkUpdateButton.onmouseover = () => {
            checkUpdateButton.style.backgroundColor = "rgba(0, 188, 212, 0.1)";
            checkUpdateButton.style.color = "#fff";
            checkUpdateButton.style.boxShadow =
              "0 0 8px rgba(0, 188, 212, 0.5)";
          };
          checkUpdateButton.onmouseout = () => {
            checkUpdateButton.style.backgroundColor = "transparent";
            checkUpdateButton.style.color = "#00bcd4";
            checkUpdateButton.style.boxShadow = "none";
          };

          checkUpdateButton.onclick = () => {
            alert(`Verificando atualizações para: ${gameInfo.name}...`); // Alerta com o nome também!
          };

          listItem.appendChild(checkUpdateButton);
          updatesList.appendChild(listItem);
          console.log(
            `Adicionado jogo "${gameInfo.name}" à lista de atualizações.`
          );
        } else {
          // Se o ID do jogo não for encontrado na sua lista 'allGames'
          console.warn(
            `ID de jogo "${gameId}" encontrado no perfil, mas não em 'allGames'.`
          );
          const listItem = document.createElement("li");
          listItem.classList.add("account-item");
          listItem.textContent = `Jogo desconhecido (ID: ${gameId})`;
          listItem.style.color = "#ff9800"; // Cor para indicar um aviso
          updatesList.appendChild(listItem);
        }
      });
    } else {
      console.log("Nenhum jogo comprado encontrado para o usuário atual.");
      const noGamesMessage = document.createElement("li");
      noGamesMessage.textContent =
        "Você ainda não possui nenhum jogo para verificar atualizações.";
      noGamesMessage.style.color = "#ccc";
      noGamesMessage.style.textAlign = "center";
      updatesList.appendChild(noGamesMessage);
    }
    console.log(
      "--- Fim do Carregamento de Jogos do Usuário para Atualizações ---"
    );
  }
  function showSACOverlay() {
    hideElement(topContent, 0);
    hideElement(buttonContainer, 0);
    bottomPhrase?.classList.add("hidden");
    topPhrase?.classList.add("hidden");

    [
      criarContaOverlay,
      entrarOverlay,
      bibliotecaScreen,
      settingsScreen,
      clearSpaceOverlay,
      giftCardsScreen,
      saldoScreen,
    ].forEach((overlay) => {
      hideElement(overlay);
    });

    hideElement(userProfileCornerBiblioteca);
    hideElement(logoutMenuBiblioteca);
    hideElement(userProfileCornerSettings);
    hideElement(logoutMenuSettings);

    showElement(sacOverlay, "flex");
  }

  function showGiftCardsScreen() {
    hideElement(topContent, 0);
    hideElement(buttonContainer, 0);
    bottomPhrase?.classList.add("hidden");
    topPhrase?.classList.add("hidden");

    [
      criarContaOverlay,
      entrarOverlay,
      bibliotecaScreen,
      settingsScreen,
      clearSpaceOverlay,
      sacOverlay,
      saldoScreen,
    ].forEach((overlay) => {
      hideElement(overlay);
    });

    hideElement(userProfileCornerBiblioteca);
    hideElement(logoutMenuBiblioteca);
    hideElement(userProfileCornerSettings);
    hideElement(logoutMenuSettings);

    if (giftCardCodeInput) giftCardCodeInput.value = "";
    if (giftCardMessage) {
      giftCardMessage.textContent = "";
      giftCardMessage.classList.remove("success", "error");
    }

    showElement(giftCardsScreen, "flex");
  }

  function showSaldoScreen() {
    hideElement(topContent, 0);
    hideElement(buttonContainer, 0);
    bottomPhrase?.classList.add("hidden");
    topPhrase?.classList.add("hidden");

    [
      criarContaOverlay,
      entrarOverlay,
      bibliotecaScreen,
      settingsScreen,
      clearSpaceOverlay,
      sacOverlay,
      giftCardsScreen,
    ].forEach((overlay) => {
      hideElement(overlay);
    });

    hideElement(userProfileCornerBiblioteca);
    hideElement(logoutMenuBiblioteca);
    hideElement(userProfileCornerSettings);
    hideElement(logoutMenuSettings);

    updateBalanceDisplay(); // Atualiza o saldo exibido

    showElement(saldoScreen, "flex");
  }
  function showUpdatesScreen() {
    if (!currentLoggedInUser) {
      showMainScreen();
      return;
    }

    [
      criarContaOverlay,
      entrarOverlay,
      bibliotecaScreen,
      settingsScreen,
      clearSpaceOverlay,
      sacOverlay,
      giftCardsScreen,
      saldoScreen,
    ].forEach((overlay) => {
      hideElement(overlay);
    });

    hideElement(topContent, 0);
    hideElement(buttonContainer, 0);
    bottomPhrase?.classList.add("hidden");
    topPhrase?.classList.add("hidden");

    hideElement(userProfileCornerBiblioteca);
    hideElement(logoutMenuBiblioteca);
    hideElement(userProfileCornerSettings);
    hideElement(logoutMenuSettings);

    // --- NOVO: Carregar a lista de jogos antes de mostrar a tela ---
    loadUserGamesForUpdates();

    showElement(updatesScreen, "flex");
  }
  function updateBalanceDisplay() {
    if (currentLoggedInUser && currentBalanceDisplay) {
      currentBalanceDisplay.textContent = `R$ ${(
        currentLoggedInUser.balance || 0
      )
        .toFixed(2)
        .replace(".", ",")}`;
    } else {
      currentBalanceDisplay.textContent = `R$ 0,00`;
    }
  }

  function populateAccountList() {
    accountList.innerHTML = "";
    const contas = JSON.parse(localStorage.getItem("saulolabsContas")) || [];

    if (contas.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Nenhuma conta cadastrada.";
      accountList.appendChild(li);
      return;
    }

    contas.forEach((conta) => {
      const li = document.createElement("li");
      li.classList.add("account-item");

      const usernameSpan = document.createElement("span");
      usernameSpan.classList.add("username");
      usernameSpan.textContent = conta.username;
      li.appendChild(usernameSpan);

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.textContent = "Apagar Dados";
      deleteButton.dataset.username = conta.username;

      if (
        currentLoggedInUser &&
        conta.username === currentLoggedInUser.username
      ) {
        li.classList.add("current-user");
        deleteButton.disabled = true; // Não permite apagar a conta logada
        deleteButton.textContent = "Logado Atualmente";
      } else {
        deleteButton.addEventListener("click", function () {
          if (
            confirm(
              `Tem certeza que deseja apagar todos os dados de perfil de "${conta.username}"?`
            )
          ) {
            deleteAccountData(conta.username);
            populateAccountList(); // Recarrega a lista após a exclusão
            showClearSpaceOverlay(); // Reexibe a tela de limpar espaço para atualizar o display
          }
        });
      }
      li.appendChild(deleteButton);
      accountList.appendChild(li);
    });
  }

  function deleteAccountData(usernameToDelete) {
    // Apaga a imagem de perfil associada
    const profileImageKey = `saulolabsProfileImage_${usernameToDelete}`;
    localStorage.removeItem(profileImageKey);

    // Apaga a conta da lista de contas
    let contas = JSON.parse(localStorage.getItem("saulolabsContas")) || [];
    const initialCount = contas.length;
    contas = contas.filter((conta) => conta.username !== usernameToDelete);
    if (contas.length < initialCount) {
      localStorage.setItem("saulolabsContas", JSON.stringify(contas));
    }

    alert(`Dados de perfil de "${usernameToDelete}" foram apagados.`);

    // Se a conta apagada for a atualmente logada, desloga
    if (
      currentLoggedInUser &&
      currentLoggedInUser.username === usernameToDelete
    ) {
      localStorage.removeItem("saulolabsLoggedIn");
      localStorage.removeItem("saulolabsUsername");
      currentLoggedInUser = null;
      showMainScreen(); // Volta para a tela principal
    }
    updateConsoleStorageInfo(); // Atualiza informações de armazenamento
  }

  // --- Lógica de Resgate de Gift Card ---
  redeemGiftCardBtn?.addEventListener("click", function () {
    const code = giftCardCodeInput?.value.trim().toUpperCase();

    if (!code) {
      displayGiftCardMessage("Por favor, digite um código.", "error");
      return;
    }

    if (!currentLoggedInUser) {
      displayGiftCardMessage(
        "Você precisa estar logado para resgatar um Gift Card.",
        "error"
      );
      return;
    }

    const foundCard = masterGiftCards.find((card) => card.code === code);

    if (foundCard) {
      let contas = JSON.parse(localStorage.getItem("saulolabsContas")) || [];
      const userAccountIndex = contas.findIndex(
        (conta) => conta.username === currentLoggedInUser.username
      );

      if (userAccountIndex !== -1) {
        const userAccount = contas[userAccountIndex];

        // Inicializa redeemedGifts se não existir
        if (!userAccount.redeemedGifts) {
          userAccount.redeemedGifts = [];
        }
        const alreadyRedeemed = userAccount.redeemedGifts.some(
          (gift) => gift.code === code
        );

        if (alreadyRedeemed) {
          displayGiftCardMessage("Você já resgatou este Gift Card.", "error");
        } else {
          // Adiciona o gift card aos resgatados
          userAccount.redeemedGifts.push({
            code: foundCard.code,
            description: foundCard.description,
            redeemedAt: new Date().toISOString(),
          });

          // Aplica o benefício do gift card
          if (
            foundCard.type === "balance" &&
            typeof foundCard.amount === "number"
          ) {
            userAccount.balance = (userAccount.balance || 0) + foundCard.amount;
            alert(
              `R$ ${foundCard.amount
                .toFixed(2)
                .replace(
                  ".",
                  ","
                )} adicionados ao seu saldo! Seu novo saldo é R$ ${userAccount.balance
                .toFixed(2)
                .replace(".", ",")}.`
            );
            updateBalanceDisplay(); // Atualiza o display de saldo
          } else if (foundCard.type === "game" && foundCard.gameId) {
            // Inicializa purchasedGames se não existir
            if (!userAccount.purchasedGames) {
              userAccount.purchasedGames = [];
            }
            if (userAccount.purchasedGames.includes(foundCard.gameId)) {
              displayGiftCardMessage(
                `Você já possui ${foundCard.description}!`,
                "error"
              );
            } else {
              userAccount.purchasedGames.push(foundCard.gameId);
              displayGiftCardMessage(
                `Parabéns! Você adquiriu ${foundCard.description}!`,
                "success"
              );
              applyGameStatus(); // Atualiza o status do botão do jogo na biblioteca
            }
          } else if (
            foundCard.type === "discount" &&
            foundCard.code === "SAULOLABS10OFF"
          ) {
            // --- AQUI É ONDE VOCÊ ADICIONA A LÓGICA DO DESCONTO ---
            descontoPercentual = foundCard.amount; // Define descontoPercentual como 10 (se foundCard.amount for 10)
            displayGiftCardMessage(
              "Cupom de 10% de desconto aplicado com sucesso!",
              "success"
            );
            // Você pode querer desabilitar o input/botão do cupom aqui para evitar uso repetido
            if (giftCardCodeInput) giftCardCodeInput.disabled = true;
            if (redeemGiftCardBtn) redeemGiftCardBtn.disabled = true;

            // IMPORTANTE: Recalcule o preço e atualize o display
            applyGameStatus(); // Isso vai chamar applyGameStatus, que recalcula o preço do Minecraft
            // ---------------------------------------------------
            currentLoggedInUser = userAccount; // Atualiza a instância do usuário logado
            localStorage.setItem("saulolabsContas", JSON.stringify(contas)); // Salva o array 'contas' atualizado
            console.log(
              `Benefício do Gift Card '${foundCard.description}' adicionado à conta de ${currentLoggedInUser.username}.`
            );
            updateConsoleStorageInfo();
          } else {
            // Mensagem genérica para outros tipos de gift card
            displayGiftCardMessage(
              `Gift Card resgatado com sucesso! 🎉 Benefício: ${foundCard.description}`,
              "success"
            );
          }

          // Atualiza o objeto do usuário logado em memória e no localStorage
          currentLoggedInUser = userAccount;
          localStorage.setItem("saulolabsContas", JSON.stringify(contas));
          console.log(
            `Benefício do Gift Card '${foundCard.description}' adicionado à conta de ${currentLoggedInUser.username}.`
          );
          updateConsoleStorageInfo(); // Atualiza informações de armazenamento
        }
      } else {
        displayGiftCardMessage(
          "Erro: Conta de usuário não encontrada. Por favor, tente novamente.",
          "error"
        );
      }
    } else {
      displayGiftCardMessage("Código de Gift Card inválido.", "error");
    }

    giftCardCodeInput.value = ""; // Limpa o campo do gift card
  });

  function displayGiftCardMessage(message, type) {
    if (giftCardMessage) {
      giftCardMessage.textContent = message;
      giftCardMessage.className = `message-text ${type}`;
      setTimeout(() => {
        giftCardMessage.textContent = "";
        giftCardMessage.className = "message-text";
      }, 5000); // Mensagem some após 5 segundos
    }
  }

  // --- Event Listeners dos Botões de Navegação ---

  criarContaBtn?.addEventListener("click", () => {
    showAuthOverlay(criarContaOverlay);
  });
  entrarBtn?.addEventListener("click", () => {
    showAuthOverlay(entrarOverlay);
  });

  backBtnCriarConta?.addEventListener("click", () => {
    showMainScreen();
  });
  backBtnEntrar?.addEventListener("click", () => {
    showMainScreen();
  });

  backBtnSettings?.addEventListener("click", function () {
    if (currentLoggedInUser) {
      showLibraryScreen(currentLoggedInUser); // Volta para a biblioteca se logado
    } else {
      showMainScreen(); // Volta para a tela principal se deslogado
    }
  });

  backBtnClearSpace?.addEventListener("click", function () {
    if (currentLoggedInUser) {
      showSettingsScreen(currentLoggedInUser);
    } else {
      showMainScreen();
    }
  });

  backBtnSAC?.addEventListener("click", function () {
    if (currentLoggedInUser) {
      showSettingsScreen(currentLoggedInUser);
    } else {
      showMainScreen();
    }
  });

  // Lógica para voltar da tela de Gift Cards para a tela anterior (biblioteca ou configurações)
  backBtnGiftCards?.addEventListener("click", function () {
    if (currentLoggedInUser) {
      showSettingsScreen(currentLoggedInUser);
    } else {
      showMainScreen();
    }
  });

  // Salva a tela anterior antes de ir para Gift Cards
  if (giftCardsSettingsButton) {
    giftCardsSettingsButton.addEventListener("click", () => {
      localStorage.setItem("lastScreenBeforeGiftCards", "bibliotecaScreen");
      showGiftCardsScreen();
    });
  }

  // Lógica para voltar da tela de Saldo para a tela anterior (biblioteca ou configurações)
  backBtnSaldo?.addEventListener("click", function () {
    if (currentLoggedInUser) {
      showSettingsScreen(currentLoggedInUser);
    } else {
      showMainScreen();
    }
  });

  // Salva a tela anterior antes de ir para Saldo
  if (saldoSettingsButton) {
    saldoSettingsButton.addEventListener("click", () => {
      localStorage.setItem("lastScreenBeforeSaldo", "bibliotecaScreen");
      showSaldoScreen();
    });
  }
  // ... (seus outros event listeners existentes) ...

  // Event listener para o CARD de "Atualizações" nas Configurações
  if (updatesButton) {
    updatesButton.addEventListener("click", () => {
      localStorage.setItem("lastScreenBeforeUpdates", "settingsScreen"); // Salva a tela atual
      showUpdatesScreen(); // Chama a função para exibir a tela de Atualizações
    });
  }

  // Event listener para o botão "Voltar" do overlay de Atualizações
  backBtnUpdates?.addEventListener("click", function () {
    if (currentLoggedInUser) {
      showSettingsScreen(currentLoggedInUser);
    } else {
      showMainScreen();
    }
  });
  // --- Formulário de Cadastro ---
  cadastroForm?.addEventListener("submit", function (event) {
    event.preventDefault();

    const usernameInput = document.getElementById("cadastroUsername");
    const emailInput = document.getElementById("cadastroEmail");
    const senhaInput = document.getElementById("cadastroSenha");

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value;

    if (!username || !email || !senha) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    let contas = JSON.parse(localStorage.getItem("saulolabsContas")) || [];

    const usernameOuEmailExiste = contas.some(
      (conta) => conta.username === username || conta.email === email
    );
    if (usernameOuEmailExiste) {
      alert(
        "Este nome de usuário ou e-mail já está em uso. Por favor, escolha outro."
      );
      return;
    }

    // Cria a nova conta com propriedades iniciais
    contas.push({
      username: username,
      email: email,
      senha: senha,
      balance: 0,
      redeemedGifts: [],
      purchasedGames: [], // Inicializa a lista de jogos adquiridos
      descontoAtivoPercentual: 0,
    });
    localStorage.setItem("saulolabsContas", JSON.stringify(contas));

    alert("Conta criada com sucesso para " + username + "!");

    usernameInput.value = "";
    emailInput.value = "";
    senhaInput.value = "";

    showMainScreen(); // Volta para a tela principal após cadastro
    updateConsoleStorageInfo();
  });

  // --- Formulário de Login ---
  loginForm?.addEventListener("submit", function (event) {
    event.preventDefault();

    const loginEmailInput = document.getElementById("loginEmail");
    const loginSenhaInput = document.getElementById("loginSenha");

    const email = loginEmailInput.value.trim();
    const senha = loginSenhaInput.value;
    const rememberMe = rememberMeCheckbox ? rememberMeCheckbox.checked : false;

    let contas = JSON.parse(localStorage.getItem("saulolabsContas")) || [];

    const contaEncontrada = contas.find(
      (conta) => conta.email === email && conta.senha === senha
    );

    if (contaEncontrada) {
      // Garante que as propriedades existam para contas antigas
      if (contaEncontrada.balance === undefined) {
        contaEncontrada.balance = 0;
      }
      if (contaEncontrada.redeemedGifts === undefined) {
        contaEncontrada.redeemedGifts = [];
      }
      if (contaEncontrada.purchasedGames === undefined) {
        contaEncontrada.purchasedGames = [];
      }
      if (contaEncontrada.descontoAtivoPercentual === undefined) {
        contaEncontrada.descontoAtivoPercentual = 0; // Garante a propriedade para contas antigas
      }
      // Salva a conta atualizada de volta no localStorage (necessário se propriedades foram adicionadas)
      localStorage.setItem("saulolabsContas", JSON.stringify(contas));

      alert(
        "Login bem-sucedido! Bem-vindo(a), " + contaEncontrada.username + "!"
      );

      currentLoggedInUser = contaEncontrada; // Define o usuário logado em memória
      descontoPercentual = currentLoggedInUser.descontoAtivoPercentual;

      if (rememberMe) {
        localStorage.setItem("saulolabsLoggedIn", "true");
        localStorage.setItem("saulolabsUsername", currentLoggedInUser.username);
      } else {
        localStorage.removeItem("saulolabsLoggedIn");
        localStorage.removeItem("saulolabsUsername");
      }

      showLibraryScreen(currentLoggedInUser); // Exibe a tela da biblioteca com o usuário logado
      loginEmailInput.value = "";
      loginSenhaInput.value = "";
    } else {
      alert("E-mail ou senha incorretos. Tente novamente.");
    }
  });

  // --- Verifica o status de login ao carregar a página ---
  window.addEventListener("load", function () {
    const isLoggedIn = localStorage.getItem("saulolabsLoggedIn");
    const storedUsername = localStorage.getItem("saulolabsUsername");

    if (isLoggedIn === "true" && storedUsername) {
      let contas = JSON.parse(localStorage.getItem("saulolabsContas")) || [];
      const liveUserAccount = contas.find(
        (account) => account.username === storedUsername
      );

      if (liveUserAccount) {
        currentLoggedInUser = liveUserAccount;
        if (currentLoggedInUser.descontoAtivoPercentual !== undefined) {
          descontoPercentual = currentLoggedInUser.descontoAtivoPercentual;
        } else {
          descontoPercentual = 0; // Define como 0 se a propriedade ainda não existir (para contas antigas)
        }
        showLibraryScreen(currentLoggedInUser); // Exibe a biblioteca se o usuário está logado
      } else {
        console.warn(
          "Usuário logado encontrado no localStorage, mas a conta não existe mais nas contas salvas. Desconectando..."
        );
        showMainScreen(); // Se o usuário logado não for encontrado, desloga
      }
    } else {
      descontoPercentual = 0;
      showMainScreen(); // Se não há login persistente, mostra a tela principal
    }
  });

  // --- Configuração dos Listeners para os Menus de Perfil (Biblioteca e Configurações) ---
  function setupProfileListeners(
    userProfileCornerElement,
    logoutMenuElement,
    settingsButtonElement,
    giftCardsButtonElement,
    saldoButtonElement
  ) {
    if (userProfileCornerElement && logoutMenuElement) {
      userProfileCornerElement.addEventListener("click", function (event) {
        // Impede que o clique dentro do menu feche-o imediatamente
        if (logoutMenuElement.contains(event.target)) {
          return;
        }
        logoutMenuElement.classList.toggle("is-active");
        if (logoutMenuElement.classList.contains("is-active")) {
          logoutMenuElement.style.display = "flex";
        } else {
          setTimeout(() => {
            logoutMenuElement.style.display = "none";
          }, 300);
        }
      });

      // Fecha o menu se clicar fora dele
      document.addEventListener("click", function (event) {
        if (
          logoutMenuElement.classList.contains("is-active") &&
          !userProfileCornerElement.contains(event.target) &&
          !logoutMenuElement.contains(event.target)
        ) {
          logoutMenuElement.classList.remove("is-active");
          setTimeout(() => {
            logoutMenuElement.style.display = "none";
          }, 300);
        }
      });
    }

    // Listener para o botão de Logout
    const currentLogoutButton = logoutMenuElement
      ? logoutMenuElement.querySelector(".logout-button")
      : null;
    if (currentLogoutButton) {
      currentLogoutButton.addEventListener("click", function () {
        localStorage.removeItem("saulolabsLoggedIn");
        localStorage.removeItem("saulolabsUsername");
        currentLoggedInUser = null;
        alert("Você foi desconectado(a) com sucesso!");
        showMainScreen(); // Volta para a tela principal
        updateConsoleStorageInfo();
      });
    }

    // Listener para o botão de Configurações
    if (settingsButtonElement) {
      settingsButtonElement.addEventListener("click", function () {
        if (currentLoggedInUser) {
          showSettingsScreen(currentLoggedInUser);
        }
      });
    }

    // Listener para o botão de Gift Cards
    if (giftCardsButtonElement) {
      giftCardsButtonElement.addEventListener("click", function () {
        // A lógica de setar 'lastScreenBeforeGiftCards' foi movida para os listeners dos botões giftCardsBtnBiblioteca e giftCardsBtnSettings
        showGiftCardsScreen();
      });
    }

    // Listener para o botão de Saldo
    if (saldoButtonElement) {
      saldoButtonElement.addEventListener("click", function () {
        // A lógica de setar 'lastScreenBeforeSaldo' foi movida para os listeners dos botões saldoBtnBiblioteca e saldoBtnSettings
        showSaldoScreen();
      });
    }
  }

  // Aplica os listeners aos perfis da Biblioteca e Configurações
  setupProfileListeners(
    userProfileCornerBiblioteca,
    logoutMenuBiblioteca,
    settingsButtonBiblioteca,
    giftCardsBtnBiblioteca,
    saldoBtnBiblioteca
  );

  setupProfileListeners(
    userProfileCornerSettings,
    logoutMenuSettings,
    settingsButtonSettings,
    giftCardsBtnSettings,
    saldoBtnSettings
  );

  // --- Lógica de Mudança de Foto de Perfil ---
  if (changePhotoButton) {
    changePhotoButton.addEventListener("click", function () {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = "image/png, image/jpeg"; // Aceita apenas PNG e JPEG

      fileInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
          const MAX_FILE_SIZE_MB = 5;
          if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            alert(
              `A imagem selecionada é muito grande (${(
                file.size /
                (1024 * 1024)
              ).toFixed(
                2
              )}MB). Por favor, escolha uma imagem menor que ${MAX_FILE_SIZE_MB}MB.`
            );
            return;
          }

          const reader = new FileReader();

          reader.onload = function (e) {
            const imageDataUrl = e.target.result;

            const img = new Image();
            img.onload = function () {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");

              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
              let width = img.width;
              let height = img.height;

              // Redimensiona a imagem para caber nas dimensões máximas mantendo a proporção
              if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                if (width > height) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                } else {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;

              ctx.drawImage(img, 0, 0, width, height);

              // Converte a imagem redimensionada para Data URL (JPEG com qualidade 0.8)
              const resizedImageDataUrl = canvas.toDataURL("image/jpeg", 0.8);

              // Atualiza as imagens de perfil na interface
              if (profileImageBiblioteca) {
                profileImageBiblioteca.src = resizedImageDataUrl;
              }
              if (profileImageSettings) {
                profileImageSettings.src = resizedImageDataUrl;
              }

              // Salva a imagem redimensionada no localStorage associada ao usuário logado
              if (currentLoggedInUser) {
                const profileImageKey = `saulolabsProfileImage_${currentLoggedInUser.username}`;
                try {
                  localStorage.setItem(profileImageKey, resizedImageDataUrl);
                  updateConsoleStorageInfo(); // Atualiza informações de armazenamento
                } catch (e) {
                  if (e.name === "QuotaExceededError") {
                    alert(
                      "Erro: A imagem é muito grande para ser armazenada no seu navegador. Por favor, escolha uma imagem menor ou libere espaço."
                    );
                  } else {
                    console.error("Erro ao salvar imagem de perfil:", e);
                    alert("Ocorreu um erro ao salvar a imagem de perfil.");
                  }
                }
              }
            };
            img.src = imageDataUrl;
          };
          reader.readAsDataURL(file); // Lê o arquivo como Data URL
        }
      });
      fileInput.click(); // Abre o seletor de arquivos
    });
  }

  // --- Lógica para marcar jogos como "adquiridos" ou "comprar" ---
  function applyGameStatus() {
    const gameCards = document.querySelectorAll(".game-card");

    gameCards.forEach((card) => {
      const gameId = card.dataset.gameId;
      const gamePriceElement = card.querySelector(".game-price");
      const downloadButton = card.querySelector(".download-button");
      // O dataset.price é crucial para armazenar o preço original no HTML
      const originalPrice = card.dataset.price; // Use card.dataset.price instead of gamePriceElement.dataset.price

      // Remover todos os listeners de clique existentes antes de adicionar novos
      // Isso evita que múltiplos listeners se acumulem com cada chamada de applyGameStatus
      if (downloadButton) {
        downloadButton.removeEventListener("click", handlePlayGame);
        downloadButton.removeEventListener("click", handlePurchaseAttempt);
        downloadButton.removeEventListener("click", handleLoginPrompt);
      }

      if (gameId && downloadButton) {
        // Recalcule o preço com desconto AQUI, usando a variável global descontoPercentual
        const precoComDescontoAtual = parseFloat(
          (
            MINECRAFT_PRICE_ORIGINAL -
            MINECRAFT_PRICE_ORIGINAL * (descontoPercentual / 100)
          ).toFixed(2)
        );

        if (
          currentLoggedInUser &&
          currentLoggedInUser.purchasedGames &&
          currentLoggedInUser.purchasedGames.includes(gameId)
        ) {
          // Jogo já adquirido
          if (gamePriceElement) {
            gamePriceElement.textContent = "Adquirido";
            gamePriceElement.style.color = "#4CAF50"; // Verde
            gamePriceElement.style.fontSize = "0.5em";
          }
          downloadButton.textContent = "Reinstalar";
          downloadButton.style.borderColor = "#00bcd4";
          downloadButton.style.color = "#00bcd4";
          downloadButton.style.boxShadow = "0 0 10px rgba(0, 188, 212, 0.8);";
          downloadButton.addEventListener("click", handlePlayGame); // Adiciona o listener de jogar
        } else if (currentLoggedInUser) {
          // Usuário logado, mas não tem o jogo - mostrar opção de compra
          if (gamePriceElement) {
            // Use o preço com desconto aqui
            gamePriceElement.textContent = `R$ ${precoComDescontoAtual
              .toFixed(2)
              .replace(".", ",")}`;
            gamePriceElement.style.color = ""; // Remove cor personalizada
            gamePriceElement.style.fontSize = ""; // Volta ao tamanho original
          }
          downloadButton.textContent = "Comprar";
          downloadButton.style.borderColor = "#007bff"; // Azul para "Comprar"
          downloadButton.style.color = "#007bff"; // Azul para "Comprar"
          downloadButton.style.boxShadow = "0 0 15px rgba(0, 123, 255, 0.5)";
          downloadButton.addEventListener("click", handlePurchaseAttempt); // Adiciona o listener de compra
        } else {
          // Ninguém logado - mostrar "Baixar Jogo" e instrução de login
          if (gamePriceElement) {
            // Use o preço com desconto aqui também, para consistência
            gamePriceElement.textContent = `R$ ${precoComDescontoAtual
              .toFixed(2)
              .replace(".", ",")}`; // Mostra o preço com desconto mesmo se não logado
            gamePriceElement.style.color = "";
            gamePriceElement.style.fontSize = "";
          }
          downloadButton.textContent = "Baixar Jogo"; // Texto padrão
          downloadButton.style.borderColor = ""; // Remove cor personalizada
          downloadButton.style.color = ""; // Remove cor personalizada
          downloadButton.style.boxShadow = ""; // Remove sombra personalizada
          downloadButton.addEventListener("click", handleLoginPrompt); // Adiciona o listener para o prompt de login
        }
      }
    });
  }

  // --- Funções de manipulação do jogo ---
  function handlePlayGame(event) {
    const button = event.target;
    const gameCard = button.closest(".game-card");
    const gameId = gameCard.dataset.gameId;

    if (gameId === "minecraft-copia") {
      // Alerta informando que o download será iniciado
      alert(
        "O download do instalador do Minecraft (Cópia) será iniciado novamente."
      );
      // Inicia o download do instalador NSIS
      window.open(MINECRAFT_DOWNLOAD_URL, "_blank");
    } else {
      alert(
        `Iniciando ${gameId}... (Funcionalidade de jogo real não implementada. O download não será iniciado para este jogo.)`
      );
    }
  }
  function handlePurchaseAttempt(event) {
    const button = event.target;
    const gameCard = button.closest(".game-card");
    const gameId = gameCard.dataset.gameId;
    // Defina a URL do seu instalador NSIS aqui
    const MINECRAFT_DOWNLOAD_URL = "Downloads/MinecraftCopia_Setup.exe";

    if (!currentLoggedInUser) {
      alert("Por favor, faça login para comprar este jogo.");
      return;
    }

    if (gameId === "minecraft-copia") {
      // Recupere o preço original do Minecraft (você já tem a constante MINECRAFT_PRICE_ORIGINAL)
      const MINECRAFT_PRICE_ORIGINAL = 0.99; // Certifique-se que esta constante esteja acessível globalmente ou definida aqui.

      // >>>>> CALCULE O PREÇO ATUALIZADO COM DESCONTO AQUI <<<<<
      const precoAtualizadoMinecraft =
        MINECRAFT_PRICE_ORIGINAL -
        MINECRAFT_PRICE_ORIGINAL * (descontoPercentual / 100);

      // Primeiro, verifica se o usuário JÁ possui o jogo
      if (
        currentLoggedInUser.purchasedGames &&
        currentLoggedInUser.purchasedGames.includes(gameId)
      ) {
        alert(
          "Você já possui Minecraft (Cópia)! O download do instalador será iniciado novamente."
        );
        window.open(MINECRAFT_DOWNLOAD_URL, "_blank"); // Inicia o download do instalador
        return; // Sai da função, pois não é uma nova compra
      }

      // Se não possui, procede com a tentativa de compra
      // >>>>> USE 'precoAtualizadoMinecraft' AQUI <<<<<
      if (currentLoggedInUser.balance >= precoAtualizadoMinecraft) {
        if (
          confirm(
            `Comprar Minecraft (Cópia) por R$ ${precoAtualizadoMinecraft
              .toFixed(2)
              .replace(".", ",")}? ` +
              `Seu saldo atual é R$ ${currentLoggedInUser.balance
                .toFixed(2)
                .replace(".", ",")}.`
          )
        ) {
          // Simular compra: subtrai do saldo e adiciona o jogo à lista de jogos adquiridos
          currentLoggedInUser.balance -= precoAtualizadoMinecraft; // >>>>> AQUI TAMBÉM <<<<<
          if (!currentLoggedInUser.purchasedGames) {
            currentLoggedInUser.purchasedGames = [];
          }
          currentLoggedInUser.purchasedGames.push(gameId);

          // Atualiza o objeto do usuário no localStorage
          let contas =
            JSON.parse(localStorage.getItem("saulolabsContas")) || [];
          const userIndex = contas.findIndex(
            (c) => c.username === currentLoggedInUser.username
          );
          if (userIndex !== -1) {
            contas[userIndex] = currentLoggedInUser;
            localStorage.setItem("saulolabsContas", JSON.stringify(contas));
            updateBalanceDisplay(); // Atualiza o display de saldo
            applyGameStatus(); // Atualiza o status do botão para "Jogar"

            alert(
              `Minecraft (Cópia) comprado com sucesso! Seu novo saldo é R$ ${currentLoggedInUser.balance
                .toFixed(2)
                .replace(".", ",")}. O download do instalador será iniciado.`
            );

            // --- INICIA O DOWNLOAD DO INSTALADOR AQUI ---
            window.open(MINECRAFT_DOWNLOAD_URL, "_blank"); // Abre a URL do download em uma nova aba
            // Você pode querer resetar o desconto AQUI se o desconto for de uso único.
            // Se o desconto é persistente para a conta, não o resete aqui.
            // descontoPercentual = 0; // Descomente se o desconto for de uso único após a compra
          }
        }
      } else {
        alert(
          `Saldo insuficiente para comprar Minecraft (Cópia). Você precisa de R$ ${precoAtualizadoMinecraft
            .toFixed(
              // >>>>> AQUI TAMBÉM <<<<<
              2
            )
            .replace(".", ",")}, mas tem R$ ${currentLoggedInUser.balance
            .toFixed(2)
            .replace(".", ",")}.`
        );
      }
    } else {
      // Lógica para outros jogos, se houver
      alert("Funcionalidade de compra para outros jogos não implementada.");
    }
  }

  // Função para exibir o prompt de login quando o botão "Baixar Jogo" é clicado sem estar logado
  function handleLoginPrompt() {
    alert("Por favor, faça login para baixar ou jogar.");
  }

  // --- Adiciona os Event Listeners para os botões "Liberar Espaço" e "Contatar SAC" ---
  if (clearSpaceButton) {
    clearSpaceButton.addEventListener("click", showClearSpaceOverlay);
  }

  if (SACButton) {
    SACButton.addEventListener("click", showSACOverlay);
  }

  // --- NOVOS EVENT LISTENERS: BOTÕES DO SAC ---
  if (reclamacoesBtn) {
    reclamacoesBtn.addEventListener("click", function () {
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLSfUGONPLMjBPYaourOunjCD4EFLPmAZFsq0iAxKb5SXdu6s4g/viewform?usp=dialog",
        "_blank"
      );
    });
  }

  if (ideiasBtn) {
    ideiasBtn.addEventListener("click", function () {
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLSfvNu9oxndBvH-WmTivxEQaGYXz5FiLoia5k0M4-fpmMXIo0Q/viewform?usp=dialog",
        "_blank"
      );
    });
  }

  if (elogiosBtn) {
    elogiosBtn.addEventListener("click", function () {
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLSe82UkCB4hfsL1nlsGarBdfFM_0cdYpthCjuxsYMggW7gjr_Q/viewform?usp=dialog",
        "_blank"
      );
    });
  }
});
