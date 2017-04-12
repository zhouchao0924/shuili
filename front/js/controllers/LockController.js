/* Setup general page controller */
MetronicApp.controller('LockController', [
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
			LockAdvanced.init($scope, $compile, Shuffling);
			$scope.emptyData = function() {
				$scope.text = '';
			};
			//导出样表
			$scope.DownLoad1 = function() {
				window.open(Metronic.host + 'attachment/exportExample/5', '_blank');
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
