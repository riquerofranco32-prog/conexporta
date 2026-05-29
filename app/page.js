"use client";

import dynamic from "next/dynamic";
import {
  ScrollProgressBar,
  useScrollSetup,
  useScrollReveal,
} from "@/app/hooks/useAnimations";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import FeaturesBar from "@/app/components/FeaturesBar";
import PorQueConExporta from "@/app/components/PorQueConExporta";
import ComoFunciona from "@/app/components/ComoFunciona";
import Contacto from "@/app/components/Contacto";
import Footer from "@/app/components/Footer";

const Chatbot = dynamic(() => import("@/app/components/Chatbot"), {
  loading: () => (
    <div className="py-20 px-4">
      <div className="max-w-4xl mx-auto h-96 bg-white/5 animate-pulse rounded-2xl" />
    </div>
  ),
  ssr: false,
});

const Calculadora = dynamic(() => import("@/app/components/Calculadora"), {
  loading: () => (
    <div className="py-20 px-4">
      <div className="max-w-5xl mx-auto h-96 bg-white/5 animate-pulse rounded-2xl" />
    </div>
  ),
  ssr: false,
});

const GestionFirmas = dynamic(() => import("@/app/components/GestionFirmas"), {
  loading: () => (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto h-64 bg-white/5 animate-pulse rounded-2xl" />
    </div>
  ),
  ssr: false,
});

export default function Home() {
  useScrollSetup();
  useScrollReveal();
  return (
    <>
      <ScrollProgressBar />
      <Navbar />
      <main>
        <Hero />
        <FeaturesBar />
        <hr className="section-divider" />
        <PorQueConExporta />
        <hr className="section-divider" />
        <ComoFunciona />
        <hr className="section-divider" />
        <Chatbot />
        <hr className="section-divider" />
        <Calculadora />
        <hr className="section-divider" />
        <GestionFirmas />
        <hr className="section-divider" />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
