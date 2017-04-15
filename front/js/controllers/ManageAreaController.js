/* Setup general page controller */
MetronicApp.controller('ManageAreaController', [
	'$rootScope',
	'$scope',
	'settings',
	'$compile',
	'Shuffling',
	function($rootScope, $scope, settings, $compile, Shuffling) {
		$scope.$on('$viewContentLoaded', function(root) {
			// initialize core components
			Metronic.initAjax();
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			$scope.CheckedAreaIdList = [];
			//获取管理地区
			$.ajax({
				url: Metronic.host + 'user/getAreaList',
				type: 'get',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				data: {
					data: JSON.stringify({userId: root.currentScope.$state.params.id})
				},
				success: function(datas) {
					if (datas.success) {
						$scope.$apply(function() {
							$scope.AreaList = datas.data;
							$scope.AreaList.forEach(function(n) {
								if (n.isManage) {
									$scope.CheckedAreaIdList.push(n.id);
								}
							})
						})
					} else {
						layer.msg(datas.message);
					}
				}
			});
			//获取选中的地区的id和删除取消地区的id
			$scope.updateArea = function(AreaObj, event) {
				if (event.target.checked) {
					$scope.CheckedAreaIdList.push(AreaObj.id);
				} else {
					$scope.CheckedAreaIdList.splice($scope.CheckedAreaIdList.indexOf(AreaObj.id), 1);
				}
			}
			//更新管理地区
			$scope.MakeSure = function() {
				var params = {
					userId: root.currentScope.$state.params.id,
					areaList: $scope.CheckedAreaIdList
				};
				$.ajax({
					url: Metronic.host + 'user/updateManageArea',
					type: 'get',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					data: {
						data: JSON.stringify(params)
					},
					success: function(datas) {
						if (datas.success) {
							layer.msg('管理地区绑定成功')
						} else {
							layer.msg(datas.message);
						}
					}
				});
			};
		})
	}
]);
