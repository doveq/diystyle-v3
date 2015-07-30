/**
 * 核实订单信息
 */
$(function() {
	$('#backshop').click(function() {
		window.open('shopping.html');
	})
	//支付方式,发票
	var payway = $('#payway span:not(:first)'),
	 	tt = $('#tt label'),
	 	mx = $('#mx label'),
	 	payType = "Alipay",
	 	yhVal = '',
	 	title = "个人",
	 	fpmx = "艺术品";
	
	//获取发票抬头
	tt.click(function() {
		tt.each(function(i, k) {
			if ($(k).hasClass('active')) {
				$(k).removeClass('active');
			}
		})
		$(this).addClass('active');
		title = $(this).text();
	})
	//获取发票明细
	mx.click(function() {
		mx.each(function(i, k) {
			if ($(k).hasClass('active')) {
				$(k).removeClass('active');
			}
		})
		$(this).addClass('active');
		fpmx = $(this).text();
	})
	//支付类型
	payway.click(function(){
		payway.each(function(i, k) {
			if ($(k).hasClass('active')) {
				$(k).removeClass('active');
			}
		})
		$(this).addClass('active');
		payType = $(this)[0].id;
	})
	//判断当前用户是否存在地址
	window.onload = function(){
		if($('#address').val()==''){
			$('#address').parent().parent().hide();
			$('.usercenter-dressadd').show();
		}
	}
	
	//提交订单
	$('.wait-button input').click(function(){
		var params = {
				payMode : payType,
				yhVal : yhVal,
				title : title,
				titleVal : $('#title').val(),
				fpmx : fpmx
		}
		console.log(params);
		//window.open('shopwait.html');
	})

	//网银支付
	payway.click(function(){
		payway.each(function(i, k) {
			if ($(k).hasClass('active') && $(k).hasClass('paytype-wy')) {
				$('.Wait_yh01').show();
				$('.save-pay').show();
			} else {
				$('.Wait_yh01').hide();
				$('.save-pay').hide();
				$('#payMode').hide();
			}
		})
		
	})
	
	$('.CUP_rb input').each(function(i, k) {
		$(k).click(function(){
			if ($(k).attr('id')=='gsyh') {
				$('#sub_gsyh').show();
				$('#sub_msyh').hide();
				$('#sub_msyh input').attr('checked',false);
			} else if($(k).attr('id')=='msyh') {
				$('#sub_msyh').show();
				$('#sub_gsyh').hide();
				$('#sub_gsyh input').attr('checked',false);
			} else {
				$('#sub_msyh input').attr('checked',false);
				$('#sub_gsyh input').attr('checked',false);
				$('#sub_msyh').hide();
				$('#sub_gsyh').hide();
			}
		})
	})

	
	//保存支付方式
	$('#savePay').click(function(){
		//var yhVal;//当前选择的银行的代码
		$('.CUP_rb input').each(function(i,k){
			if($(k)[0].checked==true){
				/*if($(k)[0].id='gsyh'){
					$('#sub_gsyh input').each(function(o,p){
						if($(p)[0].checked==true){
							yhVal = $(p)[0].value;
						}
					})
				}
				if($(k)[0].id='msyh'){
					$('#sub_msyh input').each(function(o,p){
						if($(p)[0].checked==true){
							yhVal = $(p)[0].value;
						}
					})
				}*/
				$('.bank-ul label').each(function(j,l){
					if($(l).attr('for')==$(k)[0].id){
						yhVal = $(k)[0].value;
						console.log($(k)[0].value)
						$('#payMode img').attr('src',$(l).children().attr('src'));
						$('#payMode').show();
						$('.Wait_yh01').hide();
						$('.save-pay').hide();
					}
				})
			}
		})
		//传递给后台的银行代码
		alert('传递给后台的银行代码:'+yhVal);
	})
	//通用选择
	function commonSel(slt) {
		slt.click(function() {
			slt.each(function(i, k) {
				if ($(k).hasClass('active')) {
					$(k).removeClass('active');
				}
			})
			$(this).addClass('active');
		})
	}
})

$(function () {
	/*地址列表*/
	new DiyArt.Address({
		"addListContainer" : "#addressList",
		"addOrEditContainer" : "#addOrEditAddress",
		"addAddressBtn" : "#addAddress",
		"addressListURL" : "",
		"addAddressURL" : "",
		"editAddressURL" : "",
		"setDefaultAddressURL" : "",
		"deleteAddressURL" : ""
	});
	
	$("#invoiceMessage").on("click", ".slide", function () {
		if($(this).find(".active").length){

		} else {
			$(this).children("i").addClass("active");

			var totalHeight = 0,
				siblingsEle = $(this).parent().children(),
				invoiceType = $("#invoiceType").val(),
				invoiceName = $("#invoiceNameHidden").val() || "",
				invoiceDetail = $("#invoiceDetail").val();

			if(invoiceType && invoiceDetail){
				$(this).siblings(".title").find("label").removeClass("active").eq(invoiceType).addClass("active");
				$("#invoiceName").val(invoiceName);
				$(this).siblings(".detail").find("label").removeClass("active").eq(invoiceDetail).addClass("active");
			}

			for(var i = 0, l = siblingsEle.length; i < l; i++){
				totalHeight += siblingsEle.eq(i).outerHeight(true);
			}

			$(this).parent().animate({
				"height" : totalHeight + "px"
			});
		}
	}).on("click", "label", function (event) {
		event.preventDefault();

		$(this).addClass("active").parent().siblings().find(".active").removeClass("active");
	}).on("click", "#saveInvoice", function (event) {
		event.preventDefault();

		var container = $("#invoiceMessage"),
			invoiceType = container.find(".title .active").data("id"),
			invoiceName = $("#invoiceName").val(),
			invoiceDetail = container.find(".detail .active").data("id");

		$("#invoiceType").val(invoiceType);
		$("#invoiceNameHidden").val(invoiceName);
		$("#invoiceDetail").val(invoiceDetail);

		container.animate({
			"height" : "15px"
		}, 199, function () {
			$(this).find(".active").removeClass("active");
		});
	}).on("click", ".cancel", function (event) {
		event.preventDefault();

		$("#invoiceMessage").animate({
			"height" : "15px"
		}, 199, function () {
			$(this).find(".active").removeClass("active");
		});
	})
})
