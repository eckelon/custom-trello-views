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
        this.mixin('board');
        this.boardFlow.call(this);
    </script>
</board>