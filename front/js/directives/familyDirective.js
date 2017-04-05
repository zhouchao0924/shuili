//订单选择弹出框，软装、硬装、全品家
MetronicApp.directive('orderSelDg', ['$compile', '$timeout', function($compile, $timeout) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            modalId: '@',
            modalConfirm: '&',
            modalTitle: '@'
        },
        templateUrl: 'tpl/orderSelDg.html',
        link: function(scope, elem, attrs, ctrl, transclude) {
            scope.$watch(function() {
                if (elem.find('modal-ss').html()) return true
            }, function() {
                var radioList = elem.find('.radio-list')
                if (radioList.length) {
                    //checked必须手工点上
                    elem.find('input[type="radio"]:eq(0)').attr('checked', '');
                    Metronic.initUniform()
                }
            })

            scope.$parent.page = { typeSel: '1' }

            scope.selectOrderTypeOK = function() {
                switch (scope.$parent.page.typeSel) {
                    case '1':
                        window.location.href = '#/valet-order-detail/';
                        break;
                    case '2':
                        window.location.href = '#/orders-hard-new/' + scope.$parent.customer.basicInfo.fidBuilding + '/' + scope.$parent.customer.basicInfo.mobile;
                        break;
                }
            }

            elem.find('.modal.fade').attr('id', scope.modalId);

            scope.modalOk = function() {
                scope.modalConfirm({ data: scope })
            }
            elem.on('hide.bs.modal', function() {
                elem
                scope.$broadcast('clearModel')
            })
        },
    };
}]);

//硬装详情页里的弹出框
MetronicApp.directive('orderFamilyDetailDialog', ['$compile', function($compile) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            modalId: '@',
            modalConfirm: '&',
            modalTitle: '@'
        },
        templateUrl: 'tpl/orderFamilyDetailConfirm.html',
        link: function(scope, elem, attrs, ctrl, transclude) {
            elem.find('.modal.fade').attr('id', scope.modalId);
            // transclude(scope, function(clone, scope) {
            //     elem.find('.portlet-body').append(clone);
            //     // Metronic.initUniform()

            //     //由于操作了DOM，这里要重新compile
            //     // $compile(clone)(scope)
            // });
            scope.modalOk = function() {
                scope.$parent.hardOrderDialog = scope.hardOrderDialog
                scope.modalConfirm({ data: scope })
            }
            elem.on('hide.bs.modal', function() {
                scope.$broadcast('clearModel')
            })

        },
    };
}]);

//input框查询同一楼盘电话号码，并获取客户资料
MetronicApp.directive('orderFamilyPhoneQuery', ['ajax1', '$timeout', '$parse', 'setAllUndef',
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

                    //fidBuilding可能为0
                    // if (scope.newOrder.familyorder.buildingId === undefined || scope.newOrder.familyorder.buildingId === null ||
                    //     isNaN(scope.newOrder.familyorder.buildingId)) {
                    //     scope.orderFamilyNewForm.buildingId.$dirty = true
                    //     return
                    // }
                    if (promise) {
                        $timeout.cancel(promise);
                    }
                    promise = $timeout(function() {
                        ajax1('/familyorder/queryByJudgeMobile/' + ngModel.$viewValue + '/').then(function(data) {
                            console.log(123456789);
                            // data.obj = setAllUndef(data.obj)
                            if (!scope.newOrder.extralInfo) scope.newOrder.extralInfo = {}
                            if (data.obj.buildingId === null)
                                data.obj.buildingId = scope.newOrder.familyorder.buildingId
                            if (data.obj.purchaserTel === null)
                                data.obj.purchaserTel = scope.newOrder.familyorder.purchaserTel
                            if (data.obj.provinceId === null)
                                data.obj.provinceId = scope.newOrder.familyorder.provinceId
                            if (data.obj.cityId === null)
                                data.obj.cityId = scope.newOrder.familyorder.cityId
                            if (data.obj.areaId === null)
                                data.obj.areaId = scope.newOrder.familyorder.areaId
                            if (data.obj.houseArea === null)
                                data.obj.houseArea = scope.newOrder.familyorder.houseArea
                            data.obj.orderTimeStr = scope.newOrder.familyorder.orderTimeStr
                            $.extend(true, scope.newOrder.familyorder, data.obj)

                            if (data.obj.moneyFlag === 1) {
                                ngModel.$setValidity('该客户存在未完成收款的定金，请联系财务确认收款！', false)
                            } else if (data.obj.moneyFlag === 2) {
                                ngModel.$setValidity('该客户存在未完成收款的诚意金，请联系财务确认收款！', false)
                            } else {
                                ngModel.$setValidity('该客户存在未完成收款的定金，请联系财务确认收款！', true)
                                ngModel.$setValidity('该客户存在未完成收款的诚意金，请联系财务确认收款！', true)
                            }
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
                    // scope.$watch('newOrder.hardOrder.buildingId', function() {
                    //     if (!ngModel.$modelValue) {
                    //         return
                    //     }
                    //     judgeMobile()
                    // })
            }
        };
    }
]);


//退款金额须小于已确认收款减应收金额的９５％
MetronicApp.directive('moneyBack95', ['$compile', function($compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {

            var isRmb = function(value) {
                if (!value) {
                    return true
                }

                return parseInt(value) <= parseInt(scope.$parent.order.hardOrder.confirmedMoney) - parseInt(scope.$parent.order.hardOrder.payingMoney) * 0.95
            }
            ngModel.$parsers.push(function(value) {
                ngModel.$setValidity('退款金额不能大于已确认收款减去应收金额的95%', isRmb(value))
                return isRmb(value) ? value : undefined
            })
            scope.$watch(attrs.ngModel, function() {
                ngModel.$setValidity('退款金额不能大于已确认收款减去应收金额的95%', isRmb(ngModel.$viewValue))
            })
        }
    };
}]);
