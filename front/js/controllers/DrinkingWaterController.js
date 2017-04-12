/* Setup general page controller */
MetronicApp.controller('DrinkingWaterController', [
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
			DrinkingWaterAdvanced.init($scope, $compile, Shuffling);
			$scope.emptyData = function() {
				$scope.text = '';
			};
			//导出样表
			$scope.DownLoad1 = function() {
				window.open(Metronic.host + 'attachment/exportExample/17', '_blank');
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
