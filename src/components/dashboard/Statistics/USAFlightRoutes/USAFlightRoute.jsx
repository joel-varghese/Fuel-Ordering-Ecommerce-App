import * as Highcharts from "highcharts/highmaps"

function  UsaFr()
{

    (async () => {

        const mapData = await fetch(
            'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
        ).then(response => response.json());
    
        // Initialize the chart
        const chart = Highcharts.mapChart('container', {
    
            title: {
                text: 'Sample flight routes',
                align: 'left'
            },
    
            legend: {
                align: 'left',
                layout: 'vertical',
                floating: true
            },
    
            accessibility: {
                point: {
                    valueDescriptionFormat: '{xDescription}.'
                }
            },
    
            mapNavigation: {
                enabled: true
            },
    
            tooltip: {
                formatter: function () {
                    return this.point.id + (
                        this.point.lat ?
                            '<br>Lat: ' + this.point.lat + ' Lon: ' + this.point.lon : ''
                    );
                }
            },
    
            plotOptions: {
                series: {
                    marker: {
                        fillColor: '#FFFFFF',
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[1]
                    }
                }
            },
    
            series: [{
                // Use the gb-all map with no data as a basemap
                mapData,
                name: 'United States',
                borderColor: '#707070',
                nullColor: 'rgba(200, 200, 200, 0.3)',
                showInLegend: false
            }, {
                // Specify cities using lat/lon
                type: 'mappoint',
                name: 'Cities',
                dataLabels: {
                    format: '{point.id}'
                },
                // Use id instead of name to allow for referencing points later using
                // chart.get
                data: [{
                    id: 'Austin',
                    lat: 30.266666,
                    lon: -97.733330
                }, {
                    id: 'San Francisco',
                    lat: 37.773972,
                    lon: -122.431297
                }, {
                    id: 'NewYork',
                    lat: 40.730610,
                    lon: -73.935242
                }, {
                    id: 'Los Angeles',
                    lat: 34.052235,
                    lon: -118.243683
                }, {
                    id: 'Houston',
                    lat: 29.749907,
                    lon: -95.358421
                }, {
                    id: 'San Antonio',
                    lat: 29.424349,
                    lon: -98.491142
                }, {
                    id: 'San Diego',
                    lat: 32.715736,
                    lon: -117.161087
                }, {
                    id: 'Philadelphia',
                    lat: 39.952583,
                    lon: -75.165222
                }, {
                    id: 'Phoenix',
                    lat: 33.448376,
                    lon: -112.074036,
                    dataLabels: {
                        align: 'left',
                        x: 5,
                        verticalAlign: 'middle'
                    }
                }]
            }]
        });
    
        // Function to return an SVG path between two points, with an arc
        function pointsToPath(fromPoint, toPoint, invertArc) {
            const
                from = chart.mapView.lonLatToProjectedUnits(fromPoint),
                to = chart.mapView.lonLatToProjectedUnits(toPoint),
                curve = 0.05,
                arcPointX = (from.x + to.x) / (invertArc ? 2 + curve : 2 - curve),
                arcPointY = (from.y + to.y) / (invertArc ? 2 + curve : 2 - curve);
            return [
                ['M', from.x, from.y],
                ['Q', arcPointX, arcPointY, to.x, to.y]
            ];
        }
    
        const SanFrancisco = chart.get('San Francisco'),
        AustinPoint = chart.get('Austin');
    
        // Add a series of lines for London
        chart.addSeries({
            name: 'San Francisco flight routes',
            type: 'mapline',
            lineWidth: 2,
            color: Highcharts.getOptions().colors[3],
            data: [{
                id: 'San Francisco - Austin',
                path: pointsToPath(SanFrancisco, chart.get('Austin'))
            }, {
                id: 'San Francisco - NewYork',
                path: pointsToPath(SanFrancisco, chart.get('NewYork'), true)
            }, {
                id: 'San Francisco - Los Angeles',
                path: pointsToPath(SanFrancisco, chart.get('Los Angeles'))
            }, {
                id: 'San Francisco - Houston',
                path: pointsToPath(SanFrancisco, chart.get('Houston'), true)
            }, {
                id: 'San Francisco - San Antonio',
                path: pointsToPath(SanFrancisco, chart.get('San Antonio'),true)
            }, {
                id: 'San Francisco - San Diego',
                path: pointsToPath(SanFrancisco, chart.get('San Diego'), true)
            }, {
                id: 'San Francisco - Philadelphia',
                path: pointsToPath(SanFrancisco, chart.get('Philadelphia'), true)
            }]
        }, true, false);
    
        // Add a series of lines for Lerwick
        chart.addSeries({
            name: 'Austin flight routes',
            type: 'mapline',
            lineWidth: 2,
            color: Highcharts.getOptions().colors[5],
            data: [{
                id: 'Austin - Philadelphia',
                path: pointsToPath(AustinPoint, chart.get('Philadelphia'))
            }, {
                id: 'Austin - Houston',
                path: pointsToPath(AustinPoint, chart.get('Houston'))
            }, {
                id: 'Austin - Los Angeles',
                path: pointsToPath(AustinPoint, chart.get('Los Angeles'))
            }, {
                id: 'Austin - NewYork',
                path: pointsToPath(AustinPoint, chart.get('NewYork'))
            }]
        }, true, false);
    })();

    return (
        <>
  
        </>
    )
}

export {UsaFr}