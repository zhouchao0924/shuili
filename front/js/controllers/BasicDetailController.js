/* Setup general page controller */
MetronicApp.controller('BasicDetailController', [
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

			//article/getArticleInfoAjax
			// 获取基本信息列表
			var params = {
				articleId:14
			}
			$.ajax({
				url: Metronic.host + 'article/getArticleInfoAjax',
				type: 'GET',
				dataType: 'json',
				xhrFields: {
				 withCredentials: true
				},
				crossDomain: true,
				data: {data:JSON.stringify(params)},
				success: function(data) {
					if(data.success){
						$scope.detail = data.data;
						$scope.$apply();
					}
				},
				error: function(xhr, data, status) {
					//  alert('请检查网络');
				}
			});
		});
	}
]);
