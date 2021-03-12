//== Class Definition
var SnippetLogin = function () {

    var login = $('#m_login');
    var timer;

    var showErrorMsg = function (form, type, msg, time = 8000) {
        clearTimeout(timer);
        var alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
			<span></span>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        alert.animateClass('fadeIn animated');
        alert.find('span').html(msg);

        timer = setTimeout(() => {
            form.find('.alert').remove();
        }, time)
    }

    var embedError = function(form, name, message) {
        const parent = form.find(`[name="${ name }"]`).addClass('has-error').parent();
        parent.find('.alert').remove();
        parent.append(`<div class="m-alert m-alert--outline border-0 alert alert-danger alert-dismissible" role="alert">
			<span>${ message }</span>
		</div>`);
    }

    //== Private Functions

    var displaySignUpForm = function () {
        login.removeClass('m-login--forget-password');
        login.removeClass('m-login--signin');

        login.addClass('m-login--signup');
        login.find('.m-login__signup').animateClass('flipInX animated');
    }

    var displaySignInForm = function () {
        login.removeClass('m-login--forget-password');
        login.removeClass('m-login--signup');

        login.addClass('m-login--signin');
        login.find('.m-login__signin').animateClass('flipInX animated');
    }

    var displayForgetPasswordForm = function () {
        login.removeClass('m-login--signin');
        login.removeClass('m-login--signup');

        login.addClass('m-login--forget-password');
        login.find('.m-login__forget-password').animateClass('flipInX animated');
    }

    var handleFormSwitch = function () {
        $('#m_login_forget_password').on('click', function (e) {
            e.preventDefault();
            displayForgetPasswordForm();
        });

        $('#m_login_forget_password_cancel').on('click', function (e) {
            e.preventDefault();
            displaySignInForm();
        });

        $('#m_login_signup').on('click', function (e) {
            e.preventDefault();
            displaySignUpForm();
        });

        $('#m_login_signup_cancel').on('click', function (e) {
            e.preventDefault();
            displaySignInForm();
        });
    }

    var handleSignInFormSubmit = function () {
        $('#m_login_signin_submit').on('click', function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            $.post({
                url: '/login',
                data: form.serializeArray()
            }).then(function (response, status) {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                localStorage.setItem('token', response.token)
                setCookie('token', response.token)
                location.assign('/')
            }, function (err) {
                $('.has-error').removeClass('has-error');
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                if (err.responseJSON && err.responseJSON.message)
                    showErrorMsg(form, 'danger', err.responseJSON.message);
                else if(err.status === 422 && Array.isArray(err.responseJSON)) {
                    console.log(err.responseJSON);
                    for(const i in err.responseJSON) {
                        const element = err.responseJSON[i];
                        form.find(`[name="${ element.param }"]`).addClass('has-error');
                    }
                }
            });
        });
    }

    var handleSignUpFormSubmit = function () {
        $('#m_login_signup_submit').on('click', function (e) {
            e.preventDefault();

            var btn = $(this);
            var SinupAgree = $('#SinupAgree');
            var signInForm = $(this).closest('form');

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            $.post({
                url: '/register',
                data: signInForm.serializeArray()
            }).then(function (response, status) {
                signInForm.find('.has-error').removeClass('has-error');
                signInForm.find('.alert').remove();
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
                signInForm[0].reset()
                SinupAgree.prop('checked', false);
                showErrorMsg(signInForm, 'success', 'Thank you. To complete your registration please check your <b><a href="/reset/email/list" target="_blank">email</a></b>.', 30000);
            }, function (err) {
                signInForm.find('.has-error').removeClass('has-error');
                signInForm.find('.alert').remove();
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', true);
                SinupAgree.prop('checked', false);
                if (err.responseJSON && err.responseJSON.message)
                    showErrorMsg(signInForm, 'danger', err.responseJSON.message);
                else if(err.status === 422 && Array.isArray(err.responseJSON)) {
                    for(const i in err.responseJSON) {
                        const element = err.responseJSON[i];
                        embedError(signInForm, element.param, element.msg);
                    }
                }
            });
        });
    }

    var handleSingUpAgree = function () {
        $('#SinupAgree').on('change', function (e) {
            $('#m_login_signup_submit').prop('disabled', !this.checked);
        });
    }

    var handleForgetPasswordFormSubmit = function () {
        $('#m_login_forget_password_submit').on('click', function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            $.post({
                url: '/reset/password',
                data : form.serializeArray()
            }).then(function (response, status) {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                form[0].reset()
                showErrorMsg(form, 'success', 
                'We have sent you an <b><a href="/reset/email/list" target="_blank">reset password</a></b> email please check your email.'
                );
            }, function (err) {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                if(err.responseJSON && 0 in err.responseJSON)
                    showErrorMsg(form, 'danger', err.responseJSON[0].msg);
                else 
                    showErrorMsg(form, 'danger', "Please try again later.");
            });
        });
    }

    //== Public Functions
    return {
        // public functions
        init: function () {
            handleFormSwitch();
            handleSignInFormSubmit();
            handleSingUpAgree();
            handleSignUpFormSubmit();
            handleForgetPasswordFormSubmit();
        }
    };
}();

$.fn.animateClass = function (classlist) {
    this.addClass(classlist);
    setTimeout(() => {
        this.removeClass(classlist)
    }, 1000)
}
//== Class Initialization
jQuery(document).ready(function () {
    SnippetLogin.init();
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}