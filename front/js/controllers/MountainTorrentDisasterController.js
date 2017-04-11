/* Setup general page controller */
MetronicApp.controller('MountainTorrentDisasterController', [
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
			//初始所有表格
			MountainTorrentDisasterAdvanced1.init($scope, $compile, Shuffling);
			MountainTorrentDisasterAdvanced2.init($scope, $compile, Shuffling);
			MountainTorrentDisasterAdvanced3.init($scope, $compile, Shuffling);
			MountainTorrentDisasterAdvanced4.init($scope, $compile, Shuffling);
			MountainTorrentDisasterAdvanced5.init($scope, $compile, Shuffling);
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
			//导出表格
			$scope.DownLoad1 = function() {
				window.open(Metronic.host + 'attachment/exportExample/12', '_blank');
			};
			$scope.DownLoad2 = function() {
				window.open(Metronic.host + 'attachment/exportExample/13', '_blank');
			};
			$scope.DownLoad3 = function() {
				window.open(Metronic.host + 'attachment/exportExample/14', '_blank');
			};
			$scope.DownLoad4 = function() {
				window.open(Metronic.host + 'attachment/exportExample/15', '_blank');
			};
			$scope.DownLoad5 = function() {
				window.open(Metronic.host + 'attachment/exportExample/16', '_blank');
			};
			$scope.UpLoad1 = function() {
				$scope.MakeSureUpLoad1 = true;
			};
			$scope.UpLoad2 = function() {
				$scope.MakeSureUpLoad2 = true;
			};
			$scope.UpLoad3 = function() {
				$scope.MakeSureUpLoad3 = true;
			};
			$scope.UpLoad4 = function() {
				$scope.MakeSureUpLoad4 = true;
			};
			$scope.UpLoad5 = function() {
				$scope.MakeSureUpLoad5 = true;
			};
		});
	}
]);
