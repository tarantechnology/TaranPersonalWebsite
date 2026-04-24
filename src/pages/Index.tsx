import { lazy, Suspense } from "react";
import CursorFollower from "@/components/CursorFollower";
import useReveal from "@/hooks/useReveal";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";

const About = lazy(() => import("@/components/sections/About"));
const Experience = lazy(() => import("@/components/sections/Experience"));
const Projects = lazy(() => import("@/components/sections/Projects"));
const Content = lazy(() => import("@/components/sections/Content"));
const Contact = lazy(() => import("@/components/sections/Contact"));
const Footer = lazy(() => import("@/components/sections/Footer"));

const Index = () => {
  useReveal();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <CursorFollower />
      <Nav />
      <Hero />
      <Suspense fallback={null}>
        <About />
        <Experience />
        <Projects />
        <Content />
        <Contact />
        <Footer />
      </Suspense>
    </main>
  );
};

export default Index;
