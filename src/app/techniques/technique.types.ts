import { TechniqueAnswer } from '../core/models';

/**
 * Cada técnica emite a resposta já serializada no mesmo formato que o app
 * AngularJS enviava para a API, ou `null` enquanto estiver incompleta.
 */
export type SerializedAnswer = string | null;

export function serialize(answer: TechniqueAnswer): SerializedAnswer {
  return JSON.stringify(answer);
}

/** Identificadores das técnicas suportadas pelo servidor. */
export const TECHNIQUE_EMOCARDS = 1;
export const TECHNIQUE_AFFECT_GRID = 2;
export const TECHNIQUE_PANAS = 3;
export const TECHNIQUE_ATTRAKDIFF = 4;
export const TECHNIQUE_PREMO = 5;
export const TECHNIQUE_ESM = 6;
export const TECHNIQUE_SAM = 8;
