<filter>
    <div if={board_id !=null} class="funi-filter-info">
        <span class="funi-filter-info-current">{selectedFilters} filters are selected</span>
    </div>
    <div class="funi-filter" each={filter in filters}>
        <p class="funi-filter-name">{filter.name}:</p>
        <select class="funi-filter-values" multiple>
            <option class="{filter.name}" value="0"> No filter </option>
            <option class="{filter.name}" each={option in filter.options} value={option}> {option} </option>
        </select>
    </div>
    <div if={board_id !=null} ref="loadingFilter" id="loading-filter"><img src="/static/svg/spinner.svg" /></div>
    <button if={board_id !=null} ref="applyFilter" onclick={this.applyFilter} id="apply-filter" disabled="disabled">Apply
        filter</button>

    <style>
        .loading img {
            width: 50px;
            display: block;
            margin: auto;
        }


        .funi-filter-info .funi-filter-info-current {
            font-weight: bold;
            color: blue;
            margin: 0 20px;

        }

        .funi-filter {
            display: inline-block;
        }

        .funi-filter .funi-filter-name {
            font-size: 12px;
            font-weight: bold;
            text-align: center;
        }

        .funi-filter .funi-filter-values {
            height: 250px;
            margin: 0 25px;
            min-width: 150px;
            padding: 10px;
        }
    </style>

    <script>
        this.board_id = localStorage.getItem('board-id');
        this.mixin('trello-utils');
        this.selectedFilters = 'No';
        var self = this;

        riot.default.store.on('hide-loading', () => {
            if (this.refs.loadingFilter) {
                this.refs.loadingFilter.style.display = 'none';
            }
        });

        riot.default.store.on('show-loading', () => {
            if (this.refs.loadingFilter) {
                this.refs.loadingFilter.style.display = 'block';
            }
        });

        riot.default.store.on('activate-filter-button', () => {
            if (this.refs.applyFilter) {
                this.refs.applyFilter.disabled = false;
            }
        });
        this.load_custom_fields = function () {
            if (self.board_id == null) {
                return;
            }

            this.getCustomFields().then((res) => {
                let filters = [];
                Object.entries(res).forEach((filter) => {
                    filters.push({
                        name: filter[0],
                        options: filter[1]
                    });
                });
                self.filters = filters;
                self.update();
            });
        };

        this.applyFilter = function () {
            riot.default.store.trigger('show-loading');
            document.getElementById('apply-filter').disabled = 'disabled';
            let options = [];
            Array.from(document.getElementsByClassName('funi-filter-values')).forEach((filter) => {
                Array.from(filter.selectedOptions).forEach((option) => {
                    options.push(option)
                });
            });

            this.filter(options);
        }

        this.filter = function (options) {
            var filters = [];
            Array.from(options).filter((option) => {
                return option.value !== 0
            }).forEach((option) => {
                filters.push({
                    name: option.className,
                    value: option.value
                })
            });

            this.getCards(filters).then((res) => {
                riot.default.store.trigger('filter-applied', this.processCards(res));
            });

            let selectedFilters = '';
            filters.forEach((filter) => {
                selectedFilters += filter.value + ' + '
            });

            selectedFilters = selectedFilters.length === 0 ? 'No' : selectedFilters.slice(0, -3);
            this.selectedFilters = selectedFilters;
            this.update();
        }

        riot.default.store.on('board-id-update', (board_id) => {
            self.board_id = board_id;
            self.update();
            self.load_custom_fields();
        });

        this.load_custom_fields();
    </script>
</filter>