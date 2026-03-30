import { getPages } from "../lib/utils.js";

export const initPagination = ({ pages, fromRow, toRow, totalRows }, createPage) => {
  // В качестве шаблона берём первый элемент из контейнера со страницами
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  // И удаляем его (предполагаем, что там больше ничего; как вариант, можно и всё удалить из pages)
  pages.firstElementChild.remove();

  let pageCount;

  const applyPagination = (query, state, action) => {
    const limit = state.rowsPerPage;
    let page = state.page;

    // Обрабатываем действия для пагинации
    if (action) {
      switch (action.name) {
        case 'prev':
          page = Math.max(1, page - 1);
          break;
        case 'next':
          page = Math.min(pageCount || 1, page + 1); // Используем pageCount, если он установлен
          break;
        case 'first':
          page = 1;
          break;
        case 'last':
          // Если pageCount ещё не установлен, считаем грубо на основе limit и предполагаемого большого количества записей
          const estimatedPageCount = pageCount || Math.ceil(1000 / limit); // 1000 — условное большое число
          page = estimatedPageCount;
          break;
      }
    }

    return Object.assign({}, query, {
      limit,
      page
    });
  };

  const updatePagination = (total, { page, limit }) => {
    pageCount = Math.ceil(total / limit);

    // Получаем массив страниц, которые нужно показать (выводим только 5 страниц)
    const visiblePages = getPages(page, pageCount, 5);
    // Перерисовываем контейнер пагинации
    pages.replaceChildren(...visiblePages.map(pageNumber => {
      const el = pageTemplate.cloneNode(true);
      return createPage(el, pageNumber, pageNumber === page);
    }));
    // Обновляем статус пагинации (текст о строках)
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min((page * limit), total);
    totalRows.textContent = total;
  };

  return {
    updatePagination,
    applyPagination
  };
};
