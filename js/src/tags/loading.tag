<loading>
    <div ref="loadingFilter" id="loading-filter"><img src="/static/svg/spinner.svg" /></div>
    <style>
        #loading-filter {
            display: none;
        }
    </style>
    <script>
        this.mixin('loading');
        const self = this;

        this.on('mount', () => {
            self.loadingSubject
                .subscribe(isActive => {
                    self.refs.loadingFilter.style.display = isActive ? 'block' : 'none';
                });
        });
    </script>
</loading>