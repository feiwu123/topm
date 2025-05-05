
//动态生成销售属性
jQuery.multialiSaleProps = function(divselectid, data) {
	var sale_attrs = data;
	console.log(data);
	var fields = data.fields.field;
	var renderHtml = $("<div></div>");
	var template1 = `<div class="elems">
		<div class="sale_attr_elem" >
			<div class="sale_attr_title">
				<div class="title">
					<span class="saleAttrName"></span><span class="requiredIcon red">*</span>
				</div>
			</div>
			<div class="sale_attr_name attrVal">
				<div class="sale_attr_select" >
					<div class="sale_attr_input">
						<!-- <input class="default_val" data-saleattrid="123" value=""> -->
						<div class="attr_select_val">
							
						</div>
						<span class="iconfont icon-ICON-xia"></span>
					</div>
					<div class="dropList sale_attr_select_list attrVal_dropList" style="display: none;">
						<ul>
							
						</ul>
					</div>	
				</div>
			</div>
		</div>
	</div>`;
		var template2 = `<div class="elems sale_attr_value">
							<div class="sale_attr_elem">
								<div class="title">
									<span class="saleAttrName">Color</span><span class="requiredIcon red">*</span>
								</div>
								<div class="sale_attr_val">
									<div class="sale_attr_val_item">
										<div class="option_val attrgroups">
											<div class="sale_attr_select" data-type="sale2">
												<div class="attrVal">
													<div class="attr_select_val">
													</div>
													<div class="icons"><span class="iconfont icon-ICON-xia"></span></div>
													<div class="attrVal_dropList sale_attr_select_list" style="display: none; top: 40px;">
														<ul>
															
														</ul>	
													</div>
												</div>
											</div>
											<div class="delete_sale_attr">
												删除
											</div>
										</div>
									</div>
								</div>
								<div class="confirmSaleAttr addoneAttr">
									<span class="iconfont icon-xinzeng"></span><span>添加更多</span>
								</div>
								<div class="red error_tips">
								</div>
							</div>
						</div>`;
    if (!Array.isArray(fields)) {
		fields = new Array(fields); 	
	}
	if (Array.isArray(fields)) {
		fields.forEach((fieldItem) => {
			var rules = checkSalePropsRule(fieldItem.rules.rule);
			var options = fieldItem.options.option;
			var fieldName = fieldItem['@attributes']['name'];
			var fieldId = fieldItem['@attributes']['id'];
			var fieldType = fieldItem['@attributes']['type'];
			var listTemplate = "";
			var uploadImgTml = "";
			var showTpl = "";
			var createTpl = $(template1).clone();
			var createTpl2 = $(template2).clone();
		
			//只有一个输入框
			if(options.length==1 && options[0]['@attributes']['displayName']=="other" && options[0]['@attributes']['value']=="-1"){
				showTpl = `<input class="default_val" data-saleattrid="-1" value=""><span class="iconfont icon-ICON-xia"></span>`;
				createTpl.find(".sale_attr_elem").attr("id","sale_attr_"+fieldId);
				createTpl.find(".saleAttrName").html(fieldName);
				createTpl.find(".sale_attr_input").html(showTpl);
				renderHtml.append(createTpl);
			}else{
				showTpl = `<div class="attr_select_val"></div><span class="iconfont icon-ICON-xia"></span>`;
				options.forEach((item)=>{
					var optionVal = item['@attributes']['value'];
					var optionName = item['@attributes']['displayName'];
					if(rules.canRemark){
						// listTemplate += `<li value="${optionVal}" tabindex="-1" role="menuitem" class="next-menu-item" data-name="${optionName}">
						// 					<div class="item-block">
						// 						<div class="block-inner" role="div-color" style="height: 10px; width: 10px; background: ${optionName};"></div>
						// 					</div>
						// 					<div class="item-value" role="color-text">${optionName}</div>
						// 			</li>`;
						listTemplate += `<li value="${optionVal}" tabindex="-1" role="menuitem" class="next-menu-item" data-name="${optionName}">
											<div class="item-value" role="color-text">${optionName}</div>
									</li>`;			
					}else{
						listTemplate += `<li value="${optionVal}" tabindex="-1" role="menuitem" class="next-menu-item sale_attr_select_item" data-name="${optionName}">
												<input type="checkbox" name="attr_${optionVal}"  id="checkbox_${fieldId}_${optionVal}" data-attrid="${optionVal}" value="${optionName}" />
												<label for="checkbox_${fieldId}_${optionVal}">${optionName}</label>
										</li>`;
					}
					
				})
				if(rules.canuploadImg){
					uploadImgTml = `<div class="sale_attr_image">
										<div class="iconfont icon-xinzeng"></div>
										<input type="file" class="sale_attr_file">
										<div class="uploadImg">
											
										</div>
									</div>`;
					if(!rules.is_requried){
						createTpl2.find(".requiredIcon").remove();
					}
					createTpl2.find(".sale_attr_val_item").prepend(uploadImgTml);		
					createTpl2.find(".sale_attr_select ul").append(listTemplate);
					createTpl2.find(".sale_attr_elem").attr("id","sale_attr_"+fieldId);
					createTpl2.find(".saleAttrName").html(fieldName);
					createTpl2.find(".sale_attr_select ul").perfectScrollbar("destroy");
					createTpl2.find(".sale_attr_select ul").perfectScrollbar();
					var idName = "#sale_attr_"+fieldId;
					
					
					//下拉销售属性
					$(document).on("click",".sale_attr_select",function(event){
						event.stopImmediatePropagation();
						var that = this;
						var dataType = $(that).data("type");
						//区分销售属性下拉的不同下拉
						if(dataType){
							var selected_id = Number($(that).find(".attr_select_val span").data("value"));
							var selected_ids = $(idName).data('select_value')?$(idName).data('select_value').split(","):[];
							$(idName).find("ul li").removeClass("curr").show();
							$(idName).find("ul li").each((index,item)=>{
								var liId = $(item).attr("value");
								if(selected_ids.includes(liId)){
									$(item).hide();
									if(liId == selected_id){
										$(item).show();
										$(item).addClass("curr");
									}
								}
							})
							$(that).find(".sale_attr_select_list").show();
							$(that).find("input.default_val").focus();
						}else{
							$(that).find(".sale_attr_select_list").show();
							$(that).find("input.default_val").focus();
						}
						$(document).on("click",function(event){
							 $(that).find(".sale_attr_select_list").hide();
						});
						$(idName).find(".sale_attr_select ul").perfectScrollbar("destroy");
						$(idName).find(".sale_attr_select ul").perfectScrollbar();
					})
					
					$(document).on("click",idName+' .attrVal ul li',function(event){
						event.stopImmediatePropagation();
						var name = $(this).data("name");
						var value = $(this).attr("value");
						$(this).parents(".attrVal").find(".attr_select_val").html("<span data-name='"+name+"' data-value='"+value+"'>"+name+"</span>");
						$(idName).find(".sale_attr_select_list").hide();
						if($(idName).data("select_value")){
							var select_vals=[];
							$(idName).find(".sale_attr_val_item .attr_select_val").each((index,item)=>{
								select_vals.push($(item).find("span").data("value"));
							})
							$(idName).data("select_value",select_vals.join(","));
						}else{
							$(idName).data("select_value",value);
						}
						
					})
					$(document).on("click",idName+' .addoneAttr',function(event){
						var rowNum = $(idName).find(".sale_attr_val .sale_attr_val_item").length;
						if(rowNum>=Number(rules.maxValueRule)){
							$(idName).find(".error_tips").append("<div>*最多添加"+rules.maxValueRule+"条</div>");
							return;
						}
						var template = createTpl2.find(".sale_attr_val_item").eq(0).clone();
						$(template).find(".attr_select_val").html('');
						var select_vals = $(idName).data('select_value')?$(idName).data('select_value').split(","):[];
						$(template).find("ul li").each((index,item)=>{
							var liId = $(item).attr("value");
							if(select_vals.includes(liId)){
								$(item).hide();
							}
						})
						$(idName).find(".sale_attr_val").append(template);
						$(idName).find(".sale_attr_select ul").perfectScrollbar("destroy");
						$(idName).find(".sale_attr_select ul").perfectScrollbar();
					})
					$(document).on("click",idName+' .delete_sale_attr',function(event){
						$(this).parents(".sale_attr_val_item").remove();
						//同时要删除这个属性值
						var select_vals = $(idName).data('select_value')?$(idName).data('select_value').split(","):[];
						var select_id = String($(this).siblings(".sale_attr_select").find(".attr_select_val span").data("value"));
						console.log(select_vals,select_id);
						if(select_vals.indexOf(select_id)>-1){
							var index = select_vals.indexOf(select_id);
							select_vals.splice(index,1);
						}
						$(idName).data("select_value",select_vals.join(","));
					})
					renderHtml.append(createTpl2);
				}else{
					if(!rules.is_requried){
						createTpl.find(".requiredIcon").remove();
					}
					createTpl.find(".sale_attr_val_item").prepend(uploadImgTml);
					createTpl.find(".sale_attr_select ul").append(listTemplate);
					createTpl.find(".sale_attr_elem").attr("id","sale_attr_"+fieldId);
					createTpl.find(".saleAttrName").html(fieldName);
					renderHtml.append(createTpl);
					
					createTpl.find(".sale_attr_select ul").perfectScrollbar("destroy");
					createTpl.find(".sale_attr_select ul").perfectScrollbar();
					//console.log(renderHtml);
					var idName = "#sale_attr_"+fieldId;
					$(document).on("click",idName+' .attrVal ul li',function(event){
						event.stopImmediatePropagation();
						generateMultiSelect(idName);
						var topOffset = $(idName+' .attrVal').height() + 6;
						$(idName+' .attrVal_dropList').css('top',topOffset+'px');
						$(this).find(".attrVal_dropList").show();
					})
					//取消多选的属性
					$(document).on("click",idName+' .attrVal .attr_select_val .icon-guanbi',function(event){
						event.stopImmediatePropagation();
						var attr_val_id = $(this).data('attrid');
						var chebox_id = "#checkbox_"+fieldId+"_"+attr_val_id;
						$(this).parent('.selected_val').remove();
						$(chebox_id).prop('checked',false);
					})
				}
				
			}
			
		})
	}
	$(divselectid).prepend(renderHtml);

}

function checkSalePropsRule(ruleObj) {
	var is_requried = false,
		maxLength, maxValueRule, canInput = null,
		canuploadImg = false,
		canRemark, valueType;
	if (ruleObj == "") {
		return {
			is_requried
		};
	}
	if (Array.isArray(ruleObj)) {
		ruleObj.forEach((item, index) => {
			if (item['@attributes']['name'] == "requiredRule" && item['@attributes']['value'] == "true") {
				is_requried = true;
			}
			if (item['@attributes']['name'] == "maxLengthRule") {
				maxLength = item['@attributes']['value'];
			} else {
				maxLength = null;
			}
			if (item['@attributes']["name"] == "maxValueRule") {
				var maxValueNumArr = item['@attributes']["value"].match(/\d+/g);
				if (maxValueNumArr) {
					maxValueRule = maxValueNumArr[0];
				}
			}
			if (item['@attributes']["name"] == "valueTypeRule") {
				valueType = item['@attributes']["value"];
			}
			if (item['@attributes']['name'] == "valueAttributeRule") {
				if (item['@attributes']['value'] == "inputValue") {
					canInput = "input";
				} else if (item['@attributes']['value'] == "img") {
					canuploadImg = true;
				} else if (item['@attributes']['value'] == "remark") {
					canRemark = true
				}
			}
		})
	} else {
		if (ruleObj['@attributes']['name'] == "requiredRule" && ruleObj['@attributes']['value'] == "true") {
			is_requried = true;
		} else {
			is_requried = false;
		}
		if (ruleObj['@attributes']['name'] == "maxLengthRule") {
			maxLength = ruleObj['@attributes']['value'];
		} else {
			maxLength = null;
		}
		if (ruleObj['@attributes']["name"] == "maxValueRule") {
			var maxValueNumArr = item['@attributes']["value"].match(/\d+/g);
			if (maxValueNumArr) {
				maxValueRule = maxValueNumArr[0];
			}
		}
		if (ruleObj['@attributes']['name'] == "valueAttributeRule") {
			if (ruleObj['@attributes']['value'] == "inputValue") {
				canInput = "input";
			} else if (ruleObj['@attributes']['value'] == "img") {
				canuploadImg = true;
			} else if (ruleObj['@attributes']['value'] == "remark") {
				canRemark = true;
			}
		}
		if (ruleObj['@attributes']["name"] == "valueTypeRule") {
			valueType = item['@attributes']["value"];
		}
	}
	return {
		is_requried,
		maxLength,
		maxValueRule,
		canInput,
		canuploadImg,
		canRemark,
		valueType
	}
}