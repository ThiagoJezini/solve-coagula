export const FERIMENTOS = [
  '-1 em todos os testes',
  '-1 em testes que necessitem da visão',
  '-1 em testes que necessitem de precisão',
  '-1 em testes que necessitem de força física',
  '-1 em testes em que o personagem precise correr',
  '-1 em testes em que o personagem precise se esconder',
]

export type Pilar = 'Consciência' | 'Espírito' | 'Corpo' | 'Natureza' | 'Leis'

export interface FerimentoEfeito {
  pilares: Pilar[] | 'todos'
}

export const FERIMENTOS_EFEITOS: Record<string, FerimentoEfeito> = {
  '-1 em todos os testes': { pilares: 'todos' },
  '-1 em testes que necessitem da visão': { pilares: [] },
  '-1 em testes que necessitem de precisão': { pilares: [] },
  '-1 em testes que necessitem de força física': { pilares: [] },
  '-1 em testes em que o personagem precise correr': { pilares: [] },
  '-1 em testes em que o personagem precise se esconder': { pilares: [] },
}

export function calcularPenalidadePorFerimentos(
  selected: string[],
  pilar: Pilar
): number {
  let penalidade = 0
  for (const efeito of selected) {
    const config = FERIMENTOS_EFEITOS[efeito]
    if (!config) continue
    if (config.pilares === 'todos' || config.pilares.includes(pilar)) {
      penalidade += 1
    }
  }
  return penalidade
}