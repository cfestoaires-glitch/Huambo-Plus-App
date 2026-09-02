// ============================================================
// HUAMBO PLUS
// MÓDULO ADMINISTRATIVO
// ============================================================

'use strict';


// ============================================================
// VARIÁVEIS
// ============================================================

let adminInitialized = false;

let adminCurrentUser = null;


// ============================================================
// CONFIGURAÇÃO
// ============================================================

const ADMIN_CONFIG = {

    role: 'admin',

    providerRole: 'provider',

    providerStatuses: {

        pending: 'pending',

        approved: 'approved',

        rejected: 'rejected',

        suspended: 'suspended',

    },

};


// ============================================================
// FUNÇÕES AUXILIARES
// ============================================================

function adminGetSupabase() {

    if (window.supabaseClient) {

        return window.supabaseClient;

    }

    if (window.supabase) {

        return window.supabase;

    }

    return null;
}


// ============================================================
// ELEMENTOS DO DOM
// ============================================================

function getAdminElement(id) {

    return document.getElementById(id);

}


// ============================================================
// MOSTRAR PAINEL
// ============================================================

function showAdminPanel() {

    const authSection =
        getAdminElement('authSection');

    const clientPanel =
        getAdminElement('clientPanel');

    const providerPanel =
        getAdminElement('providerPanel');

    const adminPanel =
        getAdminElement('adminPanel');


    if (authSection) {

        authSection.classList.add('hidden');

    }

    if (clientPanel) {

        clientPanel.classList.add('hidden');

    }

    if (providerPanel) {

        providerPanel.classList.add('hidden');

    }

    if (adminPanel) {

        adminPanel.classList.remove('hidden');

    }

}


// ============================================================
// ESCONDER PAINEL
// ============================================================

function hideAdminPanel() {

    const adminPanel =
        getAdminElement('adminPanel');


    if (adminPanel) {

        adminPanel.classList.add('hidden');

    }

}


// ============================================================
// OBTER ROLE DO UTILIZADOR
// ============================================================

function getUserRole(user) {

    if (!user) {

        return null;

    }


    const appMetadata =
        user.app_metadata || {};

    const userMetadata =
        user.user_metadata || {};


    return (

        appMetadata.role ||

        userMetadata.role ||

        null

    );

}


// ============================================================
// VERIFICAR SE É ADMINISTRADOR
// ============================================================

async function verifyAdminAccess(user) {

    if (!user) {

        return false;

    }


    const role =
        getUserRole(user);


    if (role === ADMIN_CONFIG.role) {

        return true;

    }


    // --------------------------------------------------------
    // Caso o projeto tenha uma tabela profiles,
    // tentamos verificar também através dela.
    //
    // Se a tabela ainda não existir, não interrompemos
    // a aplicação.
    // --------------------------------------------------------

    const client =
        adminGetSupabase();


    if (!client) {

        return false;

    }


    try {

        const result =
            await client
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();


        if (
            result &&
            !result.error &&
            result.data &&
            result.data.role === ADMIN_CONFIG.role
        ) {

            return true;

        }

    } catch (error) {

        console.warn(
            'Não foi possível verificar o perfil administrativo:',
            error
        );

    }


    return false;

}


// ============================================================
// INICIALIZAÇÃO DO MÓDULO
// ============================================================

async function initializeAdmin(user = null) {

    if (adminInitialized && user) {

        adminCurrentUser = user;

        return true;

    }


    adminCurrentUser = user;


    if (!user) {

        return false;

    }


    const hasAccess =
        await verifyAdminAccess(user);


    if (!hasAccess) {

        hideAdminPanel();

        console.warn(
            'Acesso administrativo recusado.'
        );

        return false;

    }


    adminInitialized = true;


    showAdminPanel();


    setupAdminEvents();


    return true;

}


// ============================================================
// CONFIGURAR EVENTOS
// ============================================================

function setupAdminEvents() {

    const logoutButton =
        getAdminElement('logoutAdmin');


    if (
        logoutButton &&
        !logoutButton.dataset.listenerAttached
    ) {

        logoutButton.addEventListener(
            'click',
            handleAdminLogout
        );


        logoutButton.dataset.listenerAttached =
            'true';

    }

}


// ============================================================
// LOGOUT
// ============================================================

async function handleAdminLogout() {

    const client =
        adminGetSupabase();


    if (!client) {

        console.error(
            'Cliente Supabase não disponível.'
        );

        return;

    }


    try {

        const { error } =
            await client.auth.signOut();


        if (error) {

            throw error;

        }


        adminCurrentUser = null;

        adminInitialized = false;


        hideAdminPanel();


        const authSection =
            getAdminElement('authSection');


        if (authSection) {

            authSection.classList.remove(
                'hidden'
            );

        }


        console.log(
            'Administrador terminou a sessão.'
        );


    } catch (error) {

        console.error(
            'Erro ao terminar sessão:',
            error
        );


        alert(
            'Não foi possível terminar a sessão. Tente novamente.'
        );

    }

}


// ============================================================
// OBTER PRESTADORES PENDENTES
// ============================================================

async function getPendingProviders() {

    const client =
        adminGetSupabase();


    if (!client) {

        throw new Error(
            'Cliente Supabase não disponível.'
        );

    }


    try {

        const { data, error } =
            await client
                .from('profiles')
                .select('*')
                .eq(
                    'role',
                    ADMIN_CONFIG.providerRole
                )
                .eq(
                    'provider_status',
                    ADMIN_CONFIG.providerStatuses.pending
                )
                .order(
                    'created_at',
                    {
                        ascending: false
                    }
                );


        if (error) {

            throw error;

        }


        return data || [];


    } catch (error) {

        console.error(
            'Erro ao carregar prestadores:',
            error
        );


        return [];

    }

}


// ============================================================
// ATUALIZAR ESTADO DO PRESTADOR
// ============================================================

async function updateProviderStatus(
    providerId,
    status
) {

    if (!providerId) {

        throw new Error(
            'ID do prestador não fornecido.'
        );

    }


    const validStatuses = [

        ADMIN_CONFIG.providerStatuses.pending,

        ADMIN_CONFIG.providerStatuses.approved,

        ADMIN_CONFIG.providerStatuses.rejected,

        ADMIN_CONFIG.providerStatuses.suspended,

    ];


    if (!validStatuses.includes(status)) {

        throw new Error(
            'Estado de prestador inválido.'
        );

    }


    const client =
        adminGetSupabase();


    if (!client) {

        throw new Error(
            'Cliente Supabase não disponível.'
        );

    }


    const hasAccess =
        await verifyAdminAccess(
            adminCurrentUser
        );


    if (!hasAccess) {

        throw new Error(
            'Sem autorização administrativa.'
        );

    }


    const { data, error } =
        await client
            .from('profiles')
            .update({

                provider_status:
                    status,

                updated_at:
                    new Date().toISOString(),

            })
            .eq(
                'id',
                providerId
            )
            .eq(
                'role',
                ADMIN_CONFIG.providerRole
            )
            .select()
            .maybeSingle();


    if (error) {

        console.error(
            'Erro ao atualizar prestador:',
            error
        );

        throw error;

    }


    return data;

}


// ============================================================
// APROVAR PRESTADOR
// ============================================================

async function approveProvider(
    providerId
) {

    return updateProviderStatus(

        providerId,

        ADMIN_CONFIG.providerStatuses.approved

    );

}


// ============================================================
// REJEITAR PRESTADOR
// ============================================================

async function rejectProvider(
    providerId
) {

    return updateProviderStatus(

        providerId,

        ADMIN_CONFIG.providerStatuses.rejected

    );

}


// ============================================================
// SUSPENDER PRESTADOR
// ============================================================

async function suspendProvider(
    providerId
) {

    return updateProviderStatus(

        providerId,

        ADMIN_CONFIG.providerStatuses.suspended

    );

}


// ============================================================
// REATIVAR PRESTADOR
// ============================================================

async function reactivateProvider(
    providerId
) {

    return updateProviderStatus(

        providerId,

        ADMIN_CONFIG.providerStatuses.approved

    );

}


// ============================================================
// VERIFICAR SESSÃO ATUAL
// ============================================================

async function checkAdminSession() {

    const client =
        adminGetSupabase();


    if (!client) {

        console.warn(
            'Supabase ainda não está disponível.'
        );

        return false;

    }


    try {

        const { data, error } =
            await client.auth.getUser();


        if (error) {

            return false;

        }


        if (!data || !data.user) {

            return false;

        }


        return initializeAdmin(
            data.user
        );


    } catch (error) {

        console.error(
            'Erro ao verificar sessão administrativa:',
            error
        );


        return false;

    }

}


// ============================================================
// OBSERVAR ALTERAÇÕES DE AUTENTICAÇÃO
// ============================================================

function listenAdminAuthChanges() {

    const client =
        adminGetSupabase();


    if (!client) {

        return;

    }


    client.auth.onAuthStateChange(
        async (event, session) => {

            if (
                event === 'SIGNED_OUT'
            ) {

                adminCurrentUser = null;

                adminInitialized = false;

                hideAdminPanel();

                return;

            }


            if (
                session &&
                session.user
            ) {

                const role =
                    getUserRole(
                        session.user
                    );


                if (
                    role ===
                    ADMIN_CONFIG.role
                ) {

                    await initializeAdmin(
                        session.user
                    );

                }

            }

        }
    );

}


// ============================================================
// UTILITÁRIOS ADMINISTRATIVOS
// ============================================================

function isAdminAuthenticated() {

    return (
        adminCurrentUser !== null &&
        adminInitialized === true
    );

}


function getCurrentAdmin() {

    return adminCurrentUser;

}


// ============================================================
// EXPOR FUNÇÕES GLOBALMENTE
// ============================================================
//
// Outros módulos da aplicação poderão utilizar
// estas funções quando necessário.
//

window.HuamboPlusAdmin = {

    initialize:
        initializeAdmin,

    checkSession:
        checkAdminSession,

    verifyAccess:
        verifyAdminAccess,

    getCurrentUser:
        getCurrentAdmin,

    isAuthenticated:
        isAdminAuthenticated,

    getPendingProviders:
        getPendingProviders,

    updateProviderStatus:
        updateProviderStatus,

    approveProvider:
        approveProvider,

    rejectProvider:
        rejectProvider,

    suspendProvider:
        suspendProvider,

    reactivateProvider:
        reactivateProvider,

};


// ============================================================
// INICIALIZAÇÃO AUTOMÁTICA
// ============================================================

document.addEventListener(
    'DOMContentLoaded',
    async () => {

        // Esperar o Supabase estar disponível.

        if (
            window.supabaseClient ||
            window.supabase
        ) {

            await checkAdminSession();

            listenAdminAuthChanges();

        }

    }
);


// ============================================================
// FIM DO MÓDULO ADMINISTRATIVO
// ============================================================
