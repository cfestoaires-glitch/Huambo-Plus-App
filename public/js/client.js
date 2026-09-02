// ============================================================
// HUAMBO PLUS
// MÓDULO DO CLIENTE
// ============================================================

(function () {
  'use strict';

  let currentUser = null;


  // ----------------------------------------------------------
  // Inicialização
  // ----------------------------------------------------------

  async function initializeClient() {

    if (!window.huamboSupabase) {
      console.warn(
        'Huambo Plus: Supabase ainda não está disponível.'
      );
      return;
    }

    try {

      const {
        data,
        error
      } =
        await window.huamboSupabase.auth.getUser();

      if (error) {
        console.warn(
          'Huambo Plus: não foi possível obter o utilizador.',
          error
        );
        return;
      }

      currentUser = data?.user || null;

      if (currentUser) {
        console.log(
          'Huambo Plus: módulo do cliente preparado.'
        );
      }

    } catch (error) {

      console.error(
        'Huambo Plus: erro ao inicializar cliente.',
        error
      );

    }

  }


  // ----------------------------------------------------------
  // Obter utilizador atual
  // ----------------------------------------------------------

  function getCurrentUser() {
    return currentUser;
  }


  // ----------------------------------------------------------
  // Atualizar utilizador quando a sessão mudar
  // ----------------------------------------------------------

  function setCurrentUser(user) {
    currentUser = user || null;
  }


  // ----------------------------------------------------------
  // Verificar se o utilizador é Cliente
  // ----------------------------------------------------------

  function isClient(user = currentUser) {

    if (!user) {
      return false;
    }

    return (
      user.user_metadata?.role === 'client'
    );

  }


  // ----------------------------------------------------------
  // API pública do módulo
  // ----------------------------------------------------------

  window.HuamboClient = {

    initialize: initializeClient,

    getCurrentUser,

    setCurrentUser,

    isClient

  };


  // ----------------------------------------------------------
  // Inicializar depois do carregamento
  // ----------------------------------------------------------

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initializeClient
    );

  } else {

    initializeClient();

  }

})();
