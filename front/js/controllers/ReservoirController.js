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
			ReservoirAdvanced1.init($scope, $compile, Shuffling, $rootScope);
			ReservoirAdvanced2.init($scope, $compile, Shuffling, $rootScope);
			ReservoirAdvanced3.init($scope, $compile, Shuffling, $rootScope);
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
			$scope.UpLoad1 = function() {
				$scope.MakeSureUpLoad1 = true;
			};
			$scope.UpLoad2 = function() {
				$scope.MakeSureUpLoad2 = true;
			};
			$scope.UpLoad3 = function() {
				$scope.MakeSureUpLoad3 = true;
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
			//记住TAB页
			$scope.RemeberTab = function(Num) {
				window.localStorage.RemeberTab = Num;
			}
			if (window.localStorage.RemeberTab) {
				if (window.localStorage.RemeberTab == 0) {
					$('.nav-tabs li:first-child').addClass('active');
					$('.nav-tabs li:nth-child(2)').removeClass('active');
					$('.nav-tabs li:nth-child(3)').removeClass('active');
					$('#shuiku').addClass('active');
					$('#shantang').removeClass('active');
					$('#xiaoshuidian').removeClass('active');
				} else if (window.localStorage.RemeberTab == 1) {
					$('.nav-tabs li:nth-child(2)').addClass('active');
					$('.nav-tabs li:first-child').removeClass('active');
					$('.nav-tabs li:nth-child(3)').removeClass('active');
					$('#shantang').addClass('active');
					$('#shuiku').removeClass('active');
					$('#xiaoshuidian').removeClass('active');
				} else if (window.localStorage.RemeberTab == 2) {
					$('.nav-tabs li:nth-child(3)').addClass('active');
					$('.nav-tabs li:first-child').removeClass('active');
					$('.nav-tabs li:nth-child(2)').removeClass('active');
					$('#xiaoshuidian').addClass('active');
					$('#shantang').removeClass('active');
					$('#shuiku').removeClass('active');
				}
			}
		});
	}
]);
