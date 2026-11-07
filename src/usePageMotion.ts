import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealStart = {
  x?: number;
  y?: number;
  scale?: number;
  rotate?: number;
  filter?: string;
  clipPath?: string;
};

type RevealOptions = {
  start?: string;
  end?: string;
  scrub?: number;
  transformOrigin?: string;
};

function scrubReveal(
  selector: string,
  from: RevealStart,
  options: RevealOptions = {},
) {
  gsap.utils.toArray<HTMLElement>(selector).forEach((element) => {
    gsap.set(element, {
      transformOrigin: options.transformOrigin ?? "50% 50%",
      willChange: "transform, opacity, filter, clip-path",
    });

    gsap.fromTo(
      element,
      { ...from, autoAlpha: 0 },
      {
        x: 0,
        y: 0,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
        clipPath: "inset(0% 0 0% 0)",
        autoAlpha: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: options.start ?? "top 96%",
          end: options.end ?? "top 54%",
          scrub: options.scrub ?? 0.9,
          invalidateOnRefresh: true,
        },
      },
    );
  });
}

function createSectionTextReveals() {
  const horizontalTravel = () => Math.min(280, window.innerWidth * 0.24);

  const about = gsap.timeline({
    defaults: { duration: 1.25, ease: "power4.out" },
    scrollTrigger: {
      trigger: ".about",
      start: "top 78%",
      toggleActions: "play none none reverse",
      invalidateOnRefresh: true,
    },
  });

  about
    .fromTo(
      ".about > h2",
      {
        x: () => -horizontalTravel(),
        autoAlpha: 0,
        filter: "blur(8px)",
      },
      { x: 0, autoAlpha: 1, filter: "blur(0px)" },
      0,
    )
    .fromTo(
      ".about-copy",
      {
        x: horizontalTravel,
        autoAlpha: 0,
        filter: "blur(8px)",
      },
      { x: 0, autoAlpha: 1, filter: "blur(0px)" },
      0.12,
    )
    .fromTo(
      ".about .plus-link",
      { y: 36, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.75 },
      0.5,
    );

  const expertise = gsap.timeline({
    defaults: { duration: 1.2, ease: "power4.out" },
    scrollTrigger: {
      trigger: ".expertise",
      start: "top 78%",
      toggleActions: "play none none reverse",
      invalidateOnRefresh: true,
    },
  });

  expertise
    .fromTo(
      ".expertise > h2",
      {
        x: () => -horizontalTravel(),
        autoAlpha: 0,
        filter: "blur(8px)",
      },
      { x: 0, autoAlpha: 1, filter: "blur(0px)" },
      0,
    )
    .fromTo(
      ".service-row",
      {
        x: horizontalTravel,
        autoAlpha: 0,
        filter: "blur(6px)",
      },
      { x: 0, autoAlpha: 1, filter: "blur(0px)" },
      0.14,
    );
}

export function usePageMotion() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      createSectionTextReveals();

      scrubReveal(".service-number", { x: -120, rotate: -4 });
      scrubReveal(".architecture-copy h3", {
        y: 85,
        filter: "blur(7px)",
        clipPath: "inset(0 0 100% 0)",
      });
      scrubReveal(".architecture-copy p", {
        x: 150,
        filter: "blur(6px)",
      });

      scrubReveal(
        ".awards-heading h2, .award-title, .contact-inner > h2, .office-details h3",
        {
          y: 100,
          filter: "blur(8px)",
          clipPath: "inset(0 0 100% 0)",
        },
      );
      scrubReveal(".awards-heading > p, .contact-row, .office-tabs", {
        y: 72,
        filter: "blur(6px)",
      });
      scrubReveal(".architecture-photo, .award-photo", {
        y: 90,
        scale: 1.08,
        filter: "blur(8px)",
        clipPath: "inset(18% 0 18% 0)",
      });

      gsap.fromTo(
        ".wordmark-drift",
        { xPercent: 8 },
        {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: ".wordmark-window",
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );

      let disposed = false;
      document.fonts.ready.then(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
      return () => {
        disposed = true;
      };
    });
    return () => mm.revert();
  }, []);
}
