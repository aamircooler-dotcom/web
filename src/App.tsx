import React, { useRef, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Components (replace with your actual components if any)
const HeroSection = React.forwardRef(({ mousePosition }, ref) => (
  <div
    ref={ref}
    className="relative h-screen bg-black text-white flex items-center justify-center"
    style={{
      transform: `translate(${mousePosition.x * 8}px, ${mousePosition.y * 8}px)`
    }}
  >
    <img
      src="/eyes.png"
      alt="Eyes"
      className="w-[200px] h-[200px] object-contain grayscale contrast-110 brightness-90"
    />
  </div>
));

const PortfolioSection = React.forwardRef((_, ref) => (
  <div
    ref={ref}
    className="relative min-h-screen bg-white text-black flex items-center justify-center"
  >
    <h2 className="text-3xl font-bold">Portfolio Section</h2>
  </div>
));

const App = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const portfolioSectionRef = useRef<HTMLDivElement>(null);

  // Mouse tracking state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isCursorInsideHero, setIsCursorInsideHero] = useState(false);
  const [isMouseTrackingEnabled, setIsMouseTrackingEnabled] = useState(true);

  // Detect cursor enter/leave from hero section
  useEffect(() => {
    const handleMouseEnter = () => setIsCursorInsideHero(true);
    const handleMouseLeave = () => {
      setIsCursorInsideHero(false);
      setMousePosition({ x: 0, y: 0 }); // optional reset
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener("mouseenter", handleMouseEnter);
      heroElement.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (heroElement) {
        heroElement.removeEventListener("mouseenter", handleMouseEnter);
        heroElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isCursorInsideHero || !isMouseTrackingEnabled) return;

      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isCursorInsideHero, isMouseTrackingEnabled]);

  // Disable tracking on scroll into portfolio
  useEffect(() => {
    if (!portfolioSectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: portfolioSectionRef.current,
      start: "top center",
      end: "bottom center",
      onEnter: () => setIsMouseTrackingEnabled(false),
      onLeaveBack: () => setIsMouseTrackingEnabled(true),
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      <HeroSection ref={heroRef} mousePosition={mousePosition} />
      <PortfolioSection ref={portfolioSectionRef} />
    </div>
  );
};

export default App;
