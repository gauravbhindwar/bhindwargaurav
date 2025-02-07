import { Geist, Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";

const geist = Geist({ subsets: ["latin"] });

const montserrat = Montserrat({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-montserrat'
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-space'
});

export const metadata = {
  name: "Gaurav Bhindwar",
  author: "Gaurav Bhindwar",
  keywords: "Gaurav Bhindwar, Portfolio, Gaurav Bhindwar Portfolio",
  title: "Gaurav Bhindwar",
  description: "Gaurav Bhindwar's portfolio website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${montserrat.variable} ${spaceGrotesk.variable} font-sans`}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
