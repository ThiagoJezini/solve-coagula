export const MALDICOES_POR_PILAR: Record<string, string[]> = {
  Consciência: ['Olhos no Chão'],
  Espírito: ['Espírito Artificial'],
  Corpo: ['Órgãos Mal Arranjados'],
  Natureza: ['Cabeça Animal'],
  Leis: ['Pele Metálica'],
}

export const MALDICOES_DETALHES: Record<string, { efeito: string; mecanica: string }> = {
  'Olhos no Chão': {
    efeito: 'Por onde você passa olhos brotam do chão e das paredes.',
    mecanica: 'Você não enxerga por eles mas os sente; se alguém tocar num deles, sofre 1d6 de estresse.',
  },
  'Espírito Artificial': {
    efeito: 'Um espírito artificial surge e só você o escuta e enxerga como uma mancha escura.',
    mecanica: 'A cada cena ele faz exigências terríveis. Sempre que não cumprir, sofre 1 de estresse que acumula para a próxima vez.',
  },
  'Órgãos Mal Arranjados': {
    efeito: 'Seus órgãos internos ficaram mal arranjados.',
    mecanica: 'Perca 1 de Vitalidade máxima. Sempre que fizer um teste de COR role 1d12, se o resultado for 1 você não consegue agir por vomitar sangue.',
  },
  'Cabeça Animal': {
    efeito: 'Sua cabeça se torna a de um animal carniceiro.',
    mecanica: 'Sempre que vir sangue vertendo de alguém ou algo vivo, faça um teste DT NAT -3. Se falhar você ataca a fonte do sangue, se passar você controla seus impulsos.',
  },
  'Pele Metálica': {
    efeito: 'Partes da sua pele se transformam em algum tipo de metal, causando dores terríveis ao fazer movimentos bruscos.',
    mecanica: 'Sempre que sofre dano de estresse some +1d6 a ele.',
  },
}

export function countMaldicoesPorPilar(selected: string[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const [pilar, lista] of Object.entries(MALDICOES_POR_PILAR)) {
    counts[pilar] = selected.filter((id) => lista.includes(id)).length
  }
  return counts
}