//进销存商品选择弹出框
MetronicApp.directive('invoicingProSelect', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        // require: '?ngModel',
        // transclude: true,
        replace: true,
        scope: {
            // ngModel: '=?',
            modalId: '@',
            modalTitle: '@',
            tableInfo: '=',
            productList: '=?',
            modalOk: '&'
        },
        templateUrl: 'tpl/invoicingProductSelect.html',
        link: function(scope, elem, attrs, ctrl) {

            elem.attr('id', scope.modalId);
            var groupCheckable = $('#'+scope.modalId).find('input.group-checkable'),
                setGroup = '';
            groupCheckable.attr('data-set', '#'+scope.modalId+' '+groupCheckable.attr('data-set'));
            setGroup = groupCheckable.attr('data-set')
            $(groupCheckable).uniform();

            $('#'+scope.modalId).on('mousedown', '.spinner-up, .spinner-down', function(e){
                angular.element($(e.target).closest('div').siblings('input')).triggerHandler('input');
            })
            $('#'+scope.modalId).on('show.bs.modal', function(){
                if(groupCheckable[0].checked) {
                    groupCheckable.prop('checked', false);
                    $.uniform.update(groupCheckable);
                }

                $timeout(function(){
                    $.each(scope.productList, function(i ,n){
                        if(!n.disabled){
                            $('#'+scope.modalId).find('.spinner').eq(i).spinner({value: n.max,max: n.max});
                        }
                    })
                    $(setGroup).uniform();
                })
            })

            scope.allOrNone = function(e){
                $timeout(function(){
                    $.each($(setGroup),function(i,n){
                        if(!n.disabled){
                            $(n).attr('checked', e.target.checked);
                            scope.productList[i].checked = e.target.checked;
                        }
                    })
                    $.uniform.update(setGroup);
                })
            }
        }
    };
}]);