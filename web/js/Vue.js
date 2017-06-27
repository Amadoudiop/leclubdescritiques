
Vue.component('autocomplete', {
    template: '<div :class=\"(className ? className + \'-wrapper \' : \'\') + \'autocomplete-wrapper\'\"><input  type=\"text\" :id=\"id\":class=\"(className ? className + \'-input \' : \'\') + \'autocomplete-input\'\":placeholder=\"placeholder\"v-model=\"type\"@input=\"input(type)\"@dblclick=\"showAll\"@blur=\"hideAll\"@keydown=\"keydown\"@focus=\"focus\"autocomplete=\"off\" /><div :class=\"(className ? className + \'-list \' : \'\') + \'autocomplete transition autocomplete-list\'\" v-show=\"showList\"><ul><li v-for=\"(data, i) in json\"transition=\"showAll\":class=\"activeClass(i)\"><a  href=\"#\"@click.prevent=\"selectList(data)"@mousemove=\"mousemove(i)\"><b>{{ data[anchor] }}</b><span>{{ data[label] }}</span></a></li></ul></div> <br> <div v-if="autocompleteFlag" class="previsu"> <label for="authors">{{ dataRecup.authors }}</label> <br><img :src="dataRecup.url_image" alt="bookImg"></div></div>',
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
        debounce: Number,
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
            default: 0
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
            let self = this;
            if (val.length < this.min) return;
            if(this.url != null){
                // Callback Event
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

Vue.component('star-rating', VueStarRating.default);


var app = new Vue({
    el: '#app',
    delimiters: ['${','}'],
    data() {
        return {
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