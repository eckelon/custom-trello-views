import { Subject } from "rxjs";
import { boardService } from "./board.service";

const filterState$ = new Subject();

const updateFilters = upd => filterState$.next(upd);
const updateSelectedFilters = selectedFilters => boardService.updateBoard({ selectedFilters });
const getSelected = () => boardService.getBoard().selectedFilters || {};

export const filterService = {
    filterState$,
    updateFilters,
    updateSelectedFilters,
    getSelected
};
