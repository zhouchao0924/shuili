/* Setup general page controller */
MetronicApp.controller('GEOInfoController', [
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

			// alert(1);
			window.initialize = function(){
			  var mp = new window.BMap.Map('mapcontainer');
				// console.log(mp,9999999);
				var point = new window.BMap.Point(116.404, 39.915);
			  mp.centerAndZoom(point, 15);
				var myIcon = new window.BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {
				   offset: new window.BMap.Size(10, 25),
				   imageOffset: new window.BMap.Size(0, 0 - 1 * 25)   // 设置图片偏移
				 });
				var marker = new window.BMap.Marker(point,{icon:myIcon});        // 创建标注
				marker.addEventListener("click", function(){
				 alert("您点击了标注");
				});
				mp.addOverlay(marker);

				// var opts = {
				//  width : 250,     // 信息窗口宽度
				//  height: 100,     // 信息窗口高度
				//  title : "Hello"  // 信息窗口标题
				// }
				// var infoWindow = new window.BMap.InfoWindow("<span style='color:red;'>1231231</span>", opts);  // 创建信息窗口对象
				// mp.openInfoWindow(infoWindow, mp.getCenter());      // 打开信息窗口

				mp.addEventListener("click",function(e){
					alert(e.point.lng + "," + e.point.lat);
					$('.bs-modify-modal-lg').modal('show');
				});


			}

			function loadScript() {
			  var script = document.createElement("script");
			  script.src = "http://api.map.baidu.com/api?v=2.0&ak=gWUgzfPib0vllGaS7qILPisD&callback=initialize";//此为v2.0版本的引用方式
			  // http://api.map.baidu.com/api?v=1.4&ak=您的密钥&callback=initialize"; //此为v1.4版本及以前版本的引用方式
			  document.body.appendChild(script);
			}

			loadScript();



		});
	}
]);
