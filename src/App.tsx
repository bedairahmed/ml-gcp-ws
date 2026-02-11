import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
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

const AppRoutes = () => {
  // For now, show auth page if no Firebase config, otherwise show home
  // This will be properly gated in Phase 2
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/athkar" element={<AthkarPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/my-business" element={<MyBusinessPage />} />
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
