export function initSearching(searchField) {
  return (query, state, action) => {
    // Проверяем, что в поле поиска было что‑то введено
    return state[searchField]
      ? Object.assign({}, query, {
          search: state[searchField] // Устанавливаем в query параметр поиска
        })
      : query; // Если поле с поиском пустое, просто возвращаем query без изменений
  };
}