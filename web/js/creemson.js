// Donneés de test remplaceés par les données recupérer par la fonction getData()
var data = { 
    container1 :{
        dataPret: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        dataPasPret:[83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3],
        dataAPreter:[48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2],
        dataCherche: [42.4, 33.2, 34.5, 39.7, 52.6, 75.5, 57.4, 60.4, 47.6, 39.1, 46.8, 51.1],
    },
    container2:{
            data: [
            ['Science-fiction', 45.0],
            ['Policier', 26.8],
            {
                name: 'Manga',
                y: 12.8,
                sliced: true,
                selected: true
            },
            ['Roman', 8.5],
            ['Thriller', 6.2],
            ['Autres', 0.7]
        ]
    },
    container3:{
        dataSalon: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
        dataUsers: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
    },
    container4: {
        usersConnected: [80],
    },
    container5: {
        data: [3, 4, 3, 2, 4, 10, 12]
    }
};

$(function() {
    console.log('creemson.js to the rescue');


    console.log(data)

    function getdata(){
        $.ajax({
            url: Routing.generate('data_highchart'),
            type: 'GET',
            success: function(response) {
                data =  response
            }
        }); 
        return data       
    }

    data = getdata()
    charts(data)
    
    function charts (data){
        Highcharts.chart('container', {
            chart: {
                type: 'column'
            },
            title: {
                text: 'Total de livre par status'
            },
            subtitle: {
                text: 'Pret de livres'
            },
            xAxis: {
                categories: [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ],
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Livre (en unités)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
            series: [{
                name: 'En pret',
                data: data.container1.dataPret

            }, {
                name: 'Ne souhaite pas le preter',
                data: data.container1.dataPasPret

            }, {
                name: 'A preter',
                data: data.container1.dataAPreter

            }, {
                name: 'Cherche',
                data: data.container1.dataCherche

            }]
        });

        /////////////////////////////////

        Highcharts.chart('container2', {
            chart: {
                type: 'pie',
                options3d: {
                    enabled: true,
                    alpha: 45,
                    beta: 0
                }
            },
            title: {
                text: 'Nombre de livres par catégories'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}'
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share',
                data: data.container2.data
            }]
        });

        /////////////////////////////////

        Highcharts.chart('container3', {
            chart: {
                zoomType: 'xy'
            },
            title: {
                text: 'Utilisateurs connectés vs salons actifs'
            },
            xAxis: [{
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            }],
            yAxis: [{ // Primary yAxis
                labels: {
                    format: '{value} ',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                },
                title: {
                    text: 'Utilisateurs connectés',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Salons actifs',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
            }],

            tooltip: {
                shared: true
            },

            series: [{
                name: 'Salons actifs',
                type: 'column',
                yAxis: 1,
                data: data.container3.dataSalon,
                tooltip: {
                    pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f} mm</b> '
                }
            }, {
                name: 'Rainfall error',
                type: 'errorbar',
                yAxis: 1,
                data: [[48, 51], [68, 73], [92, 110], [128, 136], [140, 150], [171, 179], [135, 143], [142, 149], [204, 220], [189, 199], [95, 110], [52, 56]],
                tooltip: {
                    pointFormat: '(error range: {point.low}-{point.high} mm)<br/>'
                }
            }, {
                name: 'Utilisateurs',
                type: 'spline',
                data: data.container3.dataUsers,
                tooltip: {
                    pointFormat: '<span style="font-weight: bold; color: {series.color}">{series.name}</span>: <b>{point.y:.1f}°C</b> '
                }
            }, {
                name: 'Temperature error',
                type: 'errorbar',
                data: [[6, 8], [5.9, 7.6], [9.4, 10.4], [14.1, 15.9], [18.0, 20.1], [21.0, 24.0], [23.2, 25.3], [26.1, 27.8], [23.2, 23.9], [18.0, 21.1], [12.9, 14.0], [7.6, 10.0]],
                tooltip: {
                    pointFormat: '(error range: {point.low}-{point.high}°C)<br/>'
                }
            }]
        });

        /////////////////////


        Highcharts.chart('container4', {

            chart: {
                type: 'gauge',
                plotBackgroundColor: null,
                plotBackgroundImage: null,
                plotBorderWidth: 0,
                plotShadow: false
            },

            title: {
                text: 'Nombre d\'utilisateurs connectés'
            },

            pane: {
                startAngle: -150,
                endAngle: 150,
                background: [{
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#FFF'],
                            [1, '#333']
                        ]
                    },
                    borderWidth: 0,
                    outerRadius: '109%'
                }, {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#333'],
                            [1, '#FFF']
                        ]
                    },
                    borderWidth: 1,
                    outerRadius: '107%'
                }, {
                    // default background
                }, {
                    backgroundColor: '#DDD',
                    borderWidth: 0,
                    outerRadius: '105%',
                    innerRadius: '103%'
                }]
            },

            // the value axis
            yAxis: {
                min: 0,
                max: 200,

                minorTickInterval: 'auto',
                minorTickWidth: 1,
                minorTickLength: 10,
                minorTickPosition: 'inside',
                minorTickColor: '#666',

                tickPixelInterval: 30,
                tickWidth: 2,
                tickPosition: 'inside',
                tickLength: 10,
                tickColor: '#666',
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: 'utilisateurs connectés'
                },
                plotBands: [{
                    from: 0,
                    to: 120,
                    color: '#55BF3B' // green
                }, {
                    from: 120,
                    to: 160,
                    color: '#DDDF0D' // yellow
                }, {
                    from: 160,
                    to: 200,
                    color: '#DF5353' // red
                }]
            },

            series: [{
                name: 'Utilisateurs',
                data: data.container4.usersConnected,
                tooltip: {
                    valueSuffix: 'users'
                }
            }]

        },
        // Add some life
        function (chart) {
            if (!chart.renderer.forExport) {
                setInterval(function () {
                    var point = chart.series[0].points[0],
                        newVal,
                        inc = Math.round((Math.random() - 0.5) * 20);

                    newVal = point.y + inc;
                    if (newVal < 0 || newVal > 200) {
                        newVal = point.y - inc;
                    }

                    point.update(newVal);

                }, 3000);
            }
        });

        //////////////////////

        Highcharts.chart('container5', {
            chart: {
                type: 'area',
                inverted: true
            },
            title: {
                text: 'Nombre de salon ouverts sur la semaine'
            },
            subtitle: {
                style: {
                    position: 'absolute',
                    right: '0px',
                    bottom: '10px'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            xAxis: {
                categories: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday'
                ]
            },
            yAxis: {
                title: {
                    text: 'Nombre de salons actifs'
                },
                labels: {
                    formatter: function () {
                        return this.value;
                    }
                },
                min: 0
            },
            plotOptions: {
                area: {
                    fillOpacity: 0.5
                }
            },
            series: [{
                name: 'Salon',
                data: data.container5.data
            }]
        });
    }

    /**
     *
     */
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#preview_img').attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }

    $(".fileUploader").change(function(){
        readURL(this);
    });

    /**
     * Confirm delete
     */
    $('form .btn-danger').click(function(e){
        var r = confirm("Confirm delete");
        
        if (r == true)
        {    
            return true;
        }
        else
        {
            e.preventDefault();
        }
    });


    /**
     * Add Oeuvre to the trending list
     */
    $('.trends').click(function(){
        var id = $(this).attr('dataInt');
        console.log(id);
        $.ajax({
            url: Routing.generate('oeuvre_index'),
            type:'POST',
            data:'trends=true'+'&oeuvre_id='+id,
            success: function(state){
                //console.log(state);
                location.reload();
            }
        })
    });

    /**
     * Approve Oeuvre
     */
    $('.approve').click(function(){
        var id = $(this).attr('dataInt');
        console.log(id);
        $.ajax({
            url: Routing.generate('oeuvre_index'),
            type:'POST',
            data:'approve=true'+'&oeuvre_id='+id,
            success: function(state){
                //console.log(state);
                location.reload();
            }
        })
    });

    /**
     * Add or Remove page from section
     */
    $('.section').click(function(){
        var id = $(this).attr('dataInt');
        console.log(id);
        $.ajax({
            url: Routing.generate('page_index'),
            type:'POST',
            data:'section=true'+'&page_id='+id,
            success: function(state){
                //console.log(state);
                location.reload();
            }
        })
    });

    $( function() {
        // sort the links
        var sortList = $('#sortable');
        //var animation = $( '#loading-animation' );
        var pageTitle = $( 'h1' );
        sortList.sortable({
            update: function( event, ui ) {
            //animation.show();
            var data = sortList.sortable( 'toArray' );
            console.log(data);
            $.ajax({
                url: Routing.generate('menu_show')+'/'+1,
                //url: Routing.generate('menu_show'),
                type:'POST',
                data:'sortList='+data,
                success: function(response){
                    console.log('success');
                    //animation.hide();
                    pageTitle.after('success');
                },
                error: function(error){
                    console.log('error');
                    //animation.hide();
                    pageTitle.after('error');

                }
            })
            //Dropped();

          }
        });
        //$( "#sortable" ).disableSelection();
    });

    function Dropped(event, ui){
        /*$("#sortable tr").each(function(){
            //var p = $(this).position();
            console.log($(this).attr('data_link_id'));

        });*/
        $.ajax({
            url: Routing.generate('menu_show'),
            type:'POST',
            data:'sortList='+id,
            success: function(state){
                //console.log(state);
                location.reload();
            }
        })
      //refresh();
    }
});