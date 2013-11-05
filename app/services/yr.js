define(['durandal/system', 'plugins/http', 'jquery'], function(system, http, $) {
    var apiUrl = 'http://yr-proxy.tosh.no/';

    var api = {};
    api.search = function (query) {
        return system.defer(function(dfd) {
            http.get(apiUrl + '/search?q=' + query).done(function(searchResults) {
                dfd.resolve(searchResults.results);
            });
        });       
    };

    api.get = function (relativeUrl) {
        //var url = apiUrl + "sted" + relativeUrl + '/varsel.json';
        var url = apiUrl  + relativeUrl;
        return system.defer(function(dfd) {
            return http.get(url).done(function(weather) {
                var periods = weather.weatherdata.forecast[0].tabular[0].time;
                var forecasts = Enumerable.From(periods).Select(function (x) {
                    return getForecast(x);
                }).GroupBy(function (x) {
                    return moment(x.from).format('DD/MM/YYYY');
                }, function (x) {
                    return x;
                }, function (key, group) {
                    return {
                        date: key,
                        periods: group.source
                    };
                }).ToArray();

                dfd.resolve({
                    place: weather.weatherdata.location[0].name[0],
                    country: weather.weatherdata.location[0].country[0],
                    forecasts: forecasts
                });
            });
        });
    };

    function getForecast(time){
        return {
            from: time.from,
            to: time.to,
            temperature: time.temperature[0].value,
            precipitationMin: time.precipitation[0].minvalue || 0,
            precipitationMax: time.precipitation[0].maxvalue || 0,
            description: time.symbol[0].name,
            windType: time.windSpeed[0].name,
            windSpeed: time.windSpeed[0].mps,
            windDirection: time.windDirection[0].name,
            symbolUrl: 'http://symbol.yr.no/grafikk/sym/b100/' + time.symbol[0].var + '.png'
        };
    };

    return api;
})