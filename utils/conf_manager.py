import os


def get_trello_api_key():
    return os.environ['TRELLO_API_KEY']


def get_trello_api_secret():
    return os.environ['TRELLO_API_SECRET']
