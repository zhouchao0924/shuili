/* Setup general page controller */
MetronicApp.controller('RiverController', [
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
			RiverAdvanced.init($scope, $compile);
		});
	}
]);
