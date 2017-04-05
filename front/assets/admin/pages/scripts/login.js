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
            if (e.which == 13) { //回车键的键值为13
                $('#loginBtn').click(); //调用登录按钮的登录事件
            }
        });

        $('#loginBtn').click(function(e) {
            if (validate.form()) {
                $.ajax({
                    url: Metronic.host + '/admin/login',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        username: $('#username').val(),
                        password: $('#password').val()
                    },
                    success: function(data) {
                        console.log(data);
                        if (data.code == 1) {
                            var obj = {
                                userId: data.obj.queryAdmin.adminId,
                                sessionId: data.obj.queryAdmin.sessionId,
                                username: data.obj.queryAdmin.username,
                                menuList: data.obj.menuList,
                                roleCode: data.obj.adminInfo && data.obj.adminInfo.roleCode,
                                companyCode: data.obj.adminInfo && data.obj.adminInfo.companyCode
                            };
                            window.localStorage.aijiaUserdata = JSON.stringify(obj);
                            if (window.localStorage.sessionOut && window.localStorage.vmCache) {
                                var cache = JSON.parse(window.localStorage.vmCache)
                                if (cache)
                                    window.location.href = cache.url
                            } else {
                                window.location.href = 'index.html' + (obj.menuList[0].children[0] ? (obj.menuList[0].children[0].url || obj.menuList[0].children[0].children[0].url || ''):'');
                                // window.location.href = 'index.html';
                            }
                        } else if (data.code == 20) {
                            var obj = {
                                userId: data.obj.queryAdmin.adminId,
                                sessionId: data.obj.queryAdmin.sessionId,
                                username: data.obj.queryAdmin.username,
                                menuList: data.obj.menuList,
                                roleCode: data.obj.adminInfo && data.obj.adminInfo.roleCode
                            };
                            window.localStorage.aijiaUserdata = JSON.stringify(obj);
                            $.blockUI({
                                message: '您是首次登陆，请重置密码，3秒后自动跳转……<a href="change_password.html">立即前往修改密码</a>',
                                css: {
                                    border: '1px solid #ddd',
                                    padding: '10px',
                                    boxShadow: '0 1px 8px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: '#eee'
                                },
                                overlayCSS: {
                                    backgroundColor: '#555',
                                    opacity: 0.05,
                                    cursor: 'wait'
                                }
                            });
                            setTimeout(function() {
                                window.location.href = 'change_password.html';
                            }, 3000);
                        } else {
                            alert(data.ext.msg);
                        }
                    },
                    error: function(xhr, data, status) {
                        alert('请检查网络');
                    }
                })
            }
        });
    }

    // var handleForgetPassword = function() {
    //     $('.forget-form').validate({
    //         errorElement: 'span', //default input error message container
    //         errorClass: 'help-block', // default input error message class
    //         focusInvalid: false, // do not focus the last invalid input
    //         ignore: "",
    //         rules: {
    //             email: {
    //                 required: true,
    //                 email: true
    //             }
    //         },

    //         messages: {
    //             email: {
    //                 required: "Email is required."
    //             }
    //         },

    //         invalidHandler: function(event, validator) { //display error alert on form submit

    //         },

    //         highlight: function(element) { // hightlight error inputs
    //             $(element)
    //                 .closest('.form-group').addClass('has-error'); // set error class to the control group
    //         },

    //         success: function(label) {
    //             label.closest('.form-group').removeClass('has-error');
    //             label.remove();
    //         },

    //         errorPlacement: function(error, element) {
    //             error.insertAfter(element.closest('.input-icon'));
    //         },

    //         submitHandler: function(form) {
    //             form.submit();
    //         }
    //     });

    //     $('.forget-form input').keypress(function(e) {
    //         if (e.which == 13) {
    //             if ($('.forget-form').validate().form()) {
    //                 $('.forget-form').submit();
    //             }
    //             return false;
    //         }
    //     });

    //     jQuery('#forget-password').click(function() {
    //         jQuery('.login-form').hide();
    //         jQuery('.forget-form').show();
    //     });

    //     jQuery('#back-btn').click(function() {
    //         jQuery('.login-form').show();
    //         jQuery('.forget-form').hide();
    //     });

    // }

    // var handleRegister = function() {

    //     function format(state) {
    //         if (!state.id) return state.text; // optgroup
    //         return "<img class='flag' src='assets/global/img/flags/" + state.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + state.text;
    //     }

    //     if (jQuery().select2) {
    //      $("#select2_sample4").select2({
    //          placeholder: '<i class="fa fa-map-marker"></i>&nbsp;Select a Country',
    //          allowClear: true,
    //          formatResult: format,
    //          formatSelection: format,
    //          escapeMarkup: function(m) {
    //              return m;
    //          }
    //      });


    //      $('#select2_sample4').change(function() {
    //          $('.register-form').validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
    //      });
    //  }

    //     $('.register-form').validate({
    //         errorElement: 'span', //default input error message container
    //         errorClass: 'help-block', // default input error message class
    //         focusInvalid: false, // do not focus the last invalid input
    //         ignore: "",
    //         rules: {

    //             fullname: {
    //                 required: true
    //             },
    //             email: {
    //                 required: true,
    //                 email: true
    //             },
    //             address: {
    //                 required: true
    //             },
    //             city: {
    //                 required: true
    //             },
    //             country: {
    //                 required: true
    //             },

    //             username: {
    //                 required: true
    //             },
    //             password: {
    //                 required: true
    //             },
    //             rpassword: {
    //                 equalTo: "#register_password"
    //             },

    //             tnc: {
    //                 required: true
    //             }
    //         },

    //         messages: { // custom messages for radio buttons and checkboxes
    //             tnc: {
    //                 required: "Please accept TNC first."
    //             }
    //         },

    //         invalidHandler: function(event, validator) { //display error alert on form submit

    //         },

    //         highlight: function(element) { // hightlight error inputs
    //             $(element)
    //                 .closest('.form-group').addClass('has-error'); // set error class to the control group
    //         },

    //         success: function(label) {
    //             label.closest('.form-group').removeClass('has-error');
    //             label.remove();
    //         },

    //         errorPlacement: function(error, element) {
    //             if (element.attr("name") == "tnc") { // insert checkbox errors after the container
    //                 error.insertAfter($('#register_tnc_error'));
    //             } else if (element.closest('.input-icon').size() === 1) {
    //                 error.insertAfter(element.closest('.input-icon'));
    //             } else {
    //                 error.insertAfter(element);
    //             }
    //         },

    //         submitHandler: function(form) {
    //             form.submit();
    //         }
    //     });

    //     $('.register-form input').keypress(function(e) {
    //         if (e.which == 13) {
    //             if ($('.register-form').validate().form()) {
    //                 $('.register-form').submit();
    //             }
    //             return false;
    //         }
    //     });

    //     jQuery('#register-btn').click(function() {
    //         jQuery('.login-form').hide();
    //         jQuery('.register-form').show();
    //     });

    //     jQuery('#register-back-btn').click(function() {
    //         jQuery('.login-form').show();
    //         jQuery('.register-form').hide();
    //     });
    // }

    return {
        //main function to initiate the module
        init: function() {

            handleLogin();
            // handleForgetPassword();
            // handleRegister();

        }

    };

}();
