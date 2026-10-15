import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio",
  description: "Internal",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef0f5" },
    { media: "(prefers-color-scheme: dark)", color: "#161617" },
  ],
};

// Set theme (dark class) and glass level (--lq) before first paint — no flash.
const THEME_BOOT = `(function(){try{
  var d=document.documentElement,s=localStorage;
  var m=s.getItem('studio-theme')||'system';
  d.setAttribute('data-theme-mode',m);
  var dark=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);
  d.classList.toggle('dark',dark);
  var lq=s.getItem('studio-lq'); if(lq!==null){d.style.setProperty('--lq',String(Number(lq)/100));}
  var ac=s.getItem('studio-accent'); if(ac){d.setAttribute('data-accent',ac);}
}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body>
        <div className="bg-orbs" aria-hidden />
        {children}
      </body>
    </html>
  );
}
