$(function(){
	var currentpas = $('#currentpas'),
		newpsd = $('#newpsd'),
		renewpsd = $('#renewpsd');
	//保存
	$('.usercenter-dressbtn input').click(function(){
		if(currentpas.val()){
			$('#currentpas-error').hide();
		} else if(!currentpas.val()){
			$('#currentpas-error').text('密码不能为空');
			$('#currentpas-error').show();
		} else {
			$('#currentpas-error').text('密码不正确');
			$('#currentpas-error').show();
		}
		if(newpsd.val()){
			$('#newpsd-error').hide();
		} else {
			$('#newpsd-error').text('请输入新密码');
			$('#newpsd-error').show();
		}
		if(renewpsd.val() && renewpsd.val()==newpsd.val()){
			$('#renewpsd-error').hide();
		} else if(renewpsd.val()!='' && newpsd.val()!=renewpsd.val()) {
			$('#renewpsd-error').text('密码不一致');
			$('#renewpsd-error').show();
		} else {
			$('#renewpsd-error').text('确认密码不能为空');
			$('#renewpsd-error').show();
		}
	})
	
})

