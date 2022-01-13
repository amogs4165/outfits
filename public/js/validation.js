
function validateForm(){
    var valid = $("#signupform").validate({
        rules:{
            firstName:{
                required: true,
                minlength:3,
                maxlength: 30,
                lettersonly: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            lastName:{
                required: true,
                minlength:1,
                maxlength: 30,
                lettersonly: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            email:{
                required: true,
                email: true,
                minlength: 5,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            userName:{
                required: true,
                maxlength: 10,
                lettersonly: true,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            phoneNumber:{
                required: true,
                minlength: 10,
                maxlength:10,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            password:{
                required: true,
                minlength: 8,
                normalizer: function(value) {
                    return $.trim(value);
                }
            },
            confirmPassword: {
                required: true,
                minlength: 8,
                normalizer: function(value) {
                    return $.trim(value);
                },
                equalTo: "#password1"
            }
        }
    })
    return valid;
}

jQuery.validator.addMethod("lettersonly", function(value, element) {
    return this.optional(element) || /^[a-z," "]+$/i.test(value);
}, "Only letters and spaces are allowed");


$(document).ready(function(){
    validateForm();
})