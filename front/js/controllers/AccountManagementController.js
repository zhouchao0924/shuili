/* Setup general page controller */
MetronicApp.controller('AccountManagementController', [
	'$rootScope',
	'$scope',
	'settings',
	'$compile',
	function($rootScope, $scope, settings, $compile) {
		$scope.$on('$viewContentLoaded', function() {
			// initialize core components
			Metronic.initAjax();
			$rootScope.settings.layout.pageBodySolid = false;
			$rootScope.settings.layout.pageSidebarClosed = false;
			// 开始表单数据处理
			var validate_filed = {
				errorElement: 'span', //default input error message container
				errorClass: 'help-block help-block-error', // default input error message class
				messages: {
					logInName: {
						required: "请填写登录名"
					},
					realName: {
						required: "请填写真实姓名"
					},
					password: {
						required: "请填写密码"
					},
					mpassword: {
						required: "请填写密码"
					},
					resetpassword: {
						required: "请填写密码"
					},
					mresetpassword: {
						required: "请填写密码"
					},
					roleId: {
						required: "请选择角色"
					}
				},
				rules: {
					logInName: {
						required: true
					},
					realName: {
						required: true
					},
					password: {
						required: true
					},
					mpassword: {
						required: true
					},
					resetpassword: {
						required: true,
						monthEqualTo: '#password'
					},
					mresetpassword: {
						required: true,
						monthEqualTo: '#mpassword'
					},
					roleId: {
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
			AccountManagementAdvanced.init($scope, $compile, validate_filed);
			//init maxlength handler监视输入字符设置最大输入字数
			// $('.maxlength-handler').maxlength({
			//     limitReachedClass: "label label-danger",
			//     alwaysShow: true,
			//     threshold: 5
			// });
			//添加管理员
			$scope.addmanagers = function() {
				var validate = $("#articleForm").validate(validate_filed);
				if (!validate.form()) {
					return false;
				}
				var params = {
					logInName: $scope.logInName,
					realName: $scope.realName,
					password: $scope.password,
					roleId: $scope.roleId
				};
				$.ajax({
					url: Metronic.host + 'boss/addUser',
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
							//console.log(data);
							location.reload();
						} else {
							alert(data.message);
						}
					}
				});
			};
			// 获取角色列表
			$.ajax({
				url: Metronic.host + 'boss/getRoleList',
				type: 'POST',
				dataType: 'json',
				xhrFields: {
					withCredentials: true
				},
				crossDomain: true,
				data: {
					data: {}
				},
				success: function(datas) {
					if (datas.success) {
						//console.log(datas, '角色列表');
						$scope.$apply(function() {
							$scope.roles = datas.data;
						});
					} else {
						alert(datas.message);
					}
				}
			});
			//获取选中的管理机构的ID
			$scope.selected = [];
			$scope.updateSelection = function($event, item) {
				if (item.manager === 0) {
					$scope.selected.push(item.orgId);
				}
				if (item.manager === 1) {
					$.each($scope.selected, function(i, n) {
						if (n === item.orgId) {
							$scope.selected.splice(i, 1);
						}
					});
				}
			};
			jQuery.validator.addMethod("monthEqualTo", function(value, element, param) {
				var target = $(param);
				return target.val().substr(0, 7) == value.substr(0, 7);
			}, "请再次输入密码");
		});
	}
]);
