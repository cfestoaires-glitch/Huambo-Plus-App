// ============================================================
// HUAMBO PLUS
// CONFIGURAÇÃO PRINCIPAL
// ============================================================

const HUAMBO_PLUS_CONFIG = {

  // ----------------------------------------------------------
  // Supabase
  // ----------------------------------------------------------

  SUPABASE_URL:
    'https://vpukkvxnlwyhoqpgckzh.supabase.co',

  SUPABASE_ANON_KEY:
    'COLOCAR_CHAVE_SUPABASE_AQUI',

  // ----------------------------------------------------------
  // Aplicação
  // ----------------------------------------------------------

  APP_NAME: 'Huambo Plus',

  APP_VERSION: '1.0.0',

  // ----------------------------------------------------------
  // Storage
  // ----------------------------------------------------------

  STORAGE_BUCKET_PROVIDER_DOCUMENTS:
    'documentos-prestadores',

  STORAGE_BUCKET_CHAT_MEDIA:
    'chat-media',

  // ----------------------------------------------------------
  // Limites de ficheiros
  // ----------------------------------------------------------

  MAX_IMAGE_SIZE_MB: 10,

  MAX_VIDEO_SIZE_MB: 50,

  MAX_DOCUMENT_SIZE_MB: 10,

  // ----------------------------------------------------------
  // Segurança do chat
  // ----------------------------------------------------------

  BLOCK_EXTERNAL_LINKS: true,

  BLOCK_PHONE_NUMBERS: true,

  BLOCK_SOCIAL_NETWORKS: true,

  BLOCK_CONTACT_BYPASS: true

};
