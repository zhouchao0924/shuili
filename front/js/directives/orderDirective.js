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

            scope.$parent.page = {
                typeSel: '1'
            }

            scope.selectOrderTypeOK = function() {
                switch (scope.$parent.page.typeSel) {
                    case '1':
                        window.location.href = '#/valet-order-detail/' + scope.$parent.customer.basicInfo.mobile;
                        break;
                    case '2':
                        window.location.href = '#/orders-hard-new/' + scope.$parent.customer.basicInfo.fidBuilding + '/' + scope.$parent.customer.basicInfo.mobile;
                        break;
                    case '3':
                        window.location.href = '#/productfamily-new/' + scope.$parent.customer.basicInfo.fidBuilding + '/' + scope.$parent.customer.basicInfo.mobile;
                        break;
                }
            }

            elem.find('.modal.fade').attr('id', scope.modalId);

            scope.modalOk = function() {
                scope.modalConfirm({
                    data: scope
                })
            }
            elem.on('hide.bs.modal', function() {
                elem
                scope.$broadcast('clearModel')
            })
        },
    };
}]);

//申请售后的弹出框
MetronicApp.directive('afterSellDialog', ['$compile', function($compile) {
    return {
        restrict: 'E',
        scope: {
            orderNum: '=',
            buildingId: '=',
            buildingName: '=',
            purchaserName: '=',
            purchaserTel: '=',
            orderId: '=',
            type: '@'
        },
        templateUrl: 'tpl/afterSellDialog.html',
        link: function(scope, elem, attrs, ctrl, transclude) {


        },
    };
}]);

//硬装详情页里的弹出框
MetronicApp.directive('orderHardDetailDialog', ['$compile', function($compile) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            modalId: '@',
            modalConfirm: '&',
            modalTitle: '@'
        },
        templateUrl: 'tpl/orderHardDetailConfirm.html',
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
                scope.modalConfirm({
                    data: scope
                })
            }
            elem.on('hide.bs.modal', function() {
                scope.$broadcast('clearModel')
            })

        },
    };
}]);

//硬装详情页里的弹出框
MetronicApp.directive('orderDetailDialog', ['$compile', function($compile) {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            modalId: '@',
            modalConfirm: '&',
            modalTitle: '@'
        },
        templateUrl: 'tpl/orderDetailConfirm.html',
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
                scope.modalConfirm({
                    data: scope
                })
            }
            elem.on('hide.bs.modal', function() {
                scope.$parent.$broadcast('clearModel')
            })

        },
    };
}]);

//全品家详情页里的弹出框
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
                scope.modalConfirm({
                    data: scope
                })
            }
            elem.on('hide.bs.modal', function() {
                scope.$broadcast('clearModel')
            })

        },
    };
}]);

//input框查询同一楼盘电话号码，并获取客户资料，软装
MetronicApp.directive('orderSoftPhoneQuery', ['ajax1', '$timeout', '$parse', 'setAllUndef',
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
                        ajax1('/familyorder/queryByJudgeMobile/' + ngModel.$viewValue + '/').then(function(data) {
                            if (scope.orderDetail.projectId === null || scope.orderDetail.projectId === undefined)
                                scope.orderDetail.projectId = data.obj.buildingId
                            scope.orderDetail.customerName = data.obj.purchaserName
                            scope.orderDetail.provinceId = data.obj.provinceId
                            scope.orderDetail.cityId = data.obj.cityId
                            scope.orderDetail.areaId = data.obj.areaId
                            scope.orderDetail.houseAddress = data.obj.houseAddress
                            scope.orderDetail.buildingNo = data.obj.buildingNo
                            scope.orderDetail.houseNo = data.obj.houseNo
                            scope.orderDetail.cashCouponAccount = data.obj.cashCouponAccount
                            scope.orderDetail.moneyAmount = data.obj.moneyAmount
                            scope.orderDetail.depositMoneyId = data.obj.depositMoneyId
                            scope.orderDetail.earnestMoneyId = data.obj.earnestMoneyId
                            scope.orderDetail.cashCouponId = scope.orderDetail.cashCouponAccount ? scope.orderDetail.cashCouponAccount.accountId : undefined

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
            }
        };
    }
]);

//input框查询抵用券
MetronicApp.directive('queryUsableVoucher', ['ajax1', '$timeout', '$parse', 'setAllUndef',
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
                        ajax1('/familyorder/queryUsableVoucher/' + scope.orderDetail.customerTel +
                            '/' + scope.orderDetail.softContractgMoney + '/').then(function(data) {
                            if (JSON.stringify(scope.orderDetail.voucherIds) !== JSON.stringify(data.obj))
                                scope.orderDetail.voucherIds = data.obj
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

//input框查询同一楼盘电话号码，并获取客户资料
MetronicApp.directive('orderHardPhoneQuery', ['ajax1', '$timeout', '$parse', 'setAllUndef',
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
                    // if (scope.newOrder.hardOrder.buildingId === undefined ||
                    //     scope.newOrder.hardOrder.buildingId === null ||
                    //     isNaN(scope.newOrder.hardOrder.buildingId)) {
                    //     scope.orderHardNewForm.buildingId.$dirty = true
                    //     return
                    // }
                    if (promise) {
                        $timeout.cancel(promise);
                    }
                    promise = $timeout(function() {
                        ajax1('/hardorder/queryByJudgeMobile/' + ngModel.$viewValue + '/').then(function(data) {
                            // data.obj = setAllUndef(data.obj)
                            if (!scope.newOrder.extralInfo) scope.newOrder.extralInfo = {}
                            if (data.obj.hardOrder.buildingId === null)
                                data.obj.hardOrder.buildingId = scope.newOrder.hardOrder.buildingId
                            if (data.obj.hardOrder.mobile === null)
                                data.obj.hardOrder.mobile = scope.newOrder.hardOrder.mobile
                            if (data.obj.hardOrder.provinceId === null)
                                data.obj.hardOrder.provinceId = scope.newOrder.hardOrder.provinceId
                            if (data.obj.hardOrder.cityId === null)
                                data.obj.hardOrder.cityId = scope.newOrder.hardOrder.cityId
                            if (data.obj.hardOrder.areaId === null)
                                data.obj.hardOrder.areaId = scope.newOrder.hardOrder.areaId
                            if (data.obj.hardOrder.houseArea === null)
                                data.obj.hardOrder.houseArea = scope.newOrder.hardOrder.houseArea
                            data.obj.hardOrder.orderTimeStr = scope.newOrder.hardOrder.orderTimeStr
                            $.extend(true, scope.newOrder, data.obj)

                            if (data.obj.hardOrder.moneyFlag === 1) {
                                ngModel.$setValidity('该客户存在未完成收款的定金，请联系财务确认收款！', false)
                            } else if (data.obj.hardOrder.moneyFlag === 2) {
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


//退款后的金额不能少于应收金额的95%
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
                ngModel.$setValidity('退款后的金额不能少于应收金额的95%', isRmb(value))
                return isRmb(value) ? value : undefined
            })
            scope.$watch(attrs.ngModel, function() {
                ngModel.$setValidity('退款后的金额不能少于应收金额的95%', isRmb(ngModel.$viewValue))
            })
        }
    };
}]);