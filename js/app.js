(function () {
  "use strict";

  /* ---------- firmware selection ---------- */

  var installer = document.getElementById("installer");
  var hint = document.getElementById("flashHint");
  var cards = document.querySelectorAll(".fw-card");

  var hintText = {
    full: '<b>完整固件</b> · 4.0 MB · 0x0',
    app: '<b>应用固件</b> · 1.03 MB · 0x10000'
  };

  function selectFirmware(card) {
    cards.forEach(function (c) {
      c.classList.toggle("is-selected", c === card);
    });
    var key = card.querySelector("input").value;
    if (installer) installer.setAttribute("manifest", card.dataset.manifest);
    if (hint) hint.innerHTML = "将烧录：" + hintText[key];
  }

  cards.forEach(function (card) {
    var input = card.querySelector("input");
    input.addEventListener("change", function () {
      if (input.checked) selectFirmware(card);
    });
  });

  /* ---------- copy sha256 ---------- */

  function copyText(text, button) {
    function done() {
      var label = button.textContent;
      button.textContent = "已复制";
      button.classList.add("copied");
      setTimeout(function () {
        button.textContent = label;
        button.classList.remove("copied");
      }, 1600);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {
        fallbackCopy(text, done);
      });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (err) {
      /* ignore */
    }
    document.body.removeChild(ta);
  }

  document.querySelectorAll(".copy").forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      copyText(button.dataset.copy, button);
    });
  });

  /* ---------- lightbox ---------- */

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = lightbox.querySelector("img");
  var closeButton = lightbox.querySelector(".lightbox-close");
  var lastTrigger = null;

  function openLightbox(figure) {
    lastTrigger = figure;
    lightboxImg.src = figure.dataset.full;
    lightboxImg.alt = figure.querySelector("img").alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lightboxImg.src = "";
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll(".gallery-item").forEach(function (figure) {
    figure.addEventListener("click", function () {
      openLightbox(figure);
    });
    figure.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(figure);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });

  /* ---------- reveal on scroll ---------- */

  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var siblings = Array.prototype.slice.call(
            entry.target.parentNode.querySelectorAll(".reveal")
          );
          var index = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay =
            Math.min(index % 4, 3) * 55 + "ms";
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("visible");
    });
  }
})();
