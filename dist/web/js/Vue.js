'use strict';

var debounce = function debounce(callback, delay) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            callback.apply(context, args);
        }, delay);
    };
};

Vue.component('autocomplete', {
    template: '<div :class=\"(className ? className + \'-wrapper \' : \'\') + \'autocomplete-wrapper\'\"><input  type=\"text\" :id=\"id\":class=\"(className ? className + \'-input \' : \'\') + \'autocomplete-input\'\":placeholder=\"placeholder\"v-model=\"type\"@input=\"input(type)\"@dblclick=\"showAll\"@blur=\"hideAll\"@keydown=\"keydown\"@focus=\"focus\"autocomplete=\"off\" /><div :class=\"(className ? className + \'-list \' : \'\') + \'autocomplete transition autocomplete-list\'\" v-show=\"showList\"><ul><li v-for=\"(data, i) in json\"transition=\"showAll\":class=\"activeClass(i)\"><a  href=\"#\"@click.prevent=\"selectList(data)"@mousemove=\"mousemove(i)\"><b>{{ data[anchor] }}</b><span>{{ data[label] }}</span></a></li></ul></div> <br> <div v-if="autocompleteFlag" class="previsu">  <br></div>' + '<div class="row" v-if="autocompleteFlag">' + '<div class="container-fluid">' + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' + '<div class="userBooksCard"  >' + '<div class="panel panel-default">' + '<div class="panel-body">' + '<div>' + '<a  href="#portfolioModal1" class="portfolio-link" data-toggle="modal">' + '<img :src="dataRecup.url_image" id="url_image" alt="bookImg" class="img-thumbnail img-userBook img-responsive">' + '</a>' + '</div>' + '</div>' + '<div class="panel-footer" >' + '<h3><span id="title">{{ dataRecup.title }}</span></h3><br>' + '<span  id="url_product" class="hidden">{{ dataRecup.url_product }}</span>' + '<span  id="description" class="hidden">{{ dataRecup.description }}</span>' + '<span  id="publication_date" class="hidden">{{ dataRecup.publication_date }}</span>' + '<span  id="id_google_books_api" class="hidden">{{ dataRecup.id_google_books_api }}</span>' + '<span  id="sub_category" class="hidden">{{ dataRecup.sub_category }}</span>' + '<h4><span id="author">{{ dataRecup.authors }}</span></h4>' + '<star-rating :star-size="20" :max-rating="4" :rating="0"  :increment="0.5" :show-rating="false"  active-color="#D99E7E"></star-rating>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>',
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
        debounce: {
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
        onAjaxLoaded: Function
    },
    data: function data() {
        return {
            autocompleteFlag: false,
            showList: false,
            type: "",
            json: [],
            focusList: "",
            dataRecup: ""
        };
    },

    methods: {
        chargement: function chargement() {
            console.log("debut");
        },
        finChargement: function finChargement() {
            console.log("fin");
        },

        // Netralize Autocomplete
        clearInput: function clearInput() {
            this.showList = false;
            this.type = "";
            this.json = [];
            this.focusList = "";
        },

        // Get the original data
        cleanUp: function cleanUp(data) {
            return JSON.parse(JSON.stringify(data));
        },
        input: function input(val) {
            this.showList = true;
            // Callback Event
            this.onInput ? this.onInput(val) : null;
            // Debounce the "getData" method.
            if (!this.debouncedGetData || this.debounce !== this.oldDebounce) {
                this.oldDebounce = this.debounce;
                this.debouncedGetData = this.debounce ? debounce(this.getData.bind(this), this.debounce) : this.getData;
            }
            // Get The Data
            this.debouncedGetData(val);
        },
        showAll: function showAll() {
            this.json = [];
            this.getData("");
            // Callback Event
            this.onShow ? this.onShow() : null;
            this.showList = true;
        },
        hideAll: function hideAll(e) {
            var _this = this;

            // Callback Event
            this.onBlur ? this.onBlur(e) : null;
            setTimeout(function () {
                // Callback Event
                _this.onHide ? _this.onHide() : null;
                _this.showList = false;
            }, 250);
        },
        focus: function focus(e) {
            this.focusList = 0;
            // Callback Event
            this.onFocus ? this.onFocus(e) : null;
        },
        mousemove: function mousemove(i) {
            this.focusList = i;
        },
        keydown: function keydown(e) {
            var key = e.keyCode;
            // Disable when list isn't showing up
            if (!this.showList) return;
            switch (key) {
                case 40:
                    //down
                    this.focusList++;
                    break;
                case 38:
                    //up
                    this.focusList--;
                    break;
                case 13:
                    //enter
                    this.selectList(this.json[this.focusList]);
                    this.showList = false;
                    break;
                case 27:
                    //esc
                    this.showList = false;
                    break;
            }
            // When cursor out of range
            var listLength = this.json.length - 1;
            this.focusList = this.focusList > listLength ? 0 : this.focusList < 0 ? listLength : this.focusList;
        },
        activeClass: function activeClass(i) {
            return {
                'focus-list': i == this.focusList
            };
        },
        selectList: function selectList(data) {
            this.dataRecup = this.cleanUp(data);
            this.autocompleteFlag = true;
            console.log(this.dataRecup);
            var clean = this.cleanUp(data);
            // Put the selected data to type (model)
            this.type = clean[this.anchor];
            this.showList = false;
            /**
             * Callback Event
             * Deep clone of the original object
             */
            this.onSelect ? this.onSelect(clean) : null;
        },
        getData: function getData(val) {
            var _this2 = this;

            app.autocompleteLoader = true;
            var self = this;
            if (val.length < this.min) return;
            if (this.url != null) {
                // Callback Event
                app.autocompleteLoader = true;
                this.onBeforeAjax ? this.onBeforeAjax(val) : null;
                var ajax = new XMLHttpRequest();
                var params = "";
                if (this.customParams) {
                    Object.keys(this.customParams).forEach(function (key) {
                        params += '&' + key + '=' + _this2.customParams[key];
                    });
                }
                ajax.open('GET', this.url + '{' + this.param + '=' + val + params + '}', true);
                ajax.send();
                ajax.addEventListener('progress', function (data) {
                    if (data.lengthComputable) {
                        // Callback Event
                        this.onAjaxProgress ? this.onAjaxProgress(data) : null;
                    }
                });
                ajax.addEventListener('loadend', function (data) {
                    var json = JSON.parse(this.responseText);
                    // Callback Event
                    app.autocompleteLoader = false;
                    this.onAjaxLoaded ? this.onAjaxLoaded(json) : null;
                    self.json = self.process ? self.process(json) : json;
                });
            }
        },
        setValue: function setValue(val) {
            this.type = val;
        }
    },
    created: function created() {
        // Sync parent model with initValue Props
        this.type = this.initValue ? this.initValue : null;
    }
});
Vue.component('loader', {
    template: '<div class="v-spinner" v-show="loading">' + '<div class="v-square" v-bind:style="spinnerStyle">' + '</div>' + '</div>',
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
    data: function data() {
        return {
            spinnerStyle: {
                backgroundColor: this.color,
                height: this.size,
                width: this.size
            }
        };
    }
});
Vue.component('toast', {
    template: '' + '<div class="v-toaster">' + '<transition-group name="v-toast">' + '<div class="v-toast" :class="{[t.theme]: t.theme}" v-for="t in items" :key="t.key"><a class="v-toast-btn-clear" @click="remove(t)"></a>{{t.message}}</div>' + '</transition-group>' + '</div>' + '',
    props: {
        timeout: {
            type: Number,
            default: 10000
        }
    },
    methods: {
        success: function success(message) {
            var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.add(message, { theme: 'v-toast-success', timeout: option.timeout });
        },
        info: function info(message) {
            var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.add(message, { theme: 'v-toast-info', timeout: option.timeout });
        },
        warning: function warning(message) {
            var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.add(message, { theme: 'v-toast-warning', timeout: option.timeout });
        },
        error: function error(message) {
            var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
            this.add(message, { theme: 'v-toast-error', timeout: option.timeout });
        },
        add: function add(message, _ref) {
            var _this3 = this;

            var theme = _ref.theme,
                timeout = _ref.timeout;

            if (!this.$parent) {
                this.$mount();
                document.body.appendChild(this.$el);
            }
            var item = { message: message, theme: theme, key: Date.now() + '-' + Math.random() };
            this.items.push(item);
            setTimeout(function () {
                return _this3.remove(item);
            }, timeout || this.timeout);
        },
        remove: function remove(item) {
            var i = this.items.indexOf(item);
            if (i >= 0) {
                this.items.splice(i, 1);
            }
        }
    },
    data: function data() {
        return {
            items: []
        };
    }
});
Vue.component('star-rating', VueStarRating.default);
Vue.component('vue-table', {
    template: '' + '<table class="col-sm-12">' + '    <thead>' + '    <tr>' + '    <th v-for="key in columns" @click="sortBy(key)" :class="{ active: sortKey == key } " >' + '    {{ key | capitalize }}' + '<span class="arrow" :class="sortOrders[key] > 0 ? \'asc\' : \'dsc\'"> </span>' + '    </th>' + '    </tr>' + '    </thead>' + '    <tbody>' + '    <tr v-for="entry in filteredData">' + '    <td v-for="key in columns">' + '    {{entry[key]}}' + '</td>' + '</tr>' + '</tbody>' + '</table> ' + '',
    props: {
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function data() {
        var sortOrders = {};
        this.columns.forEach(function (key) {
            sortOrders[key] = 1;
        });
        return {
            sortKey: '',
            sortOrders: sortOrders
        };
    },
    computed: {
        filteredData: function filteredData() {
            var sortKey = this.sortKey;
            var filterKey = this.filterKey && this.filterKey.toLowerCase();
            var order = this.sortOrders[sortKey] || 1;
            var data = this.data;
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
                    });
                });
            }
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey];
                    b = b[sortKey];
                    return (a === b ? 0 : a > b ? 1 : -1) * order;
                });
            }
            return data;
        }
    },
    filters: {
        capitalize: function capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
    },
    methods: {
        sortBy: function sortBy(key) {
            this.sortKey = key;

            this.sortOrders[key] = this.sortOrders[key] * -1;
        }
    }
});

var app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    data: function data() {
        return {
            searchBook: '',
            searchQuery: '',
            gridColumns: [],
            gridData: [],
            rooms: [],
            autocompleteLoader: false,
            mailInscription: '',
            floatMenu1IsActive: false,
            floatMenu2IsActive: false,
            oeuvreIsShown: false,
            oeuvreShown: {},
            sujetSalon: "Lord of the Rings",
            nbParticipantsSalon: '3',
            dateSalon: '',
            alaunes: [{
                titre: '1984',
                auteur: 'Georges Orwell',
                rating: 4.5
            }, {
                titre: 'Harry Potter',
                auteur: 'JK Rowling',
                rating: 3
            }, {
                titre: 'Lord of the rings',
                auteur: 'J.R.R Tolkien',
                rating: 4
            }, {
                titre: ' Don Quijote de la Mancha',
                auteur: 'Miguel de Cervantes',
                rating: 4.8
            }, {
                titre: 'Le conte de Deux cités',
                auteur: 'Charles Dickens',
                rating: 5
            }, {
                titre: 'Le Petit Prince',
                auteur: 'Antoine de Saint-Exupéry',
                rating: 5
            }],
            userBooks: [],
            books: [],
            fetchArray: {}
        };
    },

    methods: {
        chargement: function chargement() {
            //this.autocompleteLoader = true
        },
        finChargement: function finChargement() {
            // this.autocompleteLoader = false
        },

        inscription: function inscription(event) {

            var email = $('#email').val();

            $.ajax({
                url: 'http://localhost:8000/register/',
                type: 'POST',
                data: 'email=' + email,
                success: function success(msg) {
                    console.log(msg);
                }
            });
        },
        confirmInscription: function confirmInscription(event) {

            var firstname = $('#firstname').val();
            var lastname = $('#lastname').val();
            var password = $('#password').val();
            var confirmPassword = $('#confirmPassword').val();

            $.ajax({
                url: Routing.generate('valide_activate_account'),
                type: 'POST',
                data: 'firstname=' + firstname + '&lastname=' + lastname + '&password=' + password + '&confirmPassword=' + confirmPassword,
                success: function success(msg) {
                    console.log(msg);
                }
            });
        },
        showOeuvre: function showOeuvre(obj) {
            this.oeuvreIsShown = true;
            this.oeuvreShown = obj;
        },
        closeModal: function closeModal() {
            this.oeuvreIsShown = false;
        },
        showFloatMenu: function showFloatMenu(numberCard) {
            floatMenu = "floatMenu" + numberCard + "IsActive";
            this.floatMenu = !this.floatMenu;
        },
        showPassword: function showPassword() {
            var key_attr = $('#key').attr('type');
            if (key_attr != 'text') {
                $('.checkbox').addClass('show');
                $('#key').attr('type', 'text');
            } else {
                $('.checkbox').removeClass('show');
                $('#key').attr('type', 'password');
            }
        },

        sendMessage: function sendMessage(event) {

            var message = $('#message').val();

            $.ajax({
                url: Routing.generate('send_message'),
                type: 'POST',
                data: 'message=' + message,
                success: function success(msg) {
                    console.log(msg);
                    $('#close-send-message').trigger("click");
                }
            });

            $('.msg').append("<p> dit : " + message + "</p>");
        },
        editProfil: function editProfil(event) {

            var firstname = $('#edit_firstname').val();
            var lastname = $('#edit_lastname').val();
            var email = $('#edit_email').val();
            var description = $('#edit_description').val();

            $.ajax({
                url: Routing.generate('edit_profil'),
                type: 'POST',
                data: 'firstname=' + firstname + '&lastname=' + lastname + '&email=' + email + '&description=' + description,
                success: function success(msg) {
                    console.log(msg);
                    $('#close-edit-profil').trigger("click");
                    app.$forceUpdate;
                }
            });
        },
        addBook: function addBook(event) {
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
                data: 'author=' + author + '&title=' + title + '&url_image=' + url_image + '&url_product=' + url_product + '&description=' + description + '&publication_date=' + publication_date + '&id_google_api=' + id_google_api + '&sub_category=' + sub_category,
                success: function success(msg) {
                    app.$root.$children[0].success(msg);
                    $('#close-add-book').trigger("click");
                    app.$forceUpdate;
                }
            });
        },
        getBooksTrends: function getBooksTrends() {
            var that = this;
            $.ajax({
                url: 'http://localhost:8000/app_dev.php/getBooksTrends',
                type: 'GET',
                success: function success(data) {
                    that.alaunes = data;
                    app.$root.$children[0].success('books trends récupérés');
                }
            });
        },
        getRooms: function getRooms() {
            var that = this;
            $.ajax({
                url: 'http://localhost:8000/app_dev.php/getRooms',
                type: 'GET',
                success: function success(data) {
                    that.rooms = data;
                    that.gridColumns = Object.keys(data[0]);
                    that.gridData = data;
                    console.log(Object.keys(data[0]));
                    app.$root.$children[0].success('get rooms récupéré');
                }
            });
        },
        getAllBooks: function getAllBooks() {
            var that = this;
            $.ajax({
                url: 'http://localhost:8000/app_dev.php/getAllBooks',
                type: 'GET',
                success: function success(data) {
                    console.log(data);
                    that.books = data;
                    app.$root.$children[0].success('all books récupérés');
                }
            });
        }
    },
    mounted: function mounted() {
        var atmPage = window.location.pathname;
        if (atmPage == '/app_dev.php/livres') this.getAllBooks();
        if (atmPage == '/app_dev.php/') this.getBooksTrends();
        if (atmPage == '/app_dev.php/salons') this.getRooms();

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
//# sourceMappingURL=Vue.js.map