import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        if (elements[elementName]) {
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    return option;
                })
            );
        }
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
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

        // @todo: #4.5 — отфильтровать данные используя компаратор
        const filterState = {...state};
        if (state.totalFrom || state.totalTo) {
            filterState.total = [
                state.totalFrom ? parseFloat(state.totalFrom) : null,
                state.totalTo ? parseFloat(state.totalTo) : null
            ];
            delete filterState.totalFrom;
            delete filterState.totalTo;
        }

        return data.filter(row => compare(row, filterState));
    }
}