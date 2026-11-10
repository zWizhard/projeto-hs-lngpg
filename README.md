# Projeto HS — Landing page de vendas

Página estática (HTML + CSS + JavaScript puro), sem framework, sem build e sem dependências externas. Funciona em qualquer hospedagem de arquivos estáticos.

## Estrutura

```
projeto-hs-landing/
├── index.html          Página de vendas (10 seções)
├── legal.html          Privacidade, termos, reembolso e vendedor (placeholders)
├── config.js           ÚNICO arquivo de configuração (checkout e analytics)
├── styles.css          Estilos (mobile-first, paleta e fontes do manual)
├── script.js           Interações: CTAs, 14 dias, galeria, lightbox, barra fixa
├── assets/
│   ├── favicon.svg, favicon-32.png, apple-touch-icon.png
│   ├── og-image.png    Imagem de compartilhamento 1200×630
│   ├── fonts/          Rajdhani, Inter, JetBrains Mono (WOFF2, licença OFL incluída)
│   └── img/            Prévias WebP renderizadas a partir dos PDFs v1.2 / v1.2.1
└── screenshots/        Capturas dos testes (não precisa ser publicada)
```

## 1. Conectar o checkout

Abra `config.js` e preencha:

```js
CHECKOUT_URL: "https://link-real-da-sua-plataforma"
```

- Os 5 botões de compra (hero, demonstração, oferta, CTA final e barra fixa mobile) usam essa mesma variável.
- Só URLs `https://` são aceitas.
- Parâmetros `utm_*`, `src` e `sck` da visita (ex.: `?utm_source=tiktok`) são repassados automaticamente ao checkout, para atribuição de vendas por canal.
- Enquanto `CHECKOUT_URL` estiver vazia, a página mostra uma faixa laranja de "modo de configuração" e os botões exibem um aviso em vez de abrir qualquer link. Nenhuma compra é simulada.
- `CHECKOUT_SAME_TAB: false` faz o checkout abrir em nova aba.

## 2. Publicar

Envie a pasta inteira (exceto `screenshots/` e este README, se preferir) para qualquer hospedagem estática:

- **Netlify / Vercel / Cloudflare Pages:** arraste a pasta ou conecte o repositório. Sem comando de build; diretório de publicação = raiz.
- **GitHub Pages:** suba os arquivos na branch configurada.
- **Hospedagem comum (cPanel/FTP):** copie os arquivos para `public_html/`.

Depois de publicar, edite em `index.html`:

- `<link rel="canonical">`, `og:url` e `og:image` → troque `SEU-DOMINIO.com.br` pelo domínio real (o Open Graph exige URL absoluta).

Teste local: `python3 -m http.server` dentro da pasta e acesse `http://localhost:8000`.

## 3. Analytics e pixel (opcional)

Nenhum rastreador é carregado hoje. Para ativar:

1. Implemente um banner de consentimento (LGPD) antes de qualquer tag.
2. Adicione o script da sua ferramenta (GTM, Meta Pixel, TikTok Pixel) após o consentimento.
3. Em `config.js`, mude `ANALYTICS_ENABLED` para `true`.

Os eventos são enviados para `window.dataLayer` (compatível com Google Tag Manager):

| Evento | Quando | Dados |
|---|---|---|
| `begin_checkout` | clique em qualquer botão de compra | `cta_location`, `value: 29.90`, `currency: "BRL"` |
| `view_day` | seleção de um dos 14 dias | `day` |
| `view_preview` | ampliação de uma prévia da galeria | `page` |
| `faq_open` | abertura de uma pergunta | `question` |

A função `track()` fica no topo de `script.js`, caso queira enviar para outra ferramenta.

## 4. Editar conteúdo

- **Textos:** direto em `index.html`; cada seção tem um comentário `<!-- ============ 0X ... -->`.
- **Dias do protocolo:** cada botão `.day` tem `data-title`, `data-mission` e `data-detail` (textos retirados das páginas 13–26 do manual).
- **Cores e fontes:** variáveis no topo de `styles.css` (`--black`, `--mint`, `--f-display`...).
- **Prévias:** se o PDF mudar, gere novas imagens. Exemplo com Poppler + Pillow:
  ```bash
  pdftoppm -r 170 -png -f 5 -l 5 -singlefile projeto-hs-v1.2.pdf pagina5
  python3 -c "from PIL import Image; im=Image.open('pagina5.png'); im.resize((560,792)).save('assets/img/manual-metodo-pare-560.webp', quality=82)"
  ```
  Mantenha as duas larguras (560 para a grade, 1200 para a ampliação).

## 5. Oferta de Black Friday

Tudo é controlado em `config.js` → `BLACK_FRIDAY`:

| Campo | Valor atual | Função |
|---|---|---|
| `ENABLED` | `true` | liga/desliga a campanha |
| `REGULAR_PRICE_WAS_PRACTICED` | `true` | confirma que o preço anterior foi realmente praticado. Com `false`, nada de "De/Por", % OFF ou economia aparece |
| `PRICE_REGULAR` | `69.90` | preço anterior (riscado) |
| `PRICE_PROMO` | `29.90` | preço promocional |
| `ENDS_AT` | `2026-11-30T23:59:59-03:00` | encerramento (horário de Brasília) |
| `LABEL` | `BLACK FRIDAY` | texto do selo |

- Desconto (57%, arredondado para baixo) e economia (R$40,00) são calculados a partir dos dois preços.
- A headline "AGORA POR MENOS DA METADE DO PREÇO" só é usada se o preço promocional for de fato menor que a metade do anterior.
- Durante a campanha: selo, "De/Por", economia, data de encerramento e reforço das 3 versões aparecem no hero, na oferta e no CTA final; os 5 botões passam a dizer "GARANTIR MEU PROJETO HS POR R$29,90".
- Depois de 30/11 às 23:59, a página volta sozinha ao layout normal com o preço habitual (R$69,90). Não há contador regressivo.
- **Ajuste também o preço na plataforma de checkout** nas mesmas datas: a página não altera o valor cobrado.
- `#previa-black-friday` no fim da URL mostra a oferta com uma faixa de aviso, útil para revisar o visual quando a âncora estiver desligada.

## Decisões técnicas

- **Sem React:** a página tem pouca interatividade; HTML/CSS/JS puros carregam mais rápido no 4G e publicam em qualquer lugar.
- **Fontes hospedadas localmente:** evita requisição a servidores de terceiros (desempenho e privacidade). Todas sob SIL Open Font License, uso comercial permitido.
- **Imagens WebP com `width`/`height`** e `loading="lazy"` fora do hero: layout estável e carregamento leve (≈ 1,6 MB de imagens no total, a maior parte só carregada sob demanda).
- **Acessibilidade:** link "pular para o conteúdo", foco visível, FAQ com `<details>` nativo, galeria navegável por setas e teclado, lightbox com `<dialog>` (fecha com Esc), `prefers-reduced-motion` respeitado, textos alternativos em todas as prévias.
