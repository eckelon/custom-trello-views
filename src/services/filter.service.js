import { Subject } from "rxjs";

const filterState$ = new Subject();

const updateFilters = upd => filterState$.next(upd);
export const filterService = { filterState$, updateFilters };