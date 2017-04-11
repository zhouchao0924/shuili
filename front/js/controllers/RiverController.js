/* Setup general page controller */
MetronicApp.controller('RiverController', [
	'$rootScope',
	'$scope',
	'settings',
	'$timeout',
	'$compile',
	'Shuffling',
	function($rootScope, $scope, settings, $timeout, $compile, Shuffling) {
		$scope.$on('$viewContentLoaded', function() {
			// initialize core components
			Metronic.initAjax();
			// set default layout mode
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			RiverAdvanced.init($scope, $compile, Shuffling);
			$scope.emptyData = function() {
				$scope.text = '';
			};
			//导出样表
			$scope.DownLoad1 = function() {
				window.open(Metronic.host + 'attachment/exportExample/4', '_blank');
			};
		});
	}
]);
