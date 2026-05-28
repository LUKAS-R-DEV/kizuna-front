// src/layouts/MainLayout.tsx
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import NotificationManager from "@/components/NotificationManager";
import { useEffect } from "react";
import { iamApi } from "@/lib/api";
import keycloak from "@/lib/auth";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (keycloak.authenticated) {
      iamApi.get("/users/me").catch((err) => {
        console.error("Erro ao sincronizar usuário com o banco", err);
      });
    }
  }, []);

  return (
    <>
    <NotificationManager />
    {/* h-[100dvh] e overflow-hidden no pai para travar a Sidebar no lugar */}
    <div className="h-[100dvh] w-full flex overflow-hidden bg-[#050505] text-slate-300 relative">
      
      {/* HUD CYBERPUNK GRID BACKGROUND */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: "linear-gradient(#dc2626 1px, transparent 1px), linear-gradient(90deg, #dc2626 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />

      <Sidebar />

      {/* Container da Direita: flex-col é essencial para o Footer colar embaixo */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10">
        
        <Header />
        
        {/* O main cresce (flex-1) e permite scroll interno */}
        <main className="flex-1 overflow-y-auto mt-16 flex flex-col">
          
          {/* O conteúdo cresce para empurrar o footer */}
          <div className="flex-1 p-8">
            <div className="max-w-[1600px] mx-auto">
              {children}
            </div>
          </div>

          {/* Footer agora sempre no final da rolagem ou da tela */}
          <Footer />
        </main>
      </div>
    </div>
    </>
  )
}