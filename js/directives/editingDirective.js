MetronicApp.directive('tableTab4', ['dataTable4', '$timeout', 'queryFilter', '$compile', 'userNow',
    function(dataTable4, $timeout, queryFilter, $compile, userNow) {
        return {
            restrict: 'E',
            templateUrl: 'tpl/editingtableTab.html',
            // require: 'ngModel',
            scope: {
                tableParams: '=',
                tables: '=',
                tabIndex: '='
            },
            link: function(scope, elem, attrs) {
                var tableParams = scope.tableParams;
                var table0, table1, table2, table3;
                var a = JSON.parse(window.localStorage.aijiaUserdata);
                $timeout(function() {
                    switch ('1') {
                        case '1':
                            scope.click0();
                            elem.find('li:eq(0)').addClass('active');
                            elem.children('div:eq(0)').removeClass('table-not-show');
                            elem.children('div:eq(1)').addClass('table-not-show');
                            elem.children('div:eq(2)').addClass('table-not-show');
                            elem.children('div:eq(3)').addClass('table-not-show');
                            break;
                        case '0':
                            scope.click1();
                            elem.find('li:eq(1)').addClass('active');
                            elem.children('div:eq(1)').removeClass('table-not-show');
                            elem.children('div:eq(0)').addClass('table-not-show');
                            elem.children('div:eq(2)').addClass('table-not-show');
                            elem.children('div:eq(3)').addClass('table-not-show');
                            break;
                    }
                });

                scope.click0 = function() {
                    scope.tabIndex = 0;
                    if (!table0) {
                        tableParams.id = '#sample_0';
                        tableParams.conditionsBig = {};
                        tableParams.conditions = scope.$parent.searchDetail;
                        scope.$parent.searchDetail.reviewStatus = '0';
                        scope.tables[0] = table0 = dataTable4.new(angular.copy(tableParams), scope);
                    } else {
                        scope.$parent.searchDetail.reviewStatus = '0';
                        table0.tableSearch(scope.$parent.searchDetail);
                    }

                    elem.children('div:eq(0)').removeClass('table-not-show');
                    elem.children('div:eq(1)').addClass('table-not-show');
                    elem.children('div:eq(2)').addClass('table-not-show');
                    elem.children('div:eq(3)').addClass('table-not-show');
                };
                scope.click1 = function() {
                    scope.tabIndex = 1;
                    if (!table1) {
                        tableParams.id = '#sample_1';
                        tableParams.conditions = scope.$parent.searchDetail;
                        scope.$parent.searchDetail.reviewStatus = '2';
                        // tableParams.params = {
                        //     "reviewStatus": 2
                        // };
                        scope.tables[1] = table1 = dataTable4.new(angular.copy(tableParams), scope);
                    } else {
                        scope.$parent.searchDetail.reviewStatus = '2';
                        table1.tableSearch(scope.$parent.searchDetail);
                    }

                    elem.children('div:eq(1)').removeClass('table-not-show');
                    elem.children('div:eq(0)').addClass('table-not-show');
                    elem.children('div:eq(2)').addClass('table-not-show');
                    elem.children('div:eq(3)').addClass('table-not-show');
                };
                scope.click2 = function() {
                    scope.tabIndex = 2;
                    if (!table2) {
                        tableParams.id = '#sample_2';
                        tableParams.conditions = scope.$parent.searchDetail;
                        scope.tables[2] = table2 = dataTable4.new(tableParams, scope);
                    } else {
                        table2.tableSearch(scope.$parent.searchDetail);
                    }

                    elem.children('div:eq(2)').removeClass('table-not-show');
                    elem.children('div:eq(1)').addClass('table-not-show');
                    elem.children('div:eq(0)').addClass('table-not-show');
                    elem.children('div:eq(3)').addClass('table-not-show');
                };
                scope.click3 = function() {
                    scope.tabIndex = 3;
                    if (!table3) {
                        tableParams.id = '#sample_3';
                        tableParams.conditions = scope.$parent.searchDetail;
                        scope.tables[3] = table3 = dataTable4.new(tableParams, scope);
                    } else {
                        table3.tableSearch(scope.$parent.searchDetail);
                    }

                    elem.children('div:eq(3)').removeClass('table-not-show');
                    elem.children('div:eq(1)').addClass('table-not-show');
                    elem.children('div:eq(2)').addClass('table-not-show');
                    elem.children('div:eq(0)').addClass('table-not-show');
                };
            }
        };
    }
]);
