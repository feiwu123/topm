//id data
jQuery.multiSelect = function(divselectid,data) {
	var attribute_mode = data.length>0?data[0].attribute_mode:data.attribute_mode;
	//通过attribute_mode生成不同的html
	//默认返回的input输入
	$(divselectid).siblings('.attri_name').html(data.attribute_name);
	switch (attribute_mode){
	    case 1:
	        var inputEle = createInput(data,false);
	        var listEle = createSelectList(data.attribute_value_info_list);
	        $(divselectid).html(listEle+inputEle);
	        selectAttenEvent(divselectid,1);
	        break;
	    case 2:
	        var listEle = createSelectNameList(data);
			$(divselectid).find(".select_name").html(listEle);
			attentSelectMode2(divselectid,data);
	        break;
	    case 3:
	        //单选
			var inputEle = createInput(data,false);
			var listEle = createSelectList(data.attribute_value_info_list);
			$(divselectid).html(listEle+inputEle);
			selectAttenEvent(divselectid,3);
	        break;
		case 4:
		    var inputEle = createInput(data,false);
		    var listEle = createSelectList(data.attribute_value_info_list);
			$(divselectid).find('.attr_group').siblings('.attri_name').html(data.attribute_name);
		    $(divselectid).find('.wuSelect').html(listEle+inputEle);
		    selectAttenEvent(divselectid,4);
		    break;	
	    default :
		var inputEle = createInput(data,true);
	    $(divselectid).html(inputEle);
	}

	
};

function createInput(data,isShow){
	let noSelet = isShow?'wuInput':'';
	let inputEle = `<input id="${data.attribute_name_en+data.attribute_id}" name="${data.attribute_name_en}" class="attr_value text w150 ${noSelet}" autocomplete="off"  type="${isShow?'text':'hidden'}">`;
	return  inputEle;
}
function createSelectList(listData){
	let ulStr = `<div class="multi"></div><ul class="ps-container" style="display: none;">`;
	let listStr = "";
	listData.forEach((item,index)=>{
		listStr += `<li><a href="javascript:;" data-attribute_value_id="${item.attribute_value_id}" data-attribute_value_en="${item.attribute_value_en}" class="ftx-01">${item.attribute_value}(${item.attribute_value_en})</a></li>`;
	})
	return ulStr+listStr+"</ul></div>";
}
function createSelectNameList(listData){
	
	let ulStr = `<div class="multi"></div><ul class="ps-container" style="display: none;">`;
	let listStr = "";
	listData.forEach((item,index)=>{
		listStr += `<li><a href="javascript:;" data-attribute_id="${item.attribute_id}" data-attribute_name="${item.attribute_name}" class="ftx-01">${item.attribute_name}(${item.attribute_name_en})</a></li>`;
	})
	return ulStr+listStr+"</ul></div>";
}

function selectAttenEvent(divselectid,selectType){
	$(document).on("click",divselectid+" .multi",function(event){
		event.stopImmediatePropagation();
		var that = this;
		obj = $(that).parent().find("ul");
		
		var select_ids = $(that).parent().find(".attr_value").val().split(",");
		$(".wuSelect").find("ul").hide();
		
		if(obj.css("display")=="none"){
			obj.css("display","block");
			//gei li添加选中状态
			obj.find('li a').each((index,item)=>{
				let selected_id = String($(item).data("attribute_value_id"));
				if(selectType==4){
					select_ids = $(divselectid).find('.attr_selected_value_id').val().split(",");
				}
				if(select_ids.includes(selected_id)){
					$(item).addClass("selected");
				}else{
					$(item).removeClass("selected");
				}
			})
		}else{
			obj.css("display","none");
		}
		
		obj.perfectScrollbar("destroy");
		obj.perfectScrollbar();
		
	})
		
	$(document).on("click",divselectid+" ul li a",function(event){
			event.stopImmediatePropagation();
			obj = $(this).parents(".wuSelect");
			input = obj.find(".attr_value");
			
			if(selectType==3){
				$(this).addClass("selected");
				let selected_attr_name=$(this).data("attribute_value_en");
				let selected_attr_id=$(this).data("attribute_value_id");
				$(this).siblings().removeClass("selected");
				multi = obj.find(".multi");
				multi.html(`<div>${selected_attr_name}<span class="delete" data-id="${selected_attr_id}"></span></div>`);
				$(divselectid+" ul").hide();
				input.val(selected_attr_id);
			}else if(selectType==1){
				let selecteds = $(input).val().split(',');
				let selected_attr_id = String($(this).data("attribute_value_id"));
				let selected_attr_name = String($(this).data("attribute_value_en"));
				if(!selecteds.includes(selected_attr_id)){
					$(this).addClass("selected");
					multi = obj.find(".multi");
					multi.append(`<div>${selected_attr_name}<span class="delete" data-id="${selected_attr_id}"></span></div>`);
					selecteds.push(selected_attr_id);
					$(input).val(selecteds.join(","));
				}
			}else if(selectType==4){
				let inputArr = $(divselectid).find(".attr_selected_value_id").val().length>0?$(divselectid).find(".attr_selected_value_id").val().split(","):new Array();
				let selected_attr_name=$(this).data("attribute_value_en");
				let selected_attr_value_id=String($(this).data("attribute_value_id"));
				if(!inputArr.includes(selected_attr_value_id)){
					inputArr.push(selected_attr_value_id);
					let selected_attr_id = $(this).parents(".select_item").data('attr_id');
					if(selected_attr_id){
						inputArr = inputArr.filter((item)=>{return item!=selected_attr_id });
					}
					$(this).addClass("selected");
					$(this).parents(".select_item").data('attr_id',selected_attr_value_id);
					$(divselectid).find(".attr_selected_value_id").val(inputArr.join(','));
					multi = $(this).parents(".wuSelect").find(".multi");
					multi.html(`<div>${selected_attr_name}<span class="delete" data-id="${selected_attr_value_id}"></span></div>`);
					$(divselectid+" ul").hide();
					$(this).parents(".wuSelect").find(".attr_value").val(selected_attr_value_id);
				}
			}
			
				
		});
		
		$(document).on("click",divselectid+" .multi .delete",function(event){
			let obj = $(this).parents(divselectid);
			let input = obj.find(".attr_value");
			if(selectType==3){
				input.val('');
				$(obj).find(' .multi').html('');
			}else if(selectType==1){
				let delete_attr_id = $(this).data('id');
				$(this).parent("div").remove();
				let select_ids = input.val().split(',');
				let selected_ids = select_ids.filter((item)=>{return item!= delete_attr_id});
				input.val(selected_ids.join(','));
				obj.click();
			}else if(selectType==4){
				let delete_attr_id = $(this).data('id');
				let inputArr = $(divselectid).find(".attr_selected_value_id").val().split(",");
				let obj = $(this).parents(".select_item");
				if(delete_attr_id){
					inputArr = inputArr.filter((item)=>{return item!=delete_attr_id });
				}
				$(divselectid).find(".attr_selected_value_id").val(inputArr.join(','));
				$(this).parents(".select_item").data('attr_id','');
				$(this).parents(".select_item").find(".attr_value").val('');
				$(this).parents(".select_item").find(".multi").html('');
				$(this).parents(".select_item").find(".multi").click();
			}
		})
		
		$(document).on("click",divselectid+" .addItem",function(event){
			event.stopImmediatePropagation();
			var attr_ele = $(divselectid).find(".select_item").clone().get(0);
			var deleteEle = `<a class="btn h30 mr10 fl removeItem">删除</a>`;
			$(attr_ele).find(".multi").html('');
			$(attr_ele).find(".attr_value").val('');
			$(attr_ele).append(deleteEle);
			$(divselectid+' .attr_group').append(attr_ele);
		})
		
		$(document).on("click",divselectid+" .removeItem",function(event){
			event.stopImmediatePropagation();
			let selected_attr_id = $(this).parents(".select_item").data('attr_id');
			let inputArr = $(divselectid).find(".attr_selected_value_id").val().split(",");
			let obj = $(this).parents(".select_item");
			if(selected_attr_id){
				inputArr = inputArr.filter((item)=>{return item!=selected_attr_id });
			}
			$(divselectid).find(".attr_selected_value_id").val(inputArr.join(','));
			obj.remove();
		})
		
		$(document).on("click",function(){
			$(divselectid+" ul").hide();
		});
}


function attentSelectMode2(selectId,listData){
	$(document).on("click",selectId+" .select_name .multi",function(event){
		event.stopImmediatePropagation();
		var that = this;
		obj = $(that).parent().find("ul");
		
		var select_ids = $(selectId).find(".attr_selected_name_id").val().split(",");
		$(".wuSelect").find("ul").hide();
		
		if(obj.css("display")=="none"){
			obj.css("display","block");
			//gei li添加选中状态
			obj.find('li a').each((index,item)=>{
				let selected_id = String($(item).data("attribute_id"));
				if(select_ids.includes(selected_id)){
					$(item).addClass("selected");
				}else{
					$(item).removeClass("selected");
				}
			})
		}else{
			obj.css("display","none");
		}
		
		obj.perfectScrollbar("destroy");
		obj.perfectScrollbar();
		
	})
	$(document).on("click",selectId+" .select_name ul li a",function(event){
			event.stopImmediatePropagation();
			let obj = $(this).parents(selectId);
			let inputArr = obj.find(".attr_selected_name_id").val().length>0?obj.find(".attr_selected_name_id").val().split(","):new Array();
			$(this).addClass("selected");
			let selected_name=$(this).data("attribute_name");
			let selected_id=String($(this).data("attribute_id"));
			$(this).siblings().removeClass("selected");
			multi = $(this).parents(".select_name").find(".multi");
			$(selectId+" .select_name ul").hide();
			if(!inputArr.includes(selected_id)){
				multi.html(`<div>${selected_name}</div>`);
				inputArr.push(selected_id);
				let selected_attr_id = $(this).parents(".select_item").data('attr_id');
				if(selected_attr_id){
					inputArr = inputArr.filter((item)=>{return item!=selected_attr_id });
				}
				$(this).parents(".select_item").data('attr_id',selected_id);
				obj.find(".attr_selected_name_id").val(inputArr.join(','));
				listData.forEach((item,index)=>{
					if(item.attribute_id == selected_id){
						let newId = 'attr_'+selected_id;
						$(this).parents(".select_item").find('.select_value').attr({id:newId}).removeClass('noborder');
						var inputEle = createInput(item.attribute_value_info_list,false);
						var listEle = createSelectList(item.attribute_value_info_list);
						$("#"+newId).html(listEle+inputEle);
						selectAttenEvent("#"+newId,1);
					}
				})
			}
		});
	$(document).on("click",selectId+" .addItem",function(event){
		event.stopImmediatePropagation();
		let listNum = $(selectId+" .select_item").length;
		if(listNum>=listData.length){
			return;
		}
		var attr_ele = `<div class="select_item">
					<div  class="select_w320 wuSelect select_name"></div>
					<div  class="select_w320 wuSelect select_value noborder"></div>
					<a class="btn h30 mr10 fl removeItem">
						删除
					</a>
				</div>`;
		$(selectId+' .attr_group').append(attr_ele);
		var listEle = createSelectNameList(listData);
		$(selectId+' .attr_group .select_name').last().html(listEle);
		attentSelectMode2(selectId,listData);
	})
	
	$(document).on("click",selectId+" .removeItem",function(event){
		event.stopImmediatePropagation();
		let selected_attr_id = $(this).parents(".select_item").data('attr_id');
		let inputArr = $(selectId).find(".attr_selected_name_id").val().split(",");
		let obj = $(this).parents(".select_item");
		if(selected_attr_id){
			inputArr = inputArr.filter((item)=>{return item!=selected_attr_id });
		}
		$(selectId).find(".attr_selected_name_id").val(inputArr.join(','));
		obj.remove();
	})
	
	$(document).on("click",function(){
		$(selectId+" .select_name ul").hide();
	});
}