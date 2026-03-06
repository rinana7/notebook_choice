
export interface Book {
  id: string;
  title: string;
  subject: string;
}

export type GradeLevel = 'hs1' | 'hs2' | 'hs3' | 'other';

export interface CoachResponse {
  rawText: string;
}
