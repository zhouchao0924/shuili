//buildingId转化为buildingName
// MetronicApp.filter('getBuildingName', ['ajaxCache', function(ajaxCache) {
//     var houses = []
//     ajaxCache('/house/queryBuildHouseRel/').then(function(data) {
//         houses = angular.copy(data.obj);
//     })

//     return function(input) {
//         var name = houses.filter(function(e) {
//             return parseInt(e.buildingId) === parseInt(input)
//         })
//         return name && name[0] && name[0].buildingName
//     };
// }]);
