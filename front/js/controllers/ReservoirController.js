/* Setup general page controller */
MetronicApp.controller('ReservoirController', [
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
			$('#Tabs a').click(function(e) {
				e.preventDefault();
				var index = $(this).parent().index();
			});
			// set default layout mode
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			ReservoirAdvanced.init($scope, $compile);
		});
	}
]);
