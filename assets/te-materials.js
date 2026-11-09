(() => {
  const research = document.querySelector("main");
  if (!research) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  research.querySelectorAll("[data-te-jump]").forEach((link) => {
    link.addEventListener("click", (event) => {
      const section = document.getElementById(link.dataset.teJump);
      if (!section) return;
      event.preventDefault();
      // Keep the chapter's view hash intact for local section and reference links.
      section.scrollIntoView({ behavior: reduceMotion.matches ? "instant" : "smooth", block: "start" });
      const heading = section.querySelector("h3") || section;
      heading?.focus({ preventScroll: true });
    });
  });

  const dialog = document.getElementById("te-figure-dialog");
  if (!dialog) return;
  const dialogImage = dialog.querySelector("img");
  const dialogTitle = dialog.querySelector("h3");
  const dialogCaption = dialog.querySelector("p");
  const fullSizeLink = dialog.querySelector("[data-te-full-size]");
  let trigger = null;

  research.querySelectorAll("[data-te-figure]").forEach((button) => {
    button.addEventListener("click", () => {
      trigger = button;
      dialogImage.src = button.dataset.teFigure;
      fullSizeLink.href = button.dataset.teFigure;
      dialogImage.alt = button.dataset.figureAlt || button.querySelector("img")?.alt || button.dataset.figureTitle;
      dialogTitle.textContent = button.dataset.figureTitle;
      dialogCaption.textContent = button.dataset.figureCaption;
      dialog.showModal();
      document.body.classList.add("te-figure-open");
    });
  });

  dialog.querySelector("[data-te-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("te-figure-open");
    trigger?.focus({ preventScroll: true });
  });
  const closeOnNavigation = () => { if (dialog.open) dialog.close(); };
  window.addEventListener("hashchange", closeOnNavigation);
  window.addEventListener("pageviewchange", closeOnNavigation);
})();
