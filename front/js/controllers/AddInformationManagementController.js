/* Setup general page controller */
MetronicApp.controller('AddInformationManagementController', [
	'$rootScope',
	'$scope',
	'settings',
	'$http',
	'$sce',
	function($rootScope, $scope, settings, $http, $sce) {
		$scope.$on('$viewContentLoaded', function(root) {
			// initialize core components
			Metronic.initAjax();
			// set default layout mode
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			// var um = UM.getEditor('new-editor');
			// 开始表单数据处理
			var validate_filed = {
				errorElement: 'span', //default input error message container
				errorClass: 'help-block help-block-error', // default input error message class
				// focusInvalid: false, // do not focus the last invalid input
				// ignore: "",  // validate all fields including form hidden input
				messages: {
					adTitle: {
						required: "请填写标题"
					},
					category: {
						required: "请填写类型"
					}
					// province: {
					// 	required: "请填写省市"
					// },
					// city: {
					// 	required: "请填写城市"
					// }
				},
				rules: {
					adTitle: {
						required: true
					},
					category: {
						required: true
					}
					// province: {
					// 	required: true
					// },
					// city: {
					// 	required: true
					// }
				},
				highlight: function(element) { // hightlight error inputs
					$(element).parent().addClass('has-error'); // set error class to the control group
				},
				unhighlight: function(element) { // revert the change done by hightlight
					$(element).parent().removeClass('has-error'); // set error class to the control group
				},
				errorPlacement: function(error, element) {
					element.parent().append(error);
				},
				success: function(label) {
					label.parent().removeClass('has-error'); // set success class to the control group
					label.remove();
				}
			};
			//init maxlength handler监视输入字符设置最大输入字数
			$('.maxlength-handler').maxlength({limitReachedClass: "label label-danger", alwaysShow: true, threshold: 5});
			var articleUm = '';
			var imgUrl = Metronic.host + 'boss/getUploadTokenAjax';
			window.UMEDITOR_CONFIG.UMEDITOR_HOME_URL = 'assets/global/plugins/umeditor/';
			window.UMEDITOR_CONFIG.imageUrl = imgUrl;
			$.ajax({
				url: imgUrl,
				type: 'POST',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				data: {
					data: JSON.stringify({bucket: 'public'})
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
			$scope.newsDetail = {
				'title': '',
				'imgUrl': '',
				'category': '',
				'description': '',
				'province': '',
				'city': '',
				'district': '',
				'street': '',
				'isPublic': 1,
				'isBold': ''
			};
			$scope.addnews = function() {
				var validate = $("#articleForm").validate(validate_filed);
				if (!validate.form()) {
					return false;
				}
				Metronic.blockUI({message: '<div style="background:rgba(0,0,0,0.3);padding:10px;font-size:16px;font-weight:bold;color:#fff;">正在保存...</div>', textOnly: true});
				var count = $('.fileinput-preview img').size();
				if (count > 0) {
					$('.fileinput-preview img').each(function(i, n) {
						var file = $(n).parents('.fileinput').find(".fileupload")[0];
						// $scope.num = $(n).parents('.fileinput').index();
						// $scope.count = 0;
						(function() {
							// var x = $scope.num;
							// 先保存图片
							$.ajax({
								url: Metronic.host + 'boss/getUploadTokenAjax',
								type: 'POST',
								dataType: 'json',
								xhrFields: {
									withCredentials: true
								},
								crossDomain: true,
								data: {
									data: JSON.stringify({bucket: 'public'})
								},
								success: function(data) {
									console.debug(data);
									var token = data.data.token;
									var key = data.data.key;
									var domain = data.data.domain;
									//处理图片上传，使用formData对象+ajax上传，上传成功后保存
									var formData = new FormData(document.getElementById('articleForm'));
									formData.append("token", token);
									formData.append("key", key);
									formData.append("file", file.files[0]);
									formData.append("accept", "text/plain");
									$.ajax({
										url: 'http://upload.qiniu.com',
										type: 'POST',
										dataType: 'json',
										data: formData,
										processData: false,
										contentType: false,
										success: function(data) {
											var key = data.key;
											$.ajax({
												url: Metronic.host + 'boss/getUploadImageUrlAjax',
												type: 'POST',
												dataType: 'json',
												data: {
													data: JSON.stringify({key: key})
												},
												xhrFields: {
													withCredentials: true
												},
												crossDomain: true,
												success: function(data) {
													if (data.success) {
														$scope.newsDetail.imgUrl = domain + '/' + data.data.url;
														var params = $scope.newsDetail;
														params.description = articleUm.getContent();
														$.ajax({
															url: Metronic.host + 'boss/news/addNews',
															type: 'POST',
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
																	window.location.href = '#/news';
																} else {
																	alert(data.message);
																}
															},
															error: function(xhr, data, status) {
																alert('请检查网络');
															},
															complete: function() {
																Metronic.unblockUI();
															}
														});
													}
												},
												error: function() {
													console.debug('请检查网络');
												}
											});
											// }
										}
									});
								},
								error: function(xhr, data, status) {
									alert('请检查网络');
								}
							});
						})();
					});
				} else {
					var params = $scope.newsDetail;
					params.description = articleUm.getContent();
					$.ajax({
						url: Metronic.host + 'boss/news/addNews',
						type: 'POST',
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
								window.location.href = '#/news';
							} else {
								alert(data.message);
							}
						},
						error: function(xhr, data, status) {
							alert('请检查网络');
						},
						complete: function() {
							Metronic.unblockUI();
						}
					});
				}
			};
			// 获取分类下拉框
			$.ajax({
				url: Metronic.host + 'boss/config/list',
				type: 'GET',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				data: {},
				success: function(datas) {
					if (datas.success) {
						//console.log(datas, '获取下拉框数据');
						$scope.$apply(function() {
							var arr = [];
							$.each(datas.data.newsType, function(i, n) {
								var obj = {
									id: "",
									name: ""
								};
								obj.id = i;
								obj.name = n;
								arr.push(obj);
							});
							$scope.newsType = arr;
						});
					}
				}
			});
			//获取地址
			$scope.sureaddress = !($rootScope.orgName === 'SYSTEM' || $rootScope.orgName === '调解网');
			$.ajax({
				url: Metronic.host + 'province/list',
				type: 'POST',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				data: {},
				success: function(datas) {
					if (datas.success) {
						//console.log(datas, '获取省级地址');
						$scope.$apply(function() {
							var arr = [];
							for (var i in datas.data) {
								arr.push(datas.data[i]);
							}
							$scope.provinces = arr;
						});
					}
				}
			});
			$scope.querycity = function() {
				$.ajax({
					url: Metronic.host + 'city/list' + '/' + $scope.newsDetail.province,
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					data: {},
					success: function(datas) {
						if (datas.success) {
							//console.log(datas, '获取市级地址');
							$scope.$apply(function() {
								var arr = [];
								for (var i in datas.data) {
									arr.push(datas.data[i]);
								}
								$scope.citys = arr;
							});
						}
					}
				});
			};
			$scope.querydistrict = function() {
				$.ajax({
					url: Metronic.host + 'district/list' + '/' + $scope.newsDetail.city,
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					data: {},
					success: function(datas) {
						if (datas.success) {
							//console.log(datas, '获取区级地址');
							$scope.$apply(function() {
								var arr = [];
								for (var i in datas.data) {
									arr.push(datas.data[i]);
								}
								$scope.districts = arr;
							});
						}
					}
				});
			};
			$scope.querystreet = function() {
				$.ajax({
					url: Metronic.host + 'street/list' + '/' + $scope.newsDetail.district,
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					data: {},
					success: function(datas) {
						if (datas.success) {
							//console.log(datas, '获取街道地址');
							$scope.$apply(function() {
								var arr = [];
								for (var i in datas.data) {
									arr.push(datas.data[i]);
								}
								$scope.streets = arr;
							});
						}
					}
				});
			};
			if (!($rootScope.orgName === 'SYSTEM' || $rootScope.orgName === '调解网')) {
				$.ajax({
					url: Metronic.host + 'boss/admin/orgArea',
					type: 'POST',
					dataType: 'json',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					data: {
						data: JSON.stringify({'orgId': $rootScope.orgId})
					},
					success: function(datas) {
						if (datas.success) {
							//console.log(datas, '获取管理地址');
							$scope.$apply(function() {
								if (datas.data.cityId == 0) {
									$scope.surecity = false;
								} else {
									$scope.surecity = true;
								}
								if (datas.data.distirctId == 0) {
									$scope.suredistrict = false;
								} else {
									$scope.suredistrict = true;
								}
								if (datas.data.streetId == 0) {
									$scope.surestreet = false;
								} else {
									$scope.surestreet = true;
								}
								$scope.newsDetail.province = datas.data.provinceId;
								$scope.newsDetail.city = datas.data.cityId;
								$scope.newsDetail.district = datas.data.distirctId;
								$scope.newsDetail.street = datas.data.streetId;
								$scope.querycity();
								$scope.querydistrict();
								$scope.querystreet();
							})
						}
					}
				});
			}
		});
	}
]);
