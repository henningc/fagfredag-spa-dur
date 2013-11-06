define(['knockout', 'services/yr', 'durandal/app'], function (ko, yr, app) {
    var storageKey = 'locations';
    
    var viewModel = {
        locations: ko.observableArray([]),
        activate: function() {
            viewModel.locations(JSON.parse(localStorage.getItem(storageKey)) || []);
        }
    };

    app.on('location:added', function(url) {
        viewModel.locations.push(url);
        localStorage.setItem(storageKey, JSON.stringify(viewModel.locations()));
    });

    app.on('location:removed', function(url) {
        viewModel.locations.remove(url);
        localStorage.setItem(storageKey, JSON.stringify(viewModel.locations()));
    });

    return viewModel;
})