/* Setup general page controller */
MetronicApp.controller('ReservoirController', [
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
			$('#Tabs a').click(function(e) {
				e.preventDefault();
				var index = $(this).parent().index();
			});
			// set default layout mode
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			//初始化所有表格
			ReservoirAdvanced1.init($scope, $compile, Shuffling);
			ReservoirAdvanced2.init($scope, $compile, Shuffling);
			ReservoirAdvanced3.init($scope, $compile, Shuffling);
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
			var layerImageJson = {
				"title": "", //相册标题
				"id": "", //相册id
				"start": 0, //初始显示的图片序号，默认0
				"data": [
					{ //相册包含的图片，数组格式
						"alt": "",
						"pid": "", //图片id
						"src": "", //原图地址
						"thumb": "" //缩略图地址
					}
				]
			}
			$('#test').click(function() {
				layer.photos({photos: layerImageJson, anim: 5});
			})
		});
	}
]);
