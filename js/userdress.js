$(function(){
	var edit = $('#edit'),
		del = $('#edit'),
		setdef = $('#setdef'),
		person = $('#person'),
		detdress = $('#detdress'),
		postcode = $('#postcode'),
		phone = $('#phone'),
		loc_province = $('#loc_province'),
		loc_city = $('#loc_city'),
		loc_town = $('#loc_town'),
		postCode = /^[0-9]{6}$/,
		phoneTest = /^1[3|4|5|8][0-9]\d{8}$/;
	//显示新增收货地址	
	$('#adddress').click(function(){
		$('.usercenter-dressadd').show();
	})

	//编辑收货地址
	edit.click(function(){

	})

	//删除收货地址
	del.click(function(){

	})

	//设为默认地址
	setdef.click(function(){

	})


	//添加收货地址
	$('.usercenter-dressbtn input').click(function(){
		if(person.val()) {
			$('#person-error').hide();
		} else {
			$('#person-error').text('收货人不能为空');
			$('#person-error').show();
		}
		if(loc_province.val()!='请选择' && loc_city.val()!='请选择' && loc_town.val()!='请选择') {
			$('#area-error').hide();
		} else {
			$('#area-error').text('请选择收货地址');
			$('#area-error').show();
		}
		if(detdress.val()) {
			$('#detdress-error').hide();
		} else {
			$('#detdress-error').text('详细地址不能为空');
			$('#detdress-error').show();
		} 
		if(postcode.val() && postCode.test(postcode.val())) {
			$('#postcode-error').hide();
		} else {
			$('#postcode-error').text('邮政编码不正确(6位数字)');
			$('#postcode-error').show();
		}
		if(phone.val() && phoneTest.test(phone.val())) {
			$('#phone-error').hide();
		} else {
			$('#phone-error').text('手机号码不正确');
			$('#phone-error').show();
		}
		if(person.val() && detdress.val() && postcode.val() && postCode.test(postcode.val()) && phone.val() && phoneTest.test(phone.val())) {
			console.log('收货人：'+person.val()+'\n收货地区：'+loc_province.val() + loc_city.val() + loc_town.val() +'\n详细地址：'+ detdress.val()+'\n邮政编码：'+postcode.val()+'\n手机：'+phone.val());
			var html = '<tr><td><address>'+loc_province.val()+loc_city.val()+loc_town.val()+detdress.val()+'<br>邮编：'+postcode.val() +'<br>姓名：'+person.val()+'<br>手机：'+phone.val()+'</address></td><td></td></tr>';
			$('#addressAdd').append(html);
			$('.usercenter-dressadd').hide();	
		}
		
	})
})
