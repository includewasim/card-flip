'use client';
import { useRef, useEffect } from "react";
import Card from "@/app/Card";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "@studio-freight/react-lenis";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(() => {
    const cards = cardRefs.current;
    const totalScrollHeight = window.innerHeight * 2;
    const positions = [14, 38, 62, 86];
    const rotations = [-15, -7.5, 7.5, 15];

    ScrollTrigger.create({
      trigger: container.current.querySelector('.cards'),
      start: "top top",
      end: () => `+=${totalScrollHeight}`,  // Corrected template literal
      pin: true,
      pinSpacing: true,
    });

    cards.forEach((card, index) => {
      gsap.to(card, {
        left: `${positions[index]}%`,  // Corrected template literal
        rotation: `${rotations[index]}`,  // Corrected template literal
        ease: 'none',
        scrollTrigger: {
          trigger: container.current.querySelector('.cards'),
          start: 'top top',
          end: () => `+=${window.innerHeight}`,  // Corrected template literal
          scrub: 0.5,
          id: `spread-${index}`,  // Corrected template literal
        },
      });

      cards.forEach((card, index) => {
        const frontEl = card.querySelector('.flip-card-front');
        const backEl = card.querySelector('.flip-card-back');

        const staggerOffset = index * 0.05;
        const startOffset = 1 / 3 + staggerOffset;
        const endOffset = 2 / 3 + staggerOffset;

        ScrollTrigger.create({
          trigger: container.current.querySelector('.cards'),
          start: 'top top',
          end: () => `+=${totalScrollHeight}`,  // Corrected template literal
          scrub: 1,
          id: `rotate-flip-${index}`,  // Corrected template literal
          onUpdate: (self) => {
            const progress = self.progress;
            if (progress >= startOffset && progress <= endOffset) {
              const animationProgress = (progress - startOffset) / (1 / 3);
              const frontRotation = -180 * animationProgress;
              const backRotation = 180 - 180 * animationProgress;
              const cardRotation = rotations[index] * (1 - animationProgress);

              gsap.to(frontEl, {
                rotateY: frontRotation,
                ease: 'power1.out',
              });
              gsap.to(backEl, {
                rotateY: backRotation,
                ease: 'power1.out',
              });
              gsap.to(card, {
                xPercent: -50,
                yPercent: -50,
                rotation: cardRotation,
                ease: 'power1.out',
              });
            }
          },
        });
      });
    })


  }, { scope: container });

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <ReactLenis root>
      <div className="container" ref={container}>
        <section className="hero">
          <h1>Keep Scrolling to <br /> reveal the cards</h1>
        </section>
        <section className="cards">
          {
            [...Array(4)].map((_, index) => (
              <Card
                key={index}
                id={`card-${index + 1}`}  // Corrected template literal
                frontSrc="/images/card-front.png"
                frontAlt='card front'
                backText="Govandi Guldasta"
                ref={(el) => (cardRefs.current[index] = el)}
              />
            ))
          }
        </section>
        <section>
          <h1 >&copy; 2024 Wasim Khan</h1>
        </section>
      </div>
    </ReactLenis>
  );
}
