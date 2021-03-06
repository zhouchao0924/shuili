/* Setup general page controller */
MetronicApp.controller('FileInformationManagementController', [
	'$rootScope',
	'$scope',
	'settings',
	'$timeout',
	'$compile',
	'ajax1',
	'Shuffling',
	function($rootScope, $scope, settings, $timeout, $compile, ajax, Shuffling) {
		$scope.$on('$viewContentLoaded', function() {
			// initialize core components
			Metronic.initAjax();
			// set default layout mode
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			FileInformationManagementAdvanced.init($scope, $compile, Shuffling);
			$scope.emptyData = function() {
				$scope.searchKey = '';
			}
		});
	}
]);
