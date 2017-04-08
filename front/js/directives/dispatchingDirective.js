MetronicApp.directive('tableTab2', ['dataTable', '$timeout', 'queryFilter', '$compile', 'userNow',
    function(dataTable, $timeout, queryFilter, $compile, userNow) {
        return {
            restrict: 'E',
            templateUrl: 'tpl/tableTab.html',
            // require: 'ngModel',
            scope: {
                tableParams: '=',
                tables: '=',
                tabIndex: '='
            },
            link: function(scope, elem, attrs) {
                var tableParams = scope.tableParams;
                var table0, table1, table2, table3;
                var company = queryFilter('/company/queryAllCompany/');
                var a = JSON.parse(window.localStorage.Userdata);
                tableParams.buttonFunc = function(self) {
                    return function(i, n) {
                        var rowData = self.table.api().row(i).data();
                        if (rowData) {
                            var excel = $('<a href="javascript:;" class="btn default btn-xs grey-cascade"><i class="fa fa-file-excel-o"></i> 导出清单 </a>');
                            excel.click(function(event) {
                                event.stopImmediatePropagation();
                                window.open(Metronic.host + '/workorder/export/' + rowData[10] + '/' + a.userId + '/' + a.sessionId, '_self');
                            });
                            $(this).append($compile(excel)(scope));
                            // scope.$apply();
                        }
                    };
                };

                $timeout(function() {
                    switch (userNow.companyCode) {
                        case '7':
                        case '8':
                            scope.click1()
                            elem.find('li:eq(1)').addClass('active')
                            elem.children('div:eq(1)').removeClass('table-not-show')
                            elem.children('div:eq(0)').addClass('table-not-show')
                            elem.children('div:eq(2)').addClass('table-not-show')
                            elem.children('div:eq(3)').addClass('table-not-show')
                            break;
                        case '9':
                            scope.click2()
                            elem.find('li:eq(2)').addClass('active')
                            elem.children('div:eq(2)').removeClass('table-not-show')
                            elem.children('div:eq(1)').addClass('table-not-show')
                            elem.children('div:eq(0)').addClass('table-not-show')
                            elem.children('div:eq(3)').addClass('table-not-show')
                            break;
                        case '10':
                            scope.click3()
                            elem.find('li:eq(3)').addClass('active')
                            elem.children('div:eq(3)').removeClass('table-not-show')
                            elem.children('div:eq(1)').addClass('table-not-show')
                            elem.children('div:eq(2)').addClass('table-not-show')
                            elem.children('div:eq(0)').addClass('table-not-show')
                            break;
                    }
                })

                scope.click0 = function() {
                    scope.tabIndex = 0
                    if (!table0) {
                        tableParams.id = '#sample_0'
                        tableParams.conditionsBig = {}
                        tableParams.conditions = scope.$parent.searchDetail

                        scope.tables[0] = table0 = dataTable.new(tableParams, scope)
                    } else {
                        table0.tableSearch(scope.$parent.searchDetail)
                    }

                    elem.children('div:eq(0)').removeClass('table-not-show')
                    elem.children('div:eq(1)').addClass('table-not-show')
                    elem.children('div:eq(2)').addClass('table-not-show')
                    elem.children('div:eq(3)').addClass('table-not-show')
                }
                scope.click1 = function() {
                    scope.tabIndex = 1
                    if (!table1) {
                        tableParams.id = '#sample_1'
                        tableParams.conditionsBig = {
                            companyCode: 8
                        }
                        tableParams.conditions = scope.$parent.searchDetail
                        scope.tables[1] = table1 = dataTable.new(tableParams, scope)
                    } else {
                        table1.tableSearch(scope.$parent.searchDetail)
                    }

                    elem.children('div:eq(1)').removeClass('table-not-show')
                    elem.children('div:eq(0)').addClass('table-not-show')
                    elem.children('div:eq(2)').addClass('table-not-show')
                    elem.children('div:eq(3)').addClass('table-not-show')
                }
                scope.click2 = function() {
                    scope.tabIndex = 2
                    if (!table2) {
                        tableParams.id = '#sample_2'
                        tableParams.conditionsBig = {
                            companyCode: 9
                        }
                        tableParams.conditions = scope.$parent.searchDetail
                        scope.tables[2] = table2 = dataTable.new(tableParams, scope)
                    } else {
                        table2.tableSearch(scope.$parent.searchDetail)
                    }

                    elem.children('div:eq(2)').removeClass('table-not-show')
                    elem.children('div:eq(1)').addClass('table-not-show')
                    elem.children('div:eq(0)').addClass('table-not-show')
                    elem.children('div:eq(3)').addClass('table-not-show')
                }
                scope.click3 = function() {
                    scope.tabIndex = 3
                    if (!table3) {
                        tableParams.id = '#sample_3'
                        tableParams.conditionsBig = {
                            companyCode: 10
                        }
                        tableParams.conditions = scope.$parent.searchDetail
                        scope.tables[3] = table3 = dataTable.new(tableParams, scope)
                    } else {
                        table3.tableSearch(scope.$parent.searchDetail)
                    }

                    elem.children('div:eq(3)').removeClass('table-not-show')
                    elem.children('div:eq(1)').addClass('table-not-show')
                    elem.children('div:eq(2)').addClass('table-not-show')
                    elem.children('div:eq(0)').addClass('table-not-show')
                }
            }
        };
    }
]);

//input框查询同一楼盘电话号码，并获取客户资料
MetronicApp.directive('dispatchingPhoneQuery', ['ajax1', '$timeout', '$parse', 'setAllUndef',
    function(ajax1, $timeout, $parse, setAllUndef) {
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
                        ajax1('/workorder/getCustomerByMobile/' + ngModel.$viewValue + '/').then(function(data) {
                            console.log(data);

                            // if (data.obj.buildingId === null)
                            //     data.obj.buildingId = scope.newOrder.familyorder.buildingId
                            // if (data.obj.purchaserTel === null)
                            //     data.obj.purchaserTel = scope.newOrder.familyorder.purchaserTel
                            // if (data.obj.provinceId === null)
                            //     data.obj.provinceId = scope.newOrder.familyorder.provinceId
                            // if (data.obj.cityId === null)
                            //     data.obj.cityId = scope.newOrder.familyorder.cityId
                            // if (data.obj.areaId === null)
                            //     data.obj.areaId = scope.newOrder.familyorder.areaId
                            // if (data.obj.houseArea === null)
                            //     data.obj.houseArea = scope.newOrder.familyorder.houseArea
                            // data.obj.orderTimeStr = scope.newOrder.familyorder.orderTimeStr
                            $.extend(true, scope.dispatching, data.obj)

                            ngModel.$dirty = true;
                        })
                    }, 500)
                }

                scope.$watch(attrs.ngModel, function() {
                    if (!ngModel.$modelValue) {
                        return
                    }
                    judgeMobile()
                })
            }
        };
    }
]);
