//id data

var main_atr_child_id = '';	
var main_attr_array = 0;
jQuery.multiSelect = function(divselectid,data) {
	var attribute_mode = data.length>0?data[0].attribute_mode:data.attribute_mode;
	//通过attribute_mode生成不同的html
	//默认返回的input输入
	$(divselectid).siblings('.attri_name').html(data.attribute_name);
	switch (attribute_mode){
	    case 1:
	        $(divselectid).siblings('.attri_name').data("id",data.attribute_id+"_!"+data.attribute_name);
	        
	        var inputEle = createInput(data,false);
	        var listEle = createSelectList(data.attribute_value_info_list);
	        $(divselectid).html(listEle+inputEle);
	        selectAttenEvent(divselectid,1);
	        break;
	    case 2:
	        //var attribute_label = data.length>0?data[0].attribute_label:data.attribute_label;
	        var listEle = createSelectNameList(data,1);
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
	let ulStr = `<div class="multi"></div><div class="select_icon">
													<span class="iconfont icon-ICON-xia"></span>
												</div><ul class="ps-container" style="display: none;">`;
	let listStr = "";
	listData.forEach((item,index)=>{
		listStr += `<li><a href="javascript:;" data-attribute_value_id="${item.attribute_value_id}" data-attribute_value_en="${item.attribute_value}" class="ftx-01">${item.attribute_value}</a></li>`;
	})
	return ulStr+listStr+"</ul></div>";
}
function createSelectNameList(listData, attribute_label=0){
	
	let ulStr = `<div class="multi"></div><div class="select_icon">
													<span class="iconfont icon-ICON-xia"></span>
												</div><ul class="ps-container" style="display: none;">`;
	let listStr = "";
	listData.forEach((item,index)=>{
		listStr += `<li><a href="javascript:;" data-attribute_id="${item.attribute_id}" data-attribute_name="${item.attribute_name}" class="ftx-01">${item.attribute_name}</a></li>`;
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
				multi.html(`<div>${selected_attr_name}<span class="delete iconfont icon-guanbi" data-id="${selected_attr_id}"></span></div>`);
				$(divselectid+" ul").hide();
				input.val(selected_attr_id);
			}else if(selectType==1){
				let selecteds = $(input).val().split(',');
				let selected_attr_id = String($(this).data("attribute_value_id"));
				let selected_attr_name = String($(this).data("attribute_value_en"));
				if(!selecteds.includes(selected_attr_id)){
					$(this).addClass("selected");
					multi = obj.find(".multi");
					multi.append(`<div>${selected_attr_name}<span class="delete iconfont icon-guanbi" data-id="${selected_attr_id}"></span></div>`);
					selecteds.push(selected_attr_id);
					$(input).val(selecteds.join(","));
				}
				
				
				if($(this).parent().parent().parent().parent().parent().hasClass("meicado_product_main_attr")){
				    var index = $(this).parent().parent().parent().parent().index();
            
                    if(index == 0){
                        var selected_attr_id1 = $(this).data("attribute_value_id");
                        var selected_attr_name2 = $(this).html();
                        var html = '<tr class="shein_attr'+selected_attr_id1+'">';
                						html += '	<td><span>'+selected_attr_name2+'</span></td>';
                						html += '	<td><div class="attr_pic_groups xijie_groups" id="img_xijie_main'+selected_attr_id1+'" data-id="'+selected_attr_id1+'" data-main-id="0">';
                						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id1+'" data-name="'+selected_attr_name2+'"><span class="iconfont icon-xinzeng"></span></div>';
                						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id1+'" data-name="'+selected_attr_name2+'"><span class="iconfont icon-xinzeng"></span></div>';
                						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id1+'" data-name="'+selected_attr_name2+'"><span class="iconfont icon-xinzeng"></span></div>';
                						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id1+'" data-name="'+selected_attr_name2+'"><span class="iconfont icon-xinzeng"></span></div>';
                						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id1+'" data-name="'+selected_attr_name2+'"><span class="iconfont icon-xinzeng"></span></div>';
                						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id1+'" data-name="'+selected_attr_name2+'"><span class="iconfont icon-xinzeng"></span></div>';
                						html += '	</div></td>';
                						html += '</tr>';
            		    $(".so-table-table-bordered .main_tbody").append(html);
                        $(".main_attr_info_pic .so-table-empty-ltr").remove();
                    }
                    
                    var type_id     = 0;
                    var type_name   = $(this).parent().parent().parent().prev(".attri_name").data("id");
                    var meicado_attr_id   = $(this).data("attribute_value_id");
                    var meicado_attr_name = $(this).data("attribute_value_en");
                    var attr_id     = get_attr_id();
                    var attr_value  = get_attr_value();
                    
                    $string = 'test=jxp&act=set_attribute_table&type_id='+type_id+'&type_name='+type_name;
            	    $string += '&shein_attr_id='+meicado_attr_id+'&shein_attr_name='+meicado_attr_name;
            	    $string += '&attr_id='+attr_id+'&attr_value='+attr_value;
            	    
            	    $.post('meicado_goods.php', $string , function(data){
            			$("#attribute_table").html(data.content);
            		},'JSON');
				}
				
				var main_attr_value = $("#attribute_mode_main_1 .attr_value").first().val();
				var main_attr_id    = $("#attribute_mode_main_1 .select_item").first().data("attr_id");
				
				if(main_atr_child_id != main_attr_value && main_attr_value != '' && main_attr_id>0){
				    main_atr_child_id = main_attr_value;
				    var html = '<tr class="shein_attr'+selected_attr_id+'">';
						html += '	<td><span>'+selected_attr_name+'</span><br /><span>SKC：</span></td>';
						html += '	<td><div class="attr_pic_groups xijie_groups" id="img_xijie_main'+selected_attr_id+'" data-id="'+selected_attr_id+'" data-main-id="0">';
						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem attr_pic_items xijie no_pic uploadItem_2_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '	</div></td>';
						html += '	<td style="vertical-align: baseline;"><div class="attr_pic_groups"><div class="imgList"></div><div class="uploadItem attr_pic_items fangxing no_pic uploadItem_5_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div></div></td>';
						html += '	<td style="vertical-align: baseline;"><div class="attr_pic_groups"><div class="imgList"></div><div class="uploadItem attr_pic_items sekuai no_pic uploadItem_6_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div></div></td>';
						html += '</tr>';
				    $(".so-table-table-bordered .main_tbody").append(html);
				    $(".attr-main-img .so-table-empty-ltr").remove();
				    
				    var html = '<tr class="shein_attr'+selected_attr_id+'">';
						html += '	<td><span>'+selected_attr_name+'</span><br /><span>SKC：</span></td>';
						html += '	<td><div class="attr_pic_groups" data-id="'+selected_attr_id+'">';
						html += '			<div class="uploadItem details attr_pic_items no_pic uploadItem_7_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem details attr_pic_items no_pic uploadItem_7_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem details attr_pic_items no_pic uploadItem_7_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem details attr_pic_items no_pic uploadItem_7_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem details attr_pic_items no_pic uploadItem_7_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem details attr_pic_items no_pic uploadItem_7_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem details attr_pic_items no_pic uploadItem_7_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem details attr_pic_items no_pic uploadItem_7_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem details attr_pic_items no_pic uploadItem_7_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '			<div class="uploadItem details attr_pic_items no_pic uploadItem_7_'+selected_attr_id+'" data-id="'+selected_attr_id+'"><span class="iconfont icon-xinzeng"></span></div>';
						html += '	</div></td>';
						html += '</tr>';
				    $(".attr-details-img .details_tbody").append(html);
				    $(".attr-details-img .so-table-empty-ltr").remove();
				   
				}
				var shein_attr_type_id   = parseInt($(this).parent().parent().parent().data('type_id'));
				if(shein_attr_type_id>0){
    			    var shein_attr_type_name = $(this).parent().parent().parent().data('type_name');
    			    set_shein_attribute_table(shein_attr_type_id,shein_attr_type_name,selected_attr_id,selected_attr_name);
    			    
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
					multi.html(`<div>${selected_attr_name}<span class="delete iconfont icon-guanbi" data-id="${selected_attr_value_id}"></span></div>`);
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
			    
				var shein_attr_type_id   = parseInt($(this).parent().parent().parent().data("type_id"));
				
				let delete_attr_id = $(this).data('id');
				$(this).parent("div").remove();
				let select_ids = input.val().split(',');
				let selected_ids = select_ids.filter((item)=>{return item!= delete_attr_id});
				input.val(selected_ids.join(','));
				obj.click();
				
				
				if(shein_attr_type_id>0){
				    $(".shein_attr"+delete_attr_id).remove();
				    set_shein_attribute_table();
				}
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
			var attr_ele = $(divselectid).find(".select_item").first().parents('tr').clone().get(0);
			var deleteEle = `<a class="btn h30 mr10 fl removeItem">删除</a>`;
			$(attr_ele).find(".multi").html('');
			$(attr_ele).find(".attr_value").val('');
			$(attr_ele).find(".delete_tr").append(deleteEle);
			$(divselectid+' .attr_group tbody').append(attr_ele);
		})
		
		$(document).on("click",divselectid+" .removeItem",function(event){
			event.stopImmediatePropagation();
			let selected_attr_id = $(this).parents("tr .select_item").data('attr_id');
			let inputArr = $(divselectid).find(".attr_selected_value_id").val().split(",");
			let obj = $(this).parents("tr");
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
					    //console.log(item);
						let newId = 'attr_'+selected_id;
						$(this).parents(".select_item").find('.select_value').attr({id:newId}).removeClass('noborder');
						var inputEle = createInput(item,false);
						var listEle = createSelectList(item.attribute_value_info_list);
						$("#"+newId).html(listEle+inputEle);
						selectAttenEvent("#"+newId,1);
						
						$("#"+newId).data({
						    "type_id":selected_id,
						    "type_name":selected_name
						});
					}
				})
				
				
				var firstAttrId = $("#attribute_mode_main_1 .select_item").first().data("attr_id");
				if(main_attr_array != firstAttrId && firstAttrId>0){
				    var mainObj     = $('input[name="mainattrid"]');
				    var attrName    = $("#attribute_mode_main_1 .select_item .multi").first().find('div').html();
				    
				    mainObj.val(firstAttrId);
				    mainObj.data("name",attrName);
				    
				    $(".attr-main-img .so-table-table-bordered th:first-child").html(attrName);
				    $(".attr-details-img .so-table-table-bordered th:first-child").html(attrName);
				}
			}
		});
	$(document).on("click",selectId+" .addItem",function(event){
	    
	    if($(this).hasClass("main_attr")){
	        if($("input[name='main_attr']").val() == ''){
	            return false;
	        }
	    }
	    
		event.stopImmediatePropagation();
		let listNum = $(selectId+" .select_item").length;
		if(listNum>=listData.length){
			return;
		}
		var attr_ele = `<tr class="select_item" >
		            <td><div  class="select_w320 wuSelect select_name"></div></td>
					<td><div  class="select_w320 wuSelect select_value noborder"></div></td>
					<td><a class="btn h30 mr10 fl removeItem">
						删除
					</a></td></tr>`;
		$(selectId+' .attr_group table').append(attr_ele);
		var listEle = createSelectNameList(listData);
		$(selectId+' .attr_group .select_name').last().html(listEle);
		attentSelectMode2(selectId,listData);
	})
	
	$(document).on("click",selectId+" .removeItem",function(event){
		event.stopImmediatePropagation();
		let selected_attr_id = $(this).parents(".select_item").data('attr_id');
		let inputArr = $(selectId).find(".attr_selected_name_id").val().split(",");
		let obj = $(this).parents("tr");
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
