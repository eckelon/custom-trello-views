import { BehaviorSubject, combineLatest, from, throwError } from 'rxjs';
import { catchError, concatMap, filter, map, mergeMap, tap, flatMap, switchMap } from 'rxjs/operators';
import { authService } from './auth.service';
import { doGetRequest } from './httpClient';

const url = 'https://api.trello.com/1';

const trelloRequest$ = (endpoint, method, boardId, options) => from(doGetRequest(`${url}/${endpoint}/${boardId}/${method}`, options))
    .pipe(
        map(response => {
            if (!response) {
                throwError('not cards');
            }
            return response;
        }),
        concatMap(response =>
            from(response.json()).pipe(
                map(response => {
                    if (response) {
                        return response
                    }

                    throwError('not body');
                }),
            )
        )
    );


const processCustomFields = raw => {
    const customFields = [];
    raw.map(cf => {
        const options = [];
        cf.options.map(opt => options.push({
            id: opt.id,
            value: opt.value,
            pos: opt.pos
        }));
        customFields.push({
            id: cf.id,
            name: cf.name,
            pos: cf.pos,
            options: options,
        });
    });
    return customFields;
}

const processCards = raw => {
    const cards = [];
    raw.map(card => {
        cards.push({
            id: card.id,
            listId: card.idList,
            members: card.members,
            name: card.name,
            pos: card.pos,
            url: card.shortUrl,
            customFields: card.customFieldItems,
            description: card.desc
        });
    })
    return cards;
}


const cards$ = (boardId) => {
    return authService.authState$.pipe(
        filter(auth => auth !== undefined),
        map(auth => ({
            key: auth['trelloKey'],
            token: auth['trelloToken'],
            customFieldItems: true,
            members: true,
            lists: true
        })),
        concatMap(options => trelloRequest$('boards', 'cards', boardId, options)),
        map(processCards),
        catchError(error => {
            throw new Error(error);
        })
    );
};

const lists$ = (boardId) => {
    return authService.authState$.pipe(
        filter(auth => auth !== undefined),
        map(auth => ({
            key: auth['trelloKey'],
            token: auth['trelloToken'],
        })),
        concatMap(options => trelloRequest$('boards', 'lists', boardId, options)),
        catchError(error => {
            throw new Error(error);
        })
    );
};

const customFields$ = (boardId) => {
    return authService.authState$.pipe(
        filter(auth => auth !== undefined),
        map(auth => ({
            key: auth['trelloKey'],
            token: auth['trelloToken'],
        })),
        concatMap(options => trelloRequest$('boards', 'customFields', boardId, options)),
        map(processCustomFields),
        catchError(error => {
            throw new Error(error);
        })
    );
};


const trello$ = new BehaviorSubject();
const updateTrello$ = (boardId) => {
    return combineLatest(customFields$(boardId), lists$(boardId), cards$(boardId)).pipe(
        tap(params => {
            trello$.next({
                customFields: params[0],
                lists: params[1],
                cards: params[2],
            })
        })
    );
};

export const trelloService = { trello$, updateTrello$ }
