import riot from 'riot';
import 'riot-hot-reload';
import boardUtils from './mixins/board';
import filterUtils from './mixins/filter';
import loadingUtils from './mixins/loading';
import './tags/board.tag';
import './tags/filter.tag';
import './tags/loading.tag';

riot.mixin('loading', loadingUtils);
riot.mixin('filter', filterUtils);
riot.mixin('board', boardUtils);

riot.mount('*');