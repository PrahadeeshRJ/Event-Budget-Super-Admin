import { GeistSans } from "geist/font/sans";
import "./globals.css"; 
import { Toaster } from "@/components/ui/toaster"; 
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const inter = GeistSans; 

export const metadata = {
  metadataBase: new URL(defaultUrl), 
  title: "s22 Event Budget App", 
  description: "Created by Solution22", 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; 
}) {
  return (
    <html lang="en"> 
      <body className={inter.className}> 
        <ToastContainer /> 
        <div className="h-screen"> 
          {children} 
        </div>
        <Toaster /> 
      </body>
    </html>
  );
}
