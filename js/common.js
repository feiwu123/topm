//点击弹出购物车列表
$('#shopCar').on('click',function(){
	$('#shoppingCar').addClass('popup');
	$('body').addClass('guding');
})

$('.menu_tabs .tabItem').on('click',function(){
	var cate_id = $(this).data("cate_id");
	if(cate_id>0){
	    window.location.href="category.php?id=" + cate_id; 
	}
})

$(".shopcar_icon").on('click',function(){
	$('#shoppingCar').addClass('popup');
	$('body').addClass('guding');
})

$('#shoppingCar').on('click','#know',function(){
	$('#shoppingCar').removeClass('popup');
	$('body').removeClass('guding');
})

//购物车列表 去结算按钮
$(document).on('click','.gotoPay',function(){
    var cart_value = $("#cart_value").val();
    console.log(123);
    
    if(cart_value.length == 0){
        popToast('tips','','Por favor seleccione al menos un artículo',1,()=>{
				$('.totast').remove();
			})
        return false;
    }
	$.ajax({
		url:"user.php?act=verifying_is_login",
		dataType: "json",
		success:function(result){
		    $('#loadingCon').addClass('hide');
			if(result.error == 624) {
				$("#noLogin").removeClass("popup").addClass("popup");
				$('#shoppingCar').removeClass('popup');
			} else {
			    location.href = "flow.php?step=checkout&cart_value="+cart_value;
			}
		},
		beforeSend:function(){
			$('#loadingCon').removeClass('hide');
	   }
	});
})

// $('#shoppingCar').on('click','.topCon .deleteIcon',function(){
// 	$('#shoppingCar').removeClass('popup');
// 	$('body').removeClass('guding');
// })

//公共弹窗提示
//imgSrc 提示图片类型 1laji 垃圾桶 2tips 有问题  success fail
//title 提示名称
//msg  提示信息
//btnType 1单个按钮 2双按钮
//func 点击按钮执行函数
//btn_text 其中一个按钮的文本
//remove_icon 是否显示右上角删除icon

function popToast(imgType,title,msg,btnType,func,btn_text='Listo',remove_icon=true){

    var imgUrl;
    var toast = '',buttons = '';
    
    switch(imgType){
        case 'laji':
            imgUrl = "/images/hzp2/laji.svg";
        break;
        case 'success':
            imgUrl = "/images/hzp2/success.svg";
        break;
        case 'fail':
            imgUrl = "/images/hzp2/fail.svg";
        break;
        default:
            imgUrl = "/images/hzp2/tips.svg";
    }
    switch(btnType){
        case 1:
            buttons = `<div class="knowBtn cancel">
            ${btn_text}
            </div>`;
        break;
        default:
            buttons = `<div class="knowBtn">
            ${btn_text}
        </div>
        <div class="cancel">Cancel</div>`;
        break;
    }
    
    var show_img='';
    if(remove_icon){
       show_img ='<img src="/images/hzp2/delete.svg" />';
    }
    
    
    var toastTemplate = `<div class="totast" id="totastMsg">
    <div class="bgCon">
    </div>
    <div class="pupCon">
    <div class="topCon">
    <div class="title">
    </div>
    <div class="deleteIcon">
    ${show_img}
    </div>
    </div>
    <div class="centerCon">
    <div class="tipImg">
    <img src="${imgUrl}"/>
    </div>
    <div class="tipTitle">
    ${title}
    </div>
    <div class="tipMsg">
    ${msg}
    </div>
    </div>
    <div class="bottomCon">
    ${buttons}
    </div>
    </div> 
    </div>`;
    
    $('body').append(toastTemplate); 
    $('#totastMsg .knowBtn').on('click',function(){
        $(this).off("click",func);
        func();
    })
    $('#totastMsg .deleteIcon').on('click',function(){
        $(this).off("click",func);
        $('#totastMsg').remove();
    })
    $('#totastMsg .cancel').on('click',function(){
        $(this).off("click",func);
        $('#totastMsg').remove();
    })

}

$('.login-skip').on('click',function(e){
    e.stopPropagation();
	var skip_url = $(this).data("href");
		//ajax提交
	$.ajax({
		url:"user.php?act=verifying_is_login",
		dataType: "json",
		success:function(result){
			if(result.error == 624) {
				$("#noLogin").removeClass("popup").addClass("popup");
			} else {
			    location.href = skip_url;
			}
		},
	});
})

//关闭登录弹出框

$(document).on('click',".deleteIcon",function(){
	$(this).parents('.popup').removeClass('popup');
	$('body').removeClass('guding');
})

$(document).ready(function(){
    //登录提交表单
    $('.loginIn').on('click',function(){
    	userLogin();
    })
})



//登录提交表单
function userLogin(){
    var username_empty = "Ingrese su nombre de usuario";
	var username_shorter = " La longitud del nombre de usuario no puede ser inferior a 4 caracteres.";
	var password_empty = "Ingrese su contraseña";
	var password_shorter = "La contraseña de inicio de sesión no puede tener menos de 6 caracteres.";
						
	var loginName 		= $("input[name='username']").val().trim(); //用户名
	var loginPassword 	= $("input[name='password']").val().trim(); //密码
	//var back_act 		= $("input[name='back_act']").val().trim(); //返回地址
	//var dsc_token 		= $("input[name='dsc_token']").val().trim(); //token
	//var phoneName 		= $("input[name='phone_name']").val().trim(); //手机号码
	//var loginPhonecode 	= $("input[name='login-phone-code']").val().trim();  //手机号登录验证码
	var preg			= /^[0-9]*$/;//简单的方法 判断是否是数字

	var act = 'act_login_username';
	$("#login_wrong").text('');
	$(".showMsg").hide();
	//两种方式登录
	if(act == 'act_login_username'){ //密码形式登录
		if(loginName.length == 0){ //用户名不能为空
			msgText(username_empty);return false;
		}

		if(loginName.length < 4){ //用户名不能少于4个字符
			msgText(username_shorter);return false;
		}
		if(loginPassword.length == 0){ //登录密码必填
			msgText(password_empty);return false;
		}
		if(loginPassword.length < 6){ //登录密码不能少于6个字符
			msgText(password_shorter);return false;
		}else{
			//ajax提交
			$.ajax({
				url:"user.php?act=act_login",
				type:"post",
				data: {username:loginName, password:loginPassword},
				dataType: "json",
				success:function(result){
				    $('#loadingCon').addClass('hide');
					if(result.error>0) {
						msgText(result.message);return false;
					} else {
					    location.reload();return false;
					    
						if(result.is_validated == 1){
							location.href = result.url;
						}else{
							location.href = "user.php?act=user_email_verify";
						}
					}
				},
				beforeSend:function(){
				    $('#loadingCon').removeClass('hide');
		         }
			});
		}
	}

}

function msgText(msg){
	$(".showMsg").show();
	$("#login_wrong").text(msg);
	$(".wrong_msg").text(msg);
}


$('#shoppingCar').on("click",".tableTr input[type='checkbox']",function(){
	var cart_value_ele  = $('#cart_value');
	var rec_id          = String($(this).data('rec_id'));
	var ischecked       =  $(this).prop('checked');
	var rec_index;
	var cart_value      = cart_value_ele.val();
	var cart_value_arr  = cart_value.split(',');
	
	var checkedNum = $(".table_body input[type='checkbox']:checked").length;
	var checkNum = $(".table_body input[type='checkbox']").length;
	//选中取消单个状态
	
	var rec_id_arr = rec_id.split(',');
	rec_id_arr.forEach(function(rec_id_item,index){
	    rec_index = cart_value_arr.indexOf(rec_id_item);

    	if(ischecked){
    		if(rec_index<0){
    			cart_value_arr.push(rec_id_item);
    		}
    		//如果全部选中 全选状态是checked
    		if(checkedNum == checkNum){
    			$('#allpros').prop('checked',true);
    		}
    	}else{
    		if(rec_index>=0){
    			 cart_value_arr.splice(rec_index,1);
    		}
    		if(checkedNum < checkNum){
    			$('#allpros').prop('checked',false);
    		}
    	}
	    
	})


	cart_value_arr.forEach((item,index)=>{
		if(item==''){
			 cart_value_arr.splice(index,1);	
		}
	})
	cart_value_arr.length>0?cart_value = cart_value_arr.join(','):cart_value ='';
	$('#cart_value').val(cart_value);
	
	$.ajax({
		url:"flow.php?step=ajax_cart_goods_amount",
		type:"post",
		data: {rec_id:cart_value},
		dataType: "json",
		success:change_cart_goods_response,
		beforeSend:function(){
		    $('#loadingCon').removeClass('hide');
         }
	});

})

function change_cart_goods_response(result){
    $('#loadingCon').addClass('hide');
	$(".cart_amount").html(result.goods_amount);
	$(".cart_num").html(result.subtotal_number);
	$(".discount").html(result.dis_amount);

}

$('#shoppingCar').on("click","#allpros",function(){
	var ischecked =  $(this).prop('checked');
	var cart_value_arr = [];
	var cart_value = '';
	if(ischecked){
		$(".table_body input[type='checkbox']").prop('checked',true);
		$(".table_body input[type='checkbox']:checked").each(function(index,item){
			cart_value_arr.push($(item).data('rec_id'));
		})
		cart_value = cart_value_arr.join(',');
		$('#cart_value').val(cart_value);
	}else{
		$(".table_body input[type='checkbox']").prop('checked',false);
		$('#cart_value').val('');
	}
	$.ajax({
		url:"flow.php?step=ajax_cart_goods_amount",
		type:"post",
		data: {rec_id:cart_value},
		dataType: "json",
		success:change_cart_goods_response,
		beforeSend:function(){
    	    $('#loadingCon').removeClass('hide');
         }
	});
})

//购物车滚动条
$("#shoppingCar .table_body").mCustomScrollbar();


$('#mobile_header_popup').on('click','.cancel_icon',function(){
	$('#mobile_header_popup').addClass('hide');
	$('body').removeClass('guding');
})

$(".top_header .category_icon").on('click',function(){
	$('#mobile_header_popup').removeClass('hide');
	$('body').addClass('guding');
})
$(".top_header .user_center_icon").on('click',function(){
	$('#mobile_usercenter_popup').removeClass('hide');
	$('body').addClass('guding');
})
$('#mobile_usercenter_popup').on('click','.cancel_icon',function(){
	$('#mobile_usercenter_popup').addClass('hide');
	$('body').removeClass('guding');
})

$("#mobile_header_popup").on("click",".parent_cate .title",function(){
	var is_expand = $(this).data("expand");
	$("#mobile_header_popup .son_cate").addClass('hide');
	$("#mobile_header_popup .title").find("img").attr("src","images/hzp2/add.svg");
	$("#mobile_header_popup .title").data("expand",false);
	if(is_expand){
		$(this).find("img").attr("src","/images/hzp2/add.svg");
		$(this).data("expand",false);
	}else{
		$(this).find("img").attr("src","images/hzp2/dadd.svg");
		$(this).siblings(".son_cate").removeClass('hide');
		$(this).data("expand",true);
	}
})	
    /**
      * 判断是否是pc设备
      */
  
    var mobile_scroll = false; 
    function IsPC(){
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone","SymbianOS", "Windows Phone", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
            }
        }
        if(window.screen.width>=992){
            flag = true;
        }
        return flag;
    }
	
$(document).on('click', '#checkPackages .closeIcon', function(){
	$("#checkPackages").modal('hide');
})


$(document).on("click","#getSheinAddress",function(){
	alert('getAddress');
	let sheinOrderid = $("#sheinOrderId").val();
	$.ajax({
		url:"flow.php?step=ajax_cart_goods_amount",
		type:"post",
		data: {orderid:sheinOrderid},
		dataType: "json",
		success:change_cart_goods_response,
		beforeSend:function(){
		    $('#loadingCon').removeClass('hide');
	     }
	});
})
//点击面包屑分类
function diySelect(){
	$(document).on("click",".bread_categoryList",function(event){
		event.stopImmediatePropagation();
		let that = this;
		$(that).find(".subListCates").addClass('selected');
		
		$(document).on("click",function(e){
			$(that).find(".subListCates").removeClass('selected');
		});
	});
}
diySelect();