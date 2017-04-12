'use strict';
MetronicApp.controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
	$scope.$on('$viewContentLoaded', function() {
		// initialize core components
		Metronic.initAjax();
		// 开始表单数据处理
		// $.ajax({
		// 	url: Metronic.host + '/admin/home/'+a.userId+'/'+a.sessionId,
		// 	type: 'POST',
		// 	dataType: 'json',
		// 	data: {},
		// 	success: function(data){
		// 		if(data.code == 1){
		// 			$scope.$apply(function(){
		// 				$scope.boardDetail = {
		// 					productCount:data.obj.productCount,
		// 					suitCount:data.obj.suitCount,
		// 					orderCount:data.obj.orderCount,
		// 					adviceCount:data.obj.adviceCount
		// 				}
		// 			})
		// 		}else if(data.code == 3){
		// 			window.location.href = 'login.html';
		// 		}else{
		// 			layer.msg(data.message);
		// 		}
		// 	},
		// 	error:function(xhr, data, status){
		// 	    layer.msg('请检查网络');
		// 	}
		// })
	});
	// set sidebar closed and body solid layout mode
	$rootScope.settings.layout.pageBodySolid = true;
	$rootScope.settings.layout.pageSidebarClosed = false;
});
