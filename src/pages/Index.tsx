import CursorFollower from "@/components/CursorFollower";
import useReveal from "@/hooks/useReveal";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Content from "@/components/sections/Content";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

const Index = () => {
  useReveal();
  return (
    <main className="min-h-screen bg-background text-foreground">
      <CursorFollower />
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Content />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
