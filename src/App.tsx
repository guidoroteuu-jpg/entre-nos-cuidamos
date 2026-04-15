import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
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
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Registration />} />
            <Route path="/bem-vindo" element={<Welcome />} />
            <Route path="/privacidade" element={<Privacy />} />
            <Route path="/brand" element={<Brand />} />

            {/* Student routes */}
            <Route path="/aluno/home" element={<ProtectedRoute allowedRoles={["student"]}><StudentHome /></ProtectedRoute>} />
            <Route path="/aluno/chat" element={<ProtectedRoute allowedRoles={["student"]}><StudentChat /></ProtectedRoute>} />
            <Route path="/aluno/chat-ia" element={<ProtectedRoute allowedRoles={["student"]}><StudentChatIA /></ProtectedRoute>} />
            <Route path="/aluno/diario" element={<ProtectedRoute allowedRoles={["student"]}><StudentDiary /></ProtectedRoute>} />
            <Route path="/aluno/confidente" element={<ProtectedRoute allowedRoles={["student"]}><StudentConfident /></ProtectedRoute>} />

            {/* Teacher routes */}
            <Route path="/professor/dashboard" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/professor/alertas" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherAlerts /></ProtectedRoute>} />
            <Route path="/professor/denuncias" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherComplaints /></ProtectedRoute>} />
            <Route path="/professor/relatorio" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherReport /></ProtectedRoute>} />
            <Route path="/professor/ano-letivo" element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherSchoolYear /></ProtectedRoute>} />

            {/* Admin/Direction routes */}
            <Route path="/direcao/painel" element={<ProtectedRoute allowedRoles={["admin"]}><DirectionPanel /></ProtectedRoute>} />
            <Route path="/direcao/turmas" element={<ProtectedRoute allowedRoles={["admin"]}><DirectionClasses /></ProtectedRoute>} />
            <Route path="/direcao/denuncias" element={<ProtectedRoute allowedRoles={["admin"]}><DirectionComplaints /></ProtectedRoute>} />
            <Route path="/direcao/ano-letivo" element={<ProtectedRoute allowedRoles={["admin"]}><DirectionSchoolYear /></ProtectedRoute>} />
            <Route path="/direcao/configuracoes" element={<ProtectedRoute allowedRoles={["admin"]}><DirectionSettings /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
