/* Setup general page controller */
MetronicApp.controller('AccountManagementController', [
	'$rootScope',
	'$scope',
	'settings',
	'$compile',
	'Shuffling',
	function($rootScope, $scope, settings, $compile, Shuffling) {
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
					userName: {
						required: "请填写登录名"
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
					userName: {
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
			AccountManagementAdvanced.init($scope, $compile, Shuffling, validate_filed);
			//添加管理员
			$scope.addmanagers = function() {
				var validate = $("#articleForm").validate(validate_filed);
				if (!validate.form()) {
					return false;
				}
				var params = {
					userName: $scope.userName,
					password: $scope.password,
					roleId: $scope.roleId,
					desc: $scope.desc
				};
				$.ajax({
					url: Metronic.host + 'user/addUser',
					type: 'get',
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
							location.reload();
						} else {
							layer.msg(datas.message);
						}
					}
				});
			};
			jQuery.validator.addMethod("monthEqualTo", function(value, element, param) {
				var target = $(param);
				return target.val().substr(0, 7) == value.substr(0, 7);
			}, "请再次输入密码");
		});
	}
]);
