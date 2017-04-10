/* Setup general page controller */
MetronicApp.controller('EditFileInformationManagementController', [
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
					}
				},
				rules: {
					adTitle: {
						required: true
					}
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
					} else {
						alert(datas.message);
						Metronic.unblockUI();
					}
					// 获取档案信息
					$.ajax({
						url: Metronic.host + 'article/getArticleInfoAjax',
						type: 'POST',
						dataType: 'json',
						xhrFields: {
							withCredentials: true
						},
						crossDomain: true,
						data: {
							data: JSON.stringify({articleId: root.currentScope.$state.params.id})
						},
						success: function(data) {
							if (data.success) {
								articleUm.setContent(data.data.content);
								$scope.$apply(function() {
									$scope.newsDetail = {
										'id': data.data.id,
										'title': data.data.title,
										'isBoldTitle': data.data.isBoldTitle,
										'titleImgUrl': data.data.titleImgUrl,
										'articleType': 2,
										'originalUrl': data.data.originalUrl,
										'content': data.data.title
									};
									$scope.titleImgUrl = $scope.newsDetail.titleImgUrl;
								});
								$.uniform.update($('input[type = checkbox]'));
							}
						}
					});
				},
				error: function(xhr, data, status) {
					alert('请检查网络');
				}
			});
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
						(function() {
							$.ajax({
								url: Metronic.host + 'attachment/getUploadTokenAjax',
								type: 'POST',
								dataType: 'json',
								xhrFields: {
									withCredentials: true
								},
								crossDomain: true,
								data: {
									data: JSON.stringify({})
								},
								success: function(data) {
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
											$scope.newsDetail.titleImgUrl = domain + '/' + data.key;
											var params = $scope.newsDetail;
											params.content = articleUm.getContent();
											$.ajax({
												url: Metronic.host + 'article/EditArticleInfoAjax',
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
														window.location.href = '#/FileInformationManagement';
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
						url: Metronic.host + 'article/EditArticleInfoAjax',
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
								window.location.href = '#/FileInformationManagement';
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
		});
	}
]);
