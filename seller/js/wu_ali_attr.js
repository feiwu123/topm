//动态生成属性
jQuery.multialiSelect = function(divselectid,data) {
	var productAttrs = data;
	var attr_data = productAttrs.fields.field;
	var attribute_mode=null;
	var group_attr_elem='';
	$(divselectid).html('');//清空数据
	if(Array.isArray([]) && attr_data.length>0){
		attr_data.forEach((item,index)=>{
			console.log(item);
			//如果存在这个值就说明是下拉
			attribute_mode = item['@attributes']['type'];

			switch (attribute_mode){
				//单选
				case "singleCheck":
				group_attr_elem = group_attr_elem + createRadioEle(item);
				break;
				//多选
				case "multiInput":
				group_attr_elem = group_attr_elem + createCheckboxEle(item);
				break
				case "input":
				group_attr_elem = group_attr_elem + createInputEle(item,index);
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

function createInputEle(data,attrIndex){
	var attr_name = data['@attributes']['name'];
	var attr_id = data['@attributes']['id'];
	var attr_type = data['@attributes']['type'];
	var {is_requried,maxLength} = checkRule(data['rules']?data['rules']['rule']:'');
	var require_html = '';
	if(is_requried){
		require_html = '<span class="required red">*</span>';
	}
	var template1 = `<div class="attrItem" id="attrItem_${attr_id}" data-name="${attr_name}" data-index="${attrIndex}">
						<div class="attrName">
							${attr_name}${require_html}
						</div>
						<div class="attrVal">
							<input type="text" class="attr_val_input" maxlength=${maxLength} name="attr_val_${attr_id}" ${is_requried?'required':''}/>
						</div>
					</div>`;
	return 	template1;			
}

function createRadioEle(data){
	var attr_name = data['@attributes']['name'];
	var attr_id = data['@attributes']['id'];
	var attr_type = data['@attributes']['type'];
	var {is_requried,maxLength} = checkRule(data['rules']?data['rules']['rule']:'');
	var zdy_html = '';
	var require_html = '';
	
	
	if(is_requried){
		require_html = '<span class="required red">*</span>';
	}
	var radio_list = '';
	var dropDownList = data['options']['option'];
	dropDownList.forEach((item,index)=>{
		const displayName = item['@attributes']['displayName'];
		const displayValue = item['@attributes']['value'];	
		radio_list += `<li>
						<input type="radio" name="radio_${attr_id}"  id="radio_${displayValue}" value="${displayName}" />
						<label for="radio_${displayValue}">${displayName}</label>
					</li>`;
	})
	var zdy_ele = '';
	// if(is_customizable){
	// 	zdy_html = `<div class="zdy_attr">
	// 					<div class="inputEle">
	// 						<input type="text" class="zdy_attr_val" autocomplete="off"/>
	// 					</div>
	// 					<div class="enter_attr_btn">Add</div>
	// 				</div>`;
	// }
	var search_ele = `<div class="searchOption">
						<div class="inputKeywords">
							<input type="text" placeholder="Search" class="selectKeyword"/>
							<span class="iconfont icon-sousuo searchBtn"></span>
						</div>
					</div>`;
	
	var template1 = `<div class="attrItem" id="attrItem_${attr_id}">
						<div class="attrName">
							${attr_name}${require_html}
						</div>
						<div class="attrVal">
							<div class="attr_select_val">
							</div>
							<div class="icons"><span class="iconfont icon-ICON-xia"></span></div>
							<div class="attrVal_dropList">
								${search_ele}
								<ul>
									${radio_list}
								</ul>
								${zdy_html}
							</div>
						</div>
					</div>`;
					
	selectAttenEvent("#attrItem_"+attr_id,1);
	//给搜索绑定搜索事件
	bindSearch("#attrItem_"+attr_id,dropDownList);
	return 	template1;
}

//给商品下拉属性添加搜索
function bindSearch(divselectid,data){
	$(document).on("click",divselectid+' .searchBtn',function(e){
		selectData();
		console.log(23);
	});
	$(document).on("blur",divselectid+' .selectKeyword',(e)=>{selectData()});
	$(document).on("keydown",divselectid+' .selectKeyword',(e)=>{
		 if (event.key === 'Enter' || event.keyCode === 13) {
		        // 执行你的代码
				selectData()
		    }
	});
	function selectData(){
		var keywords = $(divselectid).find(".selectKeyword").val();
		var attr_id = divselectid.split("_")[1];
		var patterList = "";
		var number = 0;
		var regex = new RegExp(keywords, "i"); // "i" 标志表示不区分大小写，根据你的需要选择是否添加
		//如果搜索是空白字符串，就直接返回
		if(/^\s*$/.test(keywords)){
			data.forEach((item,index)=>{
				const displayName = item['@attributes']['displayName'];
				const displayValue = item['@attributes']['value'];
				patterList += `<li>
								<input type="radio" name="radio_${attr_id}"  id="radio_${displayValue}" value="${displayName}" />
								<label for="radio_${displayValue}">${displayName}</label>
							</li>`;
				number = number +1;				
			})
		}else{
			data.forEach((item,index)=>{
				const displayName = item['@attributes']['displayName'];
				const displayValue = item['@attributes']['value'];
				if(regex.test(displayName)){
					patterList += `<li>
									<input type="radio" name="radio_${attr_id}"  id="radio_${displayValue}" value="${displayName}" />
									<label for="radio_${displayValue}">${displayName}</label>
								</li>`;
					number = number +1;			
				}			
			})	
		}
		$(divselectid).find(".attrVal_dropList ul").html(patterList);
		$(divselectid).find(".attrVal_dropList ul").perfectScrollbar("destroy");
		$(divselectid).find(".attrVal_dropList ul").perfectScrollbar();
	}
}

function createCheckboxEle(data){
	var attr_name = data['@attributes']['name'];
	var attr_id = data['@attributes']['id'];
	var attr_type = data['@attributes']['type'];
	var {is_requried,maxLength} = checkRule(data['rules']?data['rules']['rule']:'');
	var zdy_html = '';
	var require_html = '';
	
	if(is_requried){
		require_html = '<span class="required red">*</span>';
	}
	var checkbox_list = '';
	data['options']['option'].forEach((item,index)=>{
		const displayName = item['@attributes']['displayName'];
		const displayValue = item['@attributes']['value'];	
		checkbox_list += `<li>
						<input type="checkbox" name="attr_${attr_id}"  id="checkbox_${displayValue}" data-attrid="${displayValue}" value="${displayName}" />
						<label for="checkbox_${displayValue}">${displayName}</label>
					</li>`;
	})
	var zdy_ele = '';
	// if(is_customizable){
	// 	zdy_html = `<div class="zdy_attr">
	// 					<div class="inputEle">
	// 						<input type="text" class="zdy_attr_val" name="attr_${attr_id}" autocomplete="off"/>
	// 					</div>
	// 					<div class="enter_attr_btn">Add</div>
	// 				</div>`;
	// }
	
	var search_ele = `<div class="searchOption">
						<div class="inputKeywords">
							<input type="text" placeholder="Search" class="selectKeyword"/>
							<span class="iconfont icon-sousuo searchBtn"></span>
						</div>
					</div>`;
	var template1 = `<div class="attrItem" id="attrItem_${attr_id}">
						<div class="attrName">
							${attr_name}${require_html}
						</div>
						<div class="attrVal">
							<div class="attr_select_val multi_select">
								
							</div>
							<div class="icons"><span class="iconfont icon-ICON-xia"></span></div>
							<div class="attrVal_dropList">
							    ${search_ele}
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
	  select_html += `<div class="selected_val ali_multi"><span>${$(this).val()}</span><span class="iconfont icon-guanbi" data-attrid="${attr_id}" ></span></div>`;
	});
	$(divselectid).find('.attr_select_val .ali_multi').remove();
	$(divselectid).find('.attr_select_val').prepend(select_html);
}

function checkRule(ruleObj){
	var is_requried = false,maxLength;
	if(ruleObj==""){
		return {is_requried};
	}
	if(Array.isArray(ruleObj)){
		ruleObj.forEach((item,index)=>{
			if(item['@attributes']['name']=="requiredRule" && item['@attributes']['value'] == "true"){
				is_requried = true;
			}
			if(item['@attributes']['name']=="maxLengthRule" ){
				maxLength = item['@attributes']['value'];
			}else{
				maxLength = null;
			}
		})
	}else{
		if(ruleObj['@attributes']['name']=="requiredRule" && ruleObj['@attributes']['value'] == "true"){
			is_requried = true;
		}else{
			is_requried = false;
		}
		if(ruleObj['@attributes']['name']=="maxLengthRule" ){
			maxLength = ruleObj['@attributes']['value'];
		}else{
			maxLength = null;
		}
	}
	return {is_requried,maxLength}
}