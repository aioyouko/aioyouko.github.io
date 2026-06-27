const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const views = Array.from(document.querySelectorAll("[data-view]"));
const viewLinks = Array.from(document.querySelectorAll("[data-view-link]"));
const personalTabs = Array.from(document.querySelectorAll("[data-personal-tab]"));
const personalPanels = Array.from(document.querySelectorAll("[data-personal-panel]"));

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeNavigation();
    }
  });
}

function closeNavigation() {
  document.body.classList.remove("nav-open");
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", "false");
  }
}

function setPersonalPanel(panelId) {
  personalTabs.forEach((tab) => {
    const isActive = tab.dataset.personalTab === panelId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  personalPanels.forEach((panel) => {
    const isActive = panel.id === panelId;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

personalTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    if (tab.dataset.personalTab) {
      setPersonalPanel(tab.dataset.personalTab);
    }
  });

  tab.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextTab = personalTabs[(index + direction + personalTabs.length) % personalTabs.length];
    nextTab.focus();
    if (nextTab.dataset.personalTab) {
      setPersonalPanel(nextTab.dataset.personalTab);
    }
  });
});

function viewFromHash() {
  const candidate = window.location.hash.replace("#", "");
  return views.some((view) => view.id === candidate) ? candidate : "home";
}

function setActiveView(viewId, options = {}) {
  const targetId = views.some((view) => view.id === viewId) ? viewId : "home";
  const shouldPush = options.push ?? true;

  views.forEach((view) => {
    const isActive = view.id === targetId;
    view.hidden = !isActive;
    view.classList.toggle("is-active", isActive);
  });

  viewLinks.forEach((link) => {
    link.classList.toggle("is-active", link.dataset.viewLink === targetId);
  });

  closeNavigation();

  if (shouldPush) {
    history.pushState({ view: targetId }, "", `#${targetId}`);
  }

  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
}

viewLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.dataset.viewLink;
    if (!targetId) {
      return;
    }

    event.preventDefault();
    setActiveView(targetId);
  });
});

window.addEventListener("popstate", () => {
  setActiveView(viewFromHash(), { push: false });
});

window.addEventListener("hashchange", () => {
  setActiveView(viewFromHash(), { push: false });
});

const canvas = document.querySelector("#lattice-canvas");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

setActiveView(viewFromHash(), { push: false });

if (canvas instanceof HTMLCanvasElement) {
  const context = canvas.getContext("2d");
  const palette = {
    teal: "rgba(8, 118, 108, 0.5)",
    copper: "rgba(182, 95, 36, 0.45)",
    plum: "rgba(104, 75, 115, 0.38)",
    ink: "rgba(30, 42, 49, 0.2)",
    node: "rgba(255, 250, 243, 0.86)",
  };

  const points = [];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    points.length = 0;
    const spacing = Math.max(58, Math.min(88, width / 13));
    const columns = Math.ceil(width / spacing) + 2;
    const rows = Math.ceil(height / spacing) + 2;

    for (let y = -1; y < rows; y += 1) {
      for (let x = -1; x < columns; x += 1) {
        points.push({
          x: x * spacing + (y % 2) * spacing * 0.5,
          y: y * spacing * 0.86,
          shift: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  function draw(time = 0) {
    context.clearRect(0, 0, width, height);

    const gradient = context.createLinearGradient(width * 0.08, height * 0.1, width * 0.92, height * 0.88);
    gradient.addColorStop(0, palette.teal);
    gradient.addColorStop(0.52, palette.copper);
    gradient.addColorStop(1, palette.plum);

    context.lineWidth = 1;
    context.strokeStyle = "rgba(30, 42, 49, 0.12)";

    for (const point of points) {
      const wobble = prefersReducedMotion ? 0 : Math.sin(time * 0.001 + point.shift) * 2.8;
      const px = point.x + wobble;
      const py = point.y + Math.cos(time * 0.0012 + point.shift) * 2;

      for (const neighbor of points) {
        const dx = neighbor.x - point.x;
        const dy = neighbor.y - point.y;
        const distance = Math.hypot(dx, dy);

        if (distance > 52 && distance < 92 && neighbor.x > point.x - 2) {
          context.beginPath();
          context.moveTo(px, py);
          context.lineTo(neighbor.x, neighbor.y);
          context.stroke();
        }
      }
    }

    for (const point of points) {
      const pulse = prefersReducedMotion ? 0 : Math.sin(time * 0.002 + point.shift) * 1.2;
      context.beginPath();
      context.fillStyle = gradient;
      context.arc(point.x, point.y, 5.2 + pulse, 0, Math.PI * 2);
      context.fill();

      context.beginPath();
      context.fillStyle = palette.node;
      context.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
      context.fill();
    }

    const waveX = width * 0.68 + Math.sin(time * 0.0007) * width * 0.05;
    const heat = context.createRadialGradient(waveX, height * 0.46, 30, waveX, height * 0.46, width * 0.36);
    heat.addColorStop(0, "rgba(182, 95, 36, 0.24)");
    heat.addColorStop(0.4, "rgba(8, 118, 108, 0.1)");
    heat.addColorStop(1, "rgba(104, 75, 115, 0)");
    context.fillStyle = heat;
    context.fillRect(0, 0, width, height);

    if (!prefersReducedMotion) {
      animationFrame = requestAnimationFrame(draw);
    }
  }

  resize();
  draw();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(animationFrame);
    resize();
    draw();
  });
}
