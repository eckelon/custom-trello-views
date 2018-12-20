function getCustomFields() {
    return postData('/api/custom-fields', {
        board_id: window.localStorage.getItem("board-id")
    });
}

function getCards(filters = []) {
    let data = {
        board_id: window.localStorage.getItem("board-id")
    };

    if (filters) {
        data.filter_by = filters
    }

    return postData('/api/cards', data);
}

function processCards(cardsInfo) {
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

function postData(url = '', data = {}) {
    return fetch(url, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json());
}

var trelloUtils = {
    getCustomFields: getCustomFields,
    getCards: getCards,
    processCards: processCards
};

export default trelloUtils;