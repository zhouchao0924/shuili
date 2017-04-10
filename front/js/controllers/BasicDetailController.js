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
			$.ajax({
				url: Metronic.host + 'article/getArticleInfoAjax',
				type: 'GET',
				dataType: 'json',
				xhrFields: {
				 withCredentials: true
				},
				crossDomain: true,
				data: {articleId:1},
				success: function(data) {
					if(data.success){
						$scope.detail = data.data;
					}
				},
				error: function(xhr, data, status) {
					//  alert('请检查网络');
				}
			});
		});
	}
]);
