import riot from 'riot';
import 'riot-hot-reload';
import './tags/filter.tag';
import './tags/board.tag';
import trelloUtils from './mixins/trello-utils';

var Store = function () {
    riot.observable(this)
};

riot.mixin('trello-utils', trelloUtils);
riot.store = new Store();
riot.mount('*');