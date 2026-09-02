// ============================================================
// HUAMBO PLUS
// CONEXÃO COM SUPABASE
// ============================================================

(function () {
  'use strict';

  // Verificar se a biblioteca do Supabase foi carregada
  if (!window.supabase) {
    console.error(
      'Huambo Plus: biblioteca do Supabase não foi carregada.'
    );
    return;
  }

  // Verificar se a configuração existe
  if (
    typeof HUAMBO_PLUS_CONFIG === 'undefined'
  ) {
    console.error(
      'Huambo Plus: configuração do Supabase não encontrada.'
    );
    return;
  }

  const {
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  } = HUAMBO_PLUS_CONFIG;

  // Não iniciar enquanto a chave real não estiver configurada
  if (
    !SUPABASE_URL ||
    !SUPABASE_ANON_KEY ||
    SUPABASE_ANON_KEY === 'COLOCAR_CHAVE_SUPABASE_AQUI'
  ) {
    console.warn(
      'Huambo Plus: chave pública do Supabase ainda não configurada.'
    );
    return;
  }

  // Criar cliente Supabase
  window.huamboSupabase =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

  console.log(
    'Huambo Plus: conexão com Supabase preparada.'
  );
})();
