/* Setup general page controller */
MetronicApp.controller('IrrigationController', [
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
			//初始化表格
			IrrigationAdvanced.init($scope, $compile, Shuffling);
			// 清空搜索数据
			$scope.emptyData = function() {
				$scope.text = '';
			};
			//导出样表
			$scope.DownLoad1 = function() {
				window.open(Metronic.host + 'attachment/exportExample/18', '_blank');
			};
			$scope.UpLoad = function() {
				$scope.MakeSureUpLoad = true;
			};
			//上传图片
			$scope.imgUrl = '';
			$scope.imgUrlList = [];
			$scope.addimage = function() {
				if ($scope.imgUrlList.length < 3) {
					obj = angular.copy($scope.imgUrl);
					$scope.imgUrlList.push(obj);
				} else {
					layer.msg('最多只能上传三张图片');
				}
			};
		});
	}
]);
