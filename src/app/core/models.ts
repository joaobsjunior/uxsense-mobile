/** Contratos da API do UXSense (http://api.uxsense.com.br/api/app). */

export interface Client {
  id: number;
  name: string;
  email: string;
  register: string;
  sex: string;
  datebirth?: string | null;
}

export interface DeviceSession {
  id: string;
  token: string;
}

export interface AuthData {
  client?: Client;
  device?: DeviceSession;
  authenticated?: boolean;
}

export interface Group {
  id: number;
  name: string;
}

export interface Subgroup {
  id: number;
  name: string;
  group?: Group;
}

export interface Unit {
  id: number;
  name: string;
}

export interface Team {
  id: number;
  name: string;
  subgroup?: Subgroup;
  unit?: Unit;
}

export interface Question {
  id: number;
  question: string;
}

export interface Technique {
  id: number;
  name?: string;
}

/** Pergunta agendada que chega por push e é respondida pelo aluno. */
export interface Scheduler {
  id: number;
  question: Question;
  team: Team;
  technique: Technique;
}

export interface AnswerRecord {
  id: number;
  date: string;
  time: string;
  scheduler: Scheduler;
}

export interface Coordinates {
  latitude?: number;
  longitude?: number;
}

/**
 * Formato enviado no campo `answer` (string JSON), idêntico ao do app
 * AngularJS para manter a compatibilidade com o servidor.
 */
export interface TechniqueAnswer {
  max: number | boolean;
  min: number | boolean;
  type: 'number' | 'boolean';
  data: Record<string, number | boolean>;
}

export interface GroupsResponse {
  groups: Group[];
}

export interface SubgroupsResponse {
  subgroups: Subgroup[];
}

export interface TeamsResponse {
  teams: Team[];
}

export interface AnswersResponse {
  answers: AnswerRecord[];
}

export interface LostPasswordResponse {
  sent?: boolean;
}
