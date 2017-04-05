// //
// MetronicApp.filter('getPayTypes', ['ajaxCache', function(ajaxCache) {
//     var outputs
//     ajaxCache('/configitem/queryItemsByConfigId/3/').then(function(data) {
//         outputs = angular.copy(data.obj);
//     })

//     return function(input) {
//         if (!arguments.length) {
//             return outputs
//         }

//         if (input === null) {
//             return null
//         }

//         var output = outputs.filter(function(e) {
//             return parseInt(e.id) === parseInt(input)
//         })
//         return output && output[0] && output[0].name
//     };
// }]);
