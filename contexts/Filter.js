var Filter = (function () {
    let filter = {}

    var getFilter = function () {
        return filter;
    };

    var setFilter = function (data) {
        filter = data;
    };

    return {
        getFilter: getFilter,
        setFilter: setFilter
    }

})();

export default Filter;