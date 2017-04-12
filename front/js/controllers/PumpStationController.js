/* Setup general page controller */
MetronicApp.controller('PumpStationController', [
	'$rootScope',
	'$scope',
	'settings',
	'$timeout',
	'$compile',
	'ajax',
	'Shuffling',
	function($rootScope, $scope, settings, $timeout, $compile, ajax, Shuffling) {
		$scope.$on('$viewContentLoaded', function() {
			// initialize core components
			Metronic.initAjax();
			// set default layout mode
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			PumpStationAdvanced.init($scope, $compile, Shuffling);
			$scope.emptyData = function() {
				$scope.text = '';
			};
			//导出样表
			$scope.DownLoad1 = function() {
				window.open(Metronic.host + 'attachment/exportExample/6', '_blank');
			};
			$scope.UpLoad = function() {
				$scope.MakeSureUpLoad = true;
			};
			//上传图片
			$scope.imgUrl = '';
			$scope.imgUrlList = [];
			$scope.addimage = function() {
				obj = angular.copy($scope.imgUrl);
				$scope.imgUrlList.push(obj);
			};
		});
	}
]);
