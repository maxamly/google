const RECENT_SEARCHES_KEY = "recent-searches";
const MAX_RECENT = 6;

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#search-input");
const luckyButton = document.querySelector('[data-action="lucky"]');
const clearButton = document.querySelector('[data-action="clear"]');
const recentContainer = document.querySelector("#recent-searches");

const loadRecentSearches = () => {
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn("Не удалось загрузить историю запросов", error);
    return [];
  }
};

const saveRecentSearches = (queries) => {
  try {
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(queries));
  } catch (error) {
    console.warn("Не удалось сохранить историю запросов", error);
  }
};

const renderRecentSearches = (queries) => {
  recentContainer.innerHTML = "";

  if (!queries.length) {
    const emptyState = document.createElement("p");
    emptyState.textContent = "История запросов пока пуста.";
    emptyState.className = "recent-searches__empty";
    recentContainer.append(emptyState);
    return;
  }

  queries.forEach((query) => {
    const item = document.createElement("div");
    item.className = "recent-searches__item";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "recent-searches__chip";
    button.textContent = query;
    button.addEventListener("click", () => {
      searchInput.value = query;
      searchInput.focus();
    });

    item.append(button);
    recentContainer.append(item);
  });
};

const updateRecentSearches = (query) => {
  const trimmed = query.trim();
  if (!trimmed) {
    return;
  }

  const current = loadRecentSearches();
  const deduped = [trimmed, ...current.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())];
  const limited = deduped.slice(0, MAX_RECENT);
  saveRecentSearches(limited);
  renderRecentSearches(limited);
};

searchForm?.addEventListener("submit", (event) => {
  const query = searchInput.value;
  if (!query.trim()) {
    event.preventDefault();
    searchInput.focus();
    return;
  }

  updateRecentSearches(query);
});

luckyButton?.addEventListener("click", () => {
  const query = searchInput.value.trim();
  const target = query
    ? `https://www.google.com/search?btnI=I&q=${encodeURIComponent(query)}`
    : "https://www.google.com/doodles";
  window.open(target, "_blank", "noopener");
});

clearButton?.addEventListener("click", () => {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
  renderRecentSearches([]);
  searchInput.focus();
});

renderRecentSearches(loadRecentSearches());

searchInput?.addEventListener("focus", () => {
  searchInput.select();
});
