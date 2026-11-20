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

const viewAliases = {
  "current-work": "agent-workspace",
  "te-materials": "plastic-te",
  mechanics: "plastic-te-mechanics",
  "plastic-te-flexibility": "plastic-te-mechanics",
};

function viewFromHash() {
  const hash = window.location.hash.replace("#", "");
  const candidate = viewAliases[hash] || hash;
  return views.some((view) => view.id === candidate) ? candidate : "home";
}

function setActiveView(viewId, options = {}) {
  const resolvedId = viewAliases[viewId] || viewId;
  const targetId = views.some((view) => view.id === resolvedId) ? resolvedId : "home";
  const targetView = views.find((view) => view.id === targetId);
  const shouldPush = options.push ?? true;

  views.forEach((view) => {
    const isActive = view.id === targetId;
    view.hidden = !isActive;
    view.classList.toggle("is-active", isActive);
  });

  viewLinks.forEach((link) => {
    const active = link.dataset.viewLink === targetId ||
      (link.closest("[data-nav]") && link.dataset.viewLink === targetView?.dataset.viewParent);
    link.classList.toggle("is-active", Boolean(active));
    if (active && link.closest("[data-nav]")) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  closeNavigation();
  document.body.classList.toggle("plastic-te-active", Boolean(targetView?.classList.contains("pt-page")));

  if (shouldPush) {
    history.pushState({ view: targetId }, "", `#${targetId}`);
  } else if (viewAliases[window.location.hash.slice(1)]) {
    history.replaceState({ view: targetId }, "", `#${targetId}`);
  }

  document.title = targetView?.dataset.pageTitle ? `${targetView.dataset.pageTitle} | Heyang Chen` : "Heyang Chen";
  window.dispatchEvent(new CustomEvent("pageviewchange", { detail: { viewId: targetId } }));
  window.scrollTo({ top: 0, behavior: "instant" });
  if (shouldPush) {
    const heading = targetView?.querySelector("h1, h2");
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
  }
}

viewLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
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

setActiveView(viewFromHash(), { push: false });
