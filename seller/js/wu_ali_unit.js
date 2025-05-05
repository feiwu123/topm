//动态生成销售属性
jQuery.multialiUnit = function(divselectid, data) {
	var options = data.options.option;
	var name = data["@attributes"]["name"];
	var id = data["@attributes"]["priceUnit"];
	var type = data["@attributes"]["singleCheck"];
	var patterList = "";
	
    if (!Array.isArray(options)) {
		options = new Array(options); 	
	}
	if (Array.isArray(options)) {
		options.forEach((fieldItem) => {
			var displayName = fieldItem['@attributes']['displayName'];
			var displayValue = fieldItem['@attributes']['value'];
			patterList += `<li>
							<input type="radio" name="radio_${id}"  id="radio_${displayValue}" value="${displayName}" />
							<label for="radio_${displayValue}">${displayName}</label>
						</li>`;
		
		})
	}
	$(divselectid).find(".title").html(name+`<span class="red">*</span>`);
	$(divselectid).find(".attrVal_dropList ul").html(patterList);
	$(divselectid).find(".attrVal_dropList ul").perfectScrollbar("destroy");
	$(divselectid).find(".attrVal_dropList ul").perfectScrollbar();
	selectAttenUnitEvent(divselectid,1);
}
jQuery.multialiLadderPrice = function(divselectid, data) {
	createLadderTableHeader();
	var fields = data.fields.field;
	var tl1 = `<div class="tableRow tableTr">
					<div class="colspan">
						≥<input class="min_num" />
					</div>
					<div class="colspan">
						<div class="min_per_price">
							<div class="perPrice">
								<span class="money_name">美元&nbsp;&nbsp;</span><span class="money_unit">$</span><input class="per_price" />
							</div>
							<div class="delete_stock_line">
								删除
							</div>
						</div>
					</div>
					<div class="colspan prevewer">
						<span class="showNum">≥ 1</span>
						<span class="showMoney">222美元</span>
					</div>
				</div>`;
				
	$(divselectid).on("click",".confirmSaleAttr",function(){
		var tableRowNum = $(divselectid).find(".tableTr").length;
		if(tableRowNum==4){
			return false;
		}else{
			$(divselectid).find(".tableDate").append(tl1);	
		}
	})
	$(divselectid).on("click",".delete_stock_line",function(){
		$(this).parents(".tableTr").remove();
	})
	$(divselectid).on("blur",".min_num",function(){
		showLaderPrice(this);
	})
	$(divselectid).on("blur",".per_price",function(){
		showLaderPrice(this);
	})
}

jQuery.multialiLadderPeriod = function(divselectid, data) {
	var fields = data.fields.field;
	var tl1 = `<div class="tableRow tableTr">
				<div class="colspan">
					≥<input class="min_num">
				</div>
				<div class="colspan">
					<div class="min_per_price">
						<div class="perPrice">
							<input class="per_price">
						</div>
						<div class="delete_stock_line">
							删除
						</div>
					</div>
				</div>
				<div class="colspan prevewer">
					<span class="showNum"></span>
					<span class="showMoney"></span>
				</div>
			</div>`;
				
	$(divselectid).on("click",".confirmSaleAttr",function(){
		var tableRowNum = $(divselectid).find(".tableTr").length;
		if(tableRowNum==3){
			return false;
		}else{
			$(divselectid).find(".tableDate").append(tl1);	
		}
	})
	$(divselectid).on("click",".delete_stock_line",function(){
		$(this).parents(".tableTr").remove();
	})
	$(divselectid).on("blur",".min_num",function(){
		showLaderDay(this);
	})
	$(divselectid).on("blur",".per_price",function(){
		showLaderDay(this);
	})
}

function showLaderDay(t){
	var that = t;
	var minNum = $(that).parents(".tableTr").find(".min_num").val();
	var perPrice = $(that).parents(".tableTr").find(".per_price").val();
	if(minNum==""){
		$(that).parents(".tableTr").find(".min_num").addClass("red-border");
		$("#ladderPeriod").find(".error_tip").html("数量必须填");
		return;
	}else{
		if(minNum<1 || minNum>999999999){
			$(that).parents(".tableTr").find(".minNum").addClass("red-border");
			$("#ladderPeriod").find(".error_tip").html("输入必须大于1小于999999999");
			return ;
		}else{
			$(that).parents(".tableTr").find(".per_price").removeClass("red-border");
		}
		$(that).parents(".tableTr").find(".min_num").removeClass("red-border");
	}
	if(perPrice==""){
		$(that).parents(".tableTr").find(".per_price").addClass("red-border");
		return;
	}else{
		if(perPrice<1 || perPrice>999999999){
			$(that).parents(".tableTr").find(".per_price").addClass("red-border");
			$("#ladderPeriod").find(".error_tip").html("输入必须大于1小于999999999");
			return ;
		}else{
			$(that).parents(".tableTr").find(".per_price").removeClass("red-border");
		}
	}
	$(that).parents(".tableTr").find(".prevewer .showNum").html("≥ "+minNum);
	$(that).parents(".tableTr").find(".prevewer .showMoney").html(perPrice+"天");
}

function showLaderPrice(t){
	var that = t;
	var minNum = $(that).parents(".tableTr").find(".min_num").val();
	var perPrice = $(that).parents(".tableTr").find(".per_price").val();
	if(minNum==""){
		$(that).parents(".tableTr").find(".min_num").addClass("red-border");
		$("#ladderPeriod").find(".error_tip").html("数量必须填");
	}else{
		$(that).parents(".tableTr").find(".min_num").removeClass("red-border");
	}
	if(perPrice==""){
		$(that).parents(".tableTr").find(".per_price").addClass("red-border");
		return;
	}else{
		if(perPrice<0.01 || perPrice>9999999.99){
			$(that).parents(".tableTr").find(".per_price").addClass("red-border");
			$("#ladderPrice").find(".error_tip").html("单价必须大于0.01小于9999999.99");
			return ;
		}else{
			$(that).parents(".tableTr").find(".per_price").removeClass("red-border");
		}
	}
	$(that).parents(".tableTr").find(".prevewer .showNum").html("≥ "+minNum);
	$(that).parents(".tableTr").find(".prevewer .showMoney").html(perPrice+"美元");
}

function createLadderTableHeader(){
	var unit = $("#priceUnit").find(".sale_attr_select .attr_select_val").html();
	var tl1 = `<div class="tableRow tableHead">
				<div class="colspan">最小起订量（${unit}）<span class="red">*</span></div>
				<div class="colspan">单件价格（${unit}）<span class="red">*</span></div>
				<div class="colspan">预览(Unit:${unit})</div>
			</div>`;
	if(unit){
		$("#ladderPrice").find(".tableHead").replaceWith(tl1);	
	}		
}
// function createShippingTableHeader(){
// 	var tl1 = `<div class="tableRow tableHead">
// 				<div class="colspan">最小起订量（${unit}）<span class="red">*</span></div>
// 				<div class="colspan">单件价格（${unit}）<span class="red">*</span></div>
// 				<div class="colspan">预览(Unit:${unit})</div>
// 			</div>`;
// 	if(unit){
// 		$("#ladderPrice").find(".tableHead").replaceWith(tl1);	
// 	}		
// }


function selectAttenUnitEvent(divselectid,type){
	$(document).on("click",divselectid+' .attrVal',function(event){
		event.stopImmediatePropagation();
		$(this).find(".attrVal_dropList").show();
		$(divselectid).siblings().find(".attrVal_dropList").hide();
		var topOffset = $(divselectid+' .attrVal').height() + 6;
		$(divselectid+' .attrVal_dropList').css('top',topOffset+'px');
	})
	
	$(document).on("click",divselectid+' .attrVal ul li',function(event){
		event.stopImmediatePropagation();
		if(type==1){
			let selectVal = $(divselectid+' .attrVal_dropList input[type=radio]:checked').prop('value');
			$(divselectid+' .attrVal .attr_select_val').html(selectVal);
			$(divselectid).find('.zdy_attr_val').val('');
			$(divselectid+" .attrVal_dropList").hide();
		}else{
			generateMultiSelect(divselectid);
			var topOffset = $(divselectid+' .attrVal').height() + 6;
			$(divselectid+' .attrVal_dropList').css('top',topOffset+'px');
		}
		$(this).find(".attrVal_dropList").show();
		createLadderTableHeader();
	})
	
}