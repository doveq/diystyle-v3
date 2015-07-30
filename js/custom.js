/*获取值对应数组下标*/
Array.prototype.getIndex = function (items) {
	var index = -1;
	if(typeof items != "undefined"){
		for(var i = 0, l = this.length; i < l ; i++){
			if(this[i] == items){
				index = i;
				break;
			}
		}
	}
	return index;
}

if(!DiyArt){
	var DiyArt = {};
}

;(function ($, DiyArt) {
	var ajaxPublic = window.ajaxPublic;

	DiyArt.Custom = function (options) {
		this.leftContainer = options.leftContainer;
		this.rightContainer = options.rightContainer;
		this.imageListURL = options.imageListURL;/*图片列表请求地址*/
		this.frameListURL = options.frameListURL;/*画框列表请求地址*/
		this.deleteImageURL = options.deleteImageURL;/*删除图片请求地址*/
		this.currImageURL = options.currImageURL;/*当前图片请求地址*/
		this.fileUploadURL = options.fileUploadURL;/*图片上传地址*/
		this.cutImageURL = options.cutImageURL;/*剪切图片地址*/
		this.joinShoppingURL = options.joinShoppingURL;/*加入购物车地址*/
		this.fileUploadEle = options.fileUploadEle;
		this.caizhiDialog = options.caizhiDialog;
		this.userId = options.userId;

		this.customImageListData;
		this.customFrameListData;
		this.currImageData;
		this._init();
	}

	DiyArt.Custom.prototype._init = function () {
		this._initList();

		if(this.frameListURL){
			this._initFrameList();
		}

		this._initAddImageEvent();
		this.initImageListEvent();
		this.initOtherListEvent();
		this.initPageEvent();
		this.initRightEvent();
		this.initCaizhiDialogEvent();
		this.initLeftImageEvent();
	};

	/*初始化图片列表*/
	DiyArt.Custom.prototype._initList = function () {
		var _self = this;
		ajaxPublic({
			"data": {
				"userid" : _self.userId
			},
			"url": _self.imageListURL,
			"success" : function (data) {
				if(data.status == 0){
					_self.customImageListData = data.result;
					_self.customRightList($(_self.rightContainer).find("#framePicList"),1);
				}
			}
		});
	};

	/*初始化画框列表*/
	DiyArt.Custom.prototype._initFrameList = function () {
		var _self = this;
		ajaxPublic({
			"url": _self.frameListURL,
			"success" : function (data) {
				if(data.status == 0){
					_self.customFrameListData = data.result;
					_self.customRightList($(_self.rightContainer).find("#frameList"),1);
				}
			}
		});
	};

	DiyArt.Custom.prototype.customRightList = function (content, page) {
		page = page || 1;

		var listContainer = content.children(".custom-area-maplist"),
			innerHTML = [],
			customImageListData;

		if(content.attr("id") == "framePicList"){
			customImageListData = this.customImageListData;
			if(page == 1 && content.attr("id") == "framePicList"){
				innerHTML.push('<li class="add"><img src="images/upimages.jpg"></li>');
			}

			for(var i = ((page-1)?(9*(page-1)-1):0), l = customImageListData.length; i < l && i < (page?(9*page-1):0); i++){
				innerHTML.push('<li data-id="',customImageListData[i].imageid,'" data-index="',i,'" data-width="',customImageListData[i].width,'" data-height="',customImageListData[i].height,'"><img src="',customImageListData[i].smallimg,'"><i class="check"></i><i class="close"></i></li>');
			}
		} else if(content.attr("id") == "frameList"){
			customImageListData = this.customFrameListData;
			for(var i = 9*(page-1), l = customImageListData.length; i < l && i < 9*page; i++){
				innerHTML.push('<li data-id="',customImageListData[i].code,'" data-index="',i,'"><img src="',customImageListData[i].img,'"><i class="check"></i></li>');
			}
		}

		listContainer.html(innerHTML.join(""));

		var pageContainer = content.children(".custom-area-page");

		pageContainer.find(".current_page").html(page);
		pageContainer.find(".total").html(Math.ceil((customImageListData.length-8)/9)+1);
		pageContainer.find(".custom-area-page-input").val(page);
	};

	DiyArt.Custom.prototype._initAddImageEvent = function () {
		var _self = this;
		$(_self.fileUploadEle).fileupload({
			url:_self.fileUploadURL,//文件上传地址，当然也可以直接写在input的data-url属性内
			formData:{
				userid:_self.userId,
				"simgsize":"54"
			},//如果需要额外添加参数可以在这里添加
			done:function(e,result){
				//done方法就是上传完毕的回调函数，其他回调函数可以自行查看api
				//注意result要和jquery的ajax的data参数区分，这个对象包含了整个请求信息
				//返回的数据在result.result中，假设我们服务器返回了一个json对象
				var data = result.result;
				if(data.status == 0){    // 成功
					var obj = {};
					obj.imageid = data.result.imgid;
					obj.smallimg = data.result.surl;
					obj.width = data.result.width;
					obj.height = data.result.height;
					_self.customImageListData.unshift(obj);
					_self.customRightList($(_self.rightContainer).find("#framePicList"), 1);
				}else{
					alert(data.msg);
				}
			}
		});

		$("#beginUpload").on("click", function () {
			$("#fileupload_input").trigger("click");
		})
	};

	DiyArt.Custom.prototype.initImageListEvent = function () {
		var _self = this,
			listContainer = $(this.rightContainer).find("#framePicList > .custom-area-maplist");

		/*选择当前图片*/
		listContainer.on("click", "li", function () {
			if($(this).hasClass("add")){
				$("#fileupload_input").trigger("click");
			} else if($(this).hasClass("active")){
				return false;
			} else {
				$(this).addClass("active").siblings().removeClass("active");

				var imageId = $(this).data("id"),
					imageWidth = $(this).data("width"),
					imageHeight = $(this).data("height"),
					maxNum;

				if(imageWidth/imageHeight > 4/3){
					maxNum = Math.ceil(300*imageWidth/imageHeight);
				} else {
					maxNum = Math.ceil(400*imageHeight/imageWidth);
				}

				ajaxPublic({
					"data": {
						"userid" : _self.userId,
						"imgid" : imageId,
						"midsize" : maxNum
					},
					"url": _self.currImageURL,
					"success" : function (data) {
						if(data.status == 0){
							if(data.result.prtSize.length){
								_self.initCurrentPic(data.result);
								_self.currImageData = data.result;
							} else {
								alert("图片尺寸太小，传张大点的呗");
							}
						}
					}
				});
			}
		}).on("mouseenter", "li", function () {
			$(this).children(".close").show();
		}).on("mouseleave", "li", function () {
			$(this).children(".close").hide();
		}).on("click", ".close", function (event) {
			event.stopPropagation();
			var content = $(this).closest("div"),
				index = $(this).parent().data("index"),
				imageId = $(this).parent().data("id"),
				currPage = content.find(".custom-area-page-input").val();

			ajaxPublic({
				"data": {
					"userid" : _self.userId,
					"imageid" : imageId
				},
				"url": _self.deleteImageURL,
				"success" : function (data) {
					if(data.status == 0){
						_self.customImageListData.splice(index, 1);
						_self.customRightList(content, currPage);
					}
				}
			});
		})
	};

	/*其他list事件*/
	DiyArt.Custom.prototype.initOtherListEvent = function () {
		var _self = this,
			listContainer = $(_self.rightContainer).find("#frameList > .custom-area-maplist");

		/*选择当前图片*/
		listContainer.on("click", "li", function () {
			if(!$(this).hasClass("active")){
				$(this).addClass("active").siblings().removeClass("active");

				var code = $(this).data("id"),
					currObj = _self.customFrameListData[$(this).data("index")].detail;

				$(_self.rightContainer).find(".textureDetail").data("code", code);
				_self.initCaizhiMessage(currObj);
			}
		});
	};

	/*设置材质详细信息*/
	DiyArt.Custom.prototype.initCaizhiMessage = function (data) {
		var ulEle = $(this.caizhiDialog).find("ul"),
			innerHTML = [];

		$(this.caizhiDialog).find(".currCaizhiimg").attr(data.fImg);
		innerHTML.push('<li><img src="',data.fImg,'" /></li>');
		innerHTML.push('<li><img src="',data.cImg,'" /></li>');
		innerHTML.push('<li><img src="',data.pImg,'" /></li>');

		ulEle.html(innerHTML.join(""));

	};

	/*初始化当前图片信息*/
	DiyArt.Custom.prototype.initCurrentPic = function (data) {
		this.setRight(data);
		this.setLeft(data);
	};

	/*查找最近尺寸index*/
	DiyArt.Custom.prototype.getNearestSelect = function (data, imgRatio) {
		var diffValue = 10,
			currIndex = 0;
		for(var i = 0, l = data.length; i < l; i++){
			if(diffValue > Math.abs(data[i].ratio - imgRatio)){
				diffValue = Math.abs(data[i].ratio - imgRatio);
				currIndex = i;
			}
		}
		return currIndex;
	}

	/*设置最近尺寸*/
	DiyArt.Custom.prototype.setPrtSize = function(data){
		var selectEle = $(this.rightContainer).find("#selchange"),
			innerHTML = [];
		if(typeof data != "object"){
			var prtSizeData = this.currImageData.prtSize,
				currIndex = this.getNearestSelect(prtSizeData, data);
		} else {
			var prtSizeData = data.prtSize,
				currIndex = this.getNearestSelect(prtSizeData, data.width/data.height);

			for(var i = 0, l = prtSizeData.length; i < l; i++){
				innerHTML.push('<option ', (i == currIndex ? 'selected="selected"' : ""),' value="', prtSizeData[i].sizeCode,'" data-ratio="', prtSizeData[i].ratio,'" data-price="', prtSizeData[i].price,'">', prtSizeData[i].prdDimension,'</option>');
			}

			selectEle.html(innerHTML.join(""));
		}

		$(this.rightContainer).find(".custom-area-tit .price").html(prtSizeData[currIndex].price);
		$(this.rightContainer).find(".custom-area-size .size").html(prtSizeData[currIndex].prdDimension);
	};

	DiyArt.Custom.prototype.setRight = function (data) {
		var rightContainer = $(this.rightContainer);
		if(typeof data == "object"){
			this.setPrtSize(data);
			rightContainer.find(".joinShopping").data("imgid", data.imgid);
		} else {
			this.setPrtSize(data);
		}
	};

	DiyArt.Custom.prototype.initRightEvent = function () {
		var _self = this,
			rightContainer = $(_self.rightContainer);

		rightContainer.on("click", ".textureDetail", function (event) {
			event.preventDefault();

			if($(this).data("code")){
				$(_self.caizhiDialog).fadeIn(199);
			}
		});

		rightContainer.on("change", "#selchange", function () {
			var value = $(this).children(":selected").data("ratio");
			_self.setRight(value);
			_self.setLeft(value);
		});

		/*加入购物车*/
		rightContainer.on("click", ".joinShopping", function (event) {
			event.preventDefault();

			var imgId = $(this).data("imgid"),
				caizhiCode = rightContainer.find(".textureDetail").data("code");

			if(!_self.customImageListData.length){
				alert("请上传图片");
			} else if(!imgId){
				alert("请选择图片")
			} else if(!caizhiCode){
				alert("请选择画框");
			} else {
				var imgEle = $(_self.leftContainer).find(".cropit-image-preview > img"),
					left = parseFloat(imgEle.css("left")),
					top = parseFloat(imgEle.css("top")),
					width = parseFloat(imgEle.css("width")),
					height = parseFloat(imgEle.css("height")),
					sizeScale = imgEle.data("sizescale");

				if(sizeScale == width/height){
					var img = '[{"imgid":"' + imgId + '","size":"'+ $("#selchange").val() +'","caizi":"'+ caizhiCode +'","isface":"0"}]';

					ajaxPublic({
						"data": {
							"userid": _self.userId,
							"img": img,
							"mbid" : "",
							"facedetail":"1",
							"feiye_title":"1",
							"feiye_liuming":"1",
							"feiye_detail":"",
							"pid": "1"
						},
						"url": _self.joinShoppingURL,
						"success": function (data) {
							if (data.status == 0) {

							}
						}
					});
				} else {
					ajaxPublic({
						"data" : {
							"imgid" : imgId,
							"maxside" : Math.max(width, height),
							"locate": Math.abs(left) + "," + Math.abs(top) + ";" + (Math.abs(left) + width) + "," + (Math.abs(top) + height),
							"midsize" : 100,
							"smallsize" : 100
						},
						"url" : _self.cutImageURL,
						"success" : function (data) {
							if(data.status == 0){
								var img = '[{"imgid":"' + data.result.imgid + '","size":"'+ $("#selchange").val() +'","caizi":"'+ caizhiCode +'","isface":"0"}]';

								ajaxPublic({
									"data": {
										"userid": _self.userId,
										"img": img,
										"mbid" : "",
										"facedetail":"1",
										"feiye_title":"1",
										"feiye_liuming":"1",
										"feiye_detail":"",
										"pid": "1"
									},
									"url": _self.joinShoppingURL,
									"success": function (data) {
										if (data.status == 0) {

										}
									}
								});
							}
						}
					});
				}
			}
		});

		/*标签切换*/
		rightContainer.on("click", ".custom-area-maplist-select > a", function (event) {
			event.preventDefault();

			if($(this).hasClass("active")){
				return false;
			}
			$(this).addClass("active").siblings(".active").removeClass("active");

			var type = $(this).data("type");

			if(type == "frame"){
				/*画框*/
				rightContainer.find("#frameList").show();
				rightContainer.find("#framePicList").hide();
			} else {
				rightContainer.find("#frameList").hide();
				rightContainer.find("#framePicList").show();
			}
		});
	};

	DiyArt.Custom.prototype.setLeft = function (data) {
		var imgContainer = $(this.leftContainer).find(".cropit-image-preview");
		if(typeof data == "object"){
			var currIndex = this.getNearestSelect(data.prtSize, data.width/data.height),
				sizeScale = data.prtSize[currIndex].ratio;

			if(!imgContainer.children("img").length){
				imgContainer.html('<img src="'+ data.midimg+'" style="position:absolute;" ondragstart="return false;" />');
			}
			imgContainer.children("img").attr("src", data.midimg).data("imgscale", data.width/data.height);
		} else {
			var prtSizeData = this.currImageData.prtSize,
				currIndex = this.getNearestSelect(prtSizeData, data),
				sizeScale = prtSizeData[currIndex].ratio;
		}

		var imgScale = imgContainer.children("img").data("imgscale"),
			endWidth, endHeight;

		if(sizeScale > 4/3){
			imgContainer.css({
				"width" : "400px",
				"height" : 400/sizeScale + "px"
			});

			if(sizeScale > imgScale){
				endWidth = 400;
				endHeight = 400/imgScale;
			} else {
				endWidth = 300*imgScale;
				endHeight = 300;
			}
			imgContainer.children("img").data("sizescale", sizeScale).css({
				"left" : 0,
				"top" : 0,
				"width" : endWidth + "px",
				"height" : endHeight + 'px'
			});

			$(this.leftContainer).css({
				"left" : 0,
				"top" : (300 - 400/sizeScale)/2 + "px",
				"width" : "600px",
				"height" : (400/sizeScale + 200) + 'px'
			});
		} else if(sizeScale < 4/3) {
			imgContainer.css({
				"width" : 300*sizeScale + "px",
				"height" : "300px"
			});

			if(sizeScale > imgScale){
				endWidth = 400;
				endHeight = 400/imgScale;
			} else {
				endWidth = 300*imgScale;
				endHeight = 300;
			}

			imgContainer.children("img").data("sizescale", sizeScale).attr("src", data.midimg).css({
				"left" : 0,
				"top" : 0,
				"width" : endWidth + "px",
				"height" : endHeight + 'px'
			});

			$(this.leftContainer).css({
				"left" : (400 - 300*sizeScale)/2 + "px",
				"top" : "0px",
				"width" : (300*sizeScale + 200) + "px",
				"height" : '500px'
			});
		} else {
			imgContainer.css({
				"width" : "400px",
				"height" : "300px"
			});

			imgContainer.children("img").data("sizescale", sizeScale).css({
				"left" : 0,
				"top" : 0,
				"width" : "400px",
				"height" : '300px'
			});

			$(this.leftContainer).css({
				"left" : 0,
				"top" : "0px",
				"width" : "600px",
				"height" : '500px'
			});
		}
	};

	/*左侧大图事件*/
	DiyArt.Custom.prototype.initLeftImageEvent = function () {
		var _self = this,
			currImageContent = $(_self.leftContainer).find(".cropit-image-preview"),
			initLeft, initTop, initX, initY,direction,imageWidth,imageHeight,parentWidth,parentHeight;

		function mousemoveFunc(event){
			var changeX = (event.pageX || event.clientX) - initX,
				changeY = (event.pageY || event.clientY) - initY,
				endX = 0, endY = 0;

			if(direction == "x"){
				endX = initLeft + changeX;
			} else if(direction == "y"){
				endY = initTop + changeY;
			} else if(direction == "none"){
				endX = endY = 0;
			}

			currImageContent.children("img").css({
				"left" : endX + "px",
				"top" : endY + "px"
			});
		}

		function mouseupFunc(){
			var left = parseFloat(currImageContent.children("img").css("left")),
				top = parseFloat(currImageContent.children("img").css("top")),
				endX = left,
				endY = top;

			if(left > 0){
				endX = 0;
			} else if(left + imageWidth < parentWidth){
				endX = parentWidth - imageWidth;
			}

			if(top > 0){
				endY = 0;
			} else if(top + imageHeight < parentHeight){
				endY = parentHeight - imageHeight;
			}

			currImageContent.children("img").animate({
				"left" : endX + "px",
				"top" : endY + "px"
			}, 199);

			initLeft = initTop = initX = initY = direction = null;
			$(document).off("mousemove", mousemoveFunc).off("mouseup", mouseupFunc);
		}

		currImageContent.on("mousedown", "img", function (event) {
			initLeft = parseFloat($(this).css("left"));
			initTop = parseFloat($(this).css("top"));
			initX = event.pageX || event.clientX;
			initY = event.pageY || event.clientY;
			imageWidth = $(this).outerWidth();
			imageHeight = $(this).outerHeight();
			parentWidth = $(this).parent().outerWidth();
			parentHeight = $(this).parent().outerHeight();

			var imgScale = $(this).data("imgscale"),
				sizeScale = $(this).data("sizescale");

			if(sizeScale - imgScale < 0){
				direction = "x";
			} else if(sizeScale - imgScale > 0){
				direction = "y";
			} else {
				direction = "none";
			}

			$(document).on("mousemove", mousemoveFunc).on("mouseup", mouseupFunc);
		})
	};

	/*页签切换*/
	DiyArt.Custom.prototype.initPageEvent = function () {
		var _self = this,
			pageContainer = $(this.rightContainer).find(".custom-area-page");
		pageContainer.on("click", ".custom-area-page-left", function () {
			var pageEle = $(this).closest(".custom-area-page").parent(),
				currPage = pageEle.find(".current_page").html();

			if(currPage > 1){
				_self.customRightList(pageEle,--currPage);
			}
		}).on("click", ".custom-area-page-right", function () {
			var pageEle = $(this).closest(".custom-area-page").parent(),
				currPage = pageEle.find(".current_page").html(),
				totalPage = pageEle.find(".total").html();

			if(currPage - totalPage < 0){
				_self.customRightList(pageEle, ++currPage);
			}
		}).on("keydown", ".custom-area-page-input", function (event) {
			var keyCode = event.keyCode || event.charCode;

			if(keyCode == 13){
				var pageEle = $(this).closest(".custom-area-page").parent(),
					currPage = $(this).val(),
					totalPage = pageEle.find(".total").html();

				if(!/^[1-9]\d*$/.test(currPage) || currPage <= 0){
					_self.customRightList(pageEle, 1);
				} else if(currPage - totalPage >= 0){
					_self.customRightList(pageEle, totalPage);
				}
			}
		}).on("blur", ".custom-area-page-input", function () {
			var pageEle = $(this).closest(".custom-area-page").parent(),
				currPage = $(this).val(),
				totalPage = pageEle.find(".total").html();

			if(!/^[1-9]\d*$/.test(currPage) || currPage <= 0){
				_self.customRightList(pageEle, 1);
			} else if(currPage - totalPage >= 0){
				_self.customRightList(pageEle, totalPage);
			}
		});
	}

	/*材质弹层事件*/
	DiyArt.Custom.prototype.initCaizhiDialogEvent = function () {
		var _self = this;

		$(_self.caizhiDialog).on("click", ".close", function () {
			$(_self.caizhiDialog).fadeOut(199);
		}).on("click", "li", function () {
			var imgSrc = $(this).children("img").attr("src");

			$(_self.caizhiDialog).find(".currCaizhiimg").attr("src", imgSrc);
		});
	}
})(jQuery, DiyArt);

$(function () {
	var custom = new DiyArt.Custom({
		'leftContainer' : $("#customKH"),
		'rightContainer' : $('.custom-container-right'),
		"frameListURL" : PATH + "/diyinterface/query/getImageFrame",
		"fileUploadURL" : PATH + "/diyinterface/uploadimage",
		"fileUploadEle" : $("#fileupload_input"),
		"imageListURL" : PATH + "/diyinterface/query/userImageList",
		"deleteImageURL" : PATH + "/diyinterface/del/userimage",
		"currImageURL" : PATH + "/diyinterface/query/getImageProduct",
		"cutImageURL" : PATH + "/diyinterface/add/createImageCut",
		"joinShoppingURL" : PATH + "/diyinterface/add/createCart",
		"caizhiDialog" : "#caizhiDialog",
		"userId" : "654321"
	});
})
