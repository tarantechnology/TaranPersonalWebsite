import CursorFollower from "@/components/CursorFollower";
import Sky from "@/components/drive/Sky";
import WorldScene from "@/components/drive/WorldScene";
import Jarvis from "@/components/drive/Jarvis";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Content from "@/components/sections/Content";
import Blog from "@/components/sections/Blog";
import Contact from "@/components/sections/Contact";
import Po from "@/components/sections/Po";
import Footer from "@/components/sections/Footer";
import { useDriveEngine } from "@/lib/motion";

/**
 * One day's drive, in one continuous 3D scene: Po on an endless road, the
 * camera moving between scenes with the scroll, a JARVIS-style HUD on top.
 */
const Index = () => {
  useDriveEngine();
  return (
    <main className="relative min-h-screen text-foreground">
      <CursorFollower />
      <Sky />
      <WorldScene />
      <Jarvis />
      <Nav />
      <div className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Content />
        <Blog />
        <Contact />
        <Po />
        <Footer />
      </div>
    </main>
  );
};

export default Index;
