/* Light/dark theme for the Plastic TE pages. Adds a "Dark mode" toggle next to each
 * page's back link and sets body.te-dark. The choice is remembered per browser;
 * without a saved choice the system colour-scheme preference is used. */
(() => {
  "use strict";
  const KEY = "te-theme";
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  const read = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const write = (theme) => { try { localStorage.setItem(KEY, theme); } catch { /* storage unavailable */ } };
  const preferred = () => read() || (media && media.matches ? "dark" : "light");
  const buttons = [];

  function apply(theme) {
    const dark = theme === "dark";
    document.body.classList.toggle("te-dark", dark);
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(dark)));
  }

  document.querySelectorAll(".pt-page .page-shell > .back-link").forEach((link) => {
    const bar = document.createElement("div");
    bar.className = "te-page-tools";
    link.replaceWith(bar);
    bar.append(link);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "te-theme-toggle";
    button.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10 2.75a7.25 7.25 0 0 0 0 14.5z" fill="currentColor"/></svg><span>Dark mode</span>';
    button.addEventListener("click", () => {
      const next = document.body.classList.contains("te-dark") ? "light" : "dark";
      write(next);
      apply(next);
    });
    bar.append(button);
    buttons.push(button);
  });

  if (media) {
    const follow = () => { if (!read()) apply(preferred()); };
    if (media.addEventListener) media.addEventListener("change", follow);
    else if (media.addListener) media.addListener(follow);
  }
  apply(preferred());
})();
