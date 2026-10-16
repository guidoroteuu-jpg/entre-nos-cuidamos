import { z } from 'zod';

export const classInput = z.object({
  schoolId: z.string().uuid(), name: z.string().trim().min(1).max(80),
  year: z.number().int().min(2000).max(2100), shift: z.enum(['Manhã', 'Tarde', 'Integral']),
  teacherId: z.union([z.string().uuid(), z.literal('')]),
});
export const personInput = z.object({
  schoolId: z.string().uuid(), fullName: z.string().trim().min(3).max(120),
  email: z.string().trim().email().max(254), password: z.string().min(12).max(128),
  role: z.enum(['student', 'teacher', 'director']),
  classId: z.union([z.string().uuid(), z.literal('')]),
}).refine(v => v.role !== 'student' || v.classId !== '', { message: 'Selecione uma turma para o aluno', path: ['classId'] });