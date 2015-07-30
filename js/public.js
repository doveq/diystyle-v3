/**
 * Created by llp on 2015/7/24.
 */

var PATH = "http://218.241.158.149/test";


/*异步请求 jquery*/
function ajaxPublic(param){
    var options = {
        "type" : "GET",
        "async" : false,
        "url" : "",
        "dataType" : "jsonp",
        "jsonpCallback" : "success_jsonpCallback",
        "timeout" : 5000,
        "?complete" : function (XMLHttpRequest, textStatus) {
            if (textStatus == "timeout") {
                //超时
            }
        },
        "success" : function (data) {}
    };

    var ajaxParam = $.extend(options, param),
        rn = new Date().getTime(),
        url = ajaxParam.url;

    if(url.indexOf("?") >= 0){
        url += "&rn=" + rn;
    } else {
        url += "?rn=" + rn;
    }

    ajaxParam.url = url;
    $.ajax(ajaxParam);
}

/*获取search数据*/
function getLocationSearchData(){
    var search = window.location.search.replace("?", ""),
        data = search.split("&"),
        searchJson = {};


    for(var i = 0, l = data.length; i < l; i++){
        var currData = data[i],
            keyValue = currData.split("=");
        searchJson[keyValue[0]]  = keyValue[1];
    }

    return searchJson;
}

jQuery.fn.placeholder = function(){
    var i = document.createElement('input'),
        placeholdersupport = 'placeholder' in i;
    if(!placeholdersupport){
        var inputs = jQuery(this);
        inputs.each(function(){
            var input = jQuery(this),
                text = input.attr('placeholder'),
                pdl = 0,
                height = input.outerHeight(),
                width = input.outerWidth(),
                placeholder = jQuery('<span class="phTips">'+text+'</span>');
            try{
                pdl = input.css('padding-left').match(/\d*/i)[0] * 1;
            }catch(e){
                pdl = 5;
            }
            placeholder.css({
                'margin-left': -(width-pdl),
                'height':height,
                'line-height':height+"px",
                'position':'absolute',
                'color': "#cecfc9",
                'font-size' : "16px"
            });
            placeholder.click(function(){
                input.focus();
            });
            if(input.val() != ""){
                placeholder.css({display:'none'});
            }else{
                placeholder.css({display:'inline'});
            }
            placeholder.insertAfter(input);
            input.keyup(function(e){
                if(jQuery(this).val() != ""){
                    placeholder.css({display:'none'});
                }else{
                    placeholder.css({display:'inline'});
                }
            });
        });
    }
    return this;
}

if(/msie/.test(navigator.userAgent.toLowerCase())){
    $("input[placeholder]").placeholder();
}

function setcookie(name,value){
    var Days = 30;
    var exp  = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}


function getcookie(name){
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null){
        return (arr[2]);
    }else{
        return "";
    }
}


