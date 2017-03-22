//input框检测同一楼盘电话号码是否重复
MetronicApp.directive('phonenumRepeat', ['ajax1', '$timeout', '$parse', function(ajax1, $timeout, $parse) {
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
                // if (scope.customer.basicInfo.fidBuilding === undefined || scope.customer.basicInfo.fidBuilding === null) {
                //     scope.customerForm.fidBuilding.$dirty = true
                //     return
                // }
                if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function() {
                    ajax1('/customer/queryByJudgeMobile/' + ngModel.$viewValue + '/').then(function(data) {
                        ngModel.$setValidity('客户电话重复', data.obj === 0 ? true : false)
                    })
                }, 1000)
            }

            ngModel.$parsers.push(function(value) {
                if (!value) {
                    ngModel.$setValidity('客户电话重复', true)
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
                // scope.$watch('customer.basicInfo.fidBuilding', function() {
                //     if (!ngModel.$modelValue) {
                //         return
                //     }
                //     judgeMobile()
                // })
        }
    };
}]);

//input框查询同一楼盘电话号码，并获取客户资料
MetronicApp.directive('phonenumQuery', ['ajax1', '$timeout', '$parse', function(ajax1, $timeout, $parse) {
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
                // if (scope.customer.basicInfo.fidBuilding === undefined ||
                //     scope.customer.basicInfo.fidBuilding === null ||
                //     isNaN(scope.customer.basicInfo.fidBuilding)) {
                //     scope.customerForm.fidBuilding.$dirty = true
                //     return
                // }
                if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function() {
                    ajax1('/earnestMoney/queryByJudgeMobile/' + ngModel.$viewValue + '/').then(function(data) {
                        for (i in data.obj) {
                            if (data.obj[i] === null) {
                                data.obj[i] = undefined
                            }
                        }
                        // data.obj.basicInfo.fidBuilding ? '' : data.obj.basicInfo.fidBuilding = scope.customer.basicInfo.fidBuilding
                        scope.customer.basicInfo.fidBuilding = data.obj.basicInfo.id? data.obj.basicInfo.fidBuilding: ''
                        data.obj.basicInfo.mobile ? '' : data.obj.basicInfo.mobile = scope.customer.basicInfo.mobile
                            // data.obj.basicInfo.adviser = scope.customer.basicInfo.adviser

                        // if (!data.obj.basePayment) {
                        //     data.obj.basePayment = {}
                        //     data.obj.basePayment.customerId = null
                        // }
                        scope.customer.basicInfo.companyCode = data.obj.basicInfo.companyCode;
                        data.obj.basePayment.payMoney ? '' : data.obj.basePayment.payMoney = scope.customer.basePayment.payMoney
                        data.obj.basePayment.amountOfMoney ? '' : data.obj.basePayment.amountOfMoney = scope.customer.basePayment.amountOfMoney

                        data.obj.extralInfo.fidArea ? '' : data.obj.extralInfo.fidArea = scope.customer.extralInfo.fidArea
                        data.obj.extralInfo.fidCity ? '' : data.obj.extralInfo.fidCity = scope.customer.extralInfo.fidCity
                        // data.obj.extralInfo.fidProvince ? '' : data.obj.extralInfo.fidProvince = scope.customer.extralInfo.fidProvince
                        scope.customer.extralInfo.fidProvince = data.obj.extralInfo.id? data.obj.extralInfo.fidProvince: ''
                        scope.customer.extralInfo.houseArea = data.obj.extralInfo.id? data.obj.extralInfo.houseArea: ''
                        // data.obj.extralInfo.houseArea ? '' : data.obj.extralInfo.houseArea = scope.customer.extralInfo.houseArea
                        $.extend(true, scope.customer, data.obj)
                        ngModel.$setValidity('该客户有未使用的诚意金，请先使用或取消', data.obj.basePayment.id ? false : true)
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

            // scope.$watch('customer.basicInfo.fidBuilding', function() {
            //     if (!ngModel.$modelValue) {
            //         return
            //     }
            //     judgeMobile()
            // })
        }
    };
}]);

//input框查询同一楼盘电话号码，并获取客户资料（定金）
MetronicApp.directive('phonenumQueryPost', ['ajax1', '$timeout', '$parse', function(ajax1, $timeout, $parse) {
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
                // if (scope.customer.basicInfo.fidBuilding === undefined ||
                //     scope.customer.basicInfo.fidBuilding === null ||
                //     isNaN(scope.customer.basicInfo.fidBuilding)) {
                //     scope.depositForm.fidBuilding.$dirty = true
                //     return
                // }
                if (promise) {
                    $timeout.cancel(promise);
                }
                promise = $timeout(function() {
                    ajax1('/depositMoney/queryByJudgeMobile/' + ngModel.$viewValue + '/').then(function(data) {
                        // for (i in data.obj) {
                        //     if (data.obj[i] === null) {
                        //         data.obj[i] = undefined
                        //     }
                        // }
                        // if (!data.obj.basicInfo) {
                        //     data.obj.basicInfo = {}
                        // }
                        // data.obj.basicInfo.fidBuilding ? '' : data.obj.basicInfo.fidBuilding = scope.customer.basicInfo.fidBuilding
                        scope.customer.basicInfo.fidBuilding = data.obj.basicInfo.id? data.obj.basicInfo.fidBuilding: ''
                        data.obj.basicInfo.mobile ? '' : data.obj.basicInfo.mobile = scope.customer.basicInfo.mobile
                            // data.obj.basicInfo.adviser = scope.customer.basicInfo.adviser
                        scope.customer.basicInfo.companyCode = data.obj.basicInfo.companyCode;
                        // if (!data.obj.basePayment) {
                        //     data.obj.basePayment = {}
                        //     data.obj.basePayment.customerId = null
                        // }
                        data.obj.basePayment.payMoney ? '' : data.obj.basePayment.payMoney = scope.customer.basePayment.payMoney
                        // data.obj.basePayment.amountOfMoney ? '' : data.obj.basePayment.amountOfMoney = scope.customer.basePayment.amountOfMoney
                        scope.customer.basePayment.amountOfMoney = data.obj.basePayment.amountOfMoney? data.obj.basePayment.amountOfMoney: 0
                        scope.customer.basePayment.earnestMoney = data.obj.earnestMoney.contractMoney? data.obj.earnestMoney.contractMoney: 0

                        // data.obj.basePayment.contractMoney ? '' : data.obj.basePayment.contractMoney = data.obj.earnestMoney && data.obj.earnestMoney.contractMoney
                        data.obj.basePayment.orderType ? '' : data.obj.basePayment.orderType = data.obj.earnestMoney && data.obj.earnestMoney.orderType

                        data.obj.extralInfo.fidArea ? '' : data.obj.extralInfo.fidArea = scope.customer.extralInfo.fidArea
                        data.obj.extralInfo.fidCity ? '' : data.obj.extralInfo.fidCity = scope.customer.extralInfo.fidCity
                        // data.obj.extralInfo.fidProvince ? '' : data.obj.extralInfo.fidProvince = scope.customer.extralInfo.fidProvince
                        // data.obj.extralInfo.houseArea ? '' : data.obj.extralInfo.houseArea = scope.customer.extralInfo.houseArea
                        scope.customer.extralInfo.fidProvince = data.obj.extralInfo.id? data.obj.extralInfo.fidProvince: ''
                        scope.customer.extralInfo.houseArea = data.obj.extralInfo.id? data.obj.extralInfo.houseArea: ''
                        scope.customer.paymentExt.payNo = data.obj.paymentExt.payNo? data.obj.paymentExt.payNo: scope.customer.paymentExt.payNo

                        $.extend(true, scope.customer, data.obj)
                        ngModel.$setValidity('该用户存在尚未完成的定金！', data.obj.basePayment.id ? false : true)
                        ngModel.$setValidity('该客户存在未完成收款的诚意金，请联系财务确认收款或取消诚意金！', data.obj.earnestMoneyJudge ? false : true)
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
                // scope.$watch('customer.basicInfo.fidBuilding', function() {
                //     if (!ngModel.$modelValue) {
                //         return
                //     }
                //     judgeMobile()
                // })
        }
    };
}]);

//实际收款与预定金额一致
MetronicApp.directive('preMoneyCorrect', ['$compile', function($compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {

            var isRmb = function(value) {
                if (!value) {
                    return true
                }

                return parseInt(value) === parseInt(scope.$parent.customer.basePayment.amountOfMoney)
            }
            ngModel.$parsers.push(function(value) {
                ngModel.$setValidity('请一次性支付所有金额', isRmb(value))
                return isRmb(value) ? value : undefined
            })
            scope.$watch(attrs.ngModel, function() {
                ngModel.$setValidity('请一次性支付所有金额', isRmb(ngModel.$viewValue))
            })
        }
    };
}]);

//实际退款与预定金额一致
MetronicApp.directive('moneyCorrectBack', ['$compile', function($compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {

            var isRmb = function(value) {
                if (!value) {
                    return true
                }

                return parseInt(value) === parseInt(scope.$parent.customer.basePayment.payMoney)
            }
            ngModel.$parsers.push(function(value) {
                ngModel.$setValidity('请一次性支付所有金额', isRmb(value))
                return isRmb(value) ? value : undefined
            })
            scope.$watch(attrs.ngModel, function() {
                ngModel.$setValidity('请一次性支付所有金额', isRmb(ngModel.$viewValue))
            })
        }
    };
}]);

//实际退款与预定金额一致
MetronicApp.directive('moneySmall', ['$compile', function($compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {

            var isRmb = function(value) {
                if (!value) {
                    return true
                }

                return parseInt(value) <= parseInt(scope.$parent.customer.basePayment.amountOfMoney -
                    scope.$parent.customer.basePayment.payMoney)
            }
            ngModel.$parsers.push(function(value) {
                ngModel.$setValidity('收款金额超出定金总额', isRmb(value))
                return isRmb(value) ? value : undefined
            })
            scope.$watch(attrs.ngModel, function() {
                ngModel.$setValidity('收款金额超出定金总额', isRmb(ngModel.$viewValue))
            })
        }
    };
}]);

//修改后的定金不能小于原始定金
MetronicApp.directive('moneyLarge', ['$compile', function($compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {

            var isRmb = function(value) {
                if (!value) {
                    return true
                }

                return parseInt(value) >= parseInt(scope.$parent.customer.basePayment.payMoney || '0')
            }
            ngModel.$parsers.push(function(value) {
                ngModel.$setValidity('定金须大于' + (scope.$parent.customer.basePayment.payMoney || '0') + '元', isRmb(value))
                return isRmb(value) ? value : undefined
            })
            scope.$watch(attrs.ngModel, function() {
                ngModel.$setValidity('定金须大于' + (scope.$parent.customer.basePayment.payMoney || '0') + '元', isRmb(ngModel.$viewValue))
            })
        }
    };
}]);
