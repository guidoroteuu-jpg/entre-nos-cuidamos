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
          aria-pressed={active}
          className={`min-h-[40px] px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
            active
              ? "bg-primary text-primary-foreground border-primary shadow-card"
              : "bg-card text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
          }`}
        >
          {s.name} <span className="opacity-70 text-xs font-medium">· {s.grade}</span>
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
  <div className="space-y-3.5 mb-6">
    <div>
      <h1 className="font-heading text-[26px] leading-tight font-extrabold tracking-tight text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
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
