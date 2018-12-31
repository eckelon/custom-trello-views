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

const boardFlow = function () {
    let self = this;
    this.board_id = localStorage.getItem('board-id');

    this.boardSubject.subscribe((evt) => {
        if (evt.type === 'board-data') {
            self.updateBoard(evt.value);
        }
    });

    this.load_cards = function () {
        if (self.board_id == null) {
            return;
        }

        this.getCards$().subscribe(cards => self.boardDataUpdate(cards));
    }

    this.update_board_id = function (e) {
        e.preventDefault();
        if (!this.refs.boardIdValue.value || this.refs.boardIdValue.value.length === 0) {
            return;
        }
        window.localStorage.setItem('board-id', this.refs.boardIdValue.value);
        self.board_id = this.refs.boardIdValue.value;
        self.update();
        self.boardUpdate(this.refs.boardIdValue.value);
        self.load_cards();
    }

    this.updateBoard = function (lists) {
        self.lists = lists;
        self.update();
    }

    this.on('updated', function () {
        if (!self.board_id) {
            return;
        }

        this.recalculateBoardWidth();
    });

    this.recalculateBoardWidth = function () {
        this.refs.trelloLists.style.width = (this.refs.trelloLists.getElementsByClassName('trello-lists-item').length *
            this.calculateElementWidth(this.refs.trelloLists.getElementsByClassName('trello-lists-item')[0])
        ) + 'px';
    }

    this.calculateElementWidth = function (element) {
        if ('undefined' === typeof element) {
            return 0;
        }
        //https://stackoverflow.com/a/23270007
        const style = element.currentStyle || window.getComputedStyle(element),
            width = element.offsetWidth, // or use style.width
            margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
            padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
            border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

        return width + margin - padding + border;
    };

    this.load_cards();
}

const boardUtils = {
    getCards$,
    boardSubject,
    boardUpdate,
    boardDataUpdate,
    boardFlow
};

export default boardUtils;