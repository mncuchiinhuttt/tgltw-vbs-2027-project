(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector("#site-nav");

  const closeMenu = () => {
    if (!menuToggle || !siteNav) return;
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const filterButtons = document.querySelectorAll(".filter-button");
  const newsItems = document.querySelectorAll(".news-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((candidate) => {
        const isActive = candidate === button;
        candidate.classList.toggle("is-active", isActive);
        candidate.setAttribute("aria-pressed", String(isActive));
      });

      newsItems.forEach((item) => {
        const visible = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("is-hidden", !visible);
      });
    });
  });

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const copyButton = document.querySelector("#copy-citation");
  const citationText = document.querySelector("#citation-text");
  if (copyButton && citationText) {
    copyButton.addEventListener("click", async () => {
      const originalLabel = copyButton.textContent;

      try {
        await navigator.clipboard.writeText(citationText.textContent.trim());
      } catch {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(citationText);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }

      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = originalLabel;
      }, 1600);
    });
  }
})();
