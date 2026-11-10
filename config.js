/* =========================================================================
   PROJETO HS — CONFIGURAÇÃO DA LANDING PAGE
   Este é o ÚNICO arquivo que precisa ser editado para conectar o checkout.
   ========================================================================= */

window.HS_CONFIG = {
  /* URL do checkout real (Hotmart, Kiwify, Eduzz, Mercado Pago, etc.).
     Enquanto estiver vazia, nenhum botão abre página externa: a página
     exibe um aviso de configuração pendente.
     Exemplo de formato (NÃO é um link real): "https://pay.suaplataforma.com/XXXXX" */
  CHECKOUT_URL: "https://pay.cakto.com.br/39dauce_1277247",

  /* ---------------------------------------------------------------
     PREÇOS E BLACK FRIDAY
     A oferta "De/Por", o % OFF, a economia e a headline promocional
     SÓ aparecem quando:
       1. ENABLED = true
       2. REGULAR_PRICE_WAS_PRACTICED = true  ← confirme somente se o
          produto foi de fato vendido por PRICE_REGULAR antes da promoção
          (preço anterior fictício é publicidade enganosa — CDC art. 37).
       3. a data atual for anterior a ENDS_AT.
     Fora dessas condições a página mostra o preço PRICE_PROMO como
     preço normal (se a âncora não foi praticada) ou PRICE_REGULAR
     (depois que a promoção terminar, com âncora confirmada).
     Desconto e economia são calculados automaticamente.
     Lembre de ajustar o preço também na plataforma de checkout.
     --------------------------------------------------------------- */
  BLACK_FRIDAY: {
    ENABLED: true,
    REGULAR_PRICE_WAS_PRACTICED: true,    // confirmado pelo vendedor em 03/11/2026: R$69,90 era o preço habitual
    PRICE_REGULAR: 69.90,                 // preço anterior (riscado)
    PRICE_PROMO: 29.90,                   // preço de Black Friday
    ENDS_AT: "2026-11-30T23:59:59-03:00", // encerramento: 30/11 às 23:59 (Brasília)
    LABEL: "BLACK FRIDAY"
  },

  /* Abrir o checkout na mesma aba (recomendado para mobile). */
  CHECKOUT_SAME_TAB: true,

  /* Analytics / pixel. Mantenha false até configurar o banner de
     consentimento e as ferramentas reais. Nenhum ID é incluído aqui.
     Quando true, os eventos são enviados para window.dataLayer
     (compatível com Google Tag Manager) — veja o README. */
  ANALYTICS_ENABLED: false
};
