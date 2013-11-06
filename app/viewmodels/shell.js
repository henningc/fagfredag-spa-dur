define(['jquery', 'plugins/router', 'services/yr', 'durandal/app', 'lib/jquery-ui'], function ($, router, yr, app) {
    var viewModel = {
        router: router,
        activate: function () {
            router.map([
                { route: '', title: 'Mine byer', moduleId: 'viewmodels/cities', nav: true },
                { route: 'sted*url', title: 'City', moduleId: 'viewmodels/city', nav: false }
            ]).buildNavigationModel();
            
            return router.activate();
        },
        attached: function(view) {
            $("#location-search").autocomplete({
                source: function (request, response) {
                    yr.search(request.term).done(function (searchResults) {                        
                        response($.map(searchResults, function(item) {
                            return {
                                label: item.name,
                                value: item.name,
                                url: item.bmurl.split('/').slice(3).join('/')
                            };
                        }));
                    });
                },
                minLength: 2,
                select: function (event, ui) {
                    app.trigger('location:added', ui.item.url);
                }
            });
        }
    };

    return viewModel;
});