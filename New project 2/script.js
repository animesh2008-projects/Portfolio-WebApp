const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const loader = document.getElementById("loader");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const siteHeader = document.querySelector(".site-header");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const navLinkById = new Map(navLinks.map((link) => [link.getAttribute("href")?.slice(1), link]));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const scrollProgress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
const motionToggle = document.getElementById("motionToggle");
const contactForm = document.getElementById("contactForm");
const formNote = document.getElementById("formNote");
const typedRole = document.getElementById("typedRole");
const commandInput = document.getElementById("commandInput");
const commandOutput = document.getElementById("commandOutput");
const heroCard = document.getElementById("heroCard");
const cursorGlow = document.getElementById("cursorGlow");
const interactiveCards = document.querySelectorAll(".glass-card");
let animationsPaused = false;
let scrollTicking = false;
let loaderFinished = false;

function finishLoader() {
  if (loaderFinished) {
    return;
  }

  loaderFinished = true;
  requestScrollUpdate();

  window.setTimeout(() => {
    document.body.classList.add("is-loaded");
  }, 250);
}

window.addEventListener("DOMContentLoaded", finishLoader, { once: true });
window.addEventListener("load", finishLoader, { once: true });

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("is-open");
    siteNav.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("is-open");
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

const roles = [
  "Java Developer",
  "Problem Solver",
  "Tech Enthusiast",
  "Web Creator"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function runTypingEffect() {
  if (!typedRole) {
    return;
  }

  const currentRole = roles[roleIndex];
  const nextText = isDeleting
    ? currentRole.slice(0, charIndex - 1)
    : currentRole.slice(0, charIndex + 1);

  typedRole.textContent = nextText;
  charIndex = nextText.length;

  let delay = isDeleting ? 55 : 105;

  if (!isDeleting && nextText === currentRole) {
    delay = 1400;
    isDeleting = true;
  } else if (isDeleting && nextText.length === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }

  window.setTimeout(runTypingEffect, prefersReducedMotion ? 1400 : delay);
}

if (prefersReducedMotion && typedRole) {
  typedRole.textContent = roles[0];
} else if (typedRole) {
  runTypingEffect();
}

const revealElements = document.querySelectorAll("[data-reveal]");
const counted = new WeakSet();

if (!prefersReducedMotion) {
  const revealStyles = ["reveal-left", "reveal-right", "reveal-zoom"];

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index * 45, 360)}ms`;
    if (!element.classList.contains("hero__content") && index % 3 !== 0) {
      element.classList.add(revealStyles[index % revealStyles.length]);
    }
  });
}

function animateCount(element) {
  if (counted.has(element)) {
    return;
  }

  counted.add(element);
  const target = Number(element.dataset.target || 0);
  const duration = prefersReducedMotion ? 0 : 1200;
  const startTime = performance.now();

  function update(currentTime) {
    if (duration === 0) {
      element.textContent = String(target);
      return;
    }

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.floor(target * eased));

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = String(target);
    }
  }

  requestAnimationFrame(update);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");

      if (entry.target.classList.contains("stat-card")) {
        const number = entry.target.querySelector(".stat-card__number");
        if (number) {
          animateCount(number);
        }
      }

      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18
  }
);

revealElements.forEach((element) => observer.observe(element));

const terminalStates = [
  {
    command: "npm run build-portfolio",
    output: "Compiling ideas into polished project experiences..."
  },
  {
    command: "git commit -m \"keep-learning\"",
    output: "Saving progress through practice, curiosity, and consistent building."
  },
  {
    command: "java Main --focus growth",
    output: "Running strong foundations in Java, DSA, and software thinking."
  },
  {
    command: "deploy --target future-role",
    output: "Shipping toward a dependable software developer career."
  }
];

let terminalIndex = 0;

function renderTerminalState(index) {
  if (!commandInput || !commandOutput) {
    return;
  }

  commandInput.textContent = terminalStates[index].command;
  commandOutput.textContent = terminalStates[index].output;
}

if (commandInput && commandOutput) {
  renderTerminalState(terminalIndex);

  if (!prefersReducedMotion) {
    window.setInterval(() => {
      if (animationsPaused || document.hidden) {
        return;
      }

      commandInput.style.opacity = "0.35";
      commandOutput.style.opacity = "0.35";

      window.setTimeout(() => {
        terminalIndex = (terminalIndex + 1) % terminalStates.length;
        renderTerminalState(terminalIndex);
        commandInput.style.opacity = "1";
        commandOutput.style.opacity = "1";
      }, 180);
    }, 2600);
  }
}

function updateScrollState() {
  const scrollY = window.scrollY;
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  const progress = Math.min(scrollY / maxScroll, 1);

  if (scrollProgress) {
    scrollProgress.style.transform = `scaleX(${progress})`;
  }

  siteHeader?.classList.toggle("is-scrolled", scrollY > 20);
  backToTop?.classList.toggle("is-visible", scrollY > 500);

  scrollTicking = false;
}

function requestScrollUpdate() {
  if (scrollTicking) {
    return;
  }

  scrollTicking = true;
  requestAnimationFrame(updateScrollState);
}

window.addEventListener("scroll", requestScrollUpdate, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
updateScrollState();

function setActiveSection(id) {
  sections.forEach((section) => {
    section.classList.toggle("is-current", section.id === id);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link === navLinkById.get(id));
  });
}

const activeSectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries.find((entry) => entry.isIntersecting);
    if (visibleEntry) {
      setActiveSection(visibleEntry.target.id);
    }
  },
  {
    rootMargin: "-42% 0px -42% 0px",
    threshold: 0
  }
);

sections.forEach((section) => activeSectionObserver.observe(section));
setActiveSection(sections[0]?.id);

backToTop?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: prefersReducedMotion ? "auto" : "smooth"
  });
});

function setAnimationsPaused(paused) {
  animationsPaused = paused;
  document.body.classList.toggle("motion-paused", paused);

  if (motionToggle) {
    motionToggle.classList.toggle("is-paused", paused);
    motionToggle.setAttribute("aria-pressed", String(paused));
    motionToggle.setAttribute("aria-label", paused ? "Resume animations" : "Pause animations");
    const label = motionToggle.querySelector("span");
    if (label) {
      label.textContent = paused ? "Play" : "Pause";
    }
  }
}

motionToggle?.addEventListener("click", () => {
  setAnimationsPaused(!animationsPaused);
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name")?.value.trim() || "";
  const email = document.getElementById("email")?.value.trim() || "";
  const message = document.getElementById("message")?.value.trim() || "";

  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  const mailtoLink = `mailto:animeshkarmakar882@gmail.com?subject=${subject}&body=${body}`;

  formNote.textContent = "Opening your email app with the message ready to send...";
  window.location.href = mailtoLink;
  contactForm.reset();

  window.setTimeout(() => {
    formNote.textContent = "This form opens your default email app with the message filled in.";
  }, 2600);
});

if (!prefersReducedMotion && hasFinePointer && heroCard) {
  heroCard.addEventListener("mousemove", (event) => {
    const rect = heroCard.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
    heroCard.style.transform = `rotateY(${x * 10}deg) rotateX(${y * -10}deg) translateY(-4px)`;
  });

  heroCard.addEventListener("mouseleave", () => {
    heroCard.style.transform = "rotateY(0deg) rotateX(0deg) translateY(0)";
  });
}

if (!prefersReducedMotion && hasFinePointer) {
  interactiveCards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--glow-x", `${x}%`);
      card.style.setProperty("--glow-y", `${y}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--glow-x", "50%");
      card.style.setProperty("--glow-y", "50%");
    });
  });
}

if (!prefersReducedMotion && hasFinePointer && cursorGlow) {
  window.addEventListener("pointermove", (event) => {
    cursorGlow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  });
} else if (cursorGlow) {
  cursorGlow.style.display = "none";
}

const particleCanvas = document.getElementById("particleCanvas");
const particleContext = particleCanvas?.getContext("2d");
const shouldRunParticles = !prefersReducedMotion && hasFinePointer;

if (particleCanvas && particleContext && shouldRunParticles) {
  const context = particleContext;
  let particles = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;
  let resizeFrame = 0;

  function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    particleCanvas.width = Math.floor(width * ratio);
    particleCanvas.height = Math.floor(height * ratio);
    particleCanvas.style.width = `${width}px`;
    particleCanvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const count = Math.max(24, Math.min(56, Math.floor(width / 26)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.8 + 1
    }));
  }

  function scheduleResizeCanvas() {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(resizeCanvas);
  }

  function renderParticles() {
    if (animationsPaused || document.hidden) {
      animationFrame = requestAnimationFrame(renderParticles);
      return;
    }

    context.clearRect(0, 0, width, height);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20) particle.x = width + 20;
      if (particle.x > width + 20) particle.x = -20;
      if (particle.y < -20) particle.y = height + 20;
      if (particle.y > height + 20) particle.y = -20;

      context.beginPath();
      context.fillStyle = "rgba(121, 229, 213, 0.68)";
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
        const other = particles[otherIndex];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 120) {
          context.beginPath();
          context.strokeStyle = `rgba(72, 229, 194, ${0.12 - distance / 1100})`;
          context.lineWidth = 1;
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }
    });

    animationFrame = requestAnimationFrame(renderParticles);
  }

  resizeCanvas();
  renderParticles();
  window.addEventListener("resize", scheduleResizeCanvas);
  window.addEventListener("beforeunload", () => {
    cancelAnimationFrame(animationFrame);
    cancelAnimationFrame(resizeFrame);
  });
} else if (particleCanvas) {
  particleCanvas.style.display = "none";
}
