/* ============================================================
   Ngedit.Sa — Portfolio Script
   - Mobile nav toggle
   - YouTube modal with iframe embed (no new tab)
   - Prev / Next navigation
   - Keyboard & backdrop close
   ============================================================ */

(function () {
  "use strict";

  /* ── Mobile Nav ── */
  const menuBtn = document.getElementById("menuBtn");
  const mobileNav = document.getElementById("mobileNav");

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("open");
      menuBtn.classList.toggle("open", open);
      menuBtn.setAttribute("aria-expanded", open);
    });

    // Close nav when a link is clicked
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        menuBtn.classList.remove("open");
        menuBtn.setAttribute("aria-expanded", false);
      });
    });
  }

  /* ── Collect all cards ── */
  const cards = Array.from(document.querySelectorAll(".card[data-youtube-id]"));
  let currentIndex = 0;

  /* ── Modal elements ── */
  const modal = document.getElementById("modal");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalClose = document.getElementById("modalClose");
  const modalTitle = document.getElementById("modalTitle");
  const modalCategory = document.getElementById("modalCategory");
  const modalCounter = document.getElementById("modalCounter");
  const modalPrev = document.getElementById("modalPrev");
  const modalNext = document.getElementById("modalNext");
  const modalVideoWrap = document.querySelector(".modal-video-wrap");

  /* ── Helpers ── */
  function getYtId(card) {
    return card.dataset.youtubeId || "";
  }

  // YouTube Shorts need different embed path
  function buildEmbedUrl(ytId) {
    return (
      "https://www.youtube.com/embed/" +
      ytId +
      "?autoplay=1&rel=0&playsinline=1&modestbranding=1"
    );
  }

  function injectIframe(ytId) {
    // Remove any existing iframe
    const existing = modalVideoWrap.querySelector("iframe");
    if (existing) existing.remove();

    const iframe = document.createElement("iframe");
    iframe.src = buildEmbedUrl(ytId);
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("allow", "autoplay; encrypted-media; picture-in-picture");
    iframe.setAttribute("title", "YouTube video player");
    iframe.setAttribute("frameborder", "0");
    iframe.className = "modal-iframe";
    modalVideoWrap.appendChild(iframe);
  }

  function stopVideo() {
    const iframe = modalVideoWrap.querySelector("iframe");
    if (iframe) {
      iframe.src = "";
      iframe.remove();
    }
  }

  function updateModal(index) {
    const card = cards[index];
    if (!card) return;

    const ytId = getYtId(card);
    const title = card.dataset.title || card.querySelector("h3")?.textContent || "";
    const category = card.dataset.category || card.querySelector(".card-category")?.textContent || "";

    modalTitle.textContent = title;
    modalCategory.textContent = category;
    modalCounter.textContent = index + 1 + " / " + cards.length;

    // Disable prev/next at boundaries
    modalPrev.disabled = index === 0;
    modalNext.disabled = index === cards.length - 1;

    injectIframe(ytId);
  }

  function openModal(index) {
    currentIndex = index;
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    updateModal(currentIndex);
    // Focus close button for accessibility
    setTimeout(() => modalClose.focus(), 100);
  }

  function closeModal() {
    stopVideo();
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    // Return focus to the card that opened it
    if (cards[currentIndex]) {
      cards[currentIndex].focus();
    }
  }

  /* ── Card click listeners ── */
  cards.forEach((card, i) => {
    // Make cards keyboard-accessible
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Buka video: " + (card.dataset.title || ""));

    card.addEventListener("click", () => openModal(i));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(i);
      }
    });
  });

  /* ── Modal controls ── */
  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  modalPrev.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateModal(currentIndex);
    }
  });

  modalNext.addEventListener("click", () => {
    if (currentIndex < cards.length - 1) {
      currentIndex++;
      updateModal(currentIndex);
    }
  });

  /* ── Keyboard navigation ── */
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;

    switch (e.key) {
      case "Escape":
        closeModal();
        break;
      case "ArrowLeft":
        if (currentIndex > 0) { currentIndex--; updateModal(currentIndex); }
        break;
      case "ArrowRight":
        if (currentIndex < cards.length - 1) { currentIndex++; updateModal(currentIndex); }
        break;
    }
  });

  /* ── Better thumbnail quality ── */
  // Try maxresdefault first, fallback to hqdefault
  document.querySelectorAll(".card .thumb img").forEach((img) => {
    const card = img.closest(".card");
    if (!card) return;
    const ytId = card.dataset.youtubeId;
    if (!ytId) return;

    // Set maxres as primary source
    img.src = "https://i.ytimg.com/vi/" + ytId + "/maxresdefault.jpg";

    // Fallback chain: maxres → hqdefault → mqdefault
    img.addEventListener("error", function handler() {
      if (img.src.includes("maxresdefault")) {
        img.src = "https://i.ytimg.com/vi/" + ytId + "/hqdefault.jpg";
      } else if (img.src.includes("hqdefault")) {
        img.src = "https://i.ytimg.com/vi/" + ytId + "/mqdefault.jpg";
      }
      // Stop listening after last fallback
      if (img.src.includes("mqdefault")) {
        img.removeEventListener("error", handler);
      }
    });
  });

  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

})();