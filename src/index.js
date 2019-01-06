import riot from 'riot';
import 'riot-hot-reload';
import { filter, map, tap } from 'rxjs/operators';
import './components/board.tag.html';
import './components/filter.tag.html';
import { authService } from './services/auth.service';
import { boardService } from './services/board.service';
import { trelloService } from './services/trello.service';
riot.mount('*');

authService.initAuth();

trelloService.trello$.pipe(
        filter(trelloStatus => undefined !== trelloStatus),
        map(trelloStatus => {
            trelloStatus.cards.map(card => {
                card.customFields.map(customField => {
                    const customFieldNameElement = trelloStatus.customFields.filter(cf => cf.id === customField.idCustomField)[0];
                    const customFieldValueElement = customFieldNameElement.options.filter(option => option.id === customField.idValue)[0];
                    if (customFieldNameElement) {
                        customField.name = customFieldNameElement.name;
                        customField.value = customFieldValueElement.value.text;
                    }
                })
                card.list = trelloStatus.lists.filter(list => list.id === card.listId)[0].name;
                return card;
            });
            return trelloStatus;
        }),
        tap(trelloStatus => {
            const boardCards = [];
            trelloStatus.lists.map(list => {
                boardCards.push({
                    name: list.name,
                    cards: []
                })
            });
            boardCards.map(column => {
                column.cards = trelloStatus.cards.filter(card => card.list === column.name);
            });
            boardService.updateBoard({ boardCards, customFields: trelloStatus.customFields });
        }),
    )
    .subscribe();

trelloService.updateTrello$('YCW7WPf3').subscribe();
