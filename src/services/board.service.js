import { BehaviorSubject } from "rxjs";

const board$ = new BehaviorSubject();
const updateBoard = upd => board$.next({ ...board$.getValue(), ...upd });
const getBoard = () => boardService.board$.getValue() || {};

export const boardService = { board$, updateBoard, getBoard }
