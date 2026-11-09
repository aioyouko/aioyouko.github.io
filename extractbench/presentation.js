(() => {
  "use strict";
  const chapters = [...document.querySelectorAll("[data-chapter]")];
  const toggle = document.getElementById("presentToggle");
  const pager = document.getElementById("presentPager");
  const previous = document.getElementById("previousChapter");
  const next = document.getElementById("nextChapter");
  const progress = document.getElementById("chapterProgress");
  let presenting = false;
  let current = 0;

  function showChapter(index, moveFocus = true) {
    current = Math.max(0, Math.min(index, chapters.length - 1));
    chapters.forEach((chapter, i) => chapter.classList.toggle("present-active", i === current));
    previous.disabled = current === 0;
    next.disabled = current === chapters.length - 1;
    progress.textContent = `${current + 1} / ${chapters.length} · ${chapters[current].dataset.chapter}`;
    if (presenting) {
      history.replaceState(null, "", `${location.pathname}${location.search}#${chapters[current].id}`);
      window.scrollTo({ top: 0, behavior: "instant" });
      if (moveFocus) {
        const heading = chapters[current].querySelector("h1, h2");
        heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
      }
    }
  }

  function setPresenting(value) {
    presenting = value;
    document.body.classList.toggle("presenting", value);
    toggle.setAttribute("aria-pressed", String(value));
    toggle.textContent = value ? "Exit presentation" : "Present";
    pager.hidden = !value;
    if (value) {
      const target = document.getElementById(location.hash.slice(1));
      const index = chapters.findIndex(chapter => chapter === target || chapter.contains(target));
      showChapter(index < 0 ? 0 : index);
    } else {
      chapters[current].scrollIntoView({ block: "start", behavior: "instant" });
      toggle.focus({ preventScroll: true });
    }
  }

  function revealAnchor() {
    const target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    let parent = target.parentElement;
    let opened = false;
    while (parent) {
      if (parent.tagName === "DETAILS" && !parent.open) { parent.open = true; opened = true; }
      parent = parent.parentElement;
    }
    if (presenting) {
      const index = chapters.findIndex(chapter => chapter === target || chapter.contains(target));
      if (index >= 0) {
        // Keep a deep anchor when navigating to evidence within a chapter.
        const hash = location.hash;
        showChapter(index, false);
        history.replaceState(null, "", `${location.pathname}${location.search}${hash}`);
      } else {
        setPresenting(false);
      }
      target.scrollIntoView({ block: "start", behavior: "instant" });
    } else if (opened) {
      target.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }

  toggle.hidden = false;
  toggle.addEventListener("click", () => setPresenting(!presenting));
  previous.addEventListener("click", () => showChapter(current - 1));
  next.addEventListener("click", () => showChapter(current + 1));
  document.getElementById("exitPresentation").addEventListener("click", () => setPresenting(false));
  document.addEventListener("keydown", event => {
    if (!presenting || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === "Escape") { setPresenting(false); return; }
    // Preserve native select, text-input, button and horizontally scrolling table behavior.
    if (event.target.closest("input,select,textarea,button,a,summary,[contenteditable],[role=region]")) return;
    if (event.key === "ArrowRight" && current < chapters.length - 1) {
      event.preventDefault(); showChapter(current + 1);
    } else if (event.key === "ArrowLeft" && current > 0) {
      event.preventDefault(); showChapter(current - 1);
    }
  });
  window.addEventListener("hashchange", revealAnchor);
  revealAnchor();

  const unitMode = document.getElementById("unitMode");
  unitMode.hidden = false;
  document.getElementById("unitModeLabel").hidden = false;
  unitMode.addEventListener("change", () => {
    const missed = unitMode.value === "missed";
    document.getElementById("unitExample").classList.toggle("unit-missed", missed);
    document.getElementById("convertedSeebeck").textContent = missed ? "0.2 μV/K" : "200 μV/K";
    document.getElementById("computedPF").textContent = missed ? "0.000004 mW/(m·K²)" : "4 mW/(m·K²)";
    document.getElementById("unitVerdict").textContent = missed
      ? "A missed prefix makes the calculated power factor one million times too small."
      : "With the units converted, the extracted values agree with the power-factor panel.";
  });
})();
