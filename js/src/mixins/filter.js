import {
    Observable
} from 'rxjs';
import apiClient from './apiClient';
import loadingUtils from './loading';

const getCustomFields$ = Observable.create(observer => {
    loadingUtils.startLoading();
    apiClient.httpRequest('/api/custom-fields', {
            board_id: window.localStorage.getItem("board-id")
        })
        .then(response => response.json())
        .then(body => {
            let filters = [];
            Object.entries(body).forEach((filter) => {
                filters.push({
                    name: filter[0],
                    options: filter[1]
                });
            });
            observer.next(filters);
            loadingUtils.finishLoading();
            observer.complete();
        })
        .catch(err => {
            loadingUtils.finishLoading();
            observer.error(err);
        })
});

const filterFlow = function () {
    this.mixin('loading');
    this.mixin('board');
    this.board_id = localStorage.getItem('board-id');
    this.selectedFilters = 'No';
    var self = this;

    this.on('mount', () => {
        self.loadingSubject
            .subscribe(isActive => {
                self.refs.applyFilter.disabled = isActive ? 'disabled' : false;
            });
    })

    this.load_custom_fields = () => {
        if (self.board_id == null) {
            return;
        }

        this.getCustomFields$.subscribe(filters => {
            self.filters = filters;
            self.update();
        });
    };

    this.applyFilter = function () {
        let options = [];
        Array.from(document.getElementsByClassName('funi-filter-values'))
            .filter(list => list.selectedOptions.length > 0)
            .forEach(list => options = options.concat(Array.from(list.selectedOptions)))

        this.filter(options);
    }

    this.filter = function (options) {
        var filters = [];
        Array.from(options)
            .filter(option => option.value !== 0)
            .forEach(
                option => filters.push({
                    name: option.className,
                    value: option.value
                })
            );

        this.getCards$(filters).subscribe(cards => {
            self.boardDataUpdate(cards);
            let selectedFilters = '';
            const sep = ' + ';
            filters.forEach((filter) => {
                selectedFilters += filter.value + sep
            });

            selectedFilters = selectedFilters.length === 0 ? 'No' : selectedFilters.slice(0,
                sep.length * -1);
            this.selectedFilters = selectedFilters;
            this.update();
        });
    }

    this.boardSubject.subscribe(evt => {
        if (evt.type === 'update') {
            self.board_id = evt.value;
            self.update();
            self.load_custom_fields();
        }
    });

    this.load_custom_fields();
}


const filterUtils = {
    getCustomFields$,
    filterFlow
}

export default filterUtils;