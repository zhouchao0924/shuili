/* Setup general page controller */
MetronicApp.controller('ArchiveController', [
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
			$('#Tabs a').click(function(e) {
				e.preventDefault();
				var index = $(this).parent().index();
			});
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			ArchiveAdvanced.init($scope, $compile, Shuffling);
		});
	}
]);
