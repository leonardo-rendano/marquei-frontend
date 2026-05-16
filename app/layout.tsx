import "./globals.css";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "./src/contexts/AuthContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
