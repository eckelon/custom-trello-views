<board>
    <div id="trello-lists" ref="trelloLists" class="trello-lists">
        <div class="trello-lists-item" each={list in lists}>
            <span class="trello-lists-item-title">{list.name}</span>
            <div class="trello-lists-item-content">
                <div class="card-info" each={card in list.cards}>
                    <p class="card-info-custom-field" each={customField in card.customFields}>{customField.name} ->
                        {customField.value}</p>
                    <a href="{card.url}">{card.name}</a>
                </div>
            </div>
        </div>
        <div show={ board_id==null }>
            <input type="text" ref="boardIdValue" placeholder="Board Id" />
            <button onclick="{update_board_id}">Update Board Id!</button>
        </div>
    </div>
    </div>
    <style>
        .trello-lists .trello-lists-item {
            display: inline-block;
            margin: 20px;
            width: 300px;
            vertical-align: top;
        }

        .trello-lists .trello-lists-item .trello-lists-item-title {

            font-weight: bold;
            text-align: center;
            min-height: 50px;
        }

        .trello-lists .trello-lists-item .trello-lists-item-content {
            margin: 12px 0;
            min-height: 150px;
        }

        .trello-lists .trello-lists-item .trello-lists-item-content .card-info {
            border: 1px solid black;
            margin: 5px;
        }

        .trello-lists .trello-lists-item .trello-lists-item-content .card-info .card-info-custom-field {
            font-size: 10px;
        }
    </style>
    <script>
        let self = this;
        this.mixin('trello-utils');
        this.board_id = localStorage.getItem('board-id');

        this.load_cards = function () {
            if (self.board_id == null) {
                return;
            }
            riot.default.store.trigger('show-loading');
            this.getCards().then((res) => {
                self.updateBoard(this.processCards(res));
            });
        }

        this.update_board_id = function (e) {
            e.preventDefault();
            if (!this.refs.boardIdValue.value || this.refs.boardIdValue.value.length === 0) {
                return;
            }
            window.localStorage.setItem('board-id', this.refs.boardIdValue.value);
            self.board_id = this.refs.boardIdValue.value;
            self.update();
            riot.default.store.trigger('board-id-update', this.refs.boardIdValue.value);
            self.load_cards();
        }

        this.updateBoard = function (lists) {
            self.lists = lists;
            self.update();
            riot.default.store.trigger('hide-loading');
            riot.default.store.trigger('activate-filter-button');
        }

        riot.default.store.on('filter-applied', function (lists) {
            self.updateBoard(lists);
        });

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
    </script>
</board>