const cards = document.querySelectorAll(".file-card");
const statusButton = document.querySelector("#status-button");
const statusText = document.querySelector("#status-text");

cards.forEach((card) => {
  card.addEventListener("click", () => {
    cards.forEach((item) => item.classList.remove("is-active"));
    card.classList.add("is-active");
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      card.click();
    }
  });
});

statusButton?.addEventListener("click", () => {
  statusText.textContent = "Published mindset activated: the project has a root index.html and is ready for GitHub Pages.";
  statusButton.textContent = "Published ✓";
  statusButton.setAttribute("disabled", "true");
});
