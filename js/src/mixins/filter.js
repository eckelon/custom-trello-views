import { Observable } from 'rxjs';
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


const filterUtils = {
    getCustomFields$
}

export default filterUtils;