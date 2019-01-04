import { Subject } from "rxjs";

const cardState$ = new Subject();
const listState$ = new Subject();

const updateCards = upd => cardState$.next(upd);
const updateLists = upd => listState$.next(upd);
export const cardService = { cardState$, listState$, updateCards, updateLists };
