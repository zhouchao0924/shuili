/* Setup general page controller */
MetronicApp.controller('PumpStationController', [
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
			PumpStationAdvanced.init($scope, $compile);
			$scope.emptyData = function() {
				$scope.text = '';
			};
		});
	}
]);;
