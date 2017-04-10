/* Setup general page controller */
MetronicApp.controller('LongRiverSystemController', [
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
			//初始所有表格
			LongRiverSystemAdvanced1.init($scope, $compile);
			LongRiverSystemAdvanced2.init($scope, $compile);
			LongRiverSystemAdvanced3.init($scope, $compile);
			LongRiverSystemAdvanced4.init($scope, $compile);
			LongRiverSystemAdvanced5.init($scope, $compile);
			//清空搜索数据
			$scope.emptyData1 = function() {
				$scope.text1 = '';
			};
			$scope.emptyData2 = function() {
				$scope.text2 = '';
			};
			$scope.emptyData3 = function() {
				$scope.text3 = '';
			};
			$scope.emptyData4 = function() {
				$scope.text4 = '';
			};
			$scope.emptyData5 = function() {
				$scope.text5 = '';
			};
		});
	}
]);
