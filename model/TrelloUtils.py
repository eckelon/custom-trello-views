from trello import TrelloClient as _TrelloClient
from model.FuniCard import FuniCard
from utils import conf_manager


class TrelloUtils(object):
    def __init__(self, board_id):
        self._board_id = board_id
        self._api = _TrelloClient(
            api_key=conf_manager.get_trello_api_key(),
            api_secret=conf_manager.get_trello_api_secret()
        )
        self._board = self._api.get_board(self._board_id)

    def get_lists(self):
        data = []
        lists = self._board.list_lists();
        for list in lists:
            data.append(list.name)

        return data

    def get_custom_fields(self):
        custom_fields = {}
        cards = self._board.all_cards()
        for card in cards:
            for custom_field in card.custom_fields:
                if (custom_field.name not in custom_fields):
                    custom_fields[custom_field.name] = []

                if custom_field.value not in custom_fields[custom_field.name]:
                    custom_fields[custom_field.name].append(custom_field.value)

        return custom_fields

    def get_cards(self, filters=None):
        board_cards = self._board.all_cards()
        funicards = {}
        lists = {}
        filter_types = {}
        is_filtered = False

        if filters is not None and filters.__len__() > 0:
            is_filtered = True
            for filter in filters:
                if filter['name'] not in filter_types:
                    filter_types[filter['name']] = []

                filter_types[filter['name']].append(filter['value'])

        for card in board_cards:
            if card.list_id not in lists:
                lists[card.list_id] = card.get_list().name

            if lists[card.list_id] not in funicards:
                funicards[lists[card.list_id]] = []

            custom_fields = {}
            labels = []

            for custom_field in card.custom_fields:
                custom_fields[custom_field.name] = custom_field.value

            if card.labels is not None:
                for label in card.labels:
                    labels.append({'name': label.name, 'color': label.color})

            if not is_filtered:
                funicards[lists[card.list_id]].append(
                    FuniCard(card.id, card.name, lists[card.list_id], labels, custom_fields, card.short_url))
            else:
                matched = 0
                for filter in filter_types:
                    if filter in custom_fields:
                        in_filter = False
                        for candidate in filter_types[filter]:
                            if candidate == custom_fields[filter]:
                                in_filter = True

                        if in_filter:
                            matched += 1

                if matched == filter_types.__len__():
                    funicards[lists[card.list_id]].append(
                        FuniCard(card.id, card.name, lists[card.list_id], labels, custom_fields, card.short_url))

        return funicards
