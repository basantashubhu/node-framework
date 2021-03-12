
const SnippetLogin = function () {

    let timer;

    const showErrorMsg = function (form, type, msg, time = 8000) {
        clearTimeout(timer)
        const alert = $('<div class="m-alert m-alert--outline alert alert-' + type + ' alert-dismissible" role="alert">\
        <span></span>\
    </div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        alert.find('span').html(msg);

        timer = setTimeout(() => {
            form.find('.alert').remove();
        }, time)
    };

    const handleSignInFormSubmit = function () {
        $('#m_login_signin_submit').on('click', function (e) {
            e.preventDefault();
            const btn = $(this);
            const form = $(this).closest('form');

            if ($('[name="password"]').val() !== $('[name="password_confirmation"]').val()) {
                return showErrorMsg(form, "Password confirmation did not match password");
            }

            btn.addClass('m-loader m-loader--right m-loader--light').attr('disabled', true);

            $.post({
                url: '/password/reset',
                data: form.serializeArray()
            }).then(function (response, status) {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                showErrorMsg(form, 'success',
                    "You have updated your password successfully. You will be redirected to login page after <b class=\"rp-timer\"><span>9</span> seconds<b/>.",
                    15000
                );
                const rpTimer = function () {
                    const time = Number($('.rp-timer>span').text().trim())
                    if (time > 0)
                        $('.rp-timer>span').text(time - 1);
                    else
                        location.assign('/login')
                }
                setInterval(rpTimer, 1000)
            }, function (err) {
                btn.removeClass('m-loader m-loader--right m-loader--light').attr('disabled', false);
                if (err.responseJSON && err.responseJSON.message)
                    showErrorMsg(form, 'danger', err.responseJSON.message);
                else if (err.responseJSON && 0 in err.responseJSON)
                    showErrorMsg(form, 'danger', err.responseJSON[0].msg);
            });
        });
    };

    //== Public Functions
    return {
        // public functions
        init: function () {
            handleSignInFormSubmit();
        }
    };
}();

//== Class Initialization
jQuery(function () {
    SnippetLogin.init();
});
