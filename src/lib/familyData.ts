// Mock data for the family portal — frontend only, illustrative.
export type Student = {
  id: string;
  name: string;
  grade: string;
  avatar?: string;
};

export const familyStudents: Student[] = [
  { id: "1", name: "Ana Beatriz", grade: "7º ano B" },
  { id: "2", name: "Lucas Henrique", grade: "4º ano A" },
];

export const subjects = [
  "Português",
  "Matemática",
  "Ciências",
  "História",
  "Geografia",
  "Inglês",
  "Artes",
  "Ed. Física",
];

export type Grade = { subject: string; b1: number; b2: number; b3: number; b4?: number };

export const gradesByStudent: Record<string, Grade[]> = {
  "1": [
    { subject: "Português", b1: 8.5, b2: 9.0, b3: 8.8 },
    { subject: "Matemática", b1: 7.0, b2: 7.5, b3: 8.0 },
    { subject: "Ciências", b1: 9.0, b2: 8.5, b3: 9.2 },
    { subject: "História", b1: 8.0, b2: 8.2, b3: 8.5 },
    { subject: "Geografia", b1: 7.5, b2: 8.0, b3: 8.3 },
    { subject: "Inglês", b1: 9.5, b2: 9.0, b3: 9.4 },
    { subject: "Artes", b1: 9.0, b2: 9.5, b3: 9.5 },
    { subject: "Ed. Física", b1: 9.0, b2: 9.0, b3: 9.5 },
  ],
  "2": [
    { subject: "Português", b1: 7.0, b2: 7.5, b3: 7.8 },
    { subject: "Matemática", b1: 8.5, b2: 9.0, b3: 9.0 },
    { subject: "Ciências", b1: 8.0, b2: 8.0, b3: 8.5 },
    { subject: "História", b1: 7.0, b2: 7.5, b3: 7.0 },
    { subject: "Geografia", b1: 7.5, b2: 7.8, b3: 8.0 },
    { subject: "Inglês", b1: 8.0, b2: 8.5, b3: 8.8 },
    { subject: "Artes", b1: 9.5, b2: 9.5, b3: 10 },
    { subject: "Ed. Física", b1: 9.0, b2: 9.0, b3: 9.0 },
  ],
};

export type AttendanceMonth = { month: string; presencas: number; faltas: number; justificadas: number };

export const attendanceByStudent: Record<string, AttendanceMonth[]> = {
  "1": [
    { month: "Fev", presencas: 19, faltas: 1, justificadas: 0 },
    { month: "Mar", presencas: 21, faltas: 0, justificadas: 1 },
    { month: "Abr", presencas: 18, faltas: 2, justificadas: 0 },
    { month: "Mai", presencas: 20, faltas: 1, justificadas: 1 },
    { month: "Jun", presencas: 17, faltas: 3, justificadas: 0 },
    { month: "Jul", presencas: 12, faltas: 0, justificadas: 0 },
  ],
  "2": [
    { month: "Fev", presencas: 20, faltas: 0, justificadas: 0 },
    { month: "Mar", presencas: 22, faltas: 0, justificadas: 0 },
    { month: "Abr", presencas: 19, faltas: 1, justificadas: 0 },
    { month: "Mai", presencas: 21, faltas: 0, justificadas: 1 },
    { month: "Jun", presencas: 20, faltas: 0, justificadas: 0 },
    { month: "Jul", presencas: 12, faltas: 0, justificadas: 0 },
  ],
};

export type MoodWeek = { week: string; humor: number; bemEstar: number };

export const moodByStudent: Record<string, MoodWeek[]> = {
  "1": [
    { week: "Sem 1", humor: 4, bemEstar: 4.2 },
    { week: "Sem 2", humor: 3.5, bemEstar: 3.8 },
    { week: "Sem 3", humor: 4.2, bemEstar: 4.3 },
    { week: "Sem 4", humor: 3, bemEstar: 3.2 },
    { week: "Sem 5", humor: 3.8, bemEstar: 4 },
    { week: "Sem 6", humor: 4.5, bemEstar: 4.6 },
    { week: "Sem 7", humor: 4.3, bemEstar: 4.4 },
    { week: "Sem 8", humor: 4.6, bemEstar: 4.7 },
  ],
  "2": [
    { week: "Sem 1", humor: 4.5, bemEstar: 4.6 },
    { week: "Sem 2", humor: 4.7, bemEstar: 4.8 },
    { week: "Sem 3", humor: 4.4, bemEstar: 4.5 },
    { week: "Sem 4", humor: 4.6, bemEstar: 4.7 },
    { week: "Sem 5", humor: 4.5, bemEstar: 4.6 },
    { week: "Sem 6", humor: 4.8, bemEstar: 4.9 },
    { week: "Sem 7", humor: 4.7, bemEstar: 4.8 },
    { week: "Sem 8", humor: 4.9, bemEstar: 4.9 },
  ],
};

export const moodLabel = (v: number) => {
  if (v >= 4.5) return "Ótimo";
  if (v >= 4) return "Bom";
  if (v >= 3) return "Regular";
  if (v >= 2) return "Atenção";
  return "Cuidado";
};

export const average = (g: Grade) => {
  const vals = [g.b1, g.b2, g.b3, g.b4].filter((v): v is number => typeof v === "number");
  return vals.reduce((a, b) => a + b, 0) / vals.length;
};
