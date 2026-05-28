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
      <body>{children}</body>
    </html>
  );
}
