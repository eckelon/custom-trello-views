import { Subject } from 'rxjs';

const loadingSubject = new Subject();
let loadingCount = 0;
const startLoading = () => updateLoadingCount(1);
const finishLoading = () => updateLoadingCount(-1);

const updateLoadingCount = update => {
    loadingCount += update;

    if (loadingCount < 0) {
        loadingCount = 0;
    }

    if (loadingCount === 1) {
        loadingSubject.next(true);
    }

    if (loadingCount === 0) {
        loadingSubject.next(false);
    }
}

const loadingUtils = {
    loadingSubject,
    startLoading,
    finishLoading
}

export default loadingUtils;