import {
    Observable,
    Subject
} from 'rxjs';
import apiClient from './apiClient';
import loadingUtils from './loading';

const boardSubject = new Subject();

const boardUpdate = boardId => boardSubject.next({
    type: 'update',
    value: boardId
});
const boardDataUpdate = data => boardSubject.next({
    type: 'board-data',
    value: data
});

const getCards$ = (filters = []) => Observable.create(observer => {
    loadingUtils.startLoading();
    let data = {
        board_id: window.localStorage.getItem("board-id")
    };

    if (filters) {
        data.filter_by = filters
    }

    apiClient.httpRequest('/api/cards', data)
        .then(response => response.json())
        .then(body => {
            observer.next(processCards(body));
            observer.complete();
            loadingUtils.finishLoading();
        })
        .catch(err => {
            loadingUtils.finishLoading();
            observer.error(err);
        });
});

const processCards = cardsInfo => {
    let lists = [];
    if ('undefined' === typeof cardsInfo) {
        return lists;
    }

    Object.entries(cardsInfo).forEach((list_info) => {
        let list_content = {};
        let cards = [];
        list_info[1].forEach((card) => {
            let customFields = [];
            Object.entries(card._custom_fields).forEach((customField) => {
                customFields.push({
                    name: customField[0],
                    value: customField[1]
                });
            });
            cards.push({
                name: card._name,
                url: card._url,
                customFields: customFields
            });
        });

        list_content.name = list_info[0];
        list_content.cards = cards;
        lists.push(list_content);
    });

    return lists;
}

const boardUtils = {
    getCards$,
    boardSubject,
    boardUpdate,
    boardDataUpdate
};

export default boardUtils;