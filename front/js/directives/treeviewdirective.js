MetronicApp.directive('treeView', ['$timeout', '$rootScope', 'ajax1', function($timeout, $rootScope, ajax1) {
    return {
        restrict: 'E',
        templateUrl: 'tpl/treeView.html',
        scope: {
            treeData: '=',
            canChecked: '=',
            textField: '@',
            itemClicked: '&',
            itemCheckedChanged: '&',
            itemTemplateUrl: '@'
        },
        controller: ['$scope', function($scope) {
            $scope.Edititem = function(item, $event) {
                item.$$isEdit = !item.$$isEdit;
            };
            $scope.Additem = function(item, $event) {
                var newobj = {
                    categoryDto: {
                        id: null,
                        level: (item.categoryDto.level + 1) || item.categoryTreeNodeDtos[item.categoryTreeNodeDtos.length - 1].categoryDto.level,
                        name: null,
                        parentId: item.categoryDto.id,
                        createTime: null,
                        updateTime: null,
                        type: item.categoryDto.type,
                        state: null,
                        sort: ((item.categoryTreeNodeDtos[item.categoryTreeNodeDtos.length - 1]) && (item.categoryTreeNodeDtos[item.categoryTreeNodeDtos.length - 1].categoryDto.sort + 1)) || 0,
                        status: null,
                    },
                    categoryTreeNodeDtos: []
                };
                item.$$isExpend = true;
                item.categoryTreeNodeDtos.push(angular.copy(newobj));
                $event.stopPropagation();
            };
            $scope.saveNewitem = function(item, $event) {
                if (!item.categoryDto.id) {
                    var params = {
                        "name": item.categoryDto.name,
                        "parentId": item.categoryDto.parentId,
                        "type": item.categoryDto.type,
                        "sort": item.categoryDto.sort,
                        "level": item.categoryDto.level
                    };
                    if (item.categoryDto.name) {
                        ajax1('/category/createCategory/', params).then(function(data) {
                            ajax1('/category/queryCategory/', {}).then(function(datas) {
                                $scope.treeData = datas.obj.categoryTreeNodeDtos;
                            });
                        });
                    } else {
                        return;
                    }
                } else {
                    var updateparams = {
                        "id": item.categoryDto.id,
                        "name": item.categoryDto.name,
                        "parentId": item.categoryDto.parentId,
                        "type": item.categoryDto.type,
                        "state": item.categoryDto.state,
                        "sort": item.categoryDto.sort,
                        "level": item.categoryDto.level
                    };
                    if (item.categoryDto.name) {
                        ajax1('/category/updateCategory/', updateparams).then(function(data) {
                            ajax1('/category/queryCategory/', {}).then(function(datas) {
                                $scope.treeData = datas.obj.categoryTreeNodeDtos;
                            });
                        });
                    } else {
                        return;
                    }
                }
            };
            $scope.Delitem = function(item, $event) {
                // 删除类目
                if (confirm('确认要删除该类目')) {
                    var params = {
                        id: item.categoryDto.id
                    };
                    ajax1('/category/deleteCategory/', params).then(function(data) {
                        ajax1('/category/queryCategory/', {}).then(function(datas) {
                            $scope.treeData = datas.obj.categoryTreeNodeDtos;
                        });
                    });
                    $event.stopPropagation();
                }
            };
            $scope.toedititem = function(item, $event) {
                // 跳转属性页面
                if (item.categoryTreeNodeDtos.length === 0) {
                    window.location.href = "#/edit-leaf-item/" + item.categoryDto.id;
                    window.localStorage.newitemname = item.categoryDto.name;
                } else {
                    window.location.href = "#/edit-item/" + item.categoryDto.id;
                    window.localStorage.newitemname = item.categoryDto.name;
                }
            };
            $scope.itemExpended = function(item, $event) {
                // 点击图标向下扩展
                item.$$isExpend = !item.$$isExpend;
                $event.stopPropagation();
            };
            $scope.getItemIcon = function(item) {
                // 获得图标，切换图标
                var isLeaf = $scope.isLeaf(item);
                if (isLeaf) {
                    return 'fa fa-circle-o';
                }
                return item.$$isExpend ? 'fa fa-minus-square-o' : 'fa fa-plus-square-o';
            };
            $scope.isLeaf = function(item) {
                // 判断是否为叶子类目
                return !item.categoryTreeNodeDtos || !item.categoryTreeNodeDtos.length;
            };
            $scope.warpCallback = function(callback, item, $event) {
                ($scope[callback] || angular.noop)({
                    $item: item,
                    $event: $event
                });
            };
        }]
    };
}]);


MetronicApp.directive('tdInput', ['$timeout', '$rootScope', 'ajax1', function($timeout, $rootScope, ajax1) {
    return {
        restrict: 'E',
        templateUrl: 'tpl/tdinput.html',
        scope: {
            viewData: '=',
        },
        controller: ['$scope', function($scope) {
            console.log($scope.viewData);
        }]
    };
}]);
