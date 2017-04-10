/* Setup general page controller */
MetronicApp.controller('BasicInformationController', [
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
			// set default layout mode
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			// ArchiveAdvanced.init($scope, $compile);


			// 获取基本信息
			$.ajax({
				url: Metronic.host + 'user/GetCurrentAreaLocation',
				type: 'GET',
				dataType: 'json',
				xhrFields: {
				 withCredentials: true
				},
				crossDomain: true,
				data: {},
				success: function(data) {
					if(data.long && data.lat){
						mp.centerAndZoom(new window.BMap.Point(data.long, data.lat), 15);
					}
				},
				error: function(xhr, data, status) {
					//  alert('请检查网络');
				}
			});
		});
	}
]);
