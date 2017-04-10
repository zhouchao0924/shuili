/* Setup general page controller */
MetronicApp.controller('DrinkingWaterController', [
	'$rootScope',
	'$scope',
	'settings',
	'$timeout',
	'$compile',
	function($rootScope, $scope, settings, $timeout, $compile) {
		$scope.$on('$viewContentLoaded', function() {
			// initialize core components
			Metronic.initAjax();
			// set default layout mode
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			DrinkingWaterAdvanced.init($scope, $compile);
			$scope.emptyData = function() {
				$scope.text = '';
			};
			//导入表格
			$scope.UpLoad = function() {
				var params = {
					efile: $scope.efile
				}
				$.ajax({
					url: Metronic.host + 'drinkingWater/import',
					type: 'POST',
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
							alert('重置密码成功');
							location.reload();
						} else {
							alert(datas.message);
							Metronic.unblockUI();
						}
					}
				});
			}
		});
	}
]);
