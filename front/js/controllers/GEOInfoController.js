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
			// ArchiveAdvanced.init($scope, $compile, Shuffling);

			$('.page-header').hide();
			$('.page-sidebar').hide();
			$('.page-footer').hide();

			// $('#mapcontainer').height(document.documentElement.clientHeight*0.8);

			var curlat = 0;
			var curlon = 0;
			var curid = undefined;
			var points = [];

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
						layer.msg(datas.message);
						Metronic.unblockUI();
					}
				},
				error: function(xhr, data, status) {
					layer.msg('请检查网络');
				}
			});

			// layer.msg(1);
			window.initialize = function(){
			  var mp = new window.BMap.Map('mapcontainer',{mapType:BMAP_HYBRID_MAP});
				mp.addControl(new BMap.NavigationControl());
				mp.addControl(new BMap.ScaleControl());
				mp.addControl(new BMap.OverviewMapControl());
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
						//  layer.msg('请检查网络');
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
					// layer.msg(e.point.lng + "," + e.point.lat);
					curlon = e.point.lng;
					curlat = e.point.lat;
					console.log(e,8888);
					if(e.overlay){
						curlon = e.overlay.point.lng;
						curlat = e.overlay.point.lat;
						$('#modalview').modal('show');
						// 比对经纬度获得id
						console.log(points,7777);
						for(var i=0;i<points.length;i++){
							console.log(points[i].longitude,curlon,points[i].latitude,curlat);
							if(points[i].longitude==curlon&&points[i].latitude==curlat){
								var id = points[i].id;
								curid = id;
								// 获取地理位置详情
								var params = {
									pointId:parseInt(id)
								}
								// function getAllPoint(){
									$.ajax({
										url: Metronic.host + 'geographyInfo/getInfoDesc',
										type: 'GET',
										dataType: 'json',
										xhrFields: {
										 withCredentials: true
										},
										crossDomain: true,
										data: {data:JSON.stringify(params)},
										success: function(data) {
										 if (data.success) {
												//
												$scope.pointdetail = data.data;
												$scope.$apply();
										 }
										},
										error: function(xhr, data, status) {
											//  layer.msg('请检查网络');
										}
									});
								// }
							}
						}

					}else{
						$('#modaladd').modal('show');
					}
				});




				getAllPoint();

				function listPoints(data){
					mp.clearOverlays();
					for(var i=0;i<data.length;i++){
						var point = new window.BMap.Point(data[i].longitude, data[i].latitude);
						console.log(parseInt(data[i].cat),888888);
						var myIcon = new window.BMap.Icon("http://onrnzg8zq.bkt.clouddn.com/markers3.png", new BMap.Size(23, 25), {
							 offset: new window.BMap.Size(10, 25),
							 imageOffset: new window.BMap.Size(0, 0 - parseInt(data[i].cat) * 25)   // 设置图片偏移
						 });
						var marker = new window.BMap.Marker(point,{icon:myIcon});        // 创建标注
						// marker.addEventListener("click", function(e){
						// //  layer.msg("您点击了标注");
						// 	console.log(e,9999);
						// 	if(e.overlay){
						// 		$('#modalview').modal('show');
						// 	}else{
						//
						// 	}
						// });
						var color=['#45B6AF','#89C4F4','#F3565D','#dfba49','#6e4af5','#f54ae7','#ffef00','#4af54e'];
						var label = new window.BMap.Label(data[i].name,{offset:new window.BMap.Size(20,-10)});
						label.setStyle({
							 color : color[data[i].cat],
							 fontSize : "12px",
							 height : "20px",
							 lineHeight : "20px",
							 fontFamily:"微软雅黑",
							 border:"1px solid "+color[data[i].cat]
						 });
						marker.setLabel(label);
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
								points = data.data;
								listPoints(data.data);
						 }
						},
						error: function(xhr, data, status) {
							//  layer.msg('请检查网络');
						}
					});
				}

				// 根据cat获取地理列表
				function getAllCatPoint(id){
					var params = {
						cat:id
					}
					$.ajax({
						url: Metronic.host + 'geographyInfo/getCatPointAll',
						type: 'GET',
						dataType: 'json',
						xhrFields: {
						 withCredentials: true
						},
						crossDomain: true,
						data: {data:JSON.stringify(params)},
						success: function(data) {
						 if (data.success) {
								//
								points = data.data;
								listPoints(data.data);
						 }
						},
						error: function(xhr, data, status) {
							//  layer.msg('请检查网络');
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
			      	//  layer.msg('请检查网络');
			      }
					});
				});

				// 编辑事件
				$('#edit').click(function(e){
					// 塞值
					$('#eTitle').val($scope.pointdetail.title);
					$('#eBold').val($scope.pointdetail.isBold);
					$scope.pointdetail.content?articleUm.setContent($scope.pointdetail.content):undefined;
					$('#modaledit').modal('show');
					$('#modalview').modal('hide');
				});

				// 保存事件
				$('#save').click(function(e){
					var params = {
						pointId:curid,
						title:$('#eTitle').val(),
						isBold:$('#eBold').is(':checked'),
						content:articleUm.getContent()
					}
					$.ajax({
						url: Metronic.host + 'geographyInfo/updateInfoDesc',
						type: 'GET',
						dataType: 'json',
						xhrFields: {
						 withCredentials: true
						},
						crossDomain: true,
						data: {data:JSON.stringify(params)},
						success: function(data) {
						 if (data.success) {
								//
								$('#modaledit').modal('hide');
						 }else{

						 }
						},
						error: function(xhr, data, status) {
							//  layer.msg('请检查网络');
						}
					});
				})

				// 删除事件
				$('#delete').click(function(e){
					var params = {
						id:curid
					}
					$.ajax({
						url: Metronic.host + 'geographyInfo/deletePoint',
						type: 'GET',
						dataType: 'json',
						xhrFields: {
						 withCredentials: true
						},
						crossDomain: true,
						data: {data:JSON.stringify(params)},
						success: function(data) {
						 if (data.success) {
								//
								getAllPoint();
								$('#modalview').modal('hide');
						 }else{

						 }
						},
						error: function(xhr, data, status) {
							//  layer.msg('请检查网络');
						}
					});
				});

				// 筛选按钮事件
				$('#btns a').click(function(e){
					console.log($(e.target).parents('a').index(),888)
					var index = $(e.target).parents('a').index();
					if(index == 0){
						getAllPoint();
					}else{
						getAllCatPoint(index-1);
					}

				})

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
