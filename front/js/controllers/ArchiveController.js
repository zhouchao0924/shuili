/* Setup general page controller */
MetronicApp.controller('ArchiveController', [
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
			$('#Tabs a').click(function(e) {
				e.preventDefault();
				var index = $(this).parent().index();
			});
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			ArchiveAdvanced.init($scope, $compile, Shuffling);
			// 获取档案信息
			var params = {
				articleType: 2, //文章类型：1，基本情况，2，文档信息
				searchKey: '', //搜索关键词 title
				page: 1, //页码
				pageSize: 10, //每页数量
			}
			$.ajax({
				url: Metronic.host + 'article/getArticleListAjax',
				type: 'GET',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				data: {
					data: JSON.stringify(params)
				},
				success: function(data) {
					if (data.success) {
						$scope.tops = data.data.topArticleList;
						var list = [];
						for (var i = 0; i < data.data.articleList.length; i++) {
							data.data.articleList[i].desc = $(data.data.articleList[i].content).text();
							list.push(data.data.articleList[i]);
						}
						$scope.lists = list;
						$scope.$apply();
					}
				},
				error: function(xhr, data, status) {
					//  layer.msg('请检查网络');
				}
			});
		});
	}
]);
