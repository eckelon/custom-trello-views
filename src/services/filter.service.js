import { BehaviorSubject, Subject } from "rxjs";

const filterState$ = new Subject();
const selectedFilterState$ = new BehaviorSubject();

const updateFilters = upd => filterState$.next(upd);
const updateSelectedFilters = upd => selectedFilterState$.next(upd);
const getSelected = () => selectedFilterState$.getValue();
export const filterService = {
    filterState$,
    selectedFilterState$,
    updateFilters,
    updateSelectedFilters,
    getSelected
};
