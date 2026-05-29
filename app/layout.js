import "./globals.css";
import Script from "next/script";
import { ScrollRestorer } from "./scroll-restorer";
import { AnimationInit } from "./components/AnimationInit";

export const metadata = {
  title: "ConExporta AI — Asistente de Comercio Exterior Argentino",
  description:
    "Consultá sobre exportaciones, importaciones, Incoterms y documentación aduanera desde Argentina. Potenciado por Claude AI.",
  keywords: [
    "comercio exterior",
    "exportación argentina",
    "importación",
    "Incoterms",
    "aduana",
    "AFIP",
    "SENASA",
  ],
  authors: [{ name: "ConExporta · UTN San Rafael" }],
  metadataBase: new URL("https://conexporta.vercel.app"),
  openGraph: {
    title: "ConExporta AI — Asistente de Comercio Exterior Argentino",
    description:
      "Consultá sobre exportaciones, importaciones, Incoterms y documentación aduanera desde Argentina. Potenciado por Claude AI.",
    url: "https://conexporta.vercel.app",
    siteName: "ConExporta AI",
    locale: "es_AR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConExporta AI",
    description:
      "Tu consultor de comercio exterior argentino, disponible 24/7.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

// Estilos críticos inline para el primer paint
const CRITICAL_CSS = `
#app-loader{position:fixed;inset:0;z-index:9999;background:#0a1628;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px}
#app-loader .loader-logo{width:56px;height:56px;border-radius:12px;background:linear-gradient(135deg,#f5c842,#d4a017);color:#0a1628;font-weight:900;font-size:1.25rem;display:flex;align-items:center;justify-content:center;animation:loaderPulse 1s ease-in-out infinite}
#app-loader .loader-bar{width:160px;height:3px;background:rgba(255,255,255,.1);border-radius:99px;overflow:hidden}
#app-loader .loader-fill{height:100%;width:0;background:#f5c842;border-radius:99px;animation:loaderFill 1.2s ease forwards}
@keyframes loaderFill{to{width:100%}}
@keyframes loaderPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
@media (prefers-reduced-motion:reduce){#app-loader .loader-logo{animation:none}#app-loader .loader-fill{animation:none;width:100%}}
`;

const LOADER_SCRIPT = `
(function(){
  function hide(){
    var l=document.getElementById('app-loader');
    if(!l)return;
    l.style.transition='opacity .4s ease';
    l.style.opacity='0';
    setTimeout(function(){l&&l.remove();},400);
  }
  if(document.readyState==='complete'){hide();}
  else{window.addEventListener('load',hide);}
  setTimeout(hide,4000);
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration'in history){history.scrollRestoration='manual';}" +
              "window.scrollTo(0,0);" +
              "document.addEventListener('DOMContentLoaded',function(){window.scrollTo({top:0,left:0,behavior:'instant'});});" +
              "window.addEventListener('load',function(){window.scrollTo({top:0,left:0,behavior:'instant'});});",
          }}
        />
      </head>
      <body>
        {/* Skip link para navegación por teclado */}
        <a
          href="#chatbot"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-yellow-400 focus:text-black focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
          Ir al asistente IA
        </a>

        <div id="app-loader" aria-hidden="true">
          <div className="loader-logo">CE</div>
          <div className="loader-bar">
            <div className="loader-fill" />
          </div>
        </div>
        <script dangerouslySetInnerHTML={{ __html: LOADER_SCRIPT }} />
        <ScrollRestorer />
        <AnimationInit />
        {children}
        <Script src="/anim.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
