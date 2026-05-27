import { Product, CommitLog } from './types';

export const MENU_PRODUCTS: Product[] = [
  // SALGADOS
  {
    id: 'carne_v1',
    name: 'Pastel de Carne (v1.0)',
    version: 'v1.0.4-stable',
    category: 'salgado',
    description: 'O clássico de feira. Carne moída refogada de primeira, cebolinha, fatias de ovo cozido e azeitona verde picada.',
    price: 11.00,
    tags: ['// legacy', '// meat', '// popular'],
    originalIngredients: ['Carne moída', 'Cebolinha', 'Ovo cozido', 'Azeitona verde'],
    sizeMultiplier: { P: 0.8, M: 1.0, G: 1.4 }
  },
  {
    id: 'queijo_v2',
    name: 'Pastel de Queijo (v2.0)',
    version: 'v2.1.2-hotfix',
    category: 'salgado',
    description: 'Muçarela premium derretendo com pitada de orégano. Sem firulas, alta consistência e sem quebras de serviço.',
    price: 11.00,
    tags: ['// stable', '// cheese', '// favorite'],
    originalIngredients: ['Queijo muçarela', 'Orégano'],
    sizeMultiplier: { P: 0.8, M: 1.0, G: 1.4 }
  },
  {
    id: 'frango_catupiry',
    name: 'Frango com Catupiry (Merge Conflict)',
    version: 'v3.0.0-rc1',
    category: 'salgado',
    description: 'Frango desfiado suculento com Catupiry original. O conflito mais gostoso que você já tentou resolver no terminal.',
    price: 13.00,
    tags: ['// merge-ready', '// chicken'],
    originalIngredients: ['Frango desfiado', 'Catupiry original', 'Milho', 'Temperos especiais'],
    sizeMultiplier: { P: 0.8, M: 1.0, G: 1.4 }
  },
  {
    id: 'stackoverflow',
    name: 'De Tudo um Pouco (StackOverflow)',
    version: 'v5.9.9-oom',
    category: 'salgado',
    description: 'Carne moída, queijo muçarela, presunto defumado, ovo cozidinho, palmito pupunha fresquinho, milho e pedacinhos de bacon bem crocantes. Estouro de pilha de sabor!',
    price: 18.00,
    tags: ['// out-of-memory', '// mega', '// best-seller'],
    originalIngredients: ['Carne moída', 'Muçarela', 'Presunto', 'Ovo', 'Palmito', 'Milho', 'Bacon'],
    sizeMultiplier: { P: 0.85, M: 1.0, G: 1.35 }
  },
  {
    id: 'calabresa_queijo',
    name: 'Calabresa com Queijo (Sass/Stylus)',
    version: 'v1.4.2',
    category: 'salgado',
    description: 'Calabresa moída fresca grelhada na chapa combinada com o queijo muçarela e molho de cebola roxa picada.',
    price: 13.00,
    tags: ['// stylish', '// spicy'],
    originalIngredients: ['Calabresa moída', 'Muçarela', 'Cebola roxa'],
    sizeMultiplier: { P: 0.8, M: 1.0, G: 1.4 }
  },
  {
    id: 'palmito_vegano',
    name: 'Vegano de Palmito (OpenSource)',
    version: 'v1.0.0-free',
    category: 'salgado',
    description: 'Palmito pupunha macio, tomate cereja confitado, azeite extra virgem e pitadas de orégano. Aberto ao desenvolvimento digestivo de todos.',
    price: 14.00,
    tags: ['// free-to-eat', '// vegan', '// plant-based'],
    originalIngredients: ['Palmito pupunha', 'Tomate cereja', 'Azeite', 'Orégano'],
    sizeMultiplier: { P: 0.8, M: 1.0, G: 1.4 }
  },
  {
    id: 'pizza_localhost',
    name: 'Pastel de Pizza (Localhost 127.0.0.1)',
    version: 'v1.2.7_0',
    category: 'salgado',
    description: 'Presunto defumado, queijo muçarela abundante, rodelas de tomate fresco e folhas de manjericão. Rápido de rodar na sua máquina local.',
    price: 12.00,
    tags: ['// home-sweet-home', '// quick-setup'],
    originalIngredients: ['Presunto', 'Muçarela', 'Tomate', 'Manjericão'],
    sizeMultiplier: { P: 0.8, M: 1.0, G: 1.4 }
  },

  // DOCES
  {
    id: 'nutella_morango',
    name: 'Nutella com Morango (Sweet Code)',
    version: 'v4.0.0-pro',
    category: 'doce',
    description: 'Cochilo doce do desenvolvedor. Recheio generoso de creme de avelã Nutella original com morango fresco fatiado na hora.',
    price: 15.00,
    tags: ['// premium-ui', '// designer-choice'],
    originalIngredients: ['Nutella', 'Morango fresco'],
    sizeMultiplier: { P: 0.8, M: 1.0, G: 1.4 }
  },
  {
    id: 'romeu_julieta',
    name: 'Romeu e Julieta (Coupling Module)',
    version: 'v1.1.0-tight',
    category: 'doce',
    description: 'Goiabada cascão cremosa e fatias de queijo minas padrão. Um acoplamento forte que nunca quebra seus testes unitários.',
    price: 13.00,
    tags: ['// high-coupling', '// traditional'],
    originalIngredients: ['Goiabada cascão', 'Queijo minas'],
    sizeMultiplier: { P: 0.8, M: 1.0, G: 1.4 }
  },
  {
    id: 'ninho_brigadeiro',
    name: 'Brigadeiro com Leite Ninho (Sugar Overflow)',
    version: 'v2.2.0-sweet',
    category: 'doce',
    description: 'Brigadeiro de colher feito em fogo baixo e muito chocolate belga, salpicado com Leite Ninho original em pó.',
    price: 14.50,
    tags: ['// crash-safe', '// sugar-boost'],
    originalIngredients: ['Brigadeiro de panela', 'Leite Ninho'],
    sizeMultiplier: { P: 0.8, M: 1.0, G: 1.4 }
  },

  // BEBIDAS
  {
    id: 'cana_pura',
    name: 'Caldo de Cana (Cooling_System.exe)',
    version: 'v5.0-chilled',
    category: 'bebida',
    description: 'Caldo de cana puro extraído a frio na hora. O resfriamento extremo ideal para acalmar os coolers do seu cérebro de programador.',
    price: 9.00,
    tags: ['// essential', '// icy', '// zero-latency'],
    originalIngredients: ['Garapa de cana fresca'],
    sizeMultiplier: { P: 0.75, M: 1.0, G: 1.3 } // Copos: 300ml, 500ml, 700ml
  },
  {
    id: 'cana_limao',
    name: 'Cana Lemon (Cooling_System --with-lime)',
    version: 'v5.1-optimized',
    category: 'bebida',
    description: 'Caldo de cana gelado com limão Tahiti espremido na hora. Sistema otimizado para refrescar o paladar com maior acidez.',
    price: 9.50,
    tags: ['// optimized', '// fresh'],
    originalIngredients: ['Garapa de cana', 'Suco de limão'],
    sizeMultiplier: { P: 0.75, M: 1.0, G: 1.3 }
  },
  {
    id: 'cafe_overclock',
    name: 'Café Coado (Coffee_Overclock.sh)',
    version: 'v9.9.9-caffeine',
    category: 'bebida',
    description: 'Café premium brasileiro coado forte na hora. Script indispensável para manter a atenção e depurar aquele código legado tenso.',
    price: 5.00,
    tags: ['// caffeine-boost', '// active-process'],
    originalIngredients: ['Café arábica de qualidade', 'Água fervente'],
    sizeMultiplier: { P: 0.8, M: 1.0, G: 1.2 } // Xícara, Copo, Caneca de Dev
  },
  {
    id: 'refrigerante',
    name: 'Refrigerante Lata (Soda_API.get)',
    version: 'v1.0.0-classic',
    category: 'bebida',
    description: 'Disponível em lata. Coca-Cola, Coca-Cola Zero, Guaraná Antarctica ou Fanta Uva geladíssima.',
    price: 6.50,
    tags: ['// legacy-drink', '// query-select'],
    originalIngredients: ['Refrigerante gelado à sua escolha'],
  },
  {
    id: 'cerveja_heineken',
    name: 'Heineken Longneck (Root_Access.sh)',
    version: 'v18.0.0-sudo',
    category: 'bebida',
    description: 'Cerveja Heineken gelada para ativar sua Ballmer Peak e destravar ideias. [Proibido para menores de 18 anos | Beba com moderação]',
    price: 9.00,
    tags: ['// sudo-permit', '// root-access'],
    originalIngredients: ['Heineken 330ml'],
  },

  // ACOMPANHAMENTOS
  {
    id: 'pasteis_vento',
    name: 'Pasteis de Vento (Empty_Pointer)',
    version: 'v0.0.0-null',
    category: 'acompanhamento',
    description: 'Porção com 12 mini pastéis crocantes, sem recheio. O famoso ponteiro nulo (NullPointer) que todos gostamos de mergulhar no molho de pimenta.',
    price: 11.00,
    tags: ['// null-ref', '// crunchy'],
    originalIngredients: ['Massa crocante frita purinha', 'Molho especial de pimenta cortesia'],
    sizeMultiplier: { P: 0.8, M: 1.0, G: 1.3 }
  },
  {
    id: 'batata_chips',
    name: 'Frita Ondulada (Binary_Chips)',
    version: 'v64.bit-crinkle',
    category: 'acompanhamento',
    description: 'Batata crinkle (ondulada) frita super sequinha e crocante, salpicada com sal temperado com ervas finas e páprica.',
    price: 13.00,
    tags: ['// hardware-mod', '// salty'],
    originalIngredients: ['Batata ondulada', 'Páprica', 'Ervas finas'],
    sizeMultiplier: { P: 0.8, M: 1.0, G: 1.3 }
  }
];

export const MOCK_COMMIT_LOGS: CommitLog[] = [];

export const INGREDIENTES_ADICIONAIS = [
  { name: 'Ouro Derretido (Queijo Extra)', price: 3.50, type: 'MUÇARELA' },
  { name: 'Bacon Bit (.env.bacon)', price: 3.00, type: 'BACON' },
  { name: 'Ovo Compilado (Fatia Extra)', price: 1.50, type: 'OVO' },
  { name: 'Calabresa Express', price: 3.00, type: 'CALABRESA' },
  { name: 'Catupiry Injector (Porção)', price: 4.00, type: 'CATUPIRY' },
  { name: 'Cebolinha Debugged', price: 0.50, type: 'CHEIRO_VERDE' }
];
