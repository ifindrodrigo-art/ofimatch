import type { Metadata } from "next";
import AppShell from "@/components/app/AppShell";
import "./app.css";

export const metadata: Metadata = {
  title: "App: pide un técnico o recibe clientes",
  description: "Abre OfiMatch para pedir un electricista, gasfitero, albañil o soldador cerca de ti, o para recibir clientes de tu oficio en Lima.",
  alternates: { canonical: "/app" },
};

export default function AppPage() {
  return <AppShell />;
}
