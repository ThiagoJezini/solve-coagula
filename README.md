# Solve Coagula

RPG de Fantasia Urbana e Sombria sobre aprendizes de alquimistas que planejam e executam **Assaltos**.

A outrora sociedade dos alquimistas foi destruída por uma organização governamental chamada **"A Mão"**, que capturou todos os alquimistas com renome. Agora, seus aprendizes se organizam nas sombras para invadir os captos e libertar seus mestres.

Sistema **roll above** com atributos e magias interligadas, mundo brutalista e bizarramente mágico.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Supabase** (auth + DB)
- **Oxlint** (lint)
- Sem CSS framework — CSS custom escrito à mão pra manter a identidade visual

## Rodar localmente

```bash
npm install
npm run dev
```

App sobe em `http://localhost:5173`.

## Configurar Supabase

Crie `.env` na raiz:

```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxx
```

Crie as tabelas no Supabase (ver migrations se aplicável).

## Build

```bash
npm run build
npm run preview
```

## Deploy

Recomendado: [Vercel](https://vercel.com) ou [Netlify](https://netlify.com).
- Framework preset: Vite
- Build command: `npm run build`
- Output: `dist`
- Adicionar as env vars acima no painel

## Como jogar

1. Digite seu nome de jogador
2. Crie uma ficha nova ou abra uma existente
3. Preencha os 5 Pilares (CONSCIÊNCIA / ESPÍRITO / CORPO / NATUREZA / LEIS) com pontos 3/2/1/0/0
4. Descreva seu Foco (item canalizador)
5. Marque transmutações, maldições, ferimentos, vantagens/desvantagens conforme rola na mesa
6. Use a aba Motivação pra registrar as 5 perguntas e riscar conforme usa

## Estrutura

```
src/
├── components/    # CharacterSheet + seções (Pilares, Foco, Marcadores, etc)
├── lib/          # api, ferimentos, maldições, transmutações, vantagens
├── hooks/        # useDraggable (popups arrastáveis)
├── assets/       # PNGs dos símbolos dos pilares, texturas
└── types.ts      # tipos Supabase/Character
```

## Licença

Por definir.
