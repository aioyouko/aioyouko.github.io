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
