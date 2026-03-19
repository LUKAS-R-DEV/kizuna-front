// src/layouts/MainLayout.tsx
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    /* h-[100dvh] e overflow-hidden no pai para travar a Sidebar no lugar */
    <div className="h-[100dvh] w-full flex overflow-hidden bg-slate-50">
      
      <Sidebar />

      {/* Container da Direita: flex-col é essencial para o Footer colar embaixo */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative bg-slate-50">
        
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
  )
}