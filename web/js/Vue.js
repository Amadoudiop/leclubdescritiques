/*Vue.component( 'oeuvre', {
    template: "#oeuvre",
    props: {
        title:'test',
        auteur:'',
        description:'',
        contenu:''
    },
    data(){
      return{
          oeuvreIsShown:true
      }
    }
    })*/

Vue.component('navbar-menu', {
    props:{
        isConnected: Boolean,
        page: String
    },
    data(){
        return{

        }
    },
    template: '#navbar-menu',
})

/*Vue.component('test-compo', {
    props: {
        title: String
    },
    data(){

    },
    template:'<div>{{ title }}</div>'
    })*/

var app = new Vue({
    el: '#app',
    delimiters: ['${','}'],
    data() {
        return {
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
                 auteur: 'Georges Orwell'
             },
             {
                titre:'Harry Potter',
                auteur: 'JK Rowling'
             },
             {
                titre:'Lord of the rings',
                auteur: 'J.R.R Tolkien'
             },
             {
                titre:' Don Quijote de la Mancha',
                auteur: 'Miguel de Cervantes'
             },
             {
                titre:'Le conte de Deux cités',
                auteur: 'Charles Dickens'
             },
            {
                titre:'Le Petit Prince',
                auteur: 'Antoine de Saint-Exupéry'
            }
             ],

        }
    },
    methods: {
        inscription(){
            alert("le compte a été créé.")
        },
        showOeuvre(_auteur,_titre){
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
        }

    }
});