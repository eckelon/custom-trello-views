import {
    Subject
} from 'rxjs';

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

const loadingFlow = function () {
    const self = this;

    this.on('mount', () => {
        self.loadingSubject
            .subscribe(isActive => {
                self.refs.loadingFilter.style.display = isActive ? 'block' : 'none';
            });
    });
}

const loadingUtils = {
    loadingSubject,
    startLoading,
    finishLoading,
    loadingFlow
}

export default loadingUtils;