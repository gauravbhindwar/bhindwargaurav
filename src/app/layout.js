import { Geist, Montserrat, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import AuthProvider from "@/components/AuthProvider";
import StructuredData from "@/components/StructuredData";

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
  title: {
    default: "Gaurav Kumar - Full Stack Developer Portfolio",
    template: "%s | Gaurav Kumar"
  },
  description: "Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. Explore my projects, skills, and professional experience.",
  keywords: [
    "Gaurav Kumar",
    "Full Stack Developer", 
    "React Developer",
    "Next.js Developer",
    "Portfolio",
    "Web Developer",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Frontend Developer",
    "Backend Developer"
  ],
  authors: [{ name: "Gaurav Kumar" }],
  creator: "Gaurav Kumar",
  publisher: "Gaurav Kumar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
    title: 'Gaurav Kumar - Full Stack Developer Portfolio',
    description: 'Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. Explore my projects, skills, and professional experience.',
    siteName: 'Gaurav Kumar Portfolio',
    images: [
      {
        url: '/gaurav.jpg',
        width: 1200,
        height: 630,
        alt: 'Gaurav Kumar - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaurav Kumar - Full Stack Developer Portfolio',
    description: 'Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies.',
    images: ['/gaurav.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <StructuredData />
      </head>
      <body className={`${montserrat.variable} ${spaceGrotesk.variable} font-sans`}>
        <AuthProvider>
          <ThemeProvider>
            <ConditionalNavbar />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
