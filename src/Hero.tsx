import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "./projects";

gsap.registerPlugin(ScrollTrigger);
const project = projects[0];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [menu, setMenu] = useState(false);
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(
      "(prefers-reduced-motion: reduce)",
      () => {
        setReduced(true);
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 2.6),
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setExpanded(self.progress >= 0.14),
        });
        trigger.current = st;
        return () => {
          trigger.current = null;
        };
      },
      root,
    );
    mm.add(
      "(prefers-reduced-motion: no-preference)",
      () => {
        setReduced(false);
        const select = gsap.utils.selector(root);

        // Keep the load-in and the scroll sequence on separate elements.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            select(".project-heading h1"),
            { y: 42, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.15 },
            0.1,
          )
          .fromTo(
            select(".pills"),
            { y: 16, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.75 },
            0.38,
          )
          .fromTo(
            select(".hero-bar"),
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.8 },
            0.28,
          );

        const sequence = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            id: "featured-project-scroll",
            trigger: root.current,
            start: "top top",
            end: () => "+=" + Math.round(window.innerHeight * 2.6),
            pin: true,
            pinSpacing: true,
            scrub: 0.75,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => setExpanded(self.progress >= 0.36),
          },
        });
        sequence
          .fromTo(
            select(".project-heading"),
            { autoAlpha: 1, y: 0 },
            { autoAlpha: 0, y: -24, duration: 0.17 },
            0.01,
          )
          .fromTo(
            select(".project-photo"),
            { scale: 1 },
            { scale: 1.045, duration: 1 },
            0,
          )
          .fromTo(
            select(".directional-shade"),
            { opacity: 0 },
            { opacity: 0.84, duration: 0.5 },
            0.12,
          )
          .fromTo(
            select(".project-details"),
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.22 },
            0.2,
          )
          .fromTo(
            select(".detail-rule"),
            { scaleX: 0 },
            { scaleX: 1, duration: 0.28 },
            0.46,
          )
          .fromTo(
            select(".rail-progress"),
            { scaleY: 0 },
            { scaleY: 1, duration: 1 },
            0,
          );
        trigger.current = sequence.scrollTrigger!;
        let disposed = false;
        document.fonts.ready.then(() => {
          if (!disposed) ScrollTrigger.refresh();
        });
        return () => {
          disposed = true;
          trigger.current = null;
        };
      },
      root,
    );

    return () => mm.revert();
  }, []);

  useLayoutEffect(() => {
    if (!menu || reduced) return;
    const context = gsap.context(() => {
      gsap.from(".menu", { autoAlpha: 0, y: 12, duration: 0.25 });
      gsap.from(".menu a", {
        y: 10,
        opacity: 0,
        stagger: 0.045,
        duration: 0.3,
      });
    }, root);
    return () => context.revert();
  }, [menu, reduced]);

  function handleKey(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape") setMenu(false);
    if (
      event.target === event.currentTarget &&
      (event.key === "Enter" || event.key === " ")
    ) {
      event.preventDefault();
      const st = trigger.current;
      if (st)
        window.scrollTo({
          top: expanded ? st.start : st.start + (st.end - st.start) * 0.72,
          behavior: "smooth",
        });
    }
  }

  return (
    <section
      ref={root}
      tabIndex={0}
      className={
        "hero hero-single " +
        (reduced ? "motion-reduced " : "") +
        (expanded ? "is-expanded" : "")
      }
      id="projects"
      aria-label="Featured project, scroll to reveal project details"
      onKeyDown={handleKey}
    >
      <aside className="project-rail">
        <span>Featured Projects</span>
        <div className="rail-segments" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <i key={index} className={index === 4 ? "active" : ""} />
          ))}
        </div>
        <div className="rail-count">
          <b>02</b>
          <span> - 06</span>
        </div>
      </aside>
      <div className="project-stage">
        <article className="project">
          <img
            className="project-photo"
            src={project.image}
            alt="Hilton Marjan Island resort at sunset"
            fetchPriority="high"
          />
          <div className="top-shade" />
          <div className="directional-shade" />
          <div className="project-heading" aria-hidden={expanded}>
            <h1>{project.title}</h1>
            <div className="pills">
              <span>{project.status}</span>
              <span>{project.client}</span>
            </div>
          </div>
          <div
            className="project-details"
            id="project-details"
            aria-hidden={!expanded}
          >
            <h2>{project.title}</h2>
            <dl>
              <div>
                <dt>Client</dt>
                <dd>{project.client}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{project.type}</dd>
              </div>
            </dl>
            <div className="detail-rule" />
            <p>{project.description}</p>
          </div>
        </article>
      </div>
      <div className="hero-bar">
        <a href="#projects" aria-label="JT & Partners home">
          <span className="logo">
            <img src="/assets/514e0.svg" alt="JT & Partners" />
          </span>
          <span className="hero-block" aria-hidden="true" />
        </a>
        <button
          className="menu-toggle"
          aria-expanded={menu}
          aria-controls="main-navigation"
          aria-label={menu ? "Close navigation" : "Open navigation"}
          onClick={() => setMenu((value) => !value)}
        >
          <span className="menu-icon" aria-hidden="true">
            <span className="menu-bar" />
            <span className="menu-bar" />
            <span className="menu-bar" />
          </span>
        </button>
        {menu && (
          <nav className="menu" id="main-navigation">
            {[
              ["About", "about"],
              ["Expertise", "expertise"],
              ["Awards", "awards"],
              ["Contact", "contact"],
            ].map(([label, id]) => (
              <a key={id} href={"#" + id} onClick={() => setMenu(false)}>
                {label}
                <span>↗</span>
              </a>
            ))}
          </nav>
        )}
      </div>
    </section>
  );
}
