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
			//初始化所有表格
			ReservoirAdvanced1.init($scope, $compile);
			ReservoirAdvanced2.init($scope, $compile);
			ReservoirAdvanced3.init($scope, $compile);
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
			//导出样表
			$scope.DownLoad1 = function() {
				window.open(Metronic.host + 'attachment/exportExample/1', '_blank');
			};
			$scope.DownLoad2 = function() {
				window.open(Metronic.host + 'attachment/exportExample/2', '_blank');
			};
			$scope.DownLoad3 = function() {
				window.open(Metronic.host + 'attachment/exportExample/3', '_blank');
			};
		});
	}
]);
