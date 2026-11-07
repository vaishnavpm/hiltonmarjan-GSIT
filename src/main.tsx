import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Hero } from "./Hero";
import gsap from "gsap";
import { usePageMotion } from "./usePageMotion";

import "./styles.css";

const asset = (name: string) => `/assets/${name}`;
function PlusLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a className="plus-link" href={href}>
      <span className="plus-icon">
        <img src={asset("44e34.svg")} alt="" />
      </span>
      {children}
    </a>
  );
}

function Expertise() {
  return (
    <section className="expertise section" id="expertise">
      <h2>Our Expertise</h2>
      <div className="service-row">
        <span>01</span>
        <span>Engineering</span>
      </div>
      <div className="architecture">
        <span className="service-number">02</span>
        <div className="architecture-copy">
          <h3>Architecture</h3>
          <span className="architecture-block" aria-hidden="true" />
          <p>
            JT Partners JT P is an international multidisciplinary consultant
            which offers a unique portfolio of architecture,
          </p>
        </div>
        <div className="architecture-photo">
          <img
            src={asset("9b6cd.png")}
            alt="Architectural rendering of a curved waterfront development"
            loading="lazy"
          />
        </div>
        <a
          href="#contact"
          className="expertise-more"
          aria-label="Discuss architecture services"
        >
          <span>
            <img src={asset("f7164.svg")} alt="" />
          </span>
        </a>
      </div>
    </section>
  );
}
function Awards() {
  const [open, setOpen] = useState(false);
  return (
    <section className="awards section" id="awards">
      <div className="awards-heading">
        <h2>
          Architectural
          <br />
          Excellence
        </h2>
        <p>
          Awards &amp;
          <br />
          Achievements
        </p>
      </div>
      <div className="award-progress">
        <span>
          01 <em>– 03</em>
        </span>
        <div>
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="award-content">
        <img
          className="award-photo"
          src={asset("605f1.png")}
          alt="DoubleTree by Hilton Jeddah International Property Award announcement"
          loading="lazy"
        />
        <div>
          <h3 className="award-title">
            <span>DoubleTree by Hilton</span>
            <span>&ndash; Jeddah recognised</span>
            <span>in International</span>
            <span>Award</span>
          </h3>
          <button
            className="plus-link"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span className="plus-icon">
              <img src={asset("44e34.svg")} alt="" />
            </span>
            {open ? "Read Less" : "Read More"}
          </button>
          {open && (
            <p className="award-note">
              DoubleTree by Hilton – Jeddah has been recognised in an
              international award. Further award details were not included in
              the supplied design.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
function Footer() {
  const [office, setOffice] = useState("Dubai");
  return (
    <footer id="contact">
      <div className="contact-inner">
        <h2>Let’s collaborate!</h2>
        <div className="contact-row">
          <div className="contact-links">
            <a href="tel:+97144521135">+971 4 452 1135</a>
            <a href="mailto:clients@jtpartners.com">
              clients<span>@</span>jtpartners.com
            </a>
          </div>
          <div className="socials">
            {["Instagram", "LinkedIn", "Facebook"].map((name) => (
              <a
                key={name}
                href={`https://${name.toLowerCase()}.com/`}
                target="_blank"
                rel="noreferrer"
                aria-label={`${name} (official profile URL not supplied)`}
              >
                {name}
                <img src={asset("21c02.svg")} alt="" />
              </a>
            ))}
          </div>
        </div>
        <div className="office-tabs" role="group" aria-label="Office location">
          {["Abu Dhabi", "Dubai", "Lebanon"].map((name) => (
            <button
              key={name}
              aria-pressed={office === name}
              onClick={() => setOffice(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="office-details" aria-live="polite">
          <h3>
            {office}
            {office === "Dubai" ? ", UAE" : ""}
          </h3>
          {office === "Dubai" ? (
            <p>
              P.O. Box 413606,Business Bay - Bay Square 8<br />
              Office #201 - 202
              <br />
              <b>T</b> 971 4 452 1135, <b>F</b> 971 4 452 0458
            </p>
          ) : (
            <p>
              <a href="mailto:clients@jtpartners.com">
                Contact our team for details
              </a>
            </p>
          )}
          <span className="address-block" aria-hidden="true" />
          <a
            className="contact-plus"
            href="mailto:clients@jtpartners.com"
            aria-label="Email JT & Partners"
          >
            <img src={asset("aa633.svg")} alt="" />
          </a>
        </div>
      </div>
      <div
        className="wordmark-window"
        aria-hidden="true"
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse")
            gsap.to(event.currentTarget.querySelector(".wordmark-track"), {
              xPercent: -50,
              duration: 5,
              ease: "none",
              repeat: -1,
              overwrite: "auto",
            });
        }}
        onPointerLeave={(event) => {
          const track = event.currentTarget.querySelector(".wordmark-track");
          gsap.killTweensOf(track);
          gsap.to(track, {
            xPercent: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: true,
          });
        }}
      >
        <div className="wordmark-drift">
          <div className="wordmark-track">
            <span className="wordmark">JT &amp; Partners</span>
            <span className="wordmark">JT &amp; Partners</span>
          </div>
        </div>
      </div>
      <div className="copyright">
        ©2025 JT &amp; Partners. All Rights Reserved
      </div>
    </footer>
  );
}
function App() {
  usePageMotion();
  return (
    <>
      <a className="skip-link" href="#about">
        Skip to main content
      </a>
      <main>
        <Hero />
        <section className="about section" id="about">
          <h2>
            Design the future
            <br />
            Now
          </h2>
          <div className="about-copy">
            <p>
              JT Partners JT P is an international multidisciplinary consultant
              which offers a unique portfolio of architecture, planning,
              engineering, project management, infrastructure and cost
              consultancy services.
            </p>
            <PlusLink href="#expertise">Know More Us</PlusLink>
          </div>
        </section>
        <Expertise />
        <Awards />
      </main>
      <Footer />
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

import "./refinements.css";
