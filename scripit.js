/* ── 1. Simple starfield background ────────────────────────────── */
(function starfield() {
  const SETTINGS = { count: 70, maxSize: 1.8, speed: 0.06 };
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: SETTINGS.count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 0.4 + Math.random() * SETTINGS.maxSize,
      a: 0.15 + Math.random() * 0.4,
      vy: SETTINGS.speed * (0.4 + Math.random()),
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.y -= s.vy;
      if (s.y < -4) { s.y = canvas.height + 4; s.x = Math.random() * canvas.width; }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(150, 210, 235," + s.a + ")";
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    // Draw one static frame only
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(150, 210, 235," + s.a + ")";
      ctx.fill();
    }
  } else {
    draw();
  }
})();

/* ── 2. Scroll-reveal: fade elements in as they enter the screen ── */
(function scrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();

/* ── 3. Gentle 3D tilt on cards (mouse only, skipped on touch) ── */
(function tiltCards() {
  const MAX_TILT = 6; // degrees — lower = calmer
  const fine = window.matchMedia("(pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || reduceMotion) return;

  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        "perspective(800px) rotateX(" + (-py * MAX_TILT).toFixed(2) + "deg) rotateY(" + (px * MAX_TILT).toFixed(2) + "deg)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    });
  });
})();