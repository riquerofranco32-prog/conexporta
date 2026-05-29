import "./globals.css";
import { ScrollRestorer } from "./scroll-restorer";

export const metadata = {
  title: "ConExporta AI — Asistente de Comercio Exterior",
  description:
    "Asistente inteligente de comercio exterior argentino. Consultá sobre documentación aduanera, Incoterms, logística y más.",
  keywords:
    "comercio exterior, exportación, importación, Argentina, Incoterms, aduana",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
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
        <ScrollRestorer />
        {children}
      </body>
    </html>
  );
}
