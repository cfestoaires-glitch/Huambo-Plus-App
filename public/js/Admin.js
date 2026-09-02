// ============================================================
// HUAMBO PLUS
// MÓDULO DO ADMINISTRADOR
// ============================================================

(function () {
  'use strict';

  let currentUser = null;


  // ----------------------------------------------------------
  // Inicialização
  // ----------------------------------------------------------

  async function initializeAdmin() {

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

      currentUser =
        data?.user || null;

      if (currentUser) {

        console.log(
          'Huambo Plus: módulo administrativo preparado.'
        );

      }

    } catch (error) {

      console.error(
        'Huambo Plus: erro ao inicializar administrador.',
        error
      );

    }

  }


  // ----------------------------------------------------------
  // Verificar administrador
  // ----------------------------------------------------------

  function isAdmin(
    user = currentUser
  ) {

    if (!user) {
      return false;
    }

    return (
      user.user_metadata?.role === 'admin'
    );

  }


  // ----------------------------------------------------------
  // Obter utilizador atual
  // ----------------------------------------------------------

  function getCurrentUser() {
    return currentUser;
  }


  function setCurrentUser(user) {
    currentUser =
      user || null;
  }


  // ----------------------------------------------------------
  // API administrativa
  // ----------------------------------------------------------

  window.HuamboAdmin = {

    initialize:
      initializeAdmin,

    getCurrentUser,

    setCurrentUser,

    isAdmin

  };


  // ----------------------------------------------------------
  // Inicialização
  // ----------------------------------------------------------

  if (
    document.readyState === 'loading'
  ) {

    document.addEventListener(
      'DOMContentLoaded',
      initializeAdmin
    );

  } else {

    initializeAdmin();

  }

})();
