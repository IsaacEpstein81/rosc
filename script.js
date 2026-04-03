const sections = [...document.querySelectorAll("[data-section]")];
const navLinks = [...document.querySelectorAll(".deck-nav__link")];
const currentSection = document.querySelector("[data-current-section]");
const totalSections = document.querySelector("[data-total-sections]");

if (totalSections) {
  totalSections.textContent = String(sections.length).padStart(2, "0");
}

const revealSection = (section) => {
  if (!section) {
    return;
  }

  section.classList.add("is-visible");
};

const setActiveSection = (id) => {
  const index = sections.findIndex((section) => section.id === id);

  if (index === -1) {
    return;
  }

  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
  });

  if (currentSection) {
    currentSection.textContent = String(index + 1).padStart(2, "0");
  }
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealSection(entry.target);
        setActiveSection(entry.target.id);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: "-4% 0px -14% 0px",
  },
);

sections.forEach((section) => {
  revealSection(section);
  sectionObserver.observe(section);
});

const initialTarget = window.location.hash
  ? document.querySelector(window.location.hash)
  : sections[0];

if (initialTarget) {
  revealSection(initialTarget);
  setActiveSection(initialTarget.id);
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);

    if (!target) {
      return;
    }

    event.preventDefault();
    revealSection(target);
    setActiveSection(target.id);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const getNearestSectionIndex = () => {
  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  sections.forEach((section, index) => {
    const distance = Math.abs(section.getBoundingClientRect().top);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
};

document.addEventListener("keydown", (event) => {
  const isFormElement = ["INPUT", "TEXTAREA", "SELECT"].includes(
    document.activeElement?.tagName,
  );

  if (isFormElement) {
    return;
  }

  const currentIndex = getNearestSectionIndex();
  let targetIndex = currentIndex;

  if (["ArrowDown", "PageDown", " "].includes(event.key)) {
    targetIndex = Math.min(currentIndex + 1, sections.length - 1);
  } else if (["ArrowUp", "PageUp"].includes(event.key)) {
    targetIndex = Math.max(currentIndex - 1, 0);
  } else if (event.key === "Home") {
    targetIndex = 0;
  } else if (event.key === "End") {
    targetIndex = sections.length - 1;
  } else {
    return;
  }

  event.preventDefault();
  revealSection(sections[targetIndex]);
  setActiveSection(sections[targetIndex].id);
  sections[targetIndex].scrollIntoView({ behavior: "smooth", block: "start" });
});
