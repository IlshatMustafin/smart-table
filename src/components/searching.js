import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const searchRule = rules.searchMultipleFields(searchField, ['date', 'castomer', 'seller'], false);
    const compare = createComparison([], [searchRule]);

    return (data, state, action) => {
        if (!state[searchField]) {
            return data;
        }
        // @todo: #5.2 — применить компаратор
        return data.filter(row => compare(row, state));
    }
}