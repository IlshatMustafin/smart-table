export function initFiltering(elements) {
  const updateIndexes = (elements, indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      if (elements[elementName]) {
        elements[elementName].append(
          ...Object.values(indexes[elementName]).map(name => {
            const el = document.createElement('option');
            el.textContent = name;
            el.value = name;
            return el;
          })
        );
      }
    });
  };

  const applyFiltering = (query, state, action) => {
    // Обработать очистку поля
    if (action && action.name === 'clear') {
      const field = action.closest('.filter-wrapper')?.querySelector('input, select');
      if (field) {
        field.value = '';
        const stateKey = action.dataset.field;
        if (stateKey) {
          state[stateKey] = '';
        }
      }
    }

    // Отфильтровать данные, используя компаратор (теперь формируем параметры для серверного запроса)
    const filter = {};

    Object.keys(elements).forEach(key => {
      if (elements[key]) {
        // Проверяем, что элемент — поле ввода или селект, и у него есть значение
        if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) {
          // Формируем вложенный объект фильтра в query
          filter[`filter[${elements[key].name}]`] = elements[key].value;
        }
      }
    });

    // Если в фильтре есть какие‑то параметры, добавляем их к запросу
    // Иначе возвращаем исходный query без изменений
    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering
  };
}