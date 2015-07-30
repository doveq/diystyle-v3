var swiper = new Swiper('.register', {
        pagination: '.register-pagination',        
        autoplay:5000,
        loop:true,
        paginationClickable: true,
        effect : 'fade',
        fade: {
		  crossFade: false
		}
    });
    

/*$(function(){

		function login(){
			$('.register-email-check').hide();
			$('#formH').fadeIn('slow');
			$('#checkCode').hide();
			$('.loginChoose').fadeIn();
			$('#registerNote').text('找回密码');
			$('.safecode').hide();
			$('.fromlist .pass').show();
			$('#active').val('登录');
			$('#registerBtn').val('注册');
		}
		function checkin(){
			$('#checkCode').fadeIn();
			$('.loginChoose').hide();
			$('.fromlist .pass').show();
			$('.safecode').hide();
			$('#registerNote').text('获取短信验证码');
			$('#active').val('注册');
			$('#registerBtn').val('登录');
		}


	$('#registerBtn').click(function(){
		var txt = $(this).val();
		if(txt=='登录'){
			login();
		}else{
			checkin();
		}
	});
	var phone = /^1[3|4|5|8][0-9]\d{8}$/;
	var email = /\b(^['_A-Za-z0-9-]+(\.['_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(\.[A-Za-z0-9-]+)*((\.[A-Za-z0-9]{2,})|(\.[A-Za-z0-9]{2,}\.[A-Za-z0-9]{2,}))$)\b/;
	//点击注册时：切换手机验证
	$('#active').click(function(){
		var ert= $('#errorTip'),
			user = $('.name input'),
			pwd = $('.pass input'),
			repwd = $('.code input');
		if($('#active').val()=='登录') {
			if(user.val() =='') {
				user.addClass('error');
				ert.html('请输入正确的手机号或者邮箱！');
				return false;
			} else if(pwd.val()=='') {
				pwd.addClass('error');
				ert.html('密码不能为空');
				return false;
			}
			if(user.val() && pwd.val()) {
				//请求后台接口--进行登录
				console.log('请求后台接口--进行登录！usrname:'+user.val()+' psssword:'+pwd.val());
				return false;
			}
		} else {
			if(user.val() =='') {
				user.addClass('error');
				ert.html('请输入正确的手机号或者邮箱！');
				return false;
			} else if(pwd.val()=='') {
				pwd.addClass('error');
				ert.html('密码不能为空');
				return false;
			} else if(repwd.val()==''){
				repwd.addClass('error');
				ert.html('重复密码不能为空');
				return false;
			}
			if(email.test(user.val()) && user.val() && pwd.val() && repwd.val() && pwd.val()==repwd.val()){
				$('#formH').hide();
				$('.register-email-check').fadeIn('slow');
				$('#emailText').html(user.val());
				//调用邮箱接口
				console.log('调用邮箱接口');
				return false;
			}
			if(phone.test(user.val()) && user.val() && pwd.val() && repwd.val() && pwd.val()==repwd.val()){
				$('.fromlist .pass, .fromlist .code').hide();
				$('.safecode').fadeIn('slow');
				$(this).val('确认');
				//调用短信接口
				console.log('调用短信接口');
				return false;
			}
		}


	});
	//验证输入有效性
	$('.name input').blur(function(){
		var usr = $('.name input').val(),
			ert= $('#errorTip');
		if(phone.test(usr)){
			$('.name i').addClass('dui');
			$('.name input').removeClass('error');
			ert.html('');
		} else if (email.test(usr)) {
			$('.name i').addClass('dui');
			$('.name input').removeClass('error');
			ert.html('');
		} else {
			$('.name i').removeClass('dui');
			$('.name input').addClass('error');
			ert.html('请输入正确的手机号或者邮箱！');
		}
	});

	$('.pass input').blur(function(){
		var pwd = $('.pass input').val(),
			ert= $('#errorTip');
		if(pwd && pwd.length >= 6){
			$('.pass input').removeClass('error');
			ert.html('');
		} else if(pwd && pwd.length < 6) {
			$('.pass input').addClass('error');
			ert.html('密码小于6位');
		} else {
			$('.pass input').addClass('error');
			ert.html('密码不能为空');
		}
	})

	$('.code input').blur(function(){
		var repwd = $('.code input').val(),
			pwd = $('.pass input').val(),
			ert= $('#errorTip');
		if(repwd!=pwd){
			$('.code input').addClass('error');
			ert.html('两次输入的密码不一致');
		} else {
			$('.code input').removeClass('error');
			ert.html('');
		}
	})

})*/

/** 邮箱登录地址 */
var EMAILHASH={
	'qq.com': 'http://mail.qq.com',
	'gmail.com': 'http://mail.google.com',
	'sina.com': 'http://mail.sina.com.cn',
	'163.com': 'http://mail.163.com',
	'126.com': 'http://mail.126.com',
	'yeah.net': 'http://www.yeah.net/',
	'sohu.com': 'http://mail.sohu.com/',
	'tom.com': 'http://mail.tom.com/',
	'sogou.com': 'http://mail.sogou.com/',
	'139.com': 'http://mail.10086.cn/',
	'hotmail.com': 'http://www.hotmail.com',
	'live.com': 'http://login.live.com/',
	'live.cn': 'http://login.live.cn/',
	'live.com.cn': 'http://login.live.com.cn',
	'189.com': 'http://webmail16.189.cn/webmail/',
	'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
	'yahoo.cn': 'http://mail.cn.yahoo.com/',
	'eyou.com': 'http://www.eyou.com/',
	'21cn.com': 'http://mail.21cn.com/',
	'188.com': 'http://www.188.com/',
	'foxmail.coom': 'http://www.foxmail.com'
};

;(function ($) {
	var mobileCodeInterval,
		loginURL,
		registerURL,
		checkUsernameURL,
		mobileFindPwdURL,
		emailFindPwdURL,
		resetPwdURL,
		mobileFindPwdSafecodeURL;

	function checkUsername(value){
		var phoneReg = /^1[3|4|5|7|8]\d{9}$/,
			emailReg = /\b(^['_A-Za-z0-9-]+(\.['_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(\.[A-Za-z0-9-]+)*((\.[A-Za-z0-9]{2,})|(\.[A-Za-z0-9]{2,}\.[A-Za-z0-9]{2,}))$)\b/,
			result = 0;

		if(value != ""){
			if(phoneReg.test(value)){
				result = 1;
			} else if(emailReg.test(value)){
				result = 2;
			}
		}
		return result;
	}

	function mobileCountDown(element){
		var count = 60;
		mobileCodeInterval = setInterval(function () {
			if(count >= 0){
				element.val(count + "秒后重新发送");
				count--;
			} else {
				element.val("重新获取验证码").removeClass("default");
			}
		}, 1000);
	}

	/** 设置邮箱登录地址 */
	function setSelfEmailLogin(email){
		var suffix = email.split("@")[1],
			loginHref = EMAILHASH[suffix];

		if(!loginHref){
			loginHref = "http://mail." + suffix;
		}
		return loginHref;
	}

	var searchData = getLocationSearchData(),
		status = searchData.status;

	function leftInit(){
		if(status == "login"){
			var loginEle = $("#formH");
			loginEle.show().siblings(".formCon").hide();
			loginEle.find("input").val("");
			loginEle.find("li").show();
			loginEle.find(".code").hide();
			loginEle.find(".text").children("a").show();
			loginEle.find(".active").val("登录");
		} else if(status == "register"){
			var registerEle = $("#formH");
			registerEle.show().siblings(".formCon").hide();
			registerEle.find("input").val("");
			registerEle.find("li").show();
			registerEle.find(".code").hide().fadeIn("400");
			registerEle.find(".text").children("a").hide();
			registerEle.find(".active").val("注册");
			registerEle.find("#loginType").hide();
		} else if(status == "forgetPassport"){
			$("#forgetPassport").show().siblings(".formCon").hide();
			$("#forgetPassport .user").val("");
			$("#forgetPassport .notice").html("");
		} else if(status == "mobileFindPassport"){
			$("#mobileFindPwd").show().siblings(".formCon").hide();
			var phone = $("#forgetPassport .user").val(),
				mobileFindPwdEle = $("#mobileFindPwd"),
				mobileCodeEle = mobileFindPwdEle.find(".safecodebtn");

			mobileFindPwdEle.find(".user").val(phone.substr(0,3) + "****" + phone.substr(7,11)).data("phone", phone);
			mobileFindPwdEle.find(".safecodetxt").val("");

			if(mobileCodeEle.hasClass("default")){
				clearInterval(mobileCodeInterval);
				mobileCodeEle.removeClass("default");
			}
			mobileCodeEle.val("获取验证码");
		} else if(status == "emailFindPassport"){
			$("#emailFindPwd").show().siblings(".formCon").hide();
			var email = $("#forgetPassport .user").val();

			$("#emailFindPwd .user").val(email);
		} else if(status == "emailFindPwdFinish"){
			var emailFindPwdFinishEle = $("#emailFindPwdFinish");
			emailFindPwdFinishEle.show().siblings(".formCon").hide();
			var email = $("#emailFindPwd .user").val(),
				loginEmail = setSelfEmailLogin(email);

			emailFindPwdFinishEle.find(".email").attr("href", loginEmail).html(email);
		} else if(status == "resetPassport"){
			$("#resetPassport").show().siblings(".formCon").hide();
			$("#resetPassport").find(".passport, .passportAgain").val("");
			var email = searchData.email;

			if(email){
				$("#resetPassport .username").html(email);
			} else {
				$("#resetPassport .username").html($("#mobileFindPwd .user").val());
			}
		} else if(status == "resetPwdSuccess"){
			$("#resetPwdSuccess").show().siblings(".formCon").hide();
			$("#resetPwdSuccess .username").html($("#resetPassport .username").html());
		}
	}

	function rightInit(){
		if(status == "login"){
			$("#registerBtn").removeClass("twins").show();
			$("#loginBtn").removeClass("twins").hide();
		} else if(status == "register"){
			$("#loginBtn").removeClass("twins").show();
			$("#registerBtn").removeClass("twins").hide();
		} else if(status == "forgetPassport"){
			$("#loginBtn").addClass("twins").show();
			$("#registerBtn").addClass("twins").show();
		} else if(status == "resetPwdSuccess"){
			$("#registerBtn").removeClass("twins").show();
			$("#loginBtn").removeClass("twins").hide();
		}
	}

	function loginAndRegisterEvent(){
		var formEle = $("#formH"),
			errEle = formEle.find(".errorTip");
		formEle.on("focus", "input", function () {
			errEle.html("");
		});

		formEle.on("blur", ".user", function () {
			var value = $(this).val(),
				checkResult = checkUsername(value);

			if(!checkResult){
				errEle.html("请输入正确的手机号或者邮箱！");
			} else {
				/*与后台校验邮箱、手机*/
				formEle.find(".active").addClass("disabled");
				ajaxPublic({
					"data" : {

					},
					"url" : checkUsernameURL,
					"success" : function (data) {
						if(data.status == 0){
							formEle.find(".active").removeClass("disabled");
						}
					}
				});
			}
		}).on("blur", ".passport, .passportAgain", function () {
			if(status == "login"){

			} else {
				var otherEle = this.id == "passport" ? $("#passportAgain") : $("#passport"),
					value = $(this).val(),
					otherValue = otherEle.val();

				if(value.length < 6){
					errEle.html("密码长度不能小于6位");
				} else if(otherValue.length >= 6 && value != otherValue){
					errEle.html("两次输入的密码不一致");
				}
			}
		}).on("click", ".active", function () {
			var errMsg = errEle.html();

			if($(this).hasClass("disabled")){
				return false;
			}

			if(!errMsg){
				if(status == "login"){
					var user = formEle.find(".user").val(),
						passport = formEle.find(".passport").val();
					ajaxPublic({
						"data" : {

						},
						"url" : loginURL,
						"success" : function (data) {
							if(data.status == 0){

							}
						}
					});
				} else if(status == "register"){
					var user = formEle.find(".user").val(),
						passport = formEle.find(".passport").val(),
						passportAgain = formEle.find(".passportAgain").val();
					ajaxPublic({
						"data" : {

						},
						"url" : registerURL,
						"success" : function (data) {
							if(data.status == 0){

							}
						}
					});
				}
			}
		});
		
		$("#registerNote").on("click", function (event) {
			event.preventDefault();

			status = "forgetPassport";
			leftInit();
			rightInit();
		});

		$("#registerBtn").on("click", function () {
			$(this).removeClass("twins").hide();
			$("#loginBtn").removeClass("twins").show();
			status = "register";
			leftInit();
			rightInit();
		});

		$("#loginBtn").on("click", function () {
			$(this).removeClass("twins").hide();
			$("#registerBtn").removeClass("twins").show();
			status = "login";
			leftInit();
			rightInit();
		})
	}

	function forgetPassportEvent(){
		$("#forgetPassport").on("blur", ".user", function () {
			var value = $(this).val(),
				checkResult = checkUsername(value);

			if(!checkResult){
				errEle.html("请输入正确的手机号或者邮箱！");
			} else {
				/*与后台校验邮箱、手机*/
				$("#forgetPassport .active").data("type", checkResult);
			}
		}).on("click", ".active", function () {
			var errMsg = $("#forgetPassport .notice").html(),
				type = $(this).data("type");

			if($(this).hasClass("disabled")){
				return false;
			}

			if(!errMsg){
				if(type == 1){
					status = "mobileFindPassport";
				} else if(type == 2){
					status = "emailFindPassport";
				}
				leftInit();
			}
		});
		
		$("#mobileFindPwd").on("click", ".safecodebtn", function () {
			if($(this).hasClass("default")){
				return false;
			}

			$(this).addClass("default");
			var phone = $("#mobileFindPwd .user").data("phone"),
				_self = $(this);

			ajaxPublic({
				"data" : {
					"phone" : phone
				},
				"url" : mobileFindPwdURL,
				"success" : function(data){
					if(data.status == 0){
						/*倒计时*/
						mobileCountDown(_self);
					} else {
						_self.removeClass("default");
					}
				}
			});
		}).on("blur", ".safecodetxt", function () {
			var safecode = $(this).val(),
				phone = $("#mobileFindPwd .user").data("phone");

			if(safecode == "" || safecode.length < 6){
				$("#mobileFindPwd .notice").html("验证码错误，请重新输入");
			} else {
				ajaxPublic({
					"data" : {
						"phone" : phone,
						"safecode" : safecode
					},
					"url" : mobileFindPwdSafecodeURL,
					"success" : function(data){
						if(data.status == 0){
							/*倒计时*/
							mobileCountDown(_self);
						} else {
							_self.removeClass("default");
						}
					}
				});
			}
		}).on("click", ".active", function () {
			if($(this).hasClass("disabled")){
				return false;
			}

			var mobileFindPwdEle = $("#mobileFindPwd"),
				phone = mobileFindPwdEle.find(".user").data("phone"),
				mobileCode = mobileFindPwdEle.find(".safecodetxt").val();
				_self = this;

			if(mobileCode == "" || mobileCode.length < 6){
				mobileFindPwdEle.find(".notice").html("验证码错误，请重新输入");
			} else {
				ajaxPublic({
					"data" : {
						"phone" : phone,
						"code" : mobileCode
					},
					"url" : phoneFindPwdURL,
					"success" : function(data){
						if(data.status == 0){
							status = "resetPassport";
							leftInit();
						} else {

						}
					}
				});
			}
		});
		
		$("#emailFindPwd").on("click", ".active", function () {
			var email = $("#emailFindPwd .user").val();

			ajaxPublic({
				"data" : {
					"email" : email
				},
				"url" : emailFindPwdURL,
				"success" : function(data){
					if(data.status == 0){
						status = "emailFindPwdFinish";
						leftInit();
					} else {

					}
				}
			});
		});

		$("#emailFindPwd").on("click", ".emailLink", function (event) {
			event.preventDefault();
			var email = $("#emailFindPwd .email").html();
			ajaxPublic({
				"data" : {
					"email" : email
				},
				"url" : emailFindPwdURL,
				"success" : function(data){
					if(data.status == 0){
						/*重复发送邮件*/
					} else {

					}
				}
			});
		});

		$("#resetPassport").on("blur", ".passport, .passportAgain", function () {
			var otherEle = $(this).hasClass("passport") ? $("#resetPassport .passportAgain") : $("#resetPassport .passport"),
				value = $(this).val(),
				otherValue = otherEle.val();

			if(value == "" || value.length < 6){
				$("#resetPassport .errMsg").html("密码长度不能小于6位");
			} else if(otherValue.length >= 6 && value != otherValue){
				$("#resetPassport .errMsg").html("两次输入的密码不一致");
			} else {
				$("#resetPassport .errMsg").html("");
			}
		}).on("click", ".active", function (event) {
			if($(this).hasClass("disabled")){
				return false;
			}

			var errMsg = $("#resetPassport .errMsg").html(),
				passport = $("#resetPassport .passport").val(),
				passportAgain = $("#resetPassport .passportAgain").val();

			if(!errMsg){
				ajaxPublic({
					"data" : {
						"passport" : passport,
						"passportAgain" : passportAgain
					},
					"url" : resetPwdURL,
					"success" : function(data){
						if(data.status == 0){
							status = "resetPwdSuccess";
							leftInit();
							rightInit();
						} else {
							alert(data.msg);
						}
					}
				});
			}
		});

		$("#resetPwdSuccess").on("click", ".active", function () {
			status = "login";
			leftInit();
			rightInit();
		})
	}

	$(function () {
		leftInit();
		rightInit();
		loginAndRegisterEvent();
		forgetPassportEvent();

	})

})(jQuery);




