/**
 * 购物车
 */
;(function ($) {
	$(function () {
		ajaxPublic({
			"data": {
				"userId" : 'eb00171c39394e78a227313f9a98e99c'
			},
			"url": PATH + '/cgycwx/cart/cartList', // 跨域URL
			"success" : function (data) {
				if(data.status == 0){
					var result = data.result,
						innerHTML = [];

					for(var i = 0, l = result.length; i < l; i++){
						innerHTML.push('<tr data-price="',result[i].price,'">');
						innerHTML.push('	<td width="60" align="center" valign="middle"><input type="checkbox"></td>');
						innerHTML.push('	<td width="201" align="center" valign="middle"><img src="',result[i].simg,'"></td>');
						innerHTML.push('	<td width="199" align="left" valign="middle">产品形式: ', result[i].gname,'<br/>尺寸: ',result[i].size,'厘米</td>');
						innerHTML.push('	<td width="223" align="center" valign="middle">￥ <span>',result[i].price,'</span></td>');
						innerHTML.push('	<td width="137" align="center" valign="middle">');
						innerHTML.push('		<input class="numminus" type="button" value="-" />');
						innerHTML.push('		<input class="numinput" maxlength="3" type="text" value="',result[i].total,'" />');
						innerHTML.push('		<input class="numadd" type="button" value="+" />');
						innerHTML.push('	</td>');
						innerHTML.push('	<td width="166" align="center" valign="middle"><strong>￥ <span class="sumCnt">',(result[i].price * result[i].total).toFixed(2),'</span></strong><br/><br><br/><span class="delete" style="cursor: pointer">删除</span></td>');
						innerHTML.push('</tr>');
					}

					$('#shopping').append(innerHTML.join(""));
					checkSelectAll();
					setTotalPrice();
				}
			}
		});

		function setTotalPrice(){
			var trEle = $("#shopping tr"),
				totalPrice = 0;

			for(var i = 1, l = trEle.length; i < l; i++){
				var currTr = trEle.eq(i);
				if(currTr.find(":checked").length){
					var goodsNum = currTr.find(".numinput").val() || 0,
						price = currTr.data("price") || 0;
					totalPrice += goodsNum*price;
				}
			}

			$("#sumCount").html(totalPrice.toFixed(2));
		}

		function checkSelectAll(){
			$("#selectAll").prop("checked", "checked");
			var checkboxEle = $("#shopping :checkbox");
			for(var i = 1, l = checkboxEle.length; i < l; i++){
				if(!checkboxEle.eq(i).is(":checked")){
					$("#selectAll").removeProp("checked");
					break;
				}
			}
		}

		$("#shopping").on("click", ":checkbox", function () {
			if(this.id == "selectAll"){
				if($(this).is(":checked")){
					$("#shopping :checkbox").prop("checked", "checked");
				} else {
					$("#shopping :checkbox").removeProp("checked");
				}
			} else {
				checkSelectAll();
			}
			setTotalPrice();
		}).on("click", ".delete", function () {
			if(confirm("您确定要将该商品移出购物车？")){
				$(this).closest("tr").remove();
				checkSelectAll();
				setTotalPrice();
			}
		}).on("click", ".numminus", function () {
			var trEle = $(this).closest("tr"),
				price = trEle.data("price"),
				goodsNum = parseInt(trEle.find(".numinput").val());

			if(goodsNum > 1){
				goodsNum--;
				trEle.find(".numinput").val(goodsNum);
				trEle.find(".sumCnt").html((price*goodsNum).toFixed(2));
			}

			if(trEle.find(":checkbox").is(":checked")){
				setTotalPrice();
			}
		}).on("click", ".numadd", function () {
			var trEle = $(this).closest("tr"),
				price = trEle.data("price"),
				goodsNum = parseInt(trEle.find(".numinput").val());

			goodsNum++;
			trEle.find(".numinput").val(goodsNum);
			trEle.find(".sumCnt").html((price*goodsNum).toFixed(2));

			if(trEle.find(":checkbox").is(":checked")){
				setTotalPrice();
			}
		}).on("blur", ".numinput", function(){
			var trEle = $(this).closest("tr"),
				price = trEle.data("price"),
				goodsNum = $(this).val();

			if(!/^[1-9]\d*$/.test(goodsNum)){
				goodsNum = 1;
				$(this).val(goodsNum);
			}

			trEle.find(".sumCnt").html((price*goodsNum).toFixed(2));

			if(trEle.find(":checkbox").is(":checked")){
				setTotalPrice();
			}
		}).on("keydown", ".numinput", function(event){
			var keyCode = event.keyCode || event.charCode;
			if(keyCode == 13){
				var trEle = $(this).closest("tr"),
					price = trEle.data("price"),
					goodsNum = $(this).val();

				if(!/^[1-9]\d+$/.test(goodsNum)){
					goodsNum = 1;
					$(this).val(goodsNum);
				}

				trEle.find(".sumCnt").html((price*goodsNum).toFixed(2));

				if(trEle.find(":checkbox").is(":checked")){
					setTotalPrice();
				}
			}
		})
	})
})(jQuery);
