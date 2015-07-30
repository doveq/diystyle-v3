
  var indswiper = new Swiper('.diyart-indswiper',{
    pagination: '.pagination',
    paginationClickable: true,
    mode: 'vertical',
    mousewheelControl : true,
    keyboardControl : true,
    onFirstInit: function(swiper){				//Swiper2.x的初始化是onFirstInit
	    swiperAnimateCache(swiper);			//隐藏动画元素 
	    swiperAnimate(swiper);				//初始化完成开始动画
	  }, 
	  onSlideChangeEnd: function(swiper){ 
	    swiperAnimate(swiper);				//每个slide切换结束时也运行当前slide动画
	  }
  })

  $('.ind-arrowdown').on('click', function(e){
    e.preventDefault()
    indswiper.swipeNext()
  })
  


$(function(){
	$('.indslide-two-product').find('li').click(function(){
		var index = $(this).index();
		$('.indslide-two-product').hide();
		$('.indslide-two-productinfo').eq(index).fadeIn('slow');
	});

	var indslideProductinfoTimeout;
	$('.indslide-two-productinfo').mouseleave(function(){
		indslideProductinfoTimeout = setTimeout(function(){
			$('.indslide-two-productinfo').hide();
			$('.indslide-two-product').fadeIn('slow');
		},1600);

	}).mouseenter(function(){
		clearTimeout(indslideProductinfoTimeout);
	});
	$('input').click(function(){
		window.location="custom.html";
	})
	
	/*var hi = new Vivus('artronlogo', {type: 'scenario-sync', duration: 100, start: 'autostart', dashGap: 200, forceRender: true},function () {
		if (window.console) {
			console.log('Animation finished. [log triggered from callback]');
		}
		$('#path2').attr('fill','#FFF');
	})*/

	var step= 0;
	var stepMove = function(){
		var leftVal = $(".stepLogo").position().left;
		if (leftVal <= 868){
			$(".stepLogo").animate({"left":leftVal+385+"px"},"swing");
			if ( step < 2 ) {
				$(".stepList li").eq(step+=1).animate({"opacity":"1"}).siblings().animate({"opacity":".45"});
			}
			else{
				$(".stepList li").animate({"opacity":".45"});
			}
		}
		else{
			step = -1;
			$(".stepLogo").css("left","-287px");
		}
	}
	setInterval(stepMove , 2000);
	
	
})

