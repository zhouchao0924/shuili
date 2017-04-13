/* Setup general page controller */
MetronicApp.controller('YYTownController', [
	'$rootScope',
	'$scope',
	'settings',
	'$timeout',
	'$compile',
	'ajax1',
	function($rootScope, $scope, settings, $timeout, $compile, ajax) {
		$scope.$on('$viewContentLoaded', function() {
			// initialize core components
			Metronic.initAjax();
			// set default layout mode
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			//获取管理区域
			$.ajax({
				url: Metronic.host + '/user/getManageArea',
				type: 'GET',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				data: {
					data: JSON.stringify({})
				},
				success: function(datas) {
					if (datas.success) {
						$scope.CityList = datas.data;
						$scope.$apply();
					}
				},
				error: function(xhr, data, status) {
					layer.msg('请检查网络');
				}
			});
			//设置管理区域
			$scope.setCurrentArea = function(id, name) {
				$.ajax({
					url: Metronic.host + '/user/setCurrentArea',
					type: 'GET',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					data: {
						data: JSON.stringify({streetId: id})
					},
					success: function(datas) {
						if (datas.success) {
							window.localStorage.UserdataMenuList = window.localStorage.Userdata;
							window.localStorage.orgName = name;
							location.reload();
							window.location.href = '#/BasicInformation';
						}
					},
					error: function(xhr, data, status) {
						layer.msg('请检查网络');
					}
				});
			}
		});
	}
]);
