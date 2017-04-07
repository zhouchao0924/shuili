var Login = function() {
	var handleLogin = function() {
		var validate = $('.login-form').validate({
			errorElement: 'span', //default input error message container
			errorClass: 'help-block', // default input error message class
			focusInvalid: false, // do not focus the last invalid input
			rules: {
				username: {
					required: true
				},
				password: {
					required: true
				},
				remember: {
					required: false
				}
			},
			messages: {
				username: {
					required: "Username is required."
				},
				password: {
					required: "Password is required."
				}
			},
			invalidHandler: function(event, validator) { //display error alert on form submit
				$('.alert-danger', $('.login-form')).show();
			},
			highlight: function(element) { // hightlight error inputs
				$(element).closest('.form-group').addClass('has-error'); // set error class to the control group
			},
			success: function(label) {
				label.closest('.form-group').removeClass('has-error');
				label.remove();
			},
			errorPlacement: function(error, element) {
				error.insertAfter(element.closest('.input-icon'));
			}
		});
		// $('.login-form input').keypress(function(e) {
		//     if (e.which == 13) {
		//         if ($('.login-form').validate().form()) {
		//             $('.login-form').submit(); //form validation success, call ajax form submit
		//         }
		//         return false;
		//     }
		// });
		$('body').bind('keydown', function(e) {
			if (e.which == 13) { //回车键的键值为13
				$('#loginBtn').click(); //调用登录按钮的登录事件
			}
		});
		$('#loginBtn').click(function(e) {
			if (validate.form()) {
				var params = {
					"userName": $('#username').val(),
					"password": $('#password').val()
				};
				$.ajax({
					url: Metronic.host + '/user/login',
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
							window.location.href = "index.html#/dashboard.html";
						} else {
							alert(data.message);
						}
					},
					error: function(xhr, data, status) {
						alert('请检查网络');
					}
				})
			}
		});
	}
	return {
		//main function to initiate the module
		init: function() {
			handleLogin();
		}
	};
}();
