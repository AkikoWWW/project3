const container = document.getElementById("charactersContainer");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("search");
const itemsPerPageSelect = document.getElementById("itemsPerPage");

let characters = [];
let currentPage = 1;
let itemsPerPage = parseInt(itemsPerPageSelect.value);

const API_URL = "https://akabab.github.io/superhero-api/api/all.json";

async function fetchAllCharacters() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    characters = data;
    renderCharacters();
    renderPagination();
  } catch (err) {
    container.innerHTML = "<p>Помилка завантаження даних...</p>";
    console.error(err);
  }
}

function renderCharacters() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = characters.filter((char) =>
    char.name.toLowerCase().includes(searchTerm)
  );

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filtered.slice(start, end);

  container.innerHTML = "";
  pageItems.forEach((char) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${char.images.sm}" alt="${char.name}">
      <h3>${char.name}</h3>
    `;
    card.addEventListener("click", () => showCharacterDetail(char));
    container.appendChild(card);
  });
}

function showCharacterDetail(char) {
  container.innerHTML = `
    <button id="backButton">Назад</button>
    <h2>${char.name}</h2>
    <img src="${char.images.lg}" alt="${char.name}">
    <div class="stats">
      <div class="stat"><strong>Сила:</strong> ${char.powerstats.power}</div>
      <div class="stat"><strong>Інтелект:</strong> ${
        char.powerstats.intelligence
      }</div>
      <div class="stat"><strong>Команда:</strong> ${
        char.connections.groupAffiliation || "Немає"
      }</div>
      <div class="stat"><strong>Біографія:</strong> ${
        char.biography.publisher || "Немає"
      }</div>
      <div class="stat"><strong>Вага:</strong> ${char.appearance.weight}
    </div>
  `;
  document
    .getElementById("backButton")
    .addEventListener("click", () => renderCharacters());
}

function renderPagination() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = characters.filter((char) =>
    char.name.toLowerCase().includes(searchTerm)
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.disabled = true;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderCharacters();
      renderPagination();
    });
    pagination.appendChild(btn);
  }
}

searchInput.addEventListener("input", () => {
  currentPage = 1;
  renderCharacters();
  renderPagination();
});

itemsPerPageSelect.addEventListener("change", () => {
  itemsPerPage = parseInt(itemsPerPageSelect.value);
  currentPage = 1;
  renderCharacters();
  renderPagination();
});

fetchAllCharacters();
