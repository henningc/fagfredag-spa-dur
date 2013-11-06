define(['knockout', 'services/yr', 'durandal/app'], function(ko, yr, app) {

    var ctor = function () {
        var that = this;
        that.cityData = undefined;
        that.isForecastVisible = ko.observable(false);

        that.location = ko.computed(function() {
            return this.cityData.country + ', ' + this.cityData.place;
        }, that, { deferEvaluation: true });

        that.formatDate = function(weather) {
            var from = moment(weather.from).format('HH');
            var to = moment(weather.to).format('HH');

            return "kl " + from + "-" + to;
        };


        that.formatWind = function(weather) {
            return weather.windType + ", " + weather.windSpeed + " m/s " + weather.windDirection;
        };

        that.formatPrecipitation = function (weather) {
            if (weather.precipitationMin === 0 && weather.precipitationMax === 0)
                return "0 mm";
            
            return weather.precipitationMin + " – " + weather.precipitationMax + " mm";
        };

        that.toggleShowForecast = function() {
            that.isForecastVisible(!that.isForecastVisible());
        };

        that.remove = function() {
            app.trigger('location:removed', that.url);
        };
    };

    ctor.prototype.activate = function (url) {
        var that = this;
        that.url = url;
        return yr.get(url).done(function(result) {
            that.cityData = result;
            that.currentWeather = result.forecasts[0].periods[0];
            that.forecasts = result.forecasts.slice(1);
        });
    };

    return ctor;
})