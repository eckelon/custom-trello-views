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
    <button if={board_id !=null} ref="applyFilter" onclick={ applyFilter } id="apply-filter">Apply filter</button>

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
        this.mixin('loading');
        this.mixin('filter');
        this.mixin('board');
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
    </script>
</filter>