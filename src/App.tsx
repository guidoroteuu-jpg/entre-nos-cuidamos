import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherAlerts from "./pages/teacher/TeacherAlerts";
import TeacherReport from "./pages/teacher/TeacherReport";
import TeacherComplaints from "./pages/teacher/TeacherComplaints";
import TeacherSchoolYear from "./pages/teacher/TeacherSchoolYear";
import DirectionPanel from "./pages/direction/DirectionPanel";
import DirectionClasses from "./pages/direction/DirectionClasses";
import DirectionComplaints from "./pages/direction/DirectionComplaints";
import DirectionSchoolYear from "./pages/direction/DirectionSchoolYear";
import DirectionSettings from "./pages/direction/DirectionSettings";
import Brand from "./pages/Brand";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
          <Route path="/aluno/confidente" element={<StudentConfident />} />
          <Route path="/professor/dashboard" element={<TeacherDashboard />} />
          <Route path="/professor/alertas" element={<TeacherAlerts />} />
          <Route path="/professor/denuncias" element={<TeacherComplaints />} />
          <Route path="/professor/relatorio" element={<TeacherReport />} />
          <Route path="/professor/ano-letivo" element={<TeacherSchoolYear />} />
          <Route path="/direcao/painel" element={<DirectionPanel />} />
          <Route path="/direcao/turmas" element={<DirectionClasses />} />
          <Route path="/direcao/denuncias" element={<DirectionComplaints />} />
          <Route path="/direcao/ano-letivo" element={<DirectionSchoolYear />} />
          <Route path="/direcao/configuracoes" element={<DirectionSettings />} />
          <Route path="/brand" element={<Brand />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
