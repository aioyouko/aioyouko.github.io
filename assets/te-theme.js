/* Site-wide light/dark theme. One toggle sits in the site header on every page
 * (homepage, Plastic TE, Agent Workspace, About, Contact; TE-PlotBench uses the same
 * button and the same saved choice). It sets body.te-dark. The choice is remembered per
 * browser under "te-theme" (mirrored to TE-PlotBench's older "tepb-theme" key); without
 * a saved choice the system colour-scheme preference is used. An inline script at the
 * top of <body> applies the saved theme before first paint. */
(() => {
  "use strict";
  const KEY = "te-theme";
  const LEGACY_KEY = "tepb-theme";
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const read = () => { try { return localStorage.getItem(KEY) || localStorage.getItem(LEGACY_KEY); } catch { return null; } };
  const write = (theme) => { try { localStorage.setItem(KEY, theme); localStorage.setItem(LEGACY_KEY, theme); } catch { /* storage unavailable */ } };
  const preferred = () => read() || (media && media.matches ? "dark" : "light");
  const buttons = Array.from(document.querySelectorAll("[data-theme-toggle]"));

  function apply(theme) {
    const dark = theme === "dark";
    document.body.classList.toggle("te-dark", dark);
    buttons.forEach((button) => {
      button.setAttribute("aria-pressed", String(dark));
      button.title = dark ? "Switch to light mode" : "Switch to dark mode";
    });
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const next = document.body.classList.contains("te-dark") ? "light" : "dark";
      write(next);
      apply(next);
    });
  });

  if (media) {
    const follow = () => { if (!read()) apply(preferred()); };
    if (media.addEventListener) media.addEventListener("change", follow);
    else if (media.addListener) media.addListener(follow);
  }
  apply(preferred());
})();
