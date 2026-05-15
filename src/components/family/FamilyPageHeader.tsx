import { useState, ReactNode } from "react";
import { familyStudents } from "@/lib/familyData";

const StudentSelector = ({
  studentId,
  onChange,
}: {
  studentId: string;
  onChange: (id: string) => void;
}) => (
  <div className="flex gap-2 flex-wrap">
    {familyStudents.map((s) => {
      const active = s.id === studentId;
      return (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
            active
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-card text-muted-foreground border-border hover:text-foreground"
          }`}
        >
          {s.name} <span className="opacity-60 text-xs">· {s.grade}</span>
        </button>
      );
    })}
  </div>
);

export const FamilyPageHeader = ({
  title,
  description,
  studentId,
  onStudent,
  children,
}: {
  title: string;
  description: string;
  studentId: string;
  onStudent: (id: string) => void;
  children?: ReactNode;
}) => (
  <div className="space-y-3 mb-5">
    <div>
      <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
    <StudentSelector studentId={studentId} onChange={onStudent} />
    {children}
  </div>
);

export const useFamilyStudent = () => {
  const [studentId, setStudentId] = useState(familyStudents[0].id);
  const student = familyStudents.find((s) => s.id === studentId)!;
  return { studentId, setStudentId, student };
};
