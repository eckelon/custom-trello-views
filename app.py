from flask import Flask, request, render_template

from model.TrelloUtils import TrelloUtils
import jsonpickle

app = Flask(__name__)


@app.route("/", methods=['GET'])
def index():
    return render_template('index.html')


@app.route("/api/cards", methods=['POST'])
def get_cards():
    data = jsonpickle.decode(request.data)
    board_id = data['board_id']
    filters = data['filter_by']
    trello = TrelloUtils(board_id)
    cards = trello.get_cards(filters)
    return jsonpickle.encode(cards)


@app.route("/api/custom-fields", methods=['POST'])
def get_custom_fields():
    board_id = jsonpickle.loads(request.data)['board_id'] if jsonpickle.loads(request.data)[
                                                                 'board_id'] is not None else None
    trello = TrelloUtils(board_id)
    get_custom_fields = trello.get_custom_fields()
    return jsonpickle.encode(get_custom_fields)


@app.route("/api/lists", methods=['POST'])
def get_lists():
    board_id = request.form.get('board_id')
    trello = TrelloUtils(board_id)
    lists = trello.get_lists()
    return jsonpickle.encode(lists)


if __name__ == "__main__":
    app.run(host='0.0.0.0')
