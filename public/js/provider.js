// ============================================================
// HUAMBO PLUS
// MÓDULO DO PRESTADOR DE SERVIÇOS
// ============================================================

(function () {
  'use strict';

  let currentUser = null;


  // ----------------------------------------------------------
  // Inicialização
  // ----------------------------------------------------------

  async function initializeProvider() {

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
        updateProviderStatus(currentUser);
      }

    } catch (error) {

      console.error(
        'Huambo Plus: erro ao inicializar prestador.',
        error
      );

    }

  }


  // ----------------------------------------------------------
  // Verificar papel
  // ----------------------------------------------------------

  function isProvider(user = currentUser) {

    if (!user) {
      return false;
    }

    return (
      user.user_metadata?.role === 'provider'
    );

  }


  // ----------------------------------------------------------
  // Estado do Prestador
  // ----------------------------------------------------------

  function getProviderStatus(
    user = currentUser
  ) {

    if (!user) {
      return null;
    }

    return (
      user.user_metadata?.status ||
      'pending'
    );

  }


  // ----------------------------------------------------------
  // Atualizar estado visual
  // ----------------------------------------------------------

  function updateProviderStatus(
    user = currentUser
  ) {

    if (!user) {
      return;
    }

    const status =
      getProviderStatus(user);

    const statusElement =
      document.getElementById(
        'providerStatus'
      );

    const messageElement =
      document.getElementById(
        'providerStatusMessage'
      );


    if (statusElement) {

      statusElement.classList.remove(
        'pending',
        'approved',
        'rejected'
      );


      if (
        status === 'approved'
      ) {

        statusElement.textContent =
          'Aprovado';

        statusElement.classList.add(
          'approved'
        );

      } else if (
        status === 'rejected'
      ) {

        statusElement.textContent =
          'Rejeitado';

        statusElement.classList.add(
          'rejected'
        );

      } else {

        statusElement.textContent =
          'Em análise';

        statusElement.classList.add(
          'pending'
        );

      }

    }


    if (messageElement) {

      if (status === 'approved') {

        messageElement.textContent =
          'A sua conta foi aprovada. Já pode utilizar as funcionalidades de prestador.';

      } else if (
        status === 'rejected'
      ) {

        messageElement.textContent =
          'A sua conta não foi aprovada. Consulte a administração para obter mais informações.';

      } else {

        messageElement.textContent =
          'Os seus documentos estão a ser analisados pela administração.';

      }

    }

  }


  // ----------------------------------------------------------
  // Utilizador atual
  // ----------------------------------------------------------

  function getCurrentUser() {
    return currentUser;
  }


  function setCurrentUser(user) {

    currentUser =
      user || null;

    if (currentUser) {
      updateProviderStatus(
        currentUser
      );
    }

  }


  // ----------------------------------------------------------
  // API pública
  // ----------------------------------------------------------

  window.HuamboProvider = {

    initialize:
      initializeProvider,

    getCurrentUser,

    setCurrentUser,

    isProvider,

    getProviderStatus,

    updateProviderStatus

  };


  // ----------------------------------------------------------
  // Inicialização
  // ----------------------------------------------------------

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initializeProvider
    );

  } else {

    initializeProvider();

  }

})();
