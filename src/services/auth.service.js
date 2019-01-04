import { BehaviorSubject, fromEvent, Subject } from "rxjs";

const authState$ = new BehaviorSubject();
const authPresent$ = new Subject();

const updateAuthStatus = isPresent => authPresent$.next(isPresent);

const updateAuth = upd => {
    authState$.next(upd);
    Object.keys(upd).forEach(key => {
        localStorage.setItem(key, upd[key]);
    });
    document.getElementById('authForm').style.display = 'none';
    updateAuthStatus(true);
}

const initAuth = () => {
    const trelloKey = localStorage.getItem('trelloKey');
    const trelloToken = localStorage.getItem('trelloToken');

    if (!trelloKey || !trelloToken) {
        updateAuthStatus(false);
    } else {
        updateAuth({ trelloKey, trelloToken });
        updateAuthStatus(true);
    }


}

fromEvent(document.getElementById('updateTrelloAuth'), 'click').subscribe(_ => {
    const trelloKey = document.getElementById('trelloKey').value;
    const trelloToken = document.getElementById('trelloToken').value;

    if (!trelloKey || !trelloToken) {
        return false;
    }

    updateAuth({ trelloKey, trelloToken });

});

export const authService = { authState$, updateAuth, authPresent$, initAuth };