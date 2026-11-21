/* Shared light/dark choice for the TE-PlotBench explorer pages ("te-theme", also reading and
 * mirroring the older "tepb-theme"). The inline script in <head> applies it before first paint. */
(() => {
  const root = document.documentElement;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const read = () => { try { return localStorage.getItem("te-theme") || localStorage.getItem("tepb-theme"); } catch (e) { return null; } };
  const apply = (theme) => {
    root.dataset.theme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(theme === "dark"));
      button.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    });
  };
  apply(read() || (mq.matches ? "dark" : "light"));
  if (mq.addEventListener) mq.addEventListener("change", () => { if (!read()) apply(mq.matches ? "dark" : "light"); });
  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      try { localStorage.setItem("te-theme", next); localStorage.setItem("tepb-theme", next); } catch (e) { /* storage unavailable */ }
      apply(next);
    });
  });
})();

/* Mobile menu: same behaviour as the homepage header. */
(() => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.getElementById("siteNav");
  if (!toggle || !nav) return;
  const close = () => { document.body.classList.remove("nav-open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => toggle.setAttribute("aria-expanded", String(document.body.classList.toggle("nav-open"))));
  nav.addEventListener("click", (event) => { if (event.target.closest("a")) close(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => { if (event.matches) close(); });
})();
