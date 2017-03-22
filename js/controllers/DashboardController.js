'use strict';

MetronicApp.controller('DashboardController', function($rootScope, $scope, $http, $timeout) {
	$scope.$on('$viewContentLoaded', function() {   
		// initialize core components
		Metronic.initAjax();

		// 开始表单数据处理
		var a = JSON.parse(window.localStorage.aijiaUserdata);

		$.ajax({
			url: Metronic.host + '/admin/home/'+a.userId+'/'+a.sessionId,
			type: 'POST',
			dataType: 'json',
			data: {},
			success: function(data){
				if(data.code == 1){
					$scope.$apply(function(){
						$scope.boardDetail = {
							productCount:data.obj.productCount,
							suitCount:data.obj.suitCount,
							orderCount:data.obj.orderCount,
							adviceCount:data.obj.adviceCount
						}
					})
				}else if(data.code == 3){
					window.location.href = 'login.html';
				}else{
					alert(data.ext.msg);
				}
			},
			error:function(xhr, data, status){
			    alert('请检查网络');
			}
		})
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = false;
});