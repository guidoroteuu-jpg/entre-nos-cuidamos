import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AccessibilityControls from "./components/AccessibilityControls";
import { I18nProvider } from "./lib/i18n";
import { useEffect } from "react";
import { initAccessibility } from "./lib/accessibility";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Welcome from "./pages/Welcome";
import Privacy from "./pages/Privacy";
import StudentHome from "./pages/student/StudentHome";
import StudentChat from "./pages/student/StudentChat";
import StudentChatIA from "./pages/student/StudentChatIA";
import StudentDiary from "./pages/student/StudentDiary";
import StudentConfident from "./pages/student/StudentConfident";
import StudentClassConnection from "./pages/student/StudentClassConnection";
import StudentSupport from "./pages/student/StudentSupport";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherAlerts from "./pages/teacher/TeacherAlerts";
import TeacherReport from "./pages/teacher/TeacherReport";
import TeacherComplaints from "./pages/teacher/TeacherComplaints";
import TeacherSchoolYear from "./pages/teacher/TeacherSchoolYear";
import TeacherResourceLibrary from "./pages/teacher/TeacherResourceLibrary";
import TeacherActionPlan from "./pages/teacher/TeacherActionPlan";
import CouncilReferral from "./pages/CouncilReferral";
import FamilyChannel from "./pages/FamilyChannel";
import SpecialistReferral from "./pages/SpecialistReferral";
import DirectionPanel from "./pages/direction/DirectionPanel";
import DirectionClasses from "./pages/direction/DirectionClasses";
import DirectionComplaints from "./pages/direction/DirectionComplaints";
import DirectionSchoolYear from "./pages/direction/DirectionSchoolYear";
import DirectionSettings from "./pages/direction/DirectionSettings";
import DirectionProtocols from "./pages/direction/DirectionProtocols";
import DirectionHeatmap from "./pages/direction/DirectionHeatmap";
import DirectionLGPD from "./pages/direction/DirectionLGPD";
import StudentAccessibility from "./pages/student/StudentAccessibility";
import TeacherAccessibility from "./pages/teacher/TeacherAccessibility";
import DirectionAccessibility from "./pages/direction/DirectionAccessibility";
import Brand from "./pages/Brand";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    initAccessibility();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AccessibilityControls />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Registration />} />
            <Route path="/bem-vindo" element={<Welcome />} />
            <Route path="/privacidade" element={<Privacy />} />
            <Route path="/aluno/home" element={<StudentHome />} />
            <Route path="/aluno/chat" element={<StudentChat />} />
            <Route path="/aluno/chat-ia" element={<StudentChatIA />} />
            <Route path="/aluno/diario" element={<StudentDiary />} />
            <Route path="/aluno/turma" element={<StudentClassConnection />} />
            <Route path="/aluno/confidente" element={<StudentConfident />} />
            <Route path="/aluno/apoio" element={<StudentSupport />} />
            <Route path="/aluno/acessibilidade" element={<StudentAccessibility />} />
            <Route path="/professor/dashboard" element={<TeacherDashboard />} />
            <Route path="/professor/alertas" element={<TeacherAlerts />} />
            <Route path="/professor/denuncias" element={<TeacherComplaints />} />
            <Route path="/professor/relatorio" element={<TeacherReport />} />
            <Route path="/professor/ano-letivo" element={<TeacherSchoolYear />} />
            <Route path="/professor/biblioteca" element={<TeacherResourceLibrary />} />
            <Route path="/professor/plano-individual" element={<TeacherActionPlan />} />
            <Route path="/professor/conselho-tutelar" element={<CouncilReferral role="teacher" />} />
            <Route path="/professor/familia" element={<FamilyChannel role="teacher" />} />
            <Route path="/professor/especialista" element={<SpecialistReferral role="teacher" />} />
            <Route path="/professor/acessibilidade" element={<TeacherAccessibility />} />
            <Route path="/direcao/painel" element={<DirectionPanel />} />
            <Route path="/direcao/turmas" element={<DirectionClasses />} />
            <Route path="/direcao/denuncias" element={<DirectionComplaints />} />
            <Route path="/direcao/ano-letivo" element={<DirectionSchoolYear />} />
            <Route path="/direcao/conselho-tutelar" element={<CouncilReferral role="admin" />} />
            <Route path="/direcao/familia" element={<FamilyChannel role="admin" />} />
            <Route path="/direcao/especialista" element={<SpecialistReferral role="admin" />} />
            <Route path="/direcao/protocolos" element={<DirectionProtocols />} />
            <Route path="/direcao/mapa-calor" element={<DirectionHeatmap />} />
            <Route path="/direcao/lgpd" element={<DirectionLGPD />} />
            <Route path="/direcao/configuracoes" element={<DirectionSettings />} />
            <Route path="/direcao/acessibilidade" element={<DirectionAccessibility />} />
            <Route path="/brand" element={<Brand />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
  );
};

export default App;
