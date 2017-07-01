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
                            '<star-rating :star-size="20" :max-rating="4" :rating="0"  :increment="0.5" :show-rating="false"  active-color="#D99E7E"></star-rating>'+
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
Vue.component('vue-table', {
    template: '' +
    '<table class="col-sm-12">'+
    '    <thead>'+
    '    <tr>'+
    '    <th v-for="key in columns" @click="sortBy(key)" :class="{ active: sortKey == key } " >'+
    '    {{ key | capitalize }}'+
    '<span class="arrow" :class="sortOrders[key] > 0 ? \'asc\' : \'dsc\'"> </span>'+
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
Vue.component('datepicker',{
    template: '' +
    '<div class="vdp-datepicker" :class="wrapperClass"> ' +
  '      <div :class="{\'input-group\' : bootstrapStyling}">'+
  '      <span class="vdp-datepicker__calendar-button" :class="{\'input-group-addon\' : bootstrapStyling}" v-if="calendarButton" @click="showCalendar"><i :class="calendarButtonIcon"><span v-if="calendarButtonIcon.length === 0">&hellip;</span></i></span>' +
  '  <input'+
  '  :type="inline ? \'hidden\' : \'text\'"'+
  '  :class="[ inputClass, { \'form-control\' : bootstrapStyling } ]"'+
  '  :name="name"'+
  '  :id="id"'+
  '  @click="showCalendar"'+
  '  :value="formattedValue"'+
  '  :placeholder="placeholder"'+
  '  :clear-button="clearButton"'+
  '  :disabled="disabledPicker"'+
  '  :required="required"'+
  '  readonly>'+
  '  <span class="vdp-datepicker__clear-button" :class="{\'input-group-addon\' : bootstrapStyling}" v-if="clearButton && selectedDate" @click="clearDate()"><i :class="clearButtonIcon"><span v-if="calendarButtonIcon.length === 0">&times;</span></i></span>'+
    '</div>'+
 '   <div class="vdp-datepicker__calendar" v-show="showDayView" v-bind:style="calendarStyle">'+
 '       <header>'+
 '       <span '+
 '   @click="previousMonth"'+
 '   class="prev"'+
 '   v-bind:class="{ \'disabled\' : previousMonthDisabled(currDate) }">&lt;</span>'+
 '       <span @click="showMonthCalendar" class="up">{{ currMonthName }} {{ currYear }}</span>'+
 '   <span'+
 '   @click="nextMonth"'+
 '   class="next"'+
 '   v-bind:class="{ \'disabled\' : nextMonthDisabled(currDate) }">&gt;</span>'+
 '       </header>'+
 '       <span class="cell day-header" v-for="d in daysOfWeek">{{ d }}</span>'+
 '   <span class="cell day blank" v-for="d in blankDays"></span><!--'+
 '           --><span class="cell day" v-for="day in days" track-by="timestamp" v-bind:class="{ \'selected\':day.isSelected, \'disabled\':day.isDisabled, \'highlighted\': day.isHighlighted, '+ '\'today\':\'+ day.isToday}"'+
 '   @click="selectDate(day)">{{ day.date }}</span>'+
 '   </div>' +
  '  <div class="vdp-datepicker__calendar" v-show="showMonthView" v-bind:style="calendarStyle">'+
  '      <header>'+
  '      <span'+
  '  @click="previousYear"'+
  '  class="prev"'+
  '  v-bind:class="{ \'disabled\' : previousYearDisabled(currDate) }">&lt;</span>'+
  '      <span @click="showYearCalendar" class="up">{{ getYear() }}</span>'+
  '  <span'+
  '  @click="nextYear"'+
  '  class="next"'+
  '  v-bind:class="{ \'disabled\' : nextYearDisabled(currDate) }">&gt;</span>'+
  '      </header>'+
  '      <span class="cell month"'+
  '  v-for="month in months"'+
  '      track-by="timestamp"'+
  '  v-bind:class="{ \'selected\': month.isSelected, \'disabled\': month.isDisabled }"'+
  '  @click.stop="selectMonth(month)">{{ month.month }}</span>'+
  '  </div>'+

   ' <div class="vdp-datepicker__calendar" v-show="showYearView" v-bind:style="calendarStyle">'+
   '     <header>'+
   '     <span @click="previousDecade" class="prev"'+
   ' v-bind:class="{ \'disabled\' : previousDecadeDisabled(currDate) }">&lt;</span>'+
   '     <span>{{ getDecade() }}</span>'+
   ' <span @click="nextDecade" class="next"'+
   ' v-bind:class="{ \'disabled\' : nextMonthDisabled(currDate) }">&gt;</span>'+
   '     </header>'+
   '     <span'+
   ' class="cell year"'+
   ' v-for="year in years"'+
   '     track-by="timestamp"'+
   ' v-bind:class="{ \'selected\': year.isSelected, \'disabled\': year.isDisabled }"'+
   ' @click.stop="selectYear(year)">{{ year.year }}</span>'+
   ' </div>'+
   ' </div>'+
    '',
    props: {
        value: {
            validator: function (val) {
                return val === null || val instanceof Date || typeof val === 'string'
            }
        },
        name: {
            value: String
        },
        id: {
            value: String
        },
        format: {
            value: String,
            default: 'dd MMM yyyy'
        },
        language: {
            value: String,
            default: 'en'
        },
        disabled: {
            type: Object
        },
        highlighted: {
            type: Object
        },
        placeholder: {
            type: String
        },
        inline: {
            type: Boolean
        },
        inputClass: {
            type: [String, Object]
        },
        wrapperClass: {
            type: [String, Object]
        },
        mondayFirst: {
            type: Boolean,
            default: false
        },
        clearButton: {
            type: Boolean,
            default: false
        },
        clearButtonIcon: {
            type: String,
            default: ''
        },
        calendarButton: {
            type: Boolean,
            default: false
        },
        calendarButtonIcon: {
            type: String,
            default: ''
        },
        bootstrapStyling: {
            type: Boolean,
            default: false
        },
        initialView: {
            type: String,
            default: 'day'
        },
        disabledPicker: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            /*
             * Vue cannot observe changes to a Date Object so date must be stored as a timestamp
             * This represents the first day of the current viewing month
             * {Number}
             */
            currDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime(),
            /*
             * Selected Date
             * {Date}
             */
            selectedDate: null,
            /*
             * Flags to show calendar views
             * {Boolean}
             */
            showDayView: false,
            showMonthView: false,
            showYearView: false,
            /*
             * Positioning
             */
            calendarHeight: 0
        }
    },
    watch: {
        value (value) {
            this.setValue(value)
        }
    },
    computed: {
        formattedValue () {
            if (!this.selectedDate) {
                return null
            }
            return DateUtils.formatDate(new Date(this.selectedDate), this.format, this.translation)
        },
        translation () {
            return DateLanguages.translations[this.language]
        },
        currMonthName () {
            const d = new Date(this.currDate)
            return DateUtils.getMonthNameAbbr(d.getMonth(), this.translation.months.abbr)
        },
        currYear () {
            const d = new Date(this.currDate)
            return d.getFullYear()
        },
        /**
         * Returns the day number of the week less one for the first of the current month
         * Used to show amount of empty cells before the first in the day calendar layout
         * @return {Number}
         */
        blankDays () {
            const d = new Date(this.currDate)
            let dObj = new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
            if (this.mondayFirst) {
                return dObj.getDay() > 0 ? dObj.getDay() - 1 : 6
            }
            return dObj.getDay()
        },
        daysOfWeek () {
            if (this.mondayFirst) {
                const tempDays = this.translation.days.slice()
                tempDays.push(tempDays.shift())
                return tempDays
            }
            return this.translation.days
        },
        days () {
            const d = new Date(this.currDate)
            let days = []
            // set up a new date object to the beginning of the current 'page'
            let dObj = new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes())
            let daysInMonth = DateUtils.daysInMonth(dObj.getFullYear(), dObj.getMonth())
            for (let i = 0; i < daysInMonth; i++) {
                days.push({
                    date: dObj.getDate(),
                    timestamp: dObj.getTime(),
                    isSelected: this.isSelectedDate(dObj),
                    isDisabled: this.isDisabledDate(dObj),
                    isHighlighted: this.isHighlightedDate(dObj),
                    isToday: dObj.toDateString() === (new Date()).toDateString()
                })
                dObj.setDate(dObj.getDate() + 1)
            }
            return days
        },
        months () {
            const d = new Date(this.currDate)
            let months = []
            // set up a new date object to the beginning of the current 'page'
            let dObj = new Date(d.getFullYear(), 0, d.getDate(), d.getHours(), d.getMinutes())
            for (let i = 0; i < 12; i++) {
                months.push({
                    month: DateUtils.getMonthName(i, this.translation.months.original),
                    timestamp: dObj.getTime(),
                    isSelected: this.isSelectedMonth(dObj),
                    isDisabled: this.isDisabledMonth(dObj)
                })
                dObj.setMonth(dObj.getMonth() + 1)
            }
            return months
        },
        years () {
            const d = new Date(this.currDate)
            let years = []
            // set up a new date object to the beginning of the current 'page'
            let dObj = new Date(Math.floor(d.getFullYear() / 10) * 10, d.getMonth(), d.getDate(), d.getHours(), d.getMinutes())
            for (let i = 0; i < 10; i++) {
                years.push({
                    year: dObj.getFullYear(),
                    timestamp: dObj.getTime(),
                    isSelected: this.isSelectedYear(dObj),
                    isDisabled: this.isDisabledYear(dObj)
                })
                dObj.setFullYear(dObj.getFullYear() + 1)
            }
            return years
        },
        calendarStyle () {
            let styles = {}
            if (this.isInline) {
                styles.position = 'static'
            }
            return styles
        },
        isOpen () {
            return this.showDayView || this.showMonthView || this.showYearView
        },
        isInline () {
            return typeof this.inline !== 'undefined' && this.inline
        }
    },
    methods: {
        /**
         * Close all calendar layers
         */
        close () {
            this.showDayView = this.showMonthView = this.showYearView = false
            this.$emit('closed')
            document.removeEventListener('click', this.clickOutside, false)
        },
        getDefaultDate () {
            return new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
        },
        resetDefaultDate () {
            if (this.selectedDate === null) {
                this.currDate = this.getDefaultDate()
                return
            }
            this.currDate = this.currDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1).getTime()
        },
        /**
         * Effectively a toggle to show/hide the calendar
         * @return {mixed} [description]
         */
        showCalendar () {
            if (this.isInline) {
                return false
            }
            if (this.isOpen) {
                return this.close()
            }
            switch (this.initialView) {
                case 'year':
                    this.showYearCalendar()
                    break
                case 'month':
                    this.showMonthCalendar()
                    break
                default:
                    this.showDayCalendar()
                    break
            }
        },
        showDayCalendar () {
            this.close()
            this.showDayView = true
            this.$emit('opened')
            document.addEventListener('click', this.clickOutside, false)
        },
        showMonthCalendar () {
            this.close()
            this.showMonthView = true
            document.addEventListener('click', this.clickOutside, false)
        },
        showYearCalendar () {
            this.close()
            this.showYearView = true
            document.addEventListener('click', this.clickOutside, false)
        },
        setDate (timestamp) {
            this.selectedDate = new Date(timestamp)
            this.currDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth(), 1).getTime()
            this.$emit('selected', new Date(timestamp))
            this.$emit('input', new Date(timestamp))
        },
        clearDate () {
            this.selectedDate = null
            this.$emit('selected', null)
            this.$emit('input', null)
            this.$emit('cleared')
        },
        /**
         * @param {Object} day
         */
        selectDate (day) {
            if (day.isDisabled) {
                return false
            }
            this.setDate(day.timestamp)
            if (this.isInline) {
                return this.showDayCalendar()
            }
            this.close()
        },
        /**
         * @param {Object} month
         */
        selectMonth (month) {
            if (month.isDisabled) {
                return false
            }
            this.currDate = month.timestamp
            this.showDayCalendar()
            this.$emit('changedMonth', month)
        },
        /**
         * @param {Object} year
         */
        selectYear (year) {
            if (year.isDisabled) {
                return false
            }
            this.currDate = year.timestamp
            this.showMonthCalendar()
            this.$emit('changedYear', year)
        },
        /**
         * @return {Number}
         */
        getMonth () {
            let d = new Date(this.currDate)
            return d.getMonth()
        },
        /**
         * @return {Number}
         */
        getYear () {
            let d = new Date(this.currDate)
            return d.getFullYear()
        },
        /**
         * @return {String}
         */
        getDecade () {
            let d = new Date(this.currDate)
            let sD = Math.floor(d.getFullYear() / 10) * 10
            return sD + '\'s'
        },
        previousMonth () {
            if (this.previousMonthDisabled()) {
                return false
            }
            let d = new Date(this.currDate)
            d.setMonth(d.getMonth() - 1)
            this.currDate = d.getTime()
            this.$emit('changedMonth', d)
        },
        previousMonthDisabled () {
            if (typeof this.disabled === 'undefined' || typeof this.disabled.to === 'undefined' || !this.disabled.to) {
                return false
            }
            let d = new Date(this.currDate)
            if (
                this.disabled.to.getMonth() >= d.getMonth() &&
                this.disabled.to.getFullYear() >= d.getFullYear()
            ) {
                return true
            }
            return false
        },
        nextMonth () {
            if (this.nextMonthDisabled()) {
                return false
            }
            let d = new Date(this.currDate)
            const daysInMonth = DateUtils.daysInMonth(d.getFullYear(), d.getMonth())
            d.setDate(d.getDate() + daysInMonth)
            this.currDate = d.getTime()
            this.$emit('changedMonth', d)
        },
        nextMonthDisabled () {
            if (typeof this.disabled === 'undefined' || typeof this.disabled.from === 'undefined' || !this.disabled.from) {
                return false
            }
            let d = new Date(this.currDate)
            if (
                this.disabled.from.getMonth() <= d.getMonth() &&
                this.disabled.from.getFullYear() <= d.getFullYear()
            ) {
                return true
            }
            return false
        },
        previousYear () {
            if (this.previousYearDisabled()) {
                return false
            }
            let d = new Date(this.currDate)
            d.setYear(d.getFullYear() - 1)
            this.currDate = d.getTime()
            this.$emit('changedYear')
        },
        previousYearDisabled () {
            if (typeof this.disabled === 'undefined' || typeof this.disabled.to === 'undefined' || !this.disabled.to) {
                return false
            }
            let d = new Date(this.currDate)
            if (this.disabled.to.getFullYear() >= d.getFullYear()) {
                return true
            }
            return false
        },
        nextYear () {
            if (this.nextYearDisabled()) {
                return false
            }
            let d = new Date(this.currDate)
            d.setYear(d.getFullYear() + 1)
            this.currDate = d.getTime()
            this.$emit('changedYear')
        },
        nextYearDisabled () {
            if (typeof this.disabled === 'undefined' || typeof this.disabled.from === 'undefined' || !this.disabled.from) {
                return false
            }
            let d = new Date(this.currDate)
            if (this.disabled.from.getFullYear() <= d.getFullYear()) {
                return true
            }
            return false
        },
        previousDecade () {
            if (this.previousDecadeDisabled()) {
                return false
            }
            let d = new Date(this.currDate)
            d.setYear(d.getFullYear() - 10)
            this.currDate = d.getTime()
            this.$emit('changedDecade')
        },
        previousDecadeDisabled () {
            if (typeof this.disabled === 'undefined' || typeof this.disabled.to === 'undefined' || !this.disabled.to) {
                return false
            }
            let d = new Date(this.currDate)
            if (Math.floor(this.disabled.to.getFullYear() / 10) * 10 >= Math.floor(d.getFullYear() / 10) * 10) {
                return true
            }
            return false
        },
        nextDecade () {
            if (this.nextDecadeDisabled()) {
                return false
            }
            let d = new Date(this.currDate)
            d.setYear(d.getFullYear() + 10)
            this.currDate = d.getTime()
            this.$emit('changedDecade')
        },
        nextDecadeDisabled () {
            if (typeof this.disabled === 'undefined' || typeof this.disabled.from === 'undefined' || !this.disabled.from) {
                return false
            }
            let d = new Date(this.currDate)
            if (Math.ceil(this.disabled.from.getFullYear() / 10) * 10 <= Math.ceil(d.getFullYear() / 10) * 10) {
                return true
            }
            return false
        },
        /**
         * Whether a day is selected
         * @param {Date}
         * @return {Boolean}
         */
        isSelectedDate (dObj) {
            return this.selectedDate && this.selectedDate.toDateString() === dObj.toDateString()
        },
        /**
         * Whether a day is disabled
         * @param {Date}
         * @return {Boolean}
         */
        isDisabledDate (date) {
            let disabled = false
            if (typeof this.disabled === 'undefined') {
                return false
            }
            if (typeof this.disabled.dates !== 'undefined') {
                this.disabled.dates.forEach((d) => {
                    if (date.toDateString() === d.toDateString()) {
                        disabled = true
                        return true
                    }
                })
            }
            if (typeof this.disabled.to !== 'undefined' && this.disabled.to && date < this.disabled.to) {
                disabled = true
            }
            if (typeof this.disabled.from !== 'undefined' && this.disabled.from && date > this.disabled.from) {
                disabled = true
            }
            if (typeof this.disabled.days !== 'undefined' && this.disabled.days.indexOf(date.getDay()) !== -1) {
                disabled = true
            }
            return disabled
        },
        /**
         * Whether a day is highlighted (only if it is not disabled already)
         * @param {Date}
         * @return {Boolean}
         */
        isHighlightedDate (date) {
            if (this.isDisabledDate(date)) {
                return false
            }
            let highlighted = false
            if (typeof this.highlighted === 'undefined') {
                return false
            }
            if (typeof this.highlighted.dates !== 'undefined') {
                this.highlighted.dates.forEach((d) => {
                    if (date.toDateString() === d.toDateString()) {
                        highlighted = true
                        return true
                    }
                })
            }
            if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
                highlighted = date >= this.highlighted.from && date <= this.highlighted.to
            }
            if (typeof this.highlighted.days !== 'undefined' && this.highlighted.days.indexOf(date.getDay()) !== -1) {
                highlighted = true
            }
            return highlighted
        },
        /**
         * Helper
         * @param  {mixed}  prop
         * @return {Boolean}
         */
        isDefined (prop) {
            return typeof prop !== 'undefined' && prop
        },
        /**
         * Whether the selected date is in this month
         * @param {Date}
         * @return {Boolean}
         */
        isSelectedMonth (date) {
            return (this.selectedDate &&
            this.selectedDate.getFullYear() === date.getFullYear() &&
            this.selectedDate.getMonth() === date.getMonth())
        },
        /**
         * Whether a month is disabled
         * @param {Date}
         * @return {Boolean}
         */
        isDisabledMonth (date) {
            let disabled = false
            if (typeof this.disabled === 'undefined') {
                return false
            }
            if (typeof this.disabled.to !== 'undefined' && this.disabled.to) {
                if (
                    (date.getMonth() < this.disabled.to.getMonth() && date.getFullYear() <= this.disabled.to.getFullYear()) ||
                    date.getFullYear() < this.disabled.to.getFullYear()
                ) {
                    disabled = true
                }
            }
            if (typeof this.disabled.from !== 'undefined' && this.disabled.from) {
                if (
                    this.disabled.from &&
                    (date.getMonth() > this.disabled.from.getMonth() && date.getFullYear() >= this.disabled.from.getFullYear()) ||
                    date.getFullYear() > this.disabled.from.getFullYear()
                ) {
                    disabled = true
                }
            }
            return disabled
        },
        /**
         * Whether a year is disabled
         * @param {Date}
         * @return {Boolean}
         */
        isSelectedYear (date) {
            return this.selectedDate && this.selectedDate.getFullYear() === date.getFullYear()
        },
        /**
         * Whether a month is disabled
         * @param {Date}
         * @return {Boolean}
         */
        isDisabledYear (date) {
            let disabled = false
            if (typeof this.disabled === 'undefined' || !this.disabled) {
                return false
            }
            if (typeof this.disabled.to !== 'undefined' && this.disabled.to) {
                if (date.getFullYear() < this.disabled.to.getFullYear()) {
                    disabled = true
                }
            }
            if (typeof this.disabled.from !== 'undefined' && this.disabled.from) {
                if (date.getFullYear() > this.disabled.from.getFullYear()) {
                    disabled = true
                }
            }
            return disabled
        },
        /**
         * Set the datepicker value
         * @param {Date|String|null} date
         */
        setValue (date) {
            if (typeof date === 'string') {
                let parsed = new Date(date)
                date = isNaN(parsed.valueOf()) ? null : parsed
            }
            if (!date) {
                const d = new Date()
                this.currDate = new Date(d.getFullYear(), d.getMonth(), 1).getTime()
                this.selectedDate = null
                return
            }
            this.selectedDate = date
            this.currDate = new Date(date.getFullYear(), date.getMonth(), 1).getTime()
        },
        /**
         * Close the calendar if clicked outside the datepicker
         * @param  {Event} event
         */
        clickOutside (event) {
            if (this.$el && !this.$el.contains(event.target)) {
                if (this.isInline) {
                    return this.showDayCalendar()
                }
                this.resetDefaultDate()
                this.close()
                document.removeEventListener('click', this.clickOutside, false)
            }
        },
        init () {
            if (this.value) {
                this.setValue(this.value)
            }
            if (this.isInline) {
                this.showDayCalendar()
            }
        }
    },
    /**
     * Vue 1.x
     */
    ready () {
        this.init()
    },
    /**
     * Vue 2.x
     */
    mounted () {
        this.init()
    }

})


var app = new Vue({
    el: '#app',
    delimiters: ['${','}'],
    data() {
        return {
            selectedBook: '',
            searchBook:'',
            searchQuery: '',
            gridColumns: [],
            gridData: [
            ],
            rooms: [ ],
            autocompleteLoader: false,
            mailInscription: '',
            floatMenu1IsActive:false,
            floatMenu2IsActive:false,
            oeuvreIsShown: false,
            oeuvreShown: { },
            sujetSalon: "Lord of the Rings",
            nbParticipantsSalon: '3',
            dateSalon: '',
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
            userBooks:[ ],
            books: [ ],
            fetchArray: {},
            conn: {},
            clientInformation: {}
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
        showOeuvre(obj){
            this.oeuvreIsShown = true;
            this.oeuvreShown = obj;
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
        sendMessageChat : function (event) {

            var message = $('#message').val();
            var id_salon = $('#id_salon').text();

            var self = this;

            $.ajax({
                url: '/sendMessage',
                type: 'POST',
                data: 'message='+message+'&id_salon='+id_salon,
                success: function(response) {
                    //console.log(response);
                    if (response.valid === true) {
                        app.$root.$children[0].success(response.msg);
                        self.sendMessage(message);
                        $('#close-send-message').trigger( "click" );
                    }else{
                        app.$root.$children[0].error(response.msg);
                    }
                }
            });

            // Empty text area
            document.getElementById("message").value = "";

        },
        editProfil(event) {

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
                    $('#close-edit-profil').trigger( "click" );
                    app.$forceUpdate
                }
            });

        },
        creerSalon(){
            console.log('creation salon')
        },
        addBook(event) {
            app.$root.$children[0].success('requete envoyée');
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
                    $('#close-add-book').trigger( "click" );
                    app.$forceUpdate
                }
            });
        },
        getBooksTrends() {
            var that = this;
            $.ajax({
                url: 'http://localhost:8000/app_dev.php/getBooksTrends',
                type: 'GET',
                success: function(data) {
                    that.alaunes = data;
                    app.$root.$children[0].success('books trends récupérés');
                }
            });
        },
        getRooms(){
            var that = this;
            $.ajax({
                url: 'http://localhost:8000/app_dev.php/getRooms',
                type: 'GET',
                success: function(data) {
                    that.rooms = data;
                    that.gridColumns = Object.keys(data[0]);
                    that.gridData = data;
                    console.log(Object.keys(data[0]));
                    app.$root.$children[0].success('get rooms récupéré');
                }
            });
        },
        getAllBooks(){
            var that = this;
            $.ajax({
                url: 'http://localhost:8000/app_dev.php/getAllBooks',
                type: 'GET',
                success: function(data) {
                    console.log(data);
                    that.books = data;
                    app.$root.$children[0].success('all books récupérés');
                }
            });
        },
        appendMessage: function(username,message){
            var dt = new Date();
            var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

            if(message){
                $('.msg:last').after(
                    '<div class="media msg">'+
                    '<a class="pull-left" href="#">'+
                    '<img class="media-object" data-src="holder.js/64x64" alt="64x64" style="width: 32px; height: 32px;" src="">' +
                    '</a>'+
                    '<div class="media-body">'+
                    '<small class="pull-right time"><i class="fa fa-clock-o"></i> '+ time +'</small>'+
                    '<h5 class="media-heading">'+ username +'</h5>'+
                    '<small class="col-lg-10">'+ message +'</small>'+
                    '</div>'+
                    '</div>'
                );
            }
        },
        sendMessage: function(text){
            this.clientInformation.message = text;
            //console.log(text);
            console.log(this.clientInformation);
            // Send info as JSON
            this.conn.send(JSON.stringify(this.clientInformation));
            // Add my own message to the list
            this.appendMessage(this.clientInformation.username, this.clientInformation.message);
        },
        setConn: function(id){
            this.conn = new WebSocket('ws://localhost:9090/chat-'+id);
        },
        setClientInformation: function(myusername){
            this.clientInformation = {
                username: myusername
            };
        }
    },
    mounted(){
        var atmPage = window.location.pathname;
        if (atmPage == '/app_dev.php/livres') this.getAllBooks()
        if (atmPage == '/app_dev.php/') this.getBooksTrends()
        if (atmPage == '/app_dev.php/salons') { this.getRooms(); this.getAllBooks()}
        //SALON
        var pathArray = window.location.pathname.split( '/' );
        var indice = pathArray.length - 2;

        //si c'est un salon
        if (pathArray[indice] == 'salon') {
            // START SOCKET CONFIG
            /**
             * Note that you need to change the "sandbox" for the URL of your project. 
             * According to the configuration in Sockets/Chat.php , change the port if you need to.
             * @type WebSocket
             */
             var self = this;
            this.setConn($('#id_salon').text());
            this.setClientInformation($('#username').text());   

            this.conn.onopen = function(e) {
                console.info("Connection established succesfully");
            };      

            this.conn.onmessage = function(e) {
                var data = JSON.parse(e.data);  

                self.appendMessage(data.username, data.message);
                
                console.log(data);
            };
            
            this.conn.onerror = function(e){
                alert("Error: something went wrong with the socket.");
                console.error(e);
            };
            // END SOCKET CONFIG
        }
    }
});