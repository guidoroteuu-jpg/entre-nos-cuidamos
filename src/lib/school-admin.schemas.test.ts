import { describe, expect, it } from 'vitest';
import { classInput, personInput } from './school-admin.schemas';
const id = '12345678-1234-4234-8234-123456789abc';
describe('school registrations', () => {
  it('requires a class when registering a student', () => {
    const person = { schoolId: id, fullName: 'Aluno Teste', email: 'student@example.test', password: 'secure-password', role: 'student', classId: '' };
    expect(personInput.safeParse(person).success).toBe(false);
    expect(personInput.safeParse({ ...person, classId: id }).success).toBe(true);
  });
  it('does not let the person form grant administrator access', () => {
    expect(personInput.safeParse({ schoolId: id, fullName: 'Admin Teste', email: 'admin@example.test', password: 'secure-password', role: 'administrator', classId: '' }).success).toBe(false);
  });
  it('accepts classes without a teacher and rejects invalid school ids', () => {
    const turma = { schoolId: id, name: '6B', year: 2026, shift: 'Manhã', teacherId: '' };
    expect(classInput.safeParse(turma).success).toBe(true);
    expect(classInput.safeParse({ ...turma, schoolId: 'other-school' }).success).toBe(false);
  });
});