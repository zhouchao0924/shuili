//input框检测楼盘是否重名
MetronicApp.directive('buildingNameRepeat', ['ajax1', '$timeout', '$parse', function(ajax1, $timeout, $parse) {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: 5,
        link: function(scope, elem, attrs, ngModel) {
            if (attrs.ngRequired) {
                if ($parse(attrs.ngRequired)(scope) === false) {
                    return
                }
            }

            var promise

            function judgeMobile() {
                if (!ngModel.$viewValue) {
                    return
                }

                if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function() {
                    ajax1('/building/queryBuildingExist/', { buildingName: ngModel.$viewValue }).then(function(data) {
                        ngModel.$setValidity('楼盘名称重复', data.obj === null ? true : false)
                    })
                }, 1000)
            }

            ngModel.$parsers.push(function(value) {
                if (!value) {
                    ngModel.$setValidity('楼盘名称重复', true)
                    return value
                }
                judgeMobile()
                return value
            })
            scope.$watch(attrs.ngModel, function() {
                if (!ngModel.$modelValue) {
                    return
                }
                judgeMobile()
            })
        }
    };
}]);
