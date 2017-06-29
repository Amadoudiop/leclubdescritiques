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
    template: '<div :class=\"(className ? className + \'-wrapper \' : \'\') + \'autocomplete-wrapper\'\"><input  type=\"text\" :id=\"id\":class=\"(className ? className + \'-input \' : \'\') + \'autocomplete-input\'\":placeholder=\"placeholder\"v-model=\"type\"@input=\"input(type)\"@dblclick=\"showAll\"@blur=\"hideAll\"@keydown=\"keydown\"@focus=\"focus\"autocomplete=\"off\" /><div :class=\"(className ? className + \'-list \' : \'\') + \'autocomplete transition autocomplete-list\'\" v-show=\"showList\"><ul><li v-for=\"(data, i) in json\"transition=\"showAll\":class=\"activeClass(i)\"><a  href=\"#\"@click.prevent=\"selectList(data)"@mousemove=\"mousemove(i)\"><b>{{ data[anchor] }}</b><span>{{ data[label] }}</span></a></li></ul></div> <br> <div v-if="autocompleteFlag" class="previsu">  <br></div>' + '<div class="row" v-if="autocompleteFlag">' + '<div class="container-fluid">' + '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' + '<div class="userBooksCard"  >' + '<div class="panel panel-default">' + '<div class="panel-body">' + '<div>' + '<a  href="#portfolioModal1" class="portfolio-link" data-toggle="modal">' + '<img :src="dataRecup.url_image" id="url_image" alt="bookImg" class="img-thumbnail img-userBook img-responsive">' + '</a>' + '</div>' + '</div>' + '<div class="panel-footer" >' + '<h3>{{ dataRecup.title }} <br></h3>' + '<span  id="url_product" class="hidden">{{ dataRecup.url_product }}</span>' + '<span  id="description" class="hidden">{{ dataRecup.description }}</span>' + '<span  id="publication_date" class="hidden">{{ dataRecup.publication_date }}</span>' + '<span  id="id_google_books_api" class="hidden">{{ dataRecup.id_google_books_api }}</span>' + '<h4>{{ dataRecup.authors }} </h4>' + '<star-rating :star-size="20" :rating="0"  :increment="0.5" :show-rating="false"  active-color="#D99E7E"></star-rating>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>',
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

var app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    data: function data() {
        return {
            autocompleteLoader: false,
            isConnected: false,
            mailInscription: '',
            floatMenu1IsActive: false,
            floatMenu2IsActive: false,
            oeuvreIsShown: false,
            oeuvreShown: {
                titre: 'temp_titre',
                auteur: 'temp_auteur',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                genre: 'roman',
                salon: 'Date_du_salon',
                note: '4'
            },
            sujetSalon: "Lord of the Rings",
            nbParticipantsSalon: '3',
            dateSalon: '',
            lienSalon: '/salon',
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
            userBooks: [{
                titre: '1984',
                auteur: 'Georges Orwell',
                Grating: 4.5,
                Urating: 5
            }, {
                titre: 'Harry Potter',
                auteur: 'JK Rowling',
                Grating: 3,
                Urating: 5
            }],
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
        showOeuvre: function showOeuvre(_auteur, _titre) {
            console.log("hello");
            this.oeuvreIsShown = true;
            this.oeuvreShown.titre = _titre;
            this.oeuvreShown.auteur = _auteur;
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
                }
            });
        },
        addBook: function addBook(event) {
            //app.$root.$children[0].success('hello');
            //app.$root.$children[0].error('error');
            //this.$children.success('toster ok')
            var author = encodeURIComponent($('#authors').text());
            var title = encodeURIComponent($('#title').text());
            var description = encodeURIComponent($('#description').text());
            var publication_date = encodeURIComponent($('#publication_date').text());
            var id_google_api = encodeURIComponent($('#id_google_books_api').text());
            var url_image = encodeURIComponent(document.getElementById("url_image").src);
            var url_product = encodeURIComponent($('#url_product').text());

            $.ajax({
                url: Routing.generate('add_book'),
                type: 'POST',
                data: 'author=' + author + '&title=' + title + '&url_image=' + url_image + '&url_product=' + url_product + '&description=' + description + '&publication_date=' + publication_date + '&id_google_api=' + id_google_api,
                success: function success(msg) {
                    app.$root.$children[0].success(msg);
                    console.log(msg);
                }
            });
        }
    },
    mounted: function mounted() {
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