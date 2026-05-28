import "./globals.css";

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
        {/* Deshabilita la restauración de scroll del browser antes de React */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration'in history){history.scrollRestoration='manual';}" +
              "window.scrollTo(0,0);" +
              "document.addEventListener('DOMContentLoaded',function(){window.scrollTo(0,0);},{once:true});" +
              "window.addEventListener('load',function(){window.scrollTo(0,0);},{once:true});",
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
