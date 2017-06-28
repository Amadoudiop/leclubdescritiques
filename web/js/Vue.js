var debounce = function(callback, delay) {
        var timeout;
        return function() {
              var context = this, args = arguments;
              clearTimeout(timeout);
              timeout = setTimeout(function() {
                    callback.apply(context, args);
                  }, delay);
            };
      };


Vue.component('autocomplete', {
    template: 
    '<div :class=\"(className ? className + \'-wrapper \' : \'\') + \'autocomplete-wrapper\'\"><input  type=\"text\" :id=\"id\":class=\"(className ? className + \'-input \' : \'\') + \'autocomplete-input\'\":placeholder=\"placeholder\"v-model=\"type\"@input=\"input(type)\"@dblclick=\"showAll\"@blur=\"hideAll\"@keydown=\"keydown\"@focus=\"focus\"autocomplete=\"off\" /><div :class=\"(className ? className + \'-list \' : \'\') + \'autocomplete transition autocomplete-list\'\" v-show=\"showList\"><ul><li v-for=\"(data, i) in json\"transition=\"showAll\":class=\"activeClass(i)\"><a  href=\"#\"@click.prevent=\"selectList(data)"@mousemove=\"mousemove(i)\"><b>{{ data[anchor] }}</b><span>{{ data[label] }}</span></a></li></ul></div> <br> <div v-if="autocompleteFlag" class="previsu">  <br></div>' +
        '<div class="row" v-if="autocompleteFlag">'+
            '<div class="container-fluid">' +
                '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +
                    '<div class="userBooksCard"  >'+
                        '<div class="panel panel-default">'+
                            '<div class="panel-body">'+
                            '<div>'+
                            '<a  href="#portfolioModal1" class="portfolio-link" data-toggle="modal">'+
                            '<img :src="dataRecup.url_image" id="url_image" alt="bookImg" class="img-thumbnail img-userBook img-responsive">'+
                            '</a>'+
                            '</div>'+
                            '</div>'+
                            '<div class="panel-footer" >'+
                            '<h3><span id="title">{{ dataRecup.title }}</span></h3><br>'+
                            '<span  id="url_product" class="hidden">{{ dataRecup.url_product }}</span>'+
                            '<span  id="description" class="hidden">{{ dataRecup.description }}</span>'+
                            '<span  id="publication_date" class="hidden">{{ dataRecup.publication_date }}</span>'+
                            '<span  id="id_google_books_api" class="hidden">{{ dataRecup.id_google_books_api }}</span>'+
                            '<span  id="sub_category" class="hidden">{{ dataRecup.sub_category }}</span>'+
                            '<h4><span id="author">{{ dataRecup.authors }}</span></h4>'+
                            '<star-rating :star-size="20" :rating="0"  :increment="0.5" :show-rating="false"  active-color="#D99E7E"></star-rating>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>' +
        '</div>' +
    '</div>',
    props: {
        id: String,
        className: String,
        placeholder: String,
        // Intial Value
        initValue: {
            type: String,
            default: ""
        },
        // Anchor of list
        anchor: {
            type: String,
            required: true
        },
        // Label of list
        label: String,
        // Debounce time
        debounce:{
            type: Number,
            default: 500
        },
        // ajax URL will be fetched
        url: {
            type: String,
            required: true
        },
        // query param
        param: {
            type: String,
            default: 'q'
        },
        // Custom Params
        customParams: Object,
        // minimum length
        min: {
            type: Number,
            default: 3
        },
        // Process the result before retrieveng the result array.
        process: Function,
        // Callback
        onInput: Function,
        onShow: Function,
        onBlur: Function,
        onHide: Function,
        onFocus: Function,
        onSelect: Function,
        onBeforeAjax: Function,
        onAjaxProgress: Function,
        onAjaxLoaded: Function,
    },
    data() {
        return {
            autocompleteFlag:false,
            showList: false,
            type: "",
            json: [],
            focusList: "",
            dataRecup: ""
        };
    },
    methods: {
        chargement() {
            console.log("debut")
        },
        finChargement(){
          console.log("fin")
        },
        // Netralize Autocomplete
        clearInput() {
            this.showList = false
            this.type = ""
            this.json = []
            this.focusList = ""
        },
        // Get the original data
        cleanUp(data){
            return JSON.parse(JSON.stringify(data));
        },
        input(val){
            this.showList = true;
            // Callback Event
            this.onInput ? this.onInput(val) : null
            // Debounce the "getData" method.
            if(!this.debouncedGetData || this.debounce !== this.oldDebounce) {
                this.oldDebounce = this.debounce;
                this.debouncedGetData = this.debounce ? debounce(this.getData.bind(this), this.debounce) : this.getData;
            }
            // Get The Data
            this.debouncedGetData(val)
        },
        showAll(){
            this.json = [];
            this.getData("")
            // Callback Event
            this.onShow ? this.onShow() : null
            this.showList = true;
        },
        hideAll(e){
            // Callback Event
            this.onBlur ? this.onBlur(e) : null
            setTimeout(() => {
                // Callback Event
                this.onHide ? this.onHide() : null
                this.showList = false;
            },250);
        },
        focus(e){
            this.focusList = 0;
            // Callback Event
            this.onFocus ? this.onFocus(e) : null
        },
        mousemove(i){
            this.focusList = i;
        },
        keydown(e){
            let key = e.keyCode;
            // Disable when list isn't showing up
            if(!this.showList) return;
            switch (key) {
                case 40: //down
                    this.focusList++;
                    break;
                case 38: //up
                    this.focusList--;
                    break;
                case 13: //enter
                    this.selectList(this.json[this.focusList])
                    this.showList = false;
                    break;
                case 27: //esc
                    this.showList = false;
                    break;
            }
            // When cursor out of range
            let listLength = this.json.length - 1;
            this.focusList = this.focusList > listLength ? 0 : this.focusList < 0 ? listLength : this.focusList;
        },
        activeClass(i){
            return {
                'focus-list' : i == this.focusList
            };
        },
        selectList(data){
            this.dataRecup = this.cleanUp(data);
            this.autocompleteFlag = true ;
            console.log(this.dataRecup);
            let clean = this.cleanUp(data);
            // Put the selected data to type (model)
            this.type = clean[this.anchor];
            this.showList = false;
            /**
             * Callback Event
             * Deep clone of the original object
             */
            this.onSelect ? this.onSelect(clean) : null
        },
        getData(val){
            app.autocompleteLoader = true
            let self = this;
            if (val.length < this.min) return;
            if(this.url != null){
                // Callback Event
                app.autocompleteLoader = true
                this.onBeforeAjax ? this.onBeforeAjax(val) : null
                let ajax = new XMLHttpRequest();
                let params = ""
                if(this.customParams) {
                    Object.keys(this.customParams).forEach((key) => {
                        params += `&${key}=${this.customParams[key]}`
                    })
                }
                ajax.open('GET', `${this.url}{${this.param}=${val}${params}}`, true);
                ajax.send();
                ajax.addEventListener('progress', function (data) {
                    if(data.lengthComputable){
                        // Callback Event
                        this.onAjaxProgress ? this.onAjaxProgress(data) : null
                    }
                });
                ajax.addEventListener('loadend', function (data) {
                    let json = JSON.parse(this.responseText);
                    // Callback Event
                    app.autocompleteLoader = false
                    this.onAjaxLoaded ? this.onAjaxLoaded(json) : null
                    self.json = self.process ? self.process(json) : json;
                });
            }
        },
        setValue(val) {
            this.type = val
        }
    },
    created(){
        // Sync parent model with initValue Props
        this.type = this.initValue ? this.initValue : null
    }

})
Vue.component('loader', {
    template: '<div class="v-spinner" v-show="loading">'+
    '<div class="v-square" v-bind:style="spinnerStyle">'+
    '</div>'+
    '</div>',
    props: {
        loading: {
            type: Boolean,
            default: true
        },
        color: {
            type: String,
            default: '#70BEB1'
        },
        size: {
            type: String,
            default: '50px'
        }
    },
    data(){
        return{
            spinnerStyle: {
                backgroundColor: this.color,
                height: this.size,
                width: this.size
            }
        }
    }
})
Vue.component('toast',{
    template: '' +
    '<div class="v-toaster">'+
    '<transition-group name="v-toast">'+
    '<div class="v-toast" :class="{[t.theme]: t.theme}" v-for="t in items" :key="t.key"><a class="v-toast-btn-clear" @click="remove(t)"></a>{{t.message}}</div>'+
    '</transition-group>'+
    '</div>' +
    '',
    props: {
        timeout: {
            type: Number,
            default: 10000
        }
    },
    methods: {
        success (message, option = {}) { this.add(message, {theme: 'v-toast-success', timeout: option.timeout}) },
        info    (message, option = {}) { this.add(message, {theme: 'v-toast-info',    timeout: option.timeout}) },
        warning (message, option = {}) { this.add(message, {theme: 'v-toast-warning', timeout: option.timeout}) },
        error   (message, option = {}) { this.add(message, {theme: 'v-toast-error',   timeout: option.timeout}) },
        add (message, {theme, timeout}) {
            if (!this.$parent) {
                this.$mount()
                document.body.appendChild(this.$el)
            }
            let item = {message, theme, key: `${Date.now()}-${Math.random()}`}
            this.items.push(item)
            setTimeout( () => this.remove(item), timeout || this.timeout)
        },
        remove (item) {
            let i = this.items.indexOf(item)
            if (i >= 0) {
                this.items.splice(i, 1)
            }
        }
    },
    data () {
        return {
            items: []
        }
    }
})
Vue.component('star-rating', VueStarRating.default);
/*Vue.component('good-table',{
    template: '' +
        '<div class="good-table">'+
    '        <div class="table-header clearfix">'+
    '        <h2 v-if="title" class="table-title pull-left">{{title}}</h2>'+
    '    <div class="actions pull-right">'+
    '        </div>'+
    '        </div>'+
    '        <table ref="table" :class="styleClass">'+
    '        <thead>'+
    '        <tr v-if="globalSearch">'+
    '        <td :colspan="lineNumbers ? columns.length + 1: columns.length">'+
    '        <div class="global-search">'+
    '        <span class="global-search-icon">'+
    '        <img src="../images/search_icon.png" alt="Search Icon" />'+
    '        </span>'+
    '        <input type="text" class="form-control global-search-input" :placeholder="globalSearchPlaceholder" v-model="globalSearchTerm" />'+
    '        </div>'+
    '        </td>'+
    '        </tr>'+
    '        <tr>'+
    '        <th v-if="lineNumbers" class="line-numbers"></th>'+
    '        <th v-for="(column, index) in columns"'+
    '    @click="sort(index)"'+
    '    :class="columnHeaderClass(column, index)"'+
    '    :style="{width: column.width ? column.width : \'auto\'}">'+
    '        <span>{{column.label}}</span>'+
    '    </th>'+
    '    <slot name="thead-tr"></slot>'+
    '        </tr>'+
    '        <tr v-if="hasFilterRow">'+
    '        <th v-if="lineNumbers"></th>'+
    '       <th v-for="(column, index) in columns">'+
    '       <input v-if="column.filterable" type="text" class="form-control" v-bind:placeholder="\'Filter \' + column.label"'+
    '   v-bind:value="columnFilters[column.field]"'+
    '    v-on:input="updateFilters(column, $event.target.value)">'+
    '        </th>'+
    '        </tr>'+
    '        </thead>'+
    '    '+
    '        <tbody>'+
    '        <tr v-for="(row, index) in paginated" :class="onClick ? \'clickable\' : \'\'" @click="click(row, index)">'+
    '        <th v-if="lineNumbers" class="line-numbers">{{ getCurrentIndex(index) }}</th>'+
    '    <slot name="table-row" :row="row">'+
    '        <td v-for="(column, i) in columns" :class="getDataStyle(i)">'+
    '        <span v-if="!column.html">{{ collectFormatted(row, column) }}</span>'+
    '    <span v-if="column.html" v-html="collect(row, column.field)"></span>'+
    '        </td>'+
    '        </slot>'+
    '        </tr>'+
    '    '+
    '        </tbody>'+
    '        </table>'+
    '    '+
    '        <div class="table-footer clearfix" v-if="paginate">'+
    '        <div class="datatable-length pull-left">'+
    '        <label>'+
    '        <span>{{rowsPerPageText}}</span>'+
    '    <span v-if="perPage" class="perpage-count">{{perPage}}</span>'+
    '    <select v-if="!perPage" class="browser-default" @change="onTableLength">'+
    '        <option value="10">10</option>'+
    '        <option value="20">20</option>'+
          '  <option value="30">30</option>'+
          '  <option value="40">40</option>'+
          '  <option value="50">50</option>'+
          '  <option value="-1">All</option>'+
          '  </select>'+
          '  </label>'+
          '  </div>'+
          '  <div class="pagination-controls pull-right">'+
          '  <a href="javascript:undefined" class="page-btn" @click.prevent.stop="previousPage" tabindex="0">'+
          '  <span class="chevron left"></span>'+
          '      <span class="label">{{prevText}}</span>'+
          '  </a>'+
          '  <div class="info">{{paginatedInfo}}</div>'+
          '  <a href="javascript:undefined" class="page-btn" @click.prevent.stop="nextPage" tabindex="0">'+
          '      <span class="label">{{nextText}}</span>'+
          '  <span class="chevron right"></span>'+
          '  </a>'+
          '  </div>'+
          ' </div>'+
        '</div>'+
    ' ',
    props: {
        styleClass: {default: 'table table-bordered'},
        title: '',
        columns: [
            {
                label: 'Id',
                field: 'id',
                type: 'number',
                html: false,
                width: '50px',
            },
            {
                label: 'Name',
                field: 'name',
                html: false,
                filterable: true,
            },
            {
                label: 'Age',
                field: 'age',
                type: 'number',
                html: false,
                filterable: true,
            },
            {
                label: 'Created On',
                field: 'createdAt',
                type: 'date',
                inputFormat: 'YYYYMMDD',
                outputFormat: 'MMM Do YY',
                filterable: false,
            },
            {
                label: 'Percent',
                field: 'btn',
                type: 'percentage',
                html: false,
                filterable: true,
            }
        ],
        rows: [
            {id:1, name:"John",age:"20",btn: 0.03343},
            {id:2, name:"Jane",age:"24",btn: 0.03343},
            {id:3, name:"Susan",age:"16",btn: 0.03343},
            {id:4, name:"Chris",age:"55",btn: 0.03343},
            {id:5, name:"Dan",age:"40",btn: 0.03343},
            {id:6, name:"John",age:"20",btn: 0.03343},
            {id:7, name:"Jane",age:"24",btn: 0.03343},
            {id:8, name:"Susan",age:"16",btn: 0.03343},
            {id:9, name:"Chris",age:"55",btn: 0.03343},
            {id:10, name:"Dan",age:"40",btn: 0.03343}
        ],
        onClick: {},
        perPage: {},
        sortable: {default: true},
        paginate: {default: false},
        lineNumbers: {default: false},
        globalSearch: {default: false},
        defaultSortBy: {default: null},

        //text options
        globalSearchPlaceholder: {default: 'Search Table'},
        nextText: {default: 'Next'},
        prevText: {default: 'Prev'},
        rowsPerPageText: {default: 'Rows per page:'},
    },
    data: () => ({
        currentPage: 1,
        currentPerPage: 10,
        sortColumn: -1,
        sortType: 'asc',
        globalSearchTerm: '',
        columnFilters: {},
        filteredRows: [],
        timer: null,
    }),
    methods: {
        nextPage() {
            if(this.currentPerPage == -1) return;
            if (this.processedRows.length > this.currentPerPage * this.currentPage)
                ++this.currentPage;
        },
        previousPage() {

            if (this.currentPage > 1)
                --this.currentPage;
        },
        onTableLength(e) {
            this.currentPerPage = e.target.value;
        },
        sort(index) {
            if (!this.sortable)
                return;
            if (this.sortColumn === index) {
                this.sortType = this.sortType === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortType = 'asc';
                this.sortColumn = index;
            }
        },
        click(row, index) {
            if (this.onClick)
                this.onClick(row, index);
        },
        // field can be:
        // 1. function
        // 2. regular property - ex: 'prop'
        // 3. nested property path - ex: 'nested.prop'
        collect(obj, field) {

            //utility function to get nested property
            function dig(obj, selector) {
                var result = obj;
                const splitter = selector.split('.');
                for (let i = 0; i < splitter.length; i++)
                    if (typeof(result) === 'undefined')
                        return undefined;
                    else
                        result = result[splitter[i]];
                return result;
            }
            if (typeof(field) === 'function')
                return field(obj);
            else if (typeof(field) === 'string')
                return dig(obj, field);
            else
                return undefined;
        },
        collectFormatted(obj, column) {
            //helper functions within collect
            function formatDecimal(v) {
                return parseFloat(Math.round(v * 100) / 100).toFixed(2);
            }
            function formatPercent(v) {
                console.log(v);
                return parseFloat(v * 100).toFixed(2) + '%';
            }
            function formatDate(v) {
                // convert to string
                v = v + '';
                // convert to date
                return format(parse(v, column.inputFormat), column.outputFormat);
            }
            var value = this.collect(obj, column.field);
            if (!value) return '';
            //lets format the resultant data
            switch(column.type) {
                case 'decimal':
                    return formatDecimal(value);
                case 'percentage':
                    return formatPercent(value);
                case 'date':
                    return formatDate(value);
                default:
                    return value;
            }
        },
        // Get the necessary style-classes for the given column
        //--------------------------------------------------------
        columnHeaderClass(column, index){
            var classString = '';
            if (this.sortable) {
                classString += 'sorting ';
            }
            if (index === this.sortColumn) {
                if (this.sortType === 'desc') {
                    classString += 'sorting-desc ';
                } else {
                    classString += 'sorting-asc ';
                }
            }
            classString += this.getDataStyle(index);
            return classString;
        },
        // given column index, we can figure out what style classes
        // to apply to this data
        //---------------------------------------------------------
        getDataStyle(index) {
            var classString = '';
            switch (this.columns[index].type) {
                case 'number':
                case 'percentage':
                case 'decimal':
                case 'date':
                    classString = 'right-align ';
                    break;
                default:
                    classString = 'left-align ';
                    break;
            }
            return classString;
        },
        //since vue doesn't detect property addition and deletion, we
        // need to create helper function to set property etc
        updateFilters(column, value) {
            const _this = this;
            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(function(){
                _this.$set(_this.columnFilters, column.field, value)
            }, 400);

        },
        //method to filter rows
        filterRows() {
            var computedRows = JSON.parse(JSON.stringify(this.rows));
            if(this.hasFilterRow) {
                for (var col of this.columns){
                    if (col.filterable && this.columnFilters[col.field]) {
                        computedRows = computedRows.filter(row => {
                            switch(col.type) {
                                case 'number':
                                case 'percentage':
                                case 'decimal':
                                    //in case of numeric value we need to do an exact
                                    //match for now`
                                    return row[col.field] == this.columnFilters[col.field];
                                default:
                                    //text value lets test starts with
                                    return (row[col.field]).toLowerCase().startsWith((this.columnFilters[col.field]).toLowerCase());
                            }
                        });
                    }
                }
            }
            this.filteredRows = computedRows;
        },
        getCurrentIndex(index) {
            return (this.currentPage - 1) * this.currentPerPage + index + 1;
        },
    },
    watch: {
        columnFilters: {
            handler: function(newObj){
                this.filterRows();
            },
            deep: true,
        },
        rows() {
            this.filterRows();
        },
        perPage() {
            if (this.perPage) {
                this.currentPerPage = this.perPage;
            }else{
                //reset to default
                this.currentPerPage = 10;
            }
        }
    },
    computed: {
        // to create a filter row, we need to
        // make sure that there is atleast 1 column
        // that requires filtering
        hasFilterRow(){
            if (!this.globalSearch) {
                for(var col of this.columns){
                    if(col.filterable){
                        return true;
                    }
                }
            }
            return false;
        },
        // this is done everytime sortColumn
        // or sort type changes
        //----------------------------------------
        processedRows() {
            var computedRows = this.filteredRows;
            //taking care of sort here
            if (this.sortable !== false) {
                computedRows = computedRows.sort((x,y) => {
                    if (!this.columns[this.sortColumn])
                        return 0;
                    const cook = (x) => {
                        x = this.collect(x, this.columns[this.sortColumn].field);

                        if (typeof(x) === 'string') {
                            x = x.toLowerCase();
                            if (this.columns[this.sortColumn].numeric)
                                x = x.indexOf('.') >= 0 ? parseFloat(x) : parseInt(x);
                        }
                        //take care of dates too.
                        if (this.columns[this.sortColumn].type === 'date') {
                            x = parse(x + '', this.columns[this.sortColumn].inputFormat);
                        }
                        return x;
                    }
                    x = cook(x);
                    y = cook(y);
                    return (x < y ? -1 : (x > y ? 1 : 0)) * (this.sortType === 'desc' ? -1 : 1);
                })
            }
            // take care of the global filter here also
            if (this.globalSearch && !!this.globalSearchTerm) {
                var filteredRows = [];
                for (var row of this.rows) {
                    for(var col of this.columns) {
                        if (String(this.collectFormatted(row, col)).toLowerCase()
                                .includes(this.globalSearchTerm.toLowerCase())) {
                            filteredRows.push(row);
                            break;
                        }
                    }
                }
                computedRows = filteredRows;
            }
            return computedRows;
        },
        paginated() {
            var paginatedRows = this.processedRows;
            if (this.paginate) {
                var pageStart = (this.currentPage - 1) * this.currentPerPage;
                // in case of filtering we might be on a page that is
                // not relevant anymore
                // also, if setting to all, current page will not be valid
                if (pageStart >= this.processedRows.length
                    || this.currentPerPage == -1) {
                    this.currentPage = 1;
                    pageStart = 0;
                }
                //calculate page end now
                var pageEnd = paginatedRows.length + 1;

                //if the setting is set to 'all'
                if (this.currentPerPage != -1) {
                    pageEnd = this.currentPage * this.currentPerPage;
                }
                paginatedRows = paginatedRows.slice(pageStart, pageEnd);
            }
            return paginatedRows;
        },
        paginatedInfo() {
            var infoStr = '';
            infoStr += (this.currentPage - 1) * this.currentPerPage ? (this.currentPage - 1) * this.currentPerPage : 1;
            infoStr += ' - ';
            infoStr += Math.min(this.processedRows.length, this.currentPerPage * this.currentPage);
            infoStr += ' of ';
            infoStr += this.processedRows.length;
            if(this.currentPerPage == -1){
                return '1 - ' + this.processedRows.length + ' of ' + this.processedRows.length;
            }
            return infoStr;
        },
    },
    mounted() {
        this.filteredRows = JSON.parse(JSON.stringify(this.rows));
        if (this.perPage) {
            this.currentPerPage = this.perPage;
        }
        //take care of default sort on mount
        if (this.defaultSortBy) {
            for (let [index, col] of this.columns.entries()) {
                if (col.field === this.defaultSortBy.field) {
                    this.sortColumn = index;
                    this.sortType = this.defaultSortBy.type || 'asc';
                    break;
                }
            }
        }
    }

})*/

Vue.component('vue-table', {
    template: '' +
    '<table>'+
    '    <thead>'+
    '    <tr>'+
    '    <th v-for="key in columns" @click="sortBy(key)" :class="{ active: sortKey == key }">'+
    '    {{ key | capitalize }}'+
    '<span class="arrow" :class="sortOrders[key] > 0 ? \'asc\' : \'dsc\'">'+
    '    </span>'+
    '    </th>'+
    '    </tr>'+
    '    </thead>'+
    '    <tbody>'+
    '    <tr v-for="entry in filteredData">'+
    '    <td v-for="key in columns">'+
    '    {{entry[key]}}'+
    '</td>'+
    '</tr>'+
    '</tbody>'+
    '</table> '+
    '',
    props: {
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function () {
        var sortOrders = {}
        this.columns.forEach(function (key) {
            sortOrders[key] = 1
        })
        return {
            sortKey: '',
            sortOrders: sortOrders
        }
    },
    computed: {
        filteredData: function () {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.data
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return data
        }
    },
    filters: {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },
    methods: {
        sortBy: function (key) {
            this.sortKey = key

            this.sortOrders[key] = this.sortOrders[key] * -1
        }
    }
})


var app = new Vue({
    el: '#app',
    delimiters: ['${','}'],
    data() {
        return {
            searchQuery: '',
            gridColumns: ['name', 'power'],
            gridData: [
                { name: 'Chuck Norris', power: Infinity },
                { name: 'Bruce Lee', power: 9000 },
                { name: 'Jackie Chan', power: 7000 },
                { name: 'Jet Li', power: 8000 }
            ],
            columns: [
                {
                    label: 'Id',
                    field: 'id',
                    type: 'number',
                    html: false,
                    width: '50px',
                },
                {
                    label: 'Name',
                    field: 'name',
                    html: false,
                    filterable: true,
                },
                {
                    label: 'Age',
                    field: 'age',
                    type: 'number',
                    html: false,
                    filterable: true,
                },
                {
                    label: 'Created On',
                    field: 'createdAt',
                    type: 'date',
                    inputFormat: 'YYYYMMDD',
                    outputFormat: 'MMM Do YY',
                    filterable: false,
                },
                {
                    label: 'Percent',
                    field: 'btn',
                    type: 'percentage',
                    html: false,
                    filterable: true,
                },
            ],
            rows: [
                {id:1, name:"John",age:"20",btn: 0.03343},
                {id:2, name:"Jane",age:"24",btn: 0.03343},
                {id:3, name:"Susan",age:"16",btn: 0.03343},
                {id:4, name:"Chris",age:"55",btn: 0.03343},
                {id:5, name:"Dan",age:"40",btn: 0.03343},
                {id:6, name:"John",age:"20",btn: 0.03343},
                {id:7, name:"Jane",age:"24",btn: 0.03343},
                {id:8, name:"Susan",age:"16",btn: 0.03343},
                {id:9, name:"Chris",age:"55",btn: 0.03343},
                {id:10, name:"Dan",age:"40",btn: 0.03343},
            ],
            autocompleteLoader: false,
            isConnected: false,
            mailInscription: '',
            floatMenu1IsActive:false,
            floatMenu2IsActive:false,
            oeuvreIsShown: false,
            oeuvreShown: {
                titre: 'temp_titre',
                auteur: 'temp_auteur',
                description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                genre:'roman',
                salon:'Date_du_salon',
                note:'4'
            },
            sujetSalon: "Lord of the Rings",
            nbParticipantsSalon: '3',
            dateSalon: '',
            lienSalon: '/salon',
            alaunes: [
             {
                 titre:'1984',
                 auteur: 'Georges Orwell',
                 rating: 4.5
             },
             {
                titre:'Harry Potter',
                auteur: 'JK Rowling',
                 rating: 3
             },
             {
                titre:'Lord of the rings',
                auteur: 'J.R.R Tolkien',
                 rating: 4
             },
             {
                titre:' Don Quijote de la Mancha',
                auteur: 'Miguel de Cervantes',
                 rating: 4.8
             },
             {
                titre:'Le conte de Deux cités',
                auteur: 'Charles Dickens',
                 rating: 5
             },
            {
                titre:'Le Petit Prince',
                auteur: 'Antoine de Saint-Exupéry',
                rating: 5
            }
             ],
            userBooks:[
                {
                    titre:'1984',
                    auteur: 'Georges Orwell',
                    Grating: 4.5,
                    Urating: 5
                },
                {
                    titre:'Harry Potter',
                    auteur: 'JK Rowling',
                    Grating: 3,
                    Urating: 5
                }
            ],
            fetchArray: {}
        }
    },
    methods: {
        chargement() {
            //this.autocompleteLoader = true
        },
        finChargement(){
           // this.autocompleteLoader = false
        },
        inscription : function (event) {

          var email = $('#email').val();    

          $.ajax({
                url: 'http://localhost:8000/register/',
                type: 'POST',
                data: 'email='+email,
                success: function(msg) {
                    console.log(msg);
                }
            });

        },
        confirmInscription : function (event) {

            var firstname = $('#firstname').val();
            var lastname = $('#lastname').val();
            var password = $('#password').val();
            var confirmPassword = $('#confirmPassword').val();

            $.ajax({
                url: Routing.generate('valide_activate_account'),
                type: 'POST',
                data: 'firstname='+firstname+'&lastname='+lastname+'&password='+password+'&confirmPassword='+confirmPassword,
                success: function(msg) {
                    console.log(msg);
                }
            });
        },
        showOeuvre(_auteur,_titre){
            console.log("hello");
            this.oeuvreIsShown = true;
            this.oeuvreShown.titre = _titre;
            this.oeuvreShown.auteur = _auteur;
        },
        closeModal(){
            this.oeuvreIsShown = false;
        },
        showFloatMenu(numberCard){
            floatMenu = "floatMenu" + numberCard + "IsActive";
            this.floatMenu = !this.floatMenu ;
        },
        showPassword() {
            var key_attr = $('#key').attr('type');
            if(key_attr != 'text') {
                $('.checkbox').addClass('show');
                $('#key').attr('type', 'text');
            } else {
                $('.checkbox').removeClass('show');
                $('#key').attr('type', 'password');
            }
        },
        sendMessage : function (event) {

            var message = $('#message').val();

            $.ajax({
                url: Routing.generate('send_message'),
                type: 'POST',
                data: 'message='+message,
                success: function(msg) {
                    console.log(msg);
                }
            });

            $('.msg').append("<p> dit : " + message + "</p>");

        },
        editProfil : function (event) {

            var firstname = $('#edit_firstname').val();
            var lastname = $('#edit_lastname').val();
            var email = $('#edit_email').val();
            var description = $('#edit_description').val();

            $.ajax({
                url: Routing.generate('edit_profil'),
                type: 'POST',
                data: 'firstname='+firstname+'&lastname='+lastname+'&email='+email+'&description='+description,
                success: function(msg) {
                    console.log(msg);
                }
            });

        },
        addBook : function (event) {
            app.$root.$children[0].success('hello');
            app.$root.$children[0].error('error')
            //this.$children.success('toster ok')
            var author = encodeURIComponent($('#author').text());
            var title = encodeURIComponent($('#title').text());
            var description = encodeURIComponent($('#description').text());
            var publication_date = encodeURIComponent($('#publication_date').text());
            var id_google_api = encodeURIComponent($('#id_google_books_api').text());
            var url_image = encodeURIComponent(document.getElementById("url_image").src);
            var url_product = encodeURIComponent($('#url_product').text());
            var sub_category = encodeURIComponent($('#sub_category').text());

            $.ajax({
                url: Routing.generate('add_book'),
                type: 'POST',
                data: 'author='+author+'&title='+title+'&url_image='+url_image+'&url_product='+url_product+'&description='+description+'&publication_date='+publication_date+'&id_google_api='+id_google_api+'&sub_category='+sub_category,
                success: function(msg) {
                    app.$root.$children[0].success(msg)
                    console.log(msg)
                }
            });
        },
    },
    mounted(){
        /*fetch('http://pokeapi.co/api/v2/pokemon/1')
            .then((resp) => resp.json())// Call the fetch function passing the url of the API as a parameter
            .then(function(data) {
                // Your code for handling the data you get from the API
                this.fetchArray = data;
                console.log(this.fetchArray);
                console.log(this.fetchArray.name);
            })
            .catch(function(error) {
                console.log(error);
                // This is where you run code if the server returns any errors
            });*/
    }
});