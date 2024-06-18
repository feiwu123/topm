var mySwiper1 = new Swiper('.banner-list', {
  autoplay:{
	  delay: 3000,
	  stopOnLastSlide: false,
	  disableOnInteraction: false
  },
  loop : true,
  pagination: {
	el: '.swiper-pagination',
  },
  navigation: {
	nextEl: '.banner-next',
	prevEl: '.banner-prev',
  },
  updateOnImagesReady : true
});


//瀑布流
var setting = {
	gap: 10,
	gridWidth: [0,200,600,900],
	refresh: 300,
	scrollbottom : {
		ele: $('.app'),
		endtxt : 'No More~~',
		gap: 200,
		callback: function(container){	
			var box = $('.product_list');
			
			var cat_id = $("#cat_id").val();
			var page = $("#page").val();
			var max_page = $("#max_page").val();
			
			if(page>0 && page <= max_page){
			
				$("#page").val(parseInt(page)+1);
				//获取该类目下面的商品
				$.ajax({
					url:"category.php",
					data:{act: 'ajax_get_goods', category: cat_id, page: page},
					dataType:"json",
					success:function(result){
						box.append(result.goods_cont);
						container.waterfall();
						
					}
				});
			}
			
			
			
		}
	}
};
$(function(){
	var cat_id = $("#cat_id").val();
	//获取当前类目所属的二级类目
	get_category_child(cat_id);
	//获取该类目下面的商品
	get_category_goods(cat_id);

	
	
	
})

//获取指定类目的二级类目
function get_category_child(cat_id){
	$.ajax({
		url:"category.php",
		data:{act: 'get_child', category: cat_id},
		dataType:"json",
		success:function(result){
			if(result.cat_id > 0){
				$(".cate_"+result.cat_id+" .parentLi").removeClass("noChild").addClass("expand");
				$(".cate_"+result.cat_id+" .parentLi").data("hasChild", true);
				$(".cate_"+result.cat_id+" .childList").addClass("expandList").html(result.goods_cont);
				$(".cate_"+result.cat_id+" .parentLi .icons img").attr('src','/images/hzp2/dadd.svg');
			}
		}
	});
}

//获取该类目下面的商品
function get_category_goods(cat_id){
	var page = $("#page").val();
	if(page==0){
	    page = 1;
	}
	$.ajax({
		url:"category.php",
		data:{act: 'ajax_get_goods', category: cat_id, page: page},
		dataType:"json",
		success:function(result){
			
			if(page == 1){
				$(".product_list").html(result.goods_cont);
			}else{
				$(".product_list").append(result.goods_cont);
			}
			$("#max_page").val(result.max_page);
			if(result.max_page>page && Number(result.count)!=0){
				$("#page").val(parseInt(page)+1);
			}else{
				$("#page").val(0);
			}
			$('.product_list').waterfall(setting);
		}
	});
}



//点击分类列表
$('.menu_list').on('click','.parentLi',function(){
	
	var isExpand = $(this).siblings('.childList').hasClass('expandList');
	$('.childList').removeClass('expandList');
	$('.parentLi .icons img').attr('src','/images/hzp2/add.svg');
	
	if(isExpand){
		$(this).siblings('.childList').removeClass('expandList');
		$(this).find('.icons img').attr('src','/images/hzp2/add.svg');
	}else{
		if($(this).siblings('.childList').html().length == 0){
		//沒有子类目 需要通过ajax获取
			var cat_id = $(this).parents('li').data("cat_id");
			get_category_child(cat_id);
		}
		$(this).siblings('.childList').addClass('expandList');
		$(this).find('.icons img').attr('src','/images/hzp2/dadd.svg');
	}
	
})

//二级类目点击
$('.menu_list').on('click','.childList div.item',function(){
	
	if(!$(this).hasClass("active")){
		var cat_id = $(this).data("cat_id");
		
		$("#page").val(0);
		$("#max_page").val(1);
		$("#cat_id").val(cat_id);
		
		get_category_goods(cat_id);
	}
	$(".menu_list .childList div.item").removeClass("active");
	$(this).addClass("active");
			
})