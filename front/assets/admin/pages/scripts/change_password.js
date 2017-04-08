var ChangePassword = function() {

    var handleChangePassword = function() {

        var a = JSON.parse(window.localStorage.Userdata);
        
        var validate = $('.change-form').validate({
            errorElement: 'span', //default input error message container
            errorClass: 'help-block', // default input error message class
            focusInvalid: false, // do not focus the last invalid input
            rules: {
                password: {
                    required: true
                },
                newPassword: {
                    required: true
                },
                confirmNewPassword: {
                    required: true,
                    equalTo: '#newPassword'
                }
            },

            messages: {
                password: {
                    required: "Password is required."
                },
                newPassword: {
                    required: "New Password is required."
                },
                confirmNewPassword: {
                    required: "Confirm New Password is required."
                }
            },

            invalidHandler: function(event, validator) { //display error alert on form submit   
                $('.alert-danger', $(this)).show();
            },

            highlight: function(element) { // hightlight error inputs
                $(element)
                    .closest('.form-group').addClass('has-error'); // set error class to the control group
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
            if (e.which==13){  //回车键的键值为13
                $('#changePwdBtn').click(); //调用登录按钮的登录事件
            }
        });

        $('#changePwdBtn').click(function(e) {
            if(validate.form()){
                $.ajax({
                    url: Metronic.host + '/admin/resetPassword',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        adminId:a.userId,
                        username:a.username,
                        password:$('#password').val(),
                        newPassword:$('#newPassword').val()
                    },
                    success:function(data){
                        if(data.code==1){
                            a.sessionId = data.obj.sessionId;
                            window.localStorage.Userdata = JSON.stringify(a);
                            window.location.href = 'index.html';
                        }else{
                            alert(data.ext.msg);
                        }
                    },
                    error:function(xhr, data, status){
                        alert('请检查网络');
                    }
                })
            }
        });
    }

    return {
        //main function to initiate the module
        init: function() {

            handleChangePassword();
            // handleForgetPassword();
            // handleRegister();

        }

    };

}();