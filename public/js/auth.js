// ============================================================
// HUAMBO PLUS
// AUTENTICAÇÃO E GESTÃO DE SESSÃO
// ============================================================

(function () {
  'use strict';

  // ----------------------------------------------------------
  // Estado
  // ----------------------------------------------------------

  let authInitialized = false;


  // ----------------------------------------------------------
  // Elementos da interface
  // ----------------------------------------------------------

  const elements = {};

  function initializeElements() {

    elements.authSection =
      document.getElementById('authSection');

    elements.authMessage =
      document.getElementById('authMessage');

    elements.userRole =
      document.getElementById('userRole');

    elements.email =
      document.getElementById('email');

    elements.password =
      document.getElementById('password');

    elements.providerFields =
      document.getElementById('providerFields');

    elements.selfieFile =
      document.getElementById('selfieFile');

    elements.biFile =
      document.getElementById('biFile');

    elements.companyFields =
      document.getElementById('companyFields');

    elements.companyName =
      document.getElementById('companyName');

    elements.companyDocument =
      document.getElementById('companyDocument');

    elements.loginBtn =
      document.getElementById('loginBtn');

    elements.signupBtn =
      document.getElementById('signupBtn');

    elements.clientPanel =
      document.getElementById('clientPanel');

    elements.providerPanel =
      document.getElementById('providerPanel');

    elements.companyPanel =
      document.getElementById('companyPanel');

    elements.adminPanel =
      document.getElementById('adminPanel');

    elements.logoutClient =
      document.getElementById('logoutClient');

    elements.logoutProvider =
      document.getElementById('logoutProvider');

    elements.logoutCompany =
      document.getElementById('logoutCompany');

    elements.logoutAdmin =
      document.getElementById('logoutAdmin');

    elements.clientWelcome =
      document.getElementById('clientWelcome');

    elements.providerWelcome =
      document.getElementById('providerWelcome');

    elements.companyWelcome =
      document.getElementById('companyWelcome');

  }


  // ----------------------------------------------------------
  // Mensagens
  // ----------------------------------------------------------

  function showMessage(
    message,
    type = 'error'
  ) {

    if (!elements.authMessage) {
      return;
    }

    elements.authMessage.textContent = message;

    elements.authMessage.classList.remove(
      'hidden',
      'success',
      'error',
      'warning'
    );

    elements.authMessage.classList.add(type);
  }


  function hideMessage() {

    if (!elements.authMessage) {
      return;
    }

    elements.authMessage.textContent = '';

    elements.authMessage.classList.add('hidden');

    elements.authMessage.classList.remove(
      'success',
      'error',
      'warning'
    );
  }


  // ----------------------------------------------------------
  // Estado dos botões
  // ----------------------------------------------------------

  function setLoading(
    button,
    loading,
    normalText
  ) {

    if (!button) {
      return;
    }

    button.disabled = loading;

    button.textContent =
      loading
        ? 'Aguarde...'
        : normalText;
  }


  // ----------------------------------------------------------
  // Mostrar / esconder painéis
  // ----------------------------------------------------------

  function hideAllPanels() {

    const panels = [
      elements.clientPanel,
      elements.providerPanel,
      elements.companyPanel,
      elements.adminPanel
    ];

    panels.forEach((panel) => {

      if (panel) {
        panel.classList.add('hidden');
      }

    });
  }


  function showAuth() {

    hideAllPanels();

    if (elements.authSection) {
      elements.authSection.classList.remove('hidden');
    }

  }


  // ----------------------------------------------------------
  // Obter papel do utilizador
  // ----------------------------------------------------------

  function getUserRole(user) {

    if (!user) {
      return 'client';
    }

    const metadata =
      user.user_metadata || {};

    const role =
      metadata.role;

    if (
      role === 'client' ||
      role === 'provider' ||
      role === 'company' ||
      role === 'admin'
    ) {
      return role;
    }

    return 'client';
  }


  // ----------------------------------------------------------
  // Redirecionamento interno
  // ----------------------------------------------------------

  function showUserPanel(user) {

    if (!user) {
      showAuth();
      return;
    }

    const role =
      getUserRole(user);

    hideMessage();

    if (elements.authSection) {
      elements.authSection.classList.add('hidden');
    }

    hideAllPanels();


    // --------------------------------------------------------
    // Cliente
    // --------------------------------------------------------

    if (role === 'client') {

      if (elements.clientPanel) {
        elements.clientPanel.classList.remove('hidden');
      }

      if (elements.clientWelcome) {

        elements.clientWelcome.textContent =
          `Bem-vindo ao Huambo Plus${user.email ? ', ' + user.email : ''}.`;

      }

      return;
    }


    // --------------------------------------------------------
    // Prestador
    // --------------------------------------------------------

    if (role === 'provider') {

      if (elements.providerPanel) {
        elements.providerPanel.classList.remove('hidden');
      }

      if (elements.providerWelcome) {

        elements.providerWelcome.textContent =
          `Conta de prestador: ${user.email || ''}`;

      }

      return;
    }


    // --------------------------------------------------------
    // Empresa
    // --------------------------------------------------------

    if (role === 'company') {

      if (elements.companyPanel) {
        elements.companyPanel.classList.remove('hidden');
      }

      if (elements.companyWelcome) {

        elements.companyWelcome.textContent =
          `Conta empresarial: ${user.email || ''}`;

      }

      return;
    }


    // --------------------------------------------------------
    // Administrador
    // --------------------------------------------------------

    if (role === 'admin') {

      if (elements.adminPanel) {
        elements.adminPanel.classList.remove('hidden');
      }

      return;
    }

  }


  // ----------------------------------------------------------
  // Validação de email
  // ----------------------------------------------------------

  function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      .test(email);

  }


  // ----------------------------------------------------------
  // Validação da conta
  // ----------------------------------------------------------

  function validateCredentials() {

    const email =
      elements.email.value.trim();

    const password =
      elements.password.value;


    if (!email) {

      showMessage(
        'Introduza o seu e-mail.',
        'warning'
      );

      return false;
    }


    if (!isValidEmail(email)) {

      showMessage(
        'Introduza um endereço de e-mail válido.',
        'warning'
      );

      return false;
    }


    if (!password) {

      showMessage(
        'Introduza a sua palavra-passe.',
        'warning'
      );

      return false;
    }


    if (password.length < 6) {

      showMessage(
        'A palavra-passe deve ter pelo menos 6 caracteres.',
        'warning'
      );

      return false;
    }


    return true;
  }


  // ----------------------------------------------------------
  // Mostrar campos de Prestador / Empresa
  // ----------------------------------------------------------

  function updateRoleFields() {

    const role =
      elements.userRole.value;


    if (elements.providerFields) {

      elements.providerFields.classList.toggle(
        'hidden',
        role !== 'provider'
      );

    }


    if (elements.companyFields) {

      elements.companyFields.classList.toggle(
        'hidden',
        role !== 'company'
      );

    }

  }


  // ----------------------------------------------------------
  // Validar documentos do Prestador
  // ----------------------------------------------------------

  function validateProviderFields() {

    const selfie =
      elements.selfieFile?.files?.[0];

    const bi =
      elements.biFile?.files?.[0];


    if (!selfie) {

      showMessage(
        'O prestador deve enviar uma selfie.',
        'warning'
      );

      return false;
    }


    if (!bi) {

      showMessage(
        'O prestador deve enviar o Bilhete de Identidade.',
        'warning'
      );

      return false;
    }


    if (!selfie.type.startsWith('image/')) {

      showMessage(
        'A selfie deve ser uma imagem válida.',
        'warning'
      );

      return false;
    }


    const validBi =
      bi.type.startsWith('image/') ||
      bi.type === 'application/pdf';


    if (!validBi) {

      showMessage(
        'O documento do BI deve ser uma imagem ou PDF.',
        'warning'
      );

      return false;
    }


    return true;
  }


  // ----------------------------------------------------------
  // Validar empresa
  // ----------------------------------------------------------

  function validateCompanyFields() {

    const companyName =
      elements.companyName.value.trim();

    const document =
      elements.companyDocument?.files?.[0];


    if (!companyName) {

      showMessage(
        'Introduza o nome da empresa.',
        'warning'
      );

      return false;
    }


    if (!document) {

      showMessage(
        'Envie o documento da empresa.',
        'warning'
      );

      return false;
    }


    return true;
  }


  // ----------------------------------------------------------
  // Criar caminho seguro para Storage
  // ----------------------------------------------------------

  function createStoragePath(
    userId,
    folder,
    file
  ) {

    const extension =
      file.name.includes('.')
        ? file.name
            .split('.')
            .pop()
            .toLowerCase()
        : 'bin';


    const randomPart =
      crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}`;


    return `${userId}/${folder}/${randomPart}.${extension}`;

  }


  // ----------------------------------------------------------
  // Upload de ficheiro
  // ----------------------------------------------------------

  async function uploadFile(
    userId,
    folder,
    file
  ) {

    const bucket =
      HUAMBO_PLUS_CONFIG
        .STORAGE_BUCKET_PROVIDER_DOCUMENTS;


    const path =
      createStoragePath(
        userId,
        folder,
        file
      );


    const {
      data,
      error
    } =
      await window.huamboSupabase
        .storage
        .from(bucket)
        .upload(
          path,
          file,
          {
            upsert: false
          }
        );


    if (error) {
      throw error;
    }


    return data.path;

  }


  // ----------------------------------------------------------
  // Registo
  // ----------------------------------------------------------

  async function signUp() {

    hideMessage();

    if (!validateCredentials()) {
      return;
    }


    const role =
      elements.userRole.value;


    if (role === 'provider') {

      if (!validateProviderFields()) {
        return;
      }

    }


    if (role === 'company') {

      if (!validateCompanyFields()) {
        return;
      }

    }


    setLoading(
      elements.signupBtn,
      true,
      'Criar Nova Conta'
    );


    try {

      // ------------------------------------------------------
      // Primeiro criar a conta
      // ------------------------------------------------------

      const {
        data,
        error
      } =
      await window.huamboSupabase.auth.signUp({

        email:
          elements.email.value.trim(),

        password:
          elements.password.value,

        options: {

          data: {

            role: role,

            status:
              role === 'provider' ||
              role === 'company'
                ? 'pending'
                : 'active',

            company_name:
              role === 'company'
                ? elements.companyName.value.trim()
                : null

          }

        }

      });


      if (error) {
        throw error;
      }


      const user =
        data?.user;


      if (!user) {

        throw new Error(
          'Não foi possível obter o utilizador criado.'
        );

      }


      // ------------------------------------------------------
      // Upload do Prestador
      // ------------------------------------------------------

      if (role === 'provider') {

        try {

          const selfiePath =
            await uploadFile(
              user.id,
              'selfie',
              elements.selfieFile.files[0]
            );


          const biPath =
            await uploadFile(
              user.id,
              'bi',
              elements.biFile.files[0]
            );


          // Guardar apenas os caminhos.
          // As políticas do Storage serão configuradas
          // posteriormente no Supabase.

          const {
            error: metadataError
          } =
          await window.huamboSupabase.auth.updateUser({

            data: {

              role: 'provider',

              status: 'pending',

              selfie_path:
                selfiePath,

              bi_path:
                biPath

            }

          });


          if (metadataError) {
            throw metadataError;
          }


        } catch (uploadError) {

          console.error(
            'Erro no upload:',
            uploadError
          );


          showMessage(
            'A conta foi criada, mas houve um problema ao enviar os documentos. A configuração do Storage será concluída antes do sistema entrar em produção.',
            'warning'
          );

          return;
        }

      }


      // ------------------------------------------------------
      // Upload da documentação da empresa
      // ------------------------------------------------------

      if (role === 'company') {

        try {

          const documentPath =
            await uploadFile(
              user.id,
              'company',
              elements.companyDocument.files[0]
            );


          const {
            error: metadataError
          } =
          await window.huamboSupabase.auth.updateUser({

            data: {

              role: 'company',

              status: 'pending',

              company_name:
                elements.companyName.value.trim(),

              company_document_path:
                documentPath

            }

          });


          if (metadataError) {
            throw metadataError;
          }


        } catch (uploadError) {

          console.error(
            'Erro no upload da empresa:',
            uploadError
          );


          showMessage(
            'A conta foi criada, mas houve um problema ao enviar a documentação da empresa.',
            'warning'
          );

          return;
        }

      }


      // ------------------------------------------------------
      // Resultado
      // ------------------------------------------------------

      showMessage(
        role === 'client'
          ? 'Conta criada com sucesso. Pode entrar na plataforma.'
          : 'Conta criada com sucesso. O seu perfil ficará pendente de validação pela administração.',
        'success'
      );


      // Limpar palavra-passe
      elements.password.value = '';


    } catch (error) {

      console.error(
        'Erro no registo:',
        error
      );


      showMessage(
        translateAuthError(error),
        'error'
      );


    } finally {

      setLoading(
        elements.signupBtn,
        false,
        'Criar Nova Conta'
      );

    }

  }


  // ----------------------------------------------------------
  // Login
  // ----------------------------------------------------------

  async function signIn() {

    hideMessage();

    if (!validateCredentials()) {
      return;
    }


    setLoading(
      elements.loginBtn,
      true,
      'Entrar na Conta'
    );


    try {

      const {
        data,
        error
      } =
      await window.huamboSupabase.auth
        .signInWithPassword({

          email:
            elements.email.value.trim(),

          password:
            elements.password.value

        });


      if (error) {
        throw error;
      }


      if (!data?.user) {

        throw new Error(
          'Não foi possível iniciar a sessão.'
        );

      }


      showUserPanel(
        data.user
      );


    } catch (error) {

      console.error(
        'Erro no login:',
        error
      );


      showMessage(
        translateAuthError(error),
        'error'
      );


    } finally {

      setLoading(
        elements.loginBtn,
        false,
        'Entrar na Conta'
      );

    }

  }


  // ----------------------------------------------------------
  // Logout
  // ----------------------------------------------------------

  async function signOut() {

    try {

      const {
        error
      } =
      await window.huamboSupabase
        .auth
        .signOut();


      if (error) {
        throw error;
      }


      showAuth();

      window.location.reload();


    } catch (error) {

      console.error(
        'Erro ao terminar sessão:',
        error
      );


      alert(
        'Não foi possível terminar a sessão corretamente.'
      );

    }

  }


  // ----------------------------------------------------------
  // Verificar sessão existente
  // ----------------------------------------------------------

  async function checkExistingSession() {

    try {

      const {
        data,
        error
      } =
      await window.huamboSupabase
        .auth
        .getSession();


      if (error) {
        throw error;
      }


      if (data?.session?.user) {

        showUserPanel(
          data.session.user
        );

      } else {

        showAuth();

      }


    } catch (error) {

      console.error(
        'Erro ao verificar sessão:',
        error
      );

      showAuth();

    }

  }


  // ----------------------------------------------------------
  // Alterações de autenticação
  // ----------------------------------------------------------

  function registerAuthListener() {

    window.huamboSupabase.auth
      .onAuthStateChange(
        (event, session) => {

          console.log(
            'Evento de autenticação:',
            event
          );


          if (
            event === 'SIGNED_IN' &&
            session?.user
          ) {

            showUserPanel(
              session.user
            );

          }


          if (
            event === 'SIGNED_OUT'
          ) {

            showAuth();

          }

        }
      );

  }


  // ----------------------------------------------------------
  // Traduzir erros comuns do Supabase
  // ----------------------------------------------------------

  function translateAuthError(error) {

    const message =
      error?.message || 'Ocorreu um erro.';


    const normalized =
      message.toLowerCase();


    if (
      normalized.includes(
        'invalid login credentials'
      )
    ) {

      return 'E-mail ou palavra-passe inc
