/* Setup general page controller */
MetronicApp.controller('LongRiverSystemController', [
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
			LongRiverSystemAdvanced1.init($scope, $compile, Shuffling);
			LongRiverSystemAdvanced2.init($scope, $compile, Shuffling);
			LongRiverSystemAdvanced3.init($scope, $compile, Shuffling);
			LongRiverSystemAdvanced4.init($scope, $compile, Shuffling);
			LongRiverSystemAdvanced5.init($scope, $compile, Shuffling);
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
				window.open(Metronic.host + 'attachment/exportExample/7', '_blank');
			};
			$scope.DownLoad2 = function() {
				window.open(Metronic.host + 'attachment/exportExample/8', '_blank');
			};
			$scope.DownLoad3 = function() {
				window.open(Metronic.host + 'attachment/exportExample/9', '_blank');
			};
			$scope.DownLoad4 = function() {
				window.open(Metronic.host + 'attachment/exportExample/10', '_blank');
			};
			$scope.DownLoad5 = function() {
				window.open(Metronic.host + 'attachment/exportExample/11', '_blank');
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
			//记住TAB页
			$scope.RemeberTab = function(Num) {
				window.localStorage.RemeberTab = Num;
			}
			if (window.localStorage.RemeberTab) {
				if (window.localStorage.RemeberTab == 0) {
					$('.nav-tabs li:first-child').addClass('active');
					$('.nav-tabs li:nth-child(2)').removeClass('active');
					$('.nav-tabs li:nth-child(3)').removeClass('active');
					$('.nav-tabs li:nth-child(4)').removeClass('active');
					$('.nav-tabs li:nth-child(5)').removeClass('active');
					$('#hzzjcxx').addClass('active');
					$('#hdpsktjb').removeClass('active');
					$('#szjcjbxx').removeClass('active');
					$('#szjccg').removeClass('active');
					$('#rhpwktj').removeClass('active');
				} else if (window.localStorage.RemeberTab == 1) {
					$('.nav-tabs li:nth-child(2)').addClass('active');
					$('.nav-tabs li:first-child').removeClass('active');
					$('.nav-tabs li:nth-child(3)').removeClass('active');
					$('.nav-tabs li:nth-child(4)').removeClass('active');
					$('.nav-tabs li:nth-child(5)').removeClass('active');
					$('#hdpsktjb').addClass('active');
					$('#hzzjcxx').removeClass('active');
					$('#szjcjbxx').removeClass('active');
					$('#szjccg').removeClass('active');
					$('#rhpwktj').removeClass('active');
				} else if (window.localStorage.RemeberTab == 2) {
					$('.nav-tabs li:nth-child(3)').addClass('active');
					$('.nav-tabs li:first-child').removeClass('active');
					$('.nav-tabs li:nth-child(2)').removeClass('active');
					$('.nav-tabs li:nth-child(4)').removeClass('active');
					$('.nav-tabs li:nth-child(5)').removeClass('active');
					$('#szjcjbxx').addClass('active');
					$('#hdpsktjb').removeClass('active');
					$('#hzzjcxx').removeClass('active');
					$('#szjccg').removeClass('active');
					$('#rhpwktj').removeClass('active');
				} else if (window.localStorage.RemeberTab == 3) {
					$('.nav-tabs li:nth-child(4)').addClass('active');
					$('.nav-tabs li:first-child').removeClass('active');
					$('.nav-tabs li:nth-child(2)').removeClass('active');
					$('.nav-tabs li:nth-child(3)').removeClass('active');
					$('.nav-tabs li:nth-child(5)').removeClass('active');
					$('#szjccg').addClass('active');
					$('#hzzjcxx').removeClass('active');
					$('#hdpsktjb').removeClass('active');
					$('#szjcjbxx').removeClass('active');
					$('#rhpwktj').removeClass('active');
				} else if (window.localStorage.RemeberTab == 4) {
					$('.nav-tabs li:nth-child(5)').addClass('active');
					$('.nav-tabs li:first-child').removeClass('active');
					$('.nav-tabs li:nth-child(2)').removeClass('active');
					$('.nav-tabs li:nth-child(3)').removeClass('active');
					$('.nav-tabs li:nth-child(4)').removeClass('active');
					$('#rhpwktj').addClass('active');
					$('#hzzjcxx').removeClass('active');
					$('#hdpsktjb').removeClass('active');
					$('#szjcjbxx').removeClass('active');
					$('#szjccg').removeClass('active');
				}
			}
		});
	}
]);;
