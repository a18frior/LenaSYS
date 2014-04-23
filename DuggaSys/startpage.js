// This JS file is only for the startpage courselist.php
function setupLogin()
{
	$(document).ready(function() {
		$("#loginform").on("submit", function(event) {
			event.preventDefault();
			var data = $(this).serialize();
			$.post("login.php", data, function(data) {
				var res = $.parseJSON(data);
				if(res.login == "success") {
					closeloginbox();
					if(res.newpw == true) {
						shownewpw();
					} else {
						window.location.reload();
					}
				} else {
					alert("Failed to log in.");
				}
			})
		});
		$("#recoverform").on("submit", showQuestion);
		$("#answerform").on("submit", checkAnswer);
		$("#newpasswordform").on("submit", newPasswordAndQuestion);
	});
}
//function for closing windows with escape
$( document ).on( 'keydown', function ( e ) {
    if ( e.keyCode === 27 ) {
		$("#bg").hide();
        $("#login-box").hide();
		$("#forgot-passw-box").hide();
		$("#answer-box").hide();
    }
});


//function for showing the login-box
function loginbox(){
	$("#forgot-passw-box").hide();
	$("#bg").css({'background': 'rgba(0, 0, 0, 0.5)', 'position': 'absolute', 'top': '0'});
	$("#login-box").css({'left': (($(document).width()/2) - $("#login-box").width()/2)});

  	$("#login-box").toggle();
	$("#bg").toggle();
}
function closeloginbox(){
	$("#login-box").hide();
	$("#bg").hide();
	$("#loginform").find('input').not('[type=submit]').val('');
}
function closeforgotpwbox(){
	$("#forgot-passw-box").hide();
	$("#bg").hide();
	$("#recoverform").find('input').not('[type=submit]').val('');
}
function showForgotPasswBox(){
	$("#login-box").hide();
	
	$("#bg").css({'background': 'rgba(0, 0, 0, 0.5)', 'position': 'absolute', 'top': '0'});
	$("#forgot-passw-box").css({'left': (($(document).width()/2) - $("#login-box").width()/2)});
	$("#forgot-passw-box").toggle();

}

function shownewpw() {
	$("#newpassword-box").css({'left': (($(document).width()/2) - $("#newpassword-box").width()/2)});
	$("#newpassword-box").toggle();
	$("#bg").toggle();
}

function closenewpwbox() {
	$("#newpassword-box").hide();
	$("#bg").hide();
}
function returnToLogin(){
	$("#login-box").show();
	$("#forgot-passw-box").hide();
	$("#answer-box").hide();
}

function showQuestion(event) {
	event.preventDefault();
	var un = $(this).find("input[type=text]").get(0);
	un = $(un).val();
	var form = $(this)
	if(un.length > 0) {
		return $.get("forgotpassword.php", {'user': un}, function(data) {
			var data = $.parseJSON(data)
			if(typeof data.error == "undefined") {
				closeloginbox();
				closeforgotpwbox();
				showanswerbox(un, data.question)
			} else {
				form.append(data.error)
			}
		})
	}
}

function showanswerbox(username, question) {
	$("#bg").show();
	var form = $("#answerform");
	form.find("input[name=user]").val(username);
	form.find("#recoverquestion").text(question);
	$("#answer-box").css({'left': (($(document).width()/2) - $("#answer-box").width()/2)});
	$("#answer-box").show();
}

function closeanswerbox() {
	var form = $("#answerform");
	form.find('input').not('[type=submit]').val('');
	$("#answer-box").hide();
	$("#bg").hide();
}

function checkAnswer(event) {
	event.preventDefault();
	var data = $(this).serialize();
	var form = $(this)
	$.post("forgotpassword.php", data, function(data) {
		var res = $.parseJSON(data);
		if(typeof res.success !== "undefined" && res.success == true) {
			form.closest("#forgot-passw-box").hide();
			closeanswerbox();
		} else {
			alert("Failed to change password.\r\n" + res.error);
		}
	});
}

function newPasswordAndQuestion(event) {
	event.preventDefault();

	var data = $(this).serialize();
	$.post("newpassword.php", data, function(data) {
		var res = $.parseJSON(data);
		if(typeof res.success !== "undefined" && res.success == true) {
			alert("New password set and successfully logged in");
			closenewpwbox();
			window.location.reload();
		} else {
			alert("Failed to set new password. " + res.errormsg);
		}
	});
}
