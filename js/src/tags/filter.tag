<filter>
    <div if={board_id !=null} class="funi-filter-info">
        <span class="funi-filter-info-current">{selectedFilters} filters are selected</span>
    </div>
    <div class="funi-filter" each="{filter in filters}">
        <p class="funi-filter-name">{filter.name}:</p>
        <select class="funi-filter-values" multiple>
            <option class="{filter.name}" value="0"> No filter </option>
            <option class="{filter.name}" each="{option in filter.options}" value={option}> {option} </option>
        </select>
    </div>
    <button if="{board_id !=null}" ref="applyFilter" onclick="{ applyFilter }" id="apply-filter">Apply filter</button>

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
        this.mixin('filter');
        this.filterFlow.call(this);
    </script>
</filter>