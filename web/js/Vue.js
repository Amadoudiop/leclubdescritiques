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
                            '<select id="status">'+
                                '<option v-for="status in dataRecup.statuts" :value="status.id">{{ status.wording }}</option>'+
                            '</select>'+
                            '<star-rating v-model="ratingAddBook" :star-size="20" :max-rating="4" :rating="0"  :increment="1" :show-rating="false"  active-color="#D99E7E"></star-rating>'+
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
            ratingAddBook: '',
            autocompleteFlag:false,
            showList: false,
            type: "",
            json: [],
            focusList: "",
            dataRecup: {}
        };
    },
    methods: {
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
Vue.component('star-rating', {
    template:'' +
    '<div :class="[\'vue-star-rating\', {\'vue-star-rating-rtl\':rtl}, {\'vue-star-rating-inline\': inline}]">'+
        '<div @mouseleave="resetRating" class="vue-star-rating">'+
        '<span v-for="n in maxRating" :class="[{\'vue-star-rating-pointer\': !readOnly }, \'vue-star-rating-star\']">'+
        '<star :fill="fillLevel[n-1]" :size="starSize" :star-id="n" :step="step" :active-color="activeColor" :inactive-color="inactiveColor" :border-color="borderColor" :border-width="borderWidth" :padding="padding" @star-selected="setRating($event, true)" @star-mouse-move="setRating" :rtl="rtl"></star>'+
        '</span>'+
        '<span v-if="showRating" :class="[\'vue-star-rating-rating-text\', textClass]"> {{formattedRating}}</span>'+
    '</div>'+
    '</div>' +
    '',
    model: {
        prop: 'rating',
        event: 'rating-selected'
    },
    props: {
        increment: {
            type: Number,
            default: 1
        },
        rating: {
            type: Number,
            default: 0
        },
        activeColor: {
            type: String,
            default: '#ffd055'
        },
        inactiveColor: {
            type: String,
            default: '#d8d8d8'
        },
        maxRating: {
            type: Number,
            default: 5
        },
        starSize: {
            type: Number,
            default: 50
        },
        showRating: {
            type: Boolean,
            default: true
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        textClass: {
            type: String,
            default: ''
        },
        inline: {
            type: Boolean,
            default: false
        },
        borderColor: {
            type: String,
            default: '#999'
        },
        borderWidth: {
            type: Number,
            default: 0
        },
        padding: {
            type: Number,
            default: 0
        },
        rtl: {
            type: Boolean,
            default: false
        },
        fixedPoints: {
            type: Number,
            default: null
        }
    },
    data() {
        return {
            step: 0,
            fillLevel: [],
            currentRating: 0,
            selectedRating: 0
        }
    },
    created() {
        this.step = this.increment * 100
        this.currentRating = this.rating
        this.selectedRating = this.rating
        this.createStars()
    },
    methods: {
        setRating($event, persist) {
            if (!this.readOnly) {
                const position = (this.rtl) ? (100 - $event.position) / 100 : $event.position / 100
                this.currentRating = (($event.id + position) - 1).toFixed(2)
                this.currentRating = (this.currentRating > this.maxRating) ? this.maxRating : this.currentRating
                this.createStars()
                if (persist) {
                    this.selectedRating = this.currentRating
                    this.$emit('rating-selected', this.selectedRating)
                } else {
                    this.$emit('current-rating', this.currentRating)
                }
            }
        },
        resetRating() {
            if (!this.readOnly) {
                this.currentRating = this.selectedRating
                this.createStars()
            }
        },
        createStars() {
            this.round()
            for (var i = 0; i < this.maxRating; i++) {
                let level = 0
                if (i < this.currentRating) {
                    level = (this.currentRating - i > 1) ? 100 : (this.currentRating - i) * 100
                }
                this.$set(this.fillLevel, i, Math.round(level))
            }
        },
        round() {
            var inv = 1.0 / this.increment
            this.currentRating = Math.min(this.maxRating, Math.ceil(this.currentRating * inv) / inv)
        }
    },
    computed: {
        formattedRating() {
            return (this.fixedPoints === null) ? this.currentRating : this.currentRating.toFixed(this.fixedPoints)
        }
    },
    watch: {
        rating(val) {
            this.currentRating = val
            this.selectedRating = val
            this.createStars()
        }
    }
})
Vue.component('star', {
    template : '' +
    '<svg :height="getSize" :width="getSize" @mousemove="mouseMoving" @click="selected" style="overflow:visible;">'+
    '<linearGradient :id="grad" x1="0" x2="100%" y1="0" y2="0">'+
    '<stop :offset="getFill" :stop-color="(rtl) ? inactiveColor : activeColor" />'+
    '<stop :offset="getFill" :stop-color="(rtl) ? activeColor : inactiveColor" />'+
    '</linearGradient>'+
    '<polygon :points="starPointsToString" :fill="getGradId" :stroke="borderColor" :stroke-width="borderWidth" />'+
    '<polygon :points="starPointsToString" :fill="getGradId" />'+
    '</svg>' +
    '',
    props: {
        fill: {
            type: Number,
            default: 0
        },
        size: {
            type: Number,
            default: 50
        },
        starId: {
            type: Number,
            required: true
        },
        activeColor: {
            type: String,
            required: true
        },
        inactiveColor: {
            type: String,
            required: true
        },
        borderColor: {
            type: String,
            default: '#000'
        },
        borderWidth: {
            type: Number,
            default: 0
        },
        padding: {
            type: Number,
            default: 0
        },
        rtl: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            starPoints: [19.8, 2.2, 6.6, 43.56, 39.6, 17.16, 0, 17.16, 33, 43.56],
            grad: ''
        }
    },
    created() {
        this.calculatePoints
        this.grad = Math.random().toString(36).substring(7)
    },
    computed: {
        calculatePoints() {
            this.starPoints = this.starPoints.map((point) => {
                return ((this.size / 43) * point) + (this.borderWidth * 1.5)
            })
        },
        starPointsToString() {
            return this.starPoints.join(',')
        },
        getGradId() {
            return 'url(#' + this.grad + ')'
        },
        getSize() {
            return parseInt(this.size) + parseInt(this.borderWidth * 3) + this.padding
        },
        getFill() {
            return (this.rtl) ? 100 - this.fill + '%' : this.fill + '%'
        }
    },
    methods: {
        mouseMoving($event) {
            this.$emit('star-mouse-move', {
                event: $event,
                position: this.getPosition($event),
                id: this.starId
            })
        },
        getPosition($event) {
            // calculate position in percentage.
            var starWidth = (92 / 100) * this.size
            var position = Math.round((100 / starWidth) * $event.offsetX)
            return Math.min(position, 100)
        },
        selected($event) {
            this.$emit('star-selected', {
                id: this.starId,
                position: this.getPosition($event)
            })
        }
    }
})


var app = new Vue({
    el: '#app',
    delimiters: ['${','}'],
    data() {
        return {
            loadingFrame: true,
            ratingAddBook: '',
            userID:{ },
            userData: {
                firstname: "Joe",
                lastname: "RIBEIRO",
                description: "Bonsoir à tous les pilotes",
                last_login: "02/07/2017",
                email: "johribe@gmail.com"
            } ,
            userContacts:{ },
            atmUser: '',
            selectedBook: '',
            searchBook: '',
            searchQuery: '',
            gridColumns: [ ],
            gridData: [ ],
            rooms: [
                {
                    created_by: "",
                    end_date: "04/01/2018",
                    id: 1,
                    oeuvre: "The Ivory Tower and Harry Potter",
                    participants_number: 3,
                    start_date: "01/,01/2012",
                    title: "test 1",
                },
                {
                    created_by: "",
                    end_date: "04/01/2018",
                    id: 1,
                    oeuvre: "The Ivory Tower and Harry Potter",
                    participants_number: 3,
                    start_date: "01/,01/2012",
                    title: "test 1",
                }
            ],
            autocompleteLoader: false,
            mailInscription: '',
            floatMenu1IsActive:false,
            floatMenu2IsActive:false,
            oeuvreIsShown: false,
            oeuvreShown: {
                author:"J.K. Rowling",
                category:"Livre",
                description:"Une rentre fracassante en voiture volante, une trange maldiction qui INTOabat sur les Slves, cette deuxime anne INTOLcole des sorciers ne INTOannonce pas de tout repos! Entre les cours de potions magiques, les matches de Quidditch et les combats de mauvais sorts, Harry et ses amis Ron et Hermione trouveront-ils le temps de percer le mystSre de la Chambre des Secrets? Le deuxi me volume des aventures de Harry Potter : un livre magique pour sorciers confirms.",
                publication_date:"08/12/2015",
                rating:4,
                sub_category:"Education",
                title:"Harry Potter et la Chambre des Secrets",
                url_image:"",
                url_product:"https://play.google.com/store/books/details?id=GBl6MWssicEC&source=gbs_api",

            },
            alaunes: [

             ],
            userBooks:[ ],
            books: [
                {
                    author:"Lana A. Whited",
                    category:"Livre",
                    description:"Now available in paper, The Ivory Tower and Harry Potter is the first book-length analysis of J. K. Rowling's work from a broad range of perspectives within literature, folklore, psychology, sociology, and popular culture. A significant portion of the book explores the Harry Potter series' literary ancestors, including magic and fantasy works by Ursula K. LeGuin, Monica Furlong, Jill Murphy, and others, as well as previous works about the British boarding school experience. Other chapters explore the moral and ethical dimensions of Harry's world, including objections to the series raised within some religious circles. In her new epilogue, Lana A. Whited brings this volume up to date by covering Rowling's latest book, Harry Potter and the Order of the Phoenix.",
                    id:1,
                    publication_date:"08/07/2017",
                    rating:5,
                    sub_category:"Literary Criticism",
                    title:"The Ivory Tower and Harry Potter",
                    url_image:"http://books.google.com/books/content?id=iO5pApw2JycC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api",
                    url_product:"http://books.google.fr/books?id=iO5pApw2JycC&dq=%7Bharry%7D&hl=&source=gbs_api"
                }
            ],
            fetchArray: { },
            conn: { },
            clientInformation: { }
        }
    },
    methods: {
        inscription : function (event) {
          var email = $('#email').val();
          var self = this;
          $.ajax({
                url: '/app.php/register/',
                type: 'POST',
                data: 'email='+email,
                success: function(response) {
                    if (response.valid === true) {
                        self.$refs.toast.success(response.msg);
                    }else{
                        self.$refs.toast.error(response.msg);
                    }
                }
            });

        },
        confirmInscription : function (event) {

            var firstname = $('#firstname').val();
            var lastname = $('#lastname').val();
            var password = $('#password').val();
            var confirmPassword = $('#confirmPassword').val();
          var self = this;
            

            $.ajax({
                url: '/app.php/valideActivateAccount',
                type: 'POST',
                data: 'firstname='+firstname+'&lastname='+lastname+'&password='+password+'&confirmPassword='+confirmPassword,
                success: function(response) {
                    if (response.valid === true) {
                        self.$refs.toast.success(response.msg);
                    }else{
                        self.$refs.toast.error(response.msg);
                    }
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
                url: '/app.php/sendMessageChat',
                type: 'POST',
                data: 'message='+message+'&id_salon='+id_salon,
                success: function(response) {
                    if (response.valid === true) {
                        self.$refs.toast.success(response.msg);
                        self.sendMessage(message);
                        $('#close-send-message').trigger( "click" );
                    }else{
                        self.$refs.toast.error(response.msg);
                    }
                }
            });

            // Empty text area
            document.getElementById("message").value = "";

        },
        deleteMessageChat : function (id) {
            var id_salon = $('#id_salon').text();

            var self = this;

            $.ajax({
                url: '/app.php/deleteMessageChat',
                type: 'POST',
                data: 'id_message='+id+'&id_salon='+id_salon,
                success: function(response) {
                    if (response.valid === true) {
                        self.$refs.toast.success(response.msg);
                        $('#'+id).remove();
                    }else{
                        self.$refs.toast.error(response.msg);
                    }
                }
            });
        },
        reportMessageChat : function (id) {
            var id_salon = $('#id_salon').text();

            var self = this;

            $.ajax({
                url: '/app.php/reportMessageChat',
                type: 'POST',
                data: 'id_message='+id+'&id_salon='+id_salon,
                success: function(response) {
                    if (response.valid === true) {
                        self.$refs.toast.success(response.msg);
                        $("#btn-"+id).addClass("hidden");
                        $("#span-"+id).removeClass("hidden");
                    }else{
                        self.$refs.toast.error(response.msg);
                    }
                }
            });
        },
        editProfil(event) {

            var firstname = $('#edit_firstname').val();
            var lastname = $('#edit_lastname').val();
            var email = $('#edit_email').val();
            var description = $('#edit_description').val();
            var self = this;
            $.ajax({
                url: '/app.php/editProfil',
                type: 'POST',
                data: 'firstname='+firstname+'&lastname='+lastname+'&email='+email+'&description='+description,
                success: function(response) {
                    if (response.valid === true) {
                        self.$refs.toast.success(response.msg);
                        self.userData.firstname = firstname;
                        self.userData.lastname = lastname;
                        self.userData.email = email;
                        self.userData.description = description;
                        $('#close-edit-profil').trigger( "click" );
                    }else{
                        self.$refs.toast.error(response.msg);
                    }
                }
            });

        },
        creerSalon(){
            var title = $('#salon-title').val();
            var book = $('#salon-book').val();
            var nb_max_part = $('#salon-max-participants').val();
            var date_start = $('#salon-date-debut').val();
            var date_end = $('#salon-date-fin').val();
            var self = this;

            $.ajax({
                url: '/app.php/createRoom',
                type: 'POST',
                data: 'title='+title+'&book='+book+'&nb_max_part='+nb_max_part+'&date_start='+date_start+'&date_end='+date_end,
                success: function(response) {
                    if (response.valid === true) {
                        self.$refs.toast.success(response.msg);
                    }else{
                        self.$refs.toast.error(response.msg);
                    }
                }
            });
        },
        editSalon(){
            var title = $('#salon-title').val();
            var nb_max_part = $('#salon-max-participants').val();
            var id_salon = $('#id_salon').text();
            var self = this;

            $.ajax({
                url: '/app.php/editRoom',
                type: 'POST',
                data: 'title='+title+'&nb_max_part='+nb_max_part+'&id_salon='+id_salon,
                success: function(response) {
                    if (response.valid === true) {
                        self.$refs.toast.success(response.msg);
                    }else{
                        self.$refs.toast.error(response.msg);
                    }
                }
            });
        },
        addBook(event) {
            var rating = app.$refs.autocomplete.ratingAddBook;
            var author = encodeURIComponent($('#author').text());
            var title = encodeURIComponent($('#title').text());
            var description = encodeURIComponent($('#description').text());
            var publication_date = encodeURIComponent($('#publication_date').text());
            var id_google_api = encodeURIComponent($('#id_google_books_api').text());
            var url_image = encodeURIComponent(document.getElementById("url_image").src);
            var url_product = encodeURIComponent($('#url_product').text());
            var sub_category = encodeURIComponent($('#sub_category').text());
            var status = encodeURIComponent($('#status').val());

            var object = {'author':author,'title':title, 'description':description,'publication_date':publication_date,'id_google_api':id_google_api,'url_image':url_image,'url_product':url_product,'sub_category':sub_category,'rating':rating,'status':status};
            var self = this;
            $.ajax({
                url: '/app.php/addBook',
                type: 'POST',
                data: 'author='+author+'&title='+title+'&url_image='+url_image+'&url_product='+url_product+'&description='+description+'&publication_date='+publication_date+'&id_google_api='+id_google_api+'&sub_category='+sub_category+'&rating='+rating+'&status='+status,
                success: function(response) {
                    if (response.valid === true) {
                        self.$refs.toast.success(response.msg);
                        $('#close-add-book').trigger( "click" );
                        self.userBooks.push(object);
                    }else{
                        self.$refs.toast.error(response.msg);
                    }   
                }
            });
        },
        getBooksTrends() {
            var that = this;
            $.ajax({
                url: '/app.php/getBooksTrends',
                type: 'GET',
                success: function(data) {
                    that.alaunes = data;
                    //app.$refs.toast.success('books trends récupérés');
                }
            });
        },
        getRooms(){
            var that = this;
            $.ajax({
                url: '/app.php/getRooms',
                type: 'GET',
                success: function(data) {
                    that.rooms = data;
                    that.gridColumns = Object.keys(data[0]);
                    //app.$refs.toast.success('get rooms récupéré');
                }
            });
        },
        getAllBooks(){
            var that = this;
            $.ajax({
                url: '/app.php/getAllBooks',
                type: 'GET',
                success: function(data) {
                    that.books = data;
                    //app.$refs.toast.success('all books récupérés');
                }
            });
        },
        appendMessage: function(username,message,id){
            var dt = new Date();
            var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

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
        },
        sendMessage: function(text){
            this.clientInformation.message = text;
            // Send info as JSON
            this.conn.send(JSON.stringify(this.clientInformation));
            // Add my own message to the list
            this.appendMessage(this.clientInformation.username, this.clientInformation.message, this.clientInformation.id);
        },
        setConn: function(id){
            this.conn = new WebSocket('ws://localhost:9090/chat-'+id);
            //console.log(this.conn)
        },
        setClientInformation: function(myusername, myid){
            this.clientInformation = {
                username: myusername,
                id: myid
            };
        },
        addContact() {
            var id_user = encodeURIComponent($('#id_user').text());

            $.ajax({
                url: '/app.php/addContact',
                type: 'POST',
                data: 'id_user=' + id_user,
                success: function (response) {
                    if (response.valid === true) {
                        app.$refs.toast.success(response.msg);
                        $("#btnAddContact").addClass("hidden");
                        $("#btnRemoveContact").removeClass("hidden");
                    } else {
                        app.$refs.toast.error(response.msg);
                    }
                }
            })
        },
        removeContact() {
            var id_user = encodeURIComponent($('#id_user').text());

            $.ajax({
                url: '/app.php/removeContact',
                type: 'POST',
                data: 'id_user=' + id_user,
                success: function (response) {
                    if (response.valid === true) {
                        app.$refs.toast.success(response.msg);
                        $("#btnAddContact").removeClass("hidden");
                        $("#btnRemoveContact").addClass("hidden");
                    } else {
                        app.$root.$children[0].error(response.msg);
                    }
                }
            })
        },
        getUser(){
            return $('#id_user').text();
        },
        getUserData(){
            var self = this;
            $.ajax({
                url: '/app.php/getInfosUser/'+ self.atmUser,
                type: 'GET',
                success: function(data) {
                    self.userData = data;
                    self.$refs.toast.success('UserData récupérés');

                }
            });
        },
        getOeuvreUser(){
            var self = this;
            $.ajax({
                url: '/app.php/getBooksUser/'+ self.atmUser,
                type: 'GET',
                success: function(data) {
                    self.userBooks = data;
                    app.$refs.toast.success('userBooks OK');
                }
            });
        },
        sendMessagePersonal : function (event) {

            var message = $('#message').val();
            var sujet = $('#sujet').val();
            var id_user = $('#id_user').text();

            var self = this;

            $.ajax({
                url: '/app.php/sendMessagePersonal',
                type: 'POST',
                data: 'message='+message+'&sujet='+sujet+'&id_user='+id_user,
                success: function(response) {
                    if (response.valid === true) {
                        app.$root.$children[0].success(response.msg);
                    }else{
                        app.$root.$children[0].error(response.msg);
                    }
                }
            });
        },
        rejoinRoom : function (id) {
            $.ajax({
                url: '/app.php/rejoinRoom',
                type: 'POST',
                data: 'id_salon='+id,
                success: function(response) {
                    if (response.valid === true) {
                        document.location.href='/app.php/salon/'+id;
                    }else{
                        app.$root.$children[0].error(response.msg);
                    }
                }
            });
        },
        inviteContact() {
            var contact = encodeURIComponent($('#contact').val());
            var id_salon = $('#id_salon').text();

            $.ajax({
                url: '/app.php/inviteContact',
                type: 'POST',
                data: 'contact='+contact+'&id_salon='+id_salon,
                success: function (response) {
                    if (response.valid === true) {
                        app.$refs.toast.success(response.msg);
                    } else {
                        app.$root.$children[0].error(response.msg);
                    }
                }
            });
        },
        getUserContacts(){
            var self = this;
            $.ajax({
                url: '/app.php/getContactsUser/'+ self.atmUser,
                type: 'GET',
                success: function(data) {
                    self.userContacts = data;
                    self.$refs.toast.success('UserData récupérés');

                }
            });
        },
        sendEmailFormContact : function (event) {

            var message = $('#contact_message').val();
            var sujet = $('#contact_sujet').val();
            var firstname = $('#contact_firstname').val();
            var lastname = $('#contact_lastname').val();
            var email = $('#contact_email').val();

            var self = this;

            $.ajax({
                url: '/app.php/sendEmailFormContact',
                type: 'POST',
                data: 'message='+message+'&sujet='+sujet+'&firstname='+firstname+'&lastname='+lastname+'&email='+email,
                success: function(response) {
                    if (response.valid === true) {
                        self.$refs.toast.success(response.msg);
                    }else{
                        self.$refs.toast.error(response.msg);
                    }
                }
            });
        },
    },
    computed: {
        filteredBooks(){
            var self = this;
            return this.books.filter(function(book) {
                // of course you can use .map() or .reduce() depending on your business logic
                return book.title.toLowerCase().indexOf(self.searchBook.toLowerCase())>=0;

            })
        },

    },
    beforeCreate(){
        this.loadingFrame = true;
    },
    created(){
        this.atmUser = this.getUser();
        var pathArray = window.location.pathname.split( '/' );
        var indice = pathArray.length;
        if (pathArray[indice-1] == 'salons') { this.getRooms(); this.getAllBooks(); this.getOeuvreUser();}
        if (pathArray[indice-1] == '')  { this.getBooksTrends(); this.getRooms() }
        if (pathArray[indice-1] == 'livres') this.getAllBooks();
        if (pathArray[indice-1] == 'profil') { this.getUserData(); this.getOeuvreUser(); this.getUserContacts(); }
        if (pathArray[indice-2] == 'profil') { this.getUserData(); this.getOeuvreUser(); }


    },
    mounted(){
        //SALON
        var pathArray = window.location.pathname.split( '/' );
        var indice = pathArray.length - 2;

        //si c'est un salon
        if (pathArray[indice] == 'salon') {
            // START SOCKET CONFIG
            /*/!**
             * Note that you need to change the "sandbox" for the URL of your project. 
             * According to the configuration in Sockets/Chat.php , change the port if you need to.
             * @type WebSocket
             *!/*/

            var self = this;

            this.setConn($('#id_salon').text());
            this.setClientInformation($('#username').text(), $('#id_user').text());   

            this.conn.onopen = function(e) {
                console.info("Connection established succesfully");
            };      

            this.conn.onmessage = function(e) {
                var data = JSON.parse(e.data);  

                self.appendMessage(data.username, data.message, data.id);
                
                console.log(data);
            };
            
            this.conn.onerror = function(e){
                console.log("Error: something went wrong with the socket.");
                console.error(e);
            };
            // END SOCKET CONFIG
        }
    },
});