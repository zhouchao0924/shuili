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

			var curlat = 0;
			var curlon = 0;

			//编辑器初始化
			var articleUm = '';
			var imgUrl = Metronic.host + 'attachment/getUploadTokenAjax';
			window.UMEDITOR_CONFIG.UMEDITOR_HOME_URL = 'assets/global/plugins/umeditor/';
			window.UMEDITOR_CONFIG.imageUrl = imgUrl;
			$.ajax({
				url: imgUrl,
				type: 'GET',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				data: {
					data: JSON.stringify({})
				},
				success: function(datas) {
					if (datas.success) {
						window.QINIU_TOKEN = datas.data.token;
						domins = datas.data.domain.replace("http://", "");
						window.QINIU_BUCKET_DOMAIN = domins;
						UM.clearCache('new-editor');
						articleUm = UM.getEditor('new-editor', {UMEDITOR_HOME_URL: 'assets/global/plugins/umeditor/'});
					} else if (datas.code == 50001) {
						window.location.href = 'login.html';
					} else {
						alert(datas.message);
						Metronic.unblockUI();
					}
				},
				error: function(xhr, data, status) {
					alert('请检查网络');
				}
			});

			// alert(1);
			window.initialize = function(){
			  var mp = new window.BMap.Map('mapcontainer');
				// 获取当前经纬度
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
						if(data.success){
							mp.centerAndZoom(new window.BMap.Point(data.data.long, data.data.lat), 15);
						}
					},
					error: function(xhr, data, status) {
						//  alert('请检查网络');
					}
				});
				// console.log(mp,9999999);


				// var opts = {
				//  width : 250,     // 信息窗口宽度
				//  height: 100,     // 信息窗口高度
				//  title : "Hello"  // 信息窗口标题
				// }
				// var infoWindow = new window.BMap.InfoWindow("<span style='color:red;'>1231231</span>", opts);  // 创建信息窗口对象
				// mp.openInfoWindow(infoWindow, mp.getCenter());      // 打开信息窗口

				mp.addEventListener("click",function(e){
					// alert(e.point.lng + "," + e.point.lat);
					curlon = e.point.lng;
					curlat = e.point.lat;
					console.log(e,8888);
					if(e.overlay){
						$('#modalview').modal('show');
						// 比对经纬度获得id
						
					}else{
						$('#modaladd').modal('show');
					}
				});




				getAllPoint();

				function listPoints(data){
					for(var i=0;i<data.length;i++){
						var point = new window.BMap.Point(data[i].longitude, data[i].latitude);
						console.log(parseInt(data[i].cat),888888);
						var myIcon = new window.BMap.Icon("http://onrnzg8zq.bkt.clouddn.com/markers2.png", new BMap.Size(23, 25), {
							 offset: new window.BMap.Size(10, 25),
							 imageOffset: new window.BMap.Size(0, 0 - parseInt(data[i].cat) * 25)   // 设置图片偏移
						 });
						var marker = new window.BMap.Marker(point,{icon:myIcon});        // 创建标注
						// marker.addEventListener("click", function(e){
						// //  alert("您点击了标注");
						// 	console.log(e,9999);
						// 	if(e.overlay){
						// 		$('#modalview').modal('show');
						// 	}else{
						//
						// 	}
						// });
						mp.addOverlay(marker);
					}
				}

				// 获取地理列表
				function getAllPoint(){
					$.ajax({
						url: Metronic.host + 'geographyInfo/getPointAll',
						type: 'GET',
						dataType: 'json',
						xhrFields: {
						 withCredentials: true
						},
						crossDomain: true,
						data: {},
						success: function(data) {
						 if (data.success && data.data.length>0) {
								//
								listPoints(data.data);
						 }
						},
						error: function(xhr, data, status) {
							//  alert('请检查网络');
						}
					});
				}

				// 对话框事件
				$('#cancel,#cancel2').click(function(e){
					$('#modaladd').modal('hide');
				});

				// 添加事件
				$('#makesure').click(function(e){
					var params = {
						cat:$('#cat').val(),
						name:$('#name').val(),
						longitude:curlon,
						latitude:curlat,
					};
					$.ajax({
			      url: Metronic.host + '/geographyInfo/addPoint',
			      type: 'GET',
			      dataType: 'json',
			      xhrFields: {
			       withCredentials: true
			      },
			      crossDomain: true,
			      data: {
			       data: JSON.stringify(params)
			      },
			      success: function(datas) {
			       if (datas.success) {
			        	// 刷新points
								getAllPoint();
								$('#modaladd').modal('hide');
			       }
			      },
			      error: function(xhr, data, status) {
			      	//  alert('请检查网络');
			      }
					});
				});

				// 编辑事件
				$('#edit').click(function(e){
					$('#modaledit').modal('show');
					$('#modalview').modal('hide');
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
