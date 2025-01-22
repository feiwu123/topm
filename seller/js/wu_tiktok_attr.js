//动态生成属性
jQuery.multiTiktokSelect = function(divselectid,data) {
	var attr_data = data;
	var attribute_mode=null;
	var group_attr_elem='';
	$(divselectid).html('');//清空数据
	if(Array.isArray([]) && data.length>0){
		attr_data.forEach((item,index)=>{
			console.log(item);
			//如果存在这个值就说明是下拉
			if(item.values){
				if(item.is_multiple_selection){
					attribute_mode = 'checkbox';
				}else{
					attribute_mode = 'radio';
				}
			}else{
				attribute_mode = 'line'
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
	var attr_id = data.id;
	var attr_type = data.type;
	var is_customizable = data.is_customizable;
	var is_requried = data.is_requried;
	var require_html = '';
	if(is_requried){
		require_html = '<span class="required red">*</span>';
	}
	var template1 = `<div class="attrItem" id="attrItem_${attr_id}">
						<div class="attrName">
							${attr_name}${require_html}
						</div>
						<div class="attrVal">
							<input type="text" class="attr_val_input" name="attr_val_${attr_id}" ${is_requried?'required':''}/>
						</div>
					</div>`;
	return 	template1;			
}

function createRadioEle(data){
	var attr_name = data.name;
	var attr_id = data.id;
	var attr_type = data.type;
	var is_customizable = data.is_customizable;
	var zdy_html = '';
	var is_requried = data.is_requried;
	var require_html = '';
	if(is_requried){
		require_html = '<span class="required red">*</span>';
	}
	var radio_list = '';
	data.values.forEach((item,index)=>{
		radio_list += `<li>
						<input type="radio" name="attr_${attr_id}"  id="radio_${item.id}" value="${item.name}" ${is_requried?'required':''}/>
						<label for="radio_${item.id}">${item.name}</label>
					</li>`;
	})
	var zdy_ele = '';
	if(is_customizable){
		zdy_html = `<div class="zdy_attr">
						<div class="inputEle">
							<input type="text" class="zdy_attr_val" autocomplete="off"/>
						</div>
						<div class="enter_attr_btn">Add</div>
					</div>`;
	}
	var template1 = `<div class="attrItem" id="attrItem_${attr_id}">
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
	var attr_id = data.id;
	var attr_type = data.type;
	var is_customizable = data.is_customizable;
	var zdy_html = '';
	var is_requried = data.is_requried;
	var require_html = '';
	if(is_requried){
		require_html = '<span class="required red">*</span>';
	}
	var checkbox_list = '';
	data.values.forEach((item,index)=>{
		checkbox_list += `<li>
						<input type="checkbox" name="attr_${attr_id}"  id="checkbox_${item.id}" data-attrid="${item.id}" value="${item.name}" ${is_requried?'required':''}/>
						<label for="checkbox_${item.id}">${item.name}</label>
					</li>`;
	})
	var zdy_ele = '';
	if(is_customizable){
		zdy_html = `<div class="zdy_attr">
						<div class="inputEle">
							<input type="text" class="zdy_attr_val" name="attr_${attr_id}" autocomplete="off"/>
						</div>
						<div class="enter_attr_btn">Add</div>
					</div>`;
	}
	var template1 = `<div class="attrItem" id="attrItem_${attr_id}">
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

//type区分2多选1单选
function selectAttenEvent(divselectid,type){
	$(document).on("click",divselectid+' .attrVal',function(event){
		event.stopImmediatePropagation();
		$(this).find(".attrVal_dropList").show();
		$(divselectid).siblings().find(".attrVal_dropList").hide();
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
	})
	
	$(document).on("click",divselectid+' .attrVal .enter_attr_btn',function(event){
		event.stopImmediatePropagation();
		var inputVal = $(this).siblings('.inputEle').find('.zdy_attr_val').val();
		if(inputVal){
			//有自定义值 如果是单选就一个值 如果多选就多个值
			if(type==1){
				$(divselectid+' .attrVal_dropList input[type=radio]').prop('checked',false);
				$(divselectid+' .attrVal .attr_select_val').html(inputVal);
				$(divselectid+" .attrVal_dropList").hide();
				$(this).siblings('.inputEle').find('.zdy_attr_val').val('');
			}else{
				let select_html = `<div class="selected_val zdy_multi"><span>${inputVal}</span><span class="iconfont icon-guanbi" data-attrid="0" ></span></div>`;
				$(divselectid).find('.attr_select_val').append(select_html);
				$(this).siblings('.inputEle').find('.zdy_attr_val').val('');
				var topOffset = $(divselectid+' .attrVal').height() + 6;
				$(divselectid+' .attrVal_dropList').css('top',topOffset+'px');
			}
		}else{
			return;
		}
		
	})
	
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

