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
			var UpLoadUrl = Metronic.host + 'drinkingWater/import'
			$('#uploadform').attr("action", UpLoadUrl);
		});
	}
]);
