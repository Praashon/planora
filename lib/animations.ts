import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function revealHeading(el: HTMLElement | null) {
  if (!el) return;
  const words = el.innerText.split(" ");
  el.innerHTML = words
    .map((w) => `<span class="inline-block overflow-hidden"><span class="reveal-word inline-block translate-y-full">${w}</span></span>`)
    .join(" ");

  gsap.to(el.querySelectorAll(".reveal-word"), {
    y: 0,
    duration: 1,
    stagger: 0.04,
    ease: "power4.out",
  });
}

export function scrollReveal(
  el: HTMLElement | null,
  opts?: { y?: number; delay?: number; stagger?: number },
) {
  if (!el) return;
  const children = el.children.length > 1 ? el.children : [el];
  gsap.fromTo(
    children,
    { opacity: 0, y: opts?.y ?? 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: opts?.stagger ?? 0.1,
      delay: opts?.delay ?? 0,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
    },
  );
}

export function fadeIn(
  el: HTMLElement | null,
  opts?: { delay?: number; duration?: number },
) {
  if (!el) return;
  gsap.fromTo(
    el,
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      duration: opts?.duration ?? 0.8,
      delay: opts?.delay ?? 0,
      ease: "power3.out",
    },
  );
}

export function parallaxFloat(el: HTMLElement | null) {
  if (!el) return;
  gsap.to(el, {
    y: -8,
    duration: 2.5,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
}
