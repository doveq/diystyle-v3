$(function(){
	var nickname = $('#nickname'),
		sexStatus = $('.user-row label'),
		year = $('.sel_year'),
		mouth = $('.sel_month'),
		day = $('.sel_day'),
		sexVal = $('input:radio:checked').val(),//性别
		xz = $('#xz').find("option:selected").text(),//星座
		loc_province = $('#loc_province'),//居住地省份
		loc_city = $('#loc_city'),//居住地地市
		loc_town = $('#loc_town'),//居住地区县
		home_province = $('#home_province'),//家乡省份
		home_city = $('#home_city'),//家乡地市
		home_town = $('#home_town');//家乡区县
	sexStatus.each(function(i,k){
		$(k).click(function(e){
            if(!($(k).hasClass('active'))){
                sexStatus.each(function(j,l){
                    if($(l).hasClass('active')){
                        $(l).removeClass('active');
                    }
                });
                $(k).addClass('active');
                sexVal = $(k).text() == '男' ? '1' : '0';
            }
        });
	});

	//保存
	$('.usercenter-personal-button input').click(function(){
		console.log('姓名：'+nickname.val()+
					'\n性别：'+sexVal+
					'\n生日：'+year.val()+'年'+mouth.val()+'月'+day.val()+'日'+
					'\n星座：'+xz+
					'\n居住地：'+loc_province.val()+loc_city.val()+loc_town.val()+
					'\n家乡：'+home_province.val()+home_city.val()+home_town.val());
	})
	
})
