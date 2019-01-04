import riot from 'riot';
import 'riot-hot-reload';
import './components/board.tag.html';
import './components/filter.tag.html';
import { authService } from './services/auth.service';
import { cardService } from './services/card.service';
import { filterService } from './services/filter.service';
import { cards$, customFields$, lists$ } from './services/trello.service';
riot.mount('*');


authService.initAuth();
customFields$().subscribe(filterService.updateFilters);
lists$().subscribe(cardService.updateLists);
cards$().subscribe(cardService.updateCards);
