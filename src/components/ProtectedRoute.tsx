import { ReactNode } from "react";
import keycloak, { initError } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactNode;
}

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  useEffect(() => {
    if (!keycloak.authenticated && !initError) {
      keycloak.login();
    }
  }, []);

  if (initError) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 p-6 flex-col text-center space-y-4">
         <AlertTriangle size={64} className="text-red-500 animate-pulse" />
         <h1 className="text-2xl font-black text-white uppercase">Authentication Error</h1>
         <p className="text-red-400 font-mono text-sm max-w-lg break-words">
            {JSON.stringify(initError)}
         </p>
         <p className="text-slate-500 text-xs">Verify Keycloak settings (CORS, Client Secret, Valid Redirect URIs) defined in your IAM Service.</p>
      </div>
    );
  }

  if (!keycloak.authenticated) {
    // Show a blank screen (or loading spinner) while we redirect
    return null;
  }

  return <>{children}</>;
};


export default ProtectedRoute;
