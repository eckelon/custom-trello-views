<loading>
    <div ref="loadingFilter" id="loading-filter"><img src="/static/svg/spinner.svg" /></div>
    <style>
        #loading-filter {
            display: none;
        }
    </style>
    <script>
        this.mixin('loading');
        this.loadingFlow.call(this);
    </script>
</loading>