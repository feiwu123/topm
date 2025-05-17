//动态生成属性
jQuery.multiTemuSelect = function(divselectid,data) {
	var attr_data = data;
	var attribute_mode=null;
	var group_attr_elem='';
	$(divselectid).html('');//清空数据
	if(Array.isArray([]) && data.length>0){
		attr_data.forEach((item,index)=>{
			//如果存在这个值就说明是下拉
			if(item.controlType==0){
				attribute_mode = 'line'
			}else if(item.controlType==1){
				if(item.chooseMaxNum>1){
					attribute_mode = "checkbox";
				}else{
					attribute_mode = "radio";
				}
			}else{
				attribute_mode = 'selection'
			}
			switch (attribute_mode){
				//单选
				case 'radio':
				group_attr_elem = group_attr_elem + createRadioEle(item);
				break;
				//多选
				case 'checkbox':
				group_attr_elem = group_attr_elem + createCheckboxEle(item);
				break
				case 'line':
				group_attr_elem = group_attr_elem + createInputEle(item);
				break;
				case 'selection':
				group_attr_elem = group_attr_elem + createSelect(item);
				default:
				break;
			}
		})
		
		$(divselectid).append(group_attr_elem);
		$(divselectid).find(".attrVal_dropList ul").perfectScrollbar("destroy");
		$(divselectid).find(".attrVal_dropList ul").perfectScrollbar();
	}else{
		console.log('数据不是数组')	
	}

	
}

function createInputEle(data){
	var attr_name = data.name;
	var attr_id = data.refPid;
	var attr_type = data.control_type;
	var is_requried = data.required;
	var require_html = '';
	if(is_requried){
		require_html = '<span class="required red">*</span>';
	}
	var template1 = `<div class="attrItem" id="attrItem_${attr_id}" data-required="${is_requried}">
						<div class="attrName">
							${attr_name}${require_html}
						</div>
						<div class="attrVal" data-name="${attr_name}">
							<input type="text" class="attr_val_input" name="attr_val_${attr_id}" ${is_requried?'required':''} data-maxValue="${data.maxValue}" data-minValue="${data.minValue}"/>
						</div>
						<div class="red error_tips"></div>
					</div>`;
	inputAttenEvent("#attrItem_"+attr_id);				
	return 	template1;			
}

function createSelect(data){
	var attr_name = data.name;
	var attr_id = data.refPid;
	var attr_type = data.control_type;
	var is_requried = data.required;
	var propertyChooseTitle = data.propertyChooseTitle;
	var number_input_title = data.numberInputTitle;
	var value_unit = data.valueUnitList[0].valueUnit;
	var require_html = '';
	var choseValue = data.values;
	var choseNumber = choseValue.length;
	if(is_requried){
		require_html = '<span class="required red">*</span>';
	}
	var template1 = `<div class="attrItem" id="attrItem_${attr_id}" data-required="${is_requried}" data-seletids="">
									<div class="attrName">
										${attr_name}${require_html}
									</div>
									<div class="materal_table">
										<div class="tableHead">
											<div class="tableRow">
												<div class="td">${propertyChooseTitle}</div>
												<div class="td">
													<div>${number_input_title}</div>
													<div style="color: #aaa;font-size: 12px;">所有成分比例之和必须等于 100%</div>
												</div>
												<div class="td">操作</div>
											</div>	
										</div>
										<div class="tableBody">
											<div class="noData">
												暂无数据
											</div>
										</div>
										<div class="tableFoot">
											<div class="addMateral">
												<span class="iconfont icon-xinzeng"></span>
												<span>添加材料</span>
											</div>
											<div class="zongji">
												<span>总计 </span><span>0%</span>
											</div>
										</div>
									</div>
								</div>`;
	
	var rowTemplate = `<div class="tableRow">
						<div class="td">
							<div class="attrVal">
								<div class="attr_select_val">
								</div>
								<div class="icons"><span class="iconfont icon-ICON-xia"></span></div>
								<div class="attrVal_dropList">
									<ul>
									</ul>
								</div>
							</div>
						</div>
						<div class="td">
							<div class="eleInput">
								<input type="number" class="materalValue inputEle"/>
								<span class="rate">${value_unit}</span>
							</div>
						</div>
						<div class="td">
							<span class="deleteMateral">删除</span>
						</div>
					</div>`;
	var id = "#attrItem_"+attr_id;
	materals["attrItem_"+attr_id] = {valeus:choseValue,selectVals:[]};//暂时存储选中的下拉
	$(document).on("click",id+" .addMateral",function(){
		var lineNum = $(id).find(".tableBody .tableRow").length;
		if(lineNum == choseNumber){
			return;
		}
		$(id).find(".tableBody .noData").remove();
		$(id).find(".tableBody").append(rowTemplate);
	})
	
	createMateralDropList(attr_id);
	return template1;
}
//删除
$(document).on("click",".tableBody .deleteMateral",function(){
	var idName = $(this).parents('.attrItem').props("id");
	
	$(this).parents(".tableRow").remove();
})

function createMateralDropList(id){
	var ele_id = "attrItem_"+id;
	$(document).on("click","#"+ele_id+" .attrVal",function(event){
		event.stopImmediatePropagation();
		var radio_list = '';
		var timeStr = new Date().getTime();
		var selected_id = $(this).find(".attr_select_val span").data("id");
		var selectedIndex = materals[ele_id].selectVals.indexOf(selected_id);
		if(selectedIndex>-1){
			materals[ele_id].selectVals.splice(selectedIndex,1);
		}
		var values = materals[ele_id].valeus.filter((item,index)=>{
			return materals[ele_id].selectVals.indexOf(item)>-1?false:true;
		})
		console.log(values);
		values.forEach((item,index)=>{
			radio_list += `<li>
							<input type="radio" name="attr_${timeStr}_${id}"  id="radio_${item.vid}" data-attrid="${item.vid}" value="${item.value}" ${item.vid==selected_id?'checked':''}/>
							<label for="radio_${item.vid}">${item.value}</label>
						</li>`;
		})
		$(this).find(".attrVal_dropList ul").html(radio_list);	
		$(this).find(".attrVal_dropList").show();
		$(this).parents(".tableRow").siblings().find(".attrVal_dropList").hide();
	})
	
	$(document).on("click","#"+ele_id+" .attrVal ul li",function(event){
		event.stopImmediatePropagation();
		var select_id = $(this).find("input[type='radio']").data("attrid");
		var select_name = $(this).find("input[type='radio']").val();
		if(materals[ele_id].selectVals.indexOf(select_id)==-1){
			materals[ele_id].selectVals.push(select_id);
		}
		var selectedVal = `<span data-id='${select_id}'>${select_name}</span>`;
		$(this).parents(".attrVal").find('.attr_select_val').html(selectedVal);
		$(this).parents(".attrVal_dropList").hide();
	})
	
	$(document).on("click",function(event){
		 $("#"+ele_id+" .attrVal_dropList").hide();
	});
}

function createRadioEle(data){
	var attr_name = data.name;
	var attr_id = data.refPid;
	var attr_type = data.control_type;
	var zdy_html = '';
	var is_requried = data.required;
	var require_html = '';
	if(is_requried){
		require_html = '<span class="required red">*</span>';
	}
	var radio_list = '';
	data.values.forEach((item,index)=>{
		radio_list += `<li>
						<input type="radio" name="attr_${attr_id}"  id="radio_${item.vid}" data-attrid="${item.vid}" value="${item.value}" ${is_requried?'required':''}/>
						<label for="radio_${item.vid}">${item.value}</label>
					</li>`;
	})
	var zdy_ele = '';

	var template1 = `<div class="attrItem" id="attrItem_${attr_id}" data-required="${is_requried}">
						<div class="attrName">
							${attr_name}${require_html}
						</div>
						<div class="attrVal">
							<div class="attr_select_val">
							</div>
							<div class="icons"><span class="iconfont icon-ICON-xia"></span></div>
							<div class="attrVal_dropList">
								<ul>
									${radio_list}
								</ul>
								${zdy_html}
							</div>
						</div>
					</div>`;
					
	selectAttenEvent("#attrItem_"+attr_id,1);
	return 	template1;
}
function createCheckboxEle(data){
	var attr_name = data.name;
	var attr_id = data.refPid;
	var attr_type = data.control_type;
	var zdy_html = '';
	var is_requried = data.is_requried;
	var require_html = '';
	if(is_requried){
		require_html = '<span class="required red">*</span>';
	}
	var checkbox_list = '';
	data.values.forEach((item,index)=>{
		checkbox_list += `<li>
						<input type="checkbox" name="attr_${attr_id}"  id="checkbox_${item.vid}" data-attrid="${item.vid}" value="${item.name}" ${is_requried?'required':''}/>
						<label for="checkbox_${item.vid}">${item.value}</label>
					</li>`;
	})
	var template1 = `<div class="attrItem" id="attrItem_${attr_id}" data-required="${is_requried}">
						<div class="attrName">
							${attr_name}${require_html}
						</div>
						<div class="attrVal">
							<div class="attr_select_val multi_select">
								
							</div>
							<div class="icons"><span class="iconfont icon-ICON-xia"></span></div>
							<div class="attrVal_dropList">
								<ul>
									${checkbox_list}
								</ul>
								${zdy_html}
							</div>
						</div>
					</div>`;
	selectAttenEvent("#attrItem_"+attr_id,2);				
	return 	template1;
}

//绑定输入框
function inputAttenEvent(divselectid){
	$(document).on("change",divselectid+' .attrVal input',function(event){
		var name = $(this).parents(".attrVal").data("name");
		var minValue = $(this).data("minvalue");
		var maxValue = $(this).data("maxvalue");
		var value = parseInt($(this).val());
		console.log(value,minValue,maxValue);
		if(!value){
			$(this).val('');
			return false;
		}
		if(value && value<minValue){
			$(this).parents(".attrVal").siblings(".error_tips").html(name+" 必须大于等于"+minValue);
			$(this).parents(".attrVal").addClass("red-border");
		}else if(value && value>maxValue){
			$(this).parents(".attrVal").siblings(".error_tips").html(name+" 必须大于等于"+minValue);
			$(this).parents(".attrVal").addClass("red-border");
		}else{
			$(this).parents(".attrVal").siblings(".error_tips").html("");
			$(this).parents(".attrVal").removeClass("red-border");
		}
		$(this).val(value);
	})
}

//type区分2多选1单选
function selectAttenEvent(divselectid,type){
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
	})
	
	
	// $(document).on("click",divselectid+' .attrVal .enter_attr_btn',function(event){
	// 	event.stopImmediatePropagation();
	// 	var inputVal = $(this).siblings('.inputEle').find('.zdy_attr_val').val();
	// 	if(inputVal){
	// 		//有自定义值 如果是单选就一个值 如果多选就多个值
	// 		if(type==1){
	// 			$(divselectid+' .attrVal_dropList input[type=radio]').prop('checked',false);
	// 			$(divselectid+' .attrVal .attr_select_val').html(inputVal);
	// 			$(divselectid+" .attrVal_dropList").hide();
	// 			$(this).siblings('.inputEle').find('.zdy_attr_val').val('');
	// 		}else{
	// 			let select_html = `<div class="selected_val zdy_multi"><span>${inputVal}</span><span class="iconfont icon-guanbi" data-attrid="0" ></span></div>`;
	// 			$(divselectid).find('.attr_select_val').append(select_html);
	// 			$(this).siblings('.inputEle').find('.zdy_attr_val').val('');
	// 			var topOffset = $(divselectid+' .attrVal').height() + 6;
	// 			$(divselectid+' .attrVal_dropList').css('top',topOffset+'px');
	// 		}
	// 	}else{
	// 		return;
	// 	}
		
	// })
	
	//取消多选的属性
	$(document).on("click",divselectid+' .attrVal .multi_select .icon-guanbi',function(event){
		event.stopImmediatePropagation();
		var attr_val_id = $(this).data('attrid');
		var chebox_id = "#checkbox_"+attr_val_id;
		$(this).parent('.selected_val').remove();
		$(chebox_id).prop('checked',false);
	})
	
	$(document).on("click",function(event){
		 $(divselectid+" .attrVal_dropList").hide();
	});
}


function generateMultiSelect(divselectid){
	var select_html = '';
	$(divselectid+' .attrVal_dropList input[type="checkbox"]:checked').each(function() {
	  const attr_id = $(this).data('attrid');	
	  select_html += `<div class="selected_val tiktok_multi"><span>${$(this).val()}</span><span class="iconfont icon-guanbi" data-attrid="${attr_id}" ></span></div>`;
	});
	$(divselectid).find('.attr_select_val .tiktok_multi').remove();
	$(divselectid).find('.attr_select_val').prepend(select_html);
}

