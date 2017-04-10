/* Setup general page controller */
MetronicApp.controller('IrrigationController', [
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
			//初始化表格
			IrrigationAdvanced.init($scope, $compile);
			// 清空搜索数据
			$scope.emptyData = function() {
				$scope.text = '';
			};
		});
	}
]);
