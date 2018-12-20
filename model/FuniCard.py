class FuniCard(object):
    def __init__(self, id, name, list_name, labels, custom_fields, url):
        self._id = id
        self._url = url
        self._name = name
        self._list_name = list_name
        self._labels = labels
        self._custom_fields = custom_fields

    def __str__(self):
        return {'id': self._id, 'name': self._name, 'list_name': self._list_name, 'labels': self._labels,
                'custom_fields': self._custom_fields}
