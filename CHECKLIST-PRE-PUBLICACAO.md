# Checklist pré-publicação — Projeto HS

## Obrigatório antes de divulgar

- [x] **Checkout:** `CHECKOUT_URL` configurada com o link da Cakto (`https://pay.cakto.com.br/39dauce_1277247`).
- [ ] **Testar a compra de ponta a ponta:** clicar em cada um dos 5 botões, concluir uma compra de teste e confirmar a entrega dos 3 PDFs.
- [ ] **Entrega:** configurar na plataforma o envio do manual principal, da edição mobile e da edição para impressão.
- [x] **Faixa de configuração:** some automaticamente com o checkout configurado (verificado).
- [ ] **Vendedor:** substituir `[PREENCHER] Nome ou razão social · CPF/CNPJ · E-mail de contato` no rodapé de `index.html` e na seção `#vendedor` de `legal.html`.
- [ ] **Termos de compra:** redigir em `legal.html#termos`.
- [ ] **Política de reembolso:** redigir em `legal.html#reembolso` e substituir o placeholder da última pergunta do FAQ em `index.html`. Considerar o direito de arrependimento do Código de Defesa do Consumidor (art. 49) para compras pela internet e as regras da plataforma escolhida.
- [ ] **Política de privacidade:** redigir em `legal.html#privacidade` (LGPD), citando a plataforma de checkout e qualquer ferramenta de analytics.
- [ ] **Domínio:** trocar `SEU-DOMINIO.com.br` em `canonical`, `og:url` e `og:image` (`index.html`).
- [ ] **Compartilhamento:** depois de publicar, testar o link no depurador de compartilhamento do Facebook e em uma mensagem de WhatsApp para ver a imagem `og-image.png`.

## Black Friday

- [ ] Guardar comprovação de que o Projeto HS foi vendido por R$69,90 antes da promoção (prints da plataforma, histórico de vendas). O preço anterior riscado precisa corresponder a um preço realmente praticado.
- [ ] Configurar o checkout para cobrar R$29,90 até 30/11 às 23:59 e voltar a R$69,90 depois (ou criar uma oferta com validade na plataforma).
- [ ] Conferir em 01/12 se a página voltou ao preço normal e se o checkout acompanha.
- [ ] Opcional: atualizar `og:title`/`og:description` com a oferta durante a campanha e reverter depois.

## Recomendado

- [ ] Rever se as informações de acesso exibidas pela plataforma (prazo de liberação, e-mail de entrega) batem com o FAQ "Como recebo o produto?".
- [ ] Se usar analytics/pixel: banner de consentimento, script da ferramenta e `ANALYTICS_ENABLED: true` (ver README).
- [ ] Usar links com UTM nas bios e vídeos (ex.: `?utm_source=tiktok&utm_medium=bio`) para saber qual rede vende mais.
- [ ] Testar em um celular Android e um iPhone reais, com 4G.
- [ ] Se os PDFs forem atualizados, regenerar as prévias da galeria (ver README).

## Já verificado nesta versão

- [x] Layout em 360, 390, 768 e 1440 px, sem rolagem horizontal.
- [x] CTA do hero visível na primeira tela nas quatro larguras (testado com tela de 800 px de altura no mobile e 900 px no desktop).
- [x] Os 5 CTAs apontam para a mesma URL; com a URL vazia, nenhum abre página.
- [x] Repasse de UTM para o checkout.
- [x] FAQ, seleção dos 14 dias, galeria (botões, toque e teclado), lightbox (abre e fecha com Esc).
- [x] Barra fixa mobile aparece no meio da página e some na oferta, no CTA final e no rodapé.
- [x] Prévias extraídas diretamente dos PDFs v1.2 e v1.2.1.
- [x] Sem imagens, logotipos ou marcas de jogos; sem depoimentos, contadores regressivos ou escassez artificial. O único desconto exibido é o da Black Friday, com âncora confirmada pelo vendedor.
- [x] Aviso de independência no rodapé.
- [x] Black Friday testada em 4 estados: campanha ativa (360–1440 px), âncora desligada, prévia por `#previa-black-friday` e depois do encerramento (volta a R$69,90). Mesmo preço, desconto e data no hero, na oferta e no CTA final; CTA do hero na primeira tela.
