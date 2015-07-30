/**
 * Created by llp on 2015/7/25.
 */

if(!DiyArt){
    var DiyArt = {};
}

(function ($, DiyArt) {
    DiyArt.Address = function (options) {
        this.addListContainer = options.addListContainer;
        this.addOrEditContainer = options.addOrEditContainer;
        this.addAddressBtn = options.addAddressBtn;
        this.addressListURL = options.addressListURL;
        this.addAddressURL = options.addAddressURL;
        this.editAddressURL = options.editAddressURL;
        this.setDefaultAddressURL = options.setDefaultAddressURL;
        this.deleteAddressURL = options.deleteAddressURL;

        this.addressListData;

        this._init();
    }

    DiyArt.Address.prototype._init = function () {
        this.getAddressListData();
        this._initList();
        this._initEvent();
    };

    /*获取地址列表数据*/
    DiyArt.Address.prototype.getAddressListData = function () {
        var _self = this;

        ajaxPublic({
            "data": {
                "userId" : getcookie("userId")
            },
            "url": _self.addressListURL,
            "success" : function (data) {
                if(data.status == 0){
                    _self.addressListData = data.result;
                } else {}
            }
        });
    };

    /*初始化地址列表*/
    DiyArt.Address.prototype._initList = function () {
        //var addressList = this.addressListData,
        var addressList = [{"id":1, "province":"北京", "city":"北京市","area":"东城","detdress":"detdress","phone":"13212341234","postcode":123321,"person":"1","isDefault":1},{"id":2, "province":"北京", "city":"北京市","area":"东城","detdress":"detdress","phone":"13212341234","postcode":123321,"person":"2",'isDefault':0},{"id":3, "province":"北京", "city":"北京市","area":"东城","detdress":"detdress","phone":"13212341234","postcode":123321,"person":"3","isDefault":0}],
            innerHTML = [];

        $(this.addListContainer).children(".user-row").remove();
        if(addressList.length){
            $(this.addOrEditContainer).hide();
            for(var i = 0, l = addressList.length; i < l;i++){
                var currAddress = addressList[i];

                innerHTML.push('<div class="user-row tr fix ', (currAddress.isDefault && "defAdd"),'" data-id="', currAddress.id,'">');
                innerHTML.push('    <div class="td">');
                innerHTML.push('        <address>', currAddress.province + currAddress.city + currAddress.area + currAddress.detdress,'　', currAddress.postcode,'<br>', currAddress.person,'　', currAddress.phone,'</address>');
                innerHTML.push('    </div>');
                innerHTML.push('    <div class="td toolBar">');
                innerHTML.push('<span class="edit">编辑</span>');
                innerHTML.push('<span class="delete">删除</span>');

                if(this.setDefaultAddressURL){
                    innerHTML.push('<span class="setDefault" ', (currAddress.isDefault ? 'style="display:none"' : ''),'>设为默认地址</span>');
                }

                innerHTML.push('    </div>');
                innerHTML.push('</div>');
            }

            $(this.addListContainer).append(innerHTML.join(""))
        } else {
            $(this.addOrEditContainer).show();
            this.initAddressDialog();
        }
    };

    DiyArt.Address.prototype._initEvent = function () {
        this._setAddAddressEvent();
        this._initAddressListEvent();
        this._initAddOrEditAddressEvent();
    };

    DiyArt.Address.prototype.initAddressDialog = function (container, data) {
        $(this.addAddressBtn).addClass("showed");
        if(typeof data == "undefined"){
            $(this.addOrEditContainer).find('input[type="text"]').val("");
            $(this.addOrEditContainer).find(".error").hide();
            $(this.addOrEditContainer).find(".shippingAddress").related({
                S1:".province",
                S2:".city",
                S3:".area"
            });
        } else {
            container.find(".error").hide();

            container.find('#person').val(data.person);
            container.find('#detdress').val(data.detdress);
            container.find('#postcode').val(data.postcode);
            container.find('#phone').val(data.phone);

            container.find(".shippingAddress").related({
                S1:".province",
                S2:".city",
                S3:".area",
                S1Text:data.province,
                S2Text:data.city,
                S3Text:data.area
            });
        }
    };

    /*新增地址ַ*/
    DiyArt.Address.prototype._setAddAddressEvent = function () {
        var _self = this;
        
        $(_self.addAddressBtn).on("click", function () {
            if($(this).hasClass("showed")){
                return false;
            }
           $( _self.addListContainer).prepend($(_self.addOrEditContainer));
            $(_self.addOrEditContainer).slideDown(399);
            _self.initAddressDialog();
        })
    };

    /*地址列表事件*/
    DiyArt.Address.prototype._initAddressListEvent = function () {
        var _self = this;

        $(_self.addListContainer).on("mouseenter", ".user-row", function () {
            if($(_self.addAddressBtn).hasClass("showed")){
                return false;
            }
            $(this).children(".toolBar").show();
        }).on("mouseleave", ".user-row", function () {
            $(this).children(".toolBar").hide();
        }).on("click", ".user-row", function () {
            if($(_self.addAddressBtn).hasClass("showed")){
                return false;
            }

            if(!_self.setDefaultAddressURL){
                $(this).addClass("defAdd").siblings(".defAdd").removeClass("defAdd");
            }
        })
        
        $(_self.addListContainer).on("click", ".edit", function (event) {
            event.stopPropagation();
            if($(_self.addAddressBtn).hasClass("showed")){
                return false;
            }

            var addressRow = $(this).closest(".user-row"),
                id = addressRow.data("id");

            /*var currAddress = {"id":1, "province":"北京", "city":"北京市","area":"东城","detdress":"detdress","phone":"13212341234","postcode":123321,"person":"1","isDefault":1};
            _self.setEditAddressDialog(addressRow, currAddress);
            return;*/
            ajaxPublic({
                "data": {
                    "addressId" : id
                },
                "url": _self.editAddressURL,
                "success" : function (data) {
                    if(data.status == 0){
                        var currAddress = data.result;
                        _self.setEditAddressDialog(addressRow, currAddress);
                    } else {}
                }
            });
        }).on("click", ".delete", function (event) {
            event.stopPropagation();
            if($(_self.addAddressBtn).hasClass("showed")){
                return false;
            }

            if(confirm("您确定要删除该地址么？")){
                var addressRow = $(this).closest(".user-row"),
                    id = addressRow.data("id");

                ajaxPublic({
                    "data": {
                        "addressId" : id
                    },
                    "url": _self.deleteAddressURL,
                    "success" : function (data) {
                        if(data.status == 0){
                            _self.getAddressListData();
                            _self._initList();
                        } else {}
                    }
                });
            }
        }).on("click", ".setDefault", function (event) {
            event.stopPropagation();
            if($(_self.addAddressBtn).hasClass("showed")){
                return false;
            }

            var addressRow = $(this).closest(".user-row"),
                id = addressRow.data("id");

            ajaxPublic({
                "data": {
                    "addressId" : id
                },
                "url": _self.setDefaultAddressURL,
                "success" : function (data) {
                    if(data.status == 0){
                        addressRow.addClass("defAdd").find(".setDefault").hide();
                        addressRow.siblings(".defAdd").removeClass("defAdd").find(".setDefault").show();
                    } else {}
                }
            });
        })
    };

    DiyArt.Address.prototype.setEditAddressDialog = function (element,data) {
        var innerHTML = $(this.addOrEditContainer).html(),
            initHeight = $(element).outerHeight(true);

        $(element).html(innerHTML).addClass("usercenter-dressadd");

        var endHeight = $(element).outerHeight();

        $(element).css("height", initHeight + "px").animate({
            "height" : endHeight - 20 + 'px'
        }, 399);

        this.initAddressDialog(element, data);
    };

    /*新增、修改地址ַ*/
    DiyArt.Address.prototype._initAddOrEditAddressEvent = function () {
        var _self = this,
            postReg = /^\d{6}$/,
            phoneReg = /^1[3|4|5|7|8]\d{9}$/;

        $(_self.addOrEditContainer + "," + _self.addListContainer).on("click", ".submitBtn", function () {
            var container = $(this).closest('.usercenter-dressadd'),
                person = container.find(".person").val(),
                province = container.find(".province").val(),
                city = container.find(".city").val(),
                area = container.find(".area").val(),
                detdress = container.find(".detdress").val(),
                postcode = container.find(".postcode").val(),
                phone = container.find(".phone").val();

            if(person == ""){
                container.find(".person").siblings("error").show().html("收货人不能为空");
            } else {
                container.find(".person").siblings("error").hide().html("");
            }
            if(province == "请选择" || city == "请选择" || area == "请选择"){
                container.find(".shippingAddress").children("error").show().html("请选择收货地址");
            } else {
                container.find(".shippingAddress").children("error").hide().html("");
            }
            if(detdress == ""){
                container.find(".detdress").siblings("error").show().html("详细地址不能为空");
            } else {
                container.find(".detdress").siblings("error").hide().html("");
            }
            if(postcode == "" || postReg.test(postcode)){
                container.find(".postcode").siblings("error").show().html("邮政编码不正确(6位数字)");
            } else {
                container.find(".postcode").siblings("error").hide().html("");
            }
            if(phone == "" || phoneReg.test(phone)){
                container.find(".phone").siblings("error").show().html("手机号码不正确");
            } else {
                container.find(".phone").siblings("error").hide().html("");
            }

            if(!container.find(".error:visible").length){
                if(container.data("id")){
                    /*修改地址请求*/
                } else {
                    /*新增地址请求*/
                }
            }
        }).on("click", ".cancelBtn", function (event) {
            event.preventDefault();

            var container = $(this).closest('.usercenter-dressadd');
            $(_self.addAddressBtn).removeClass("showed");

            if(container.data("id")){
                _self._initList();
            } else {
                container.hide();
            }
        })
    };
})(jQuery, DiyArt);