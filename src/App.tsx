import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import HomePage from "@/pages/Home";
import AthkarPage from "@/pages/Athkar";
import EventsPage from "@/pages/Events";
import ChatPage from "@/pages/Chat";
import DirectoryPage from "@/pages/Directory";
import AdminPage from "@/pages/Admin";
import ProfilePage from "@/pages/Profile";
import AuthPage from "@/pages/Auth";
import MyBusinessPage from "@/pages/MyBusiness";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/auth" element={<AuthGate><AuthPage /></AuthGate>} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/athkar" element={<ProtectedRoute><AthkarPage /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/directory" element={<ProtectedRoute><DirectoryPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/my-business" element={<ProtectedRoute requiredRole="business"><MyBusinessPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
