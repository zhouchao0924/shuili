<!DOCTYPE HTML>
<html>
<head>
	<title><?php echo $success == 'true'?'成功':'失败';?></title>
<script type="text/javascript">
var t;
t=1;

function send(){
	t=t-1;
	document.getElementById('timer').innerHTML='还有'+t+'秒跳转';
	
	if(t==0){
		<?php if(empty($url)){?>
		location.replace(document.referrer);
		<?php }else{?>
		window.location.href='<?php echo $url;?>';
		<?php }?>
	}
}
setInterval("send();",1000);
</script>
<style>
	span{display:block;text-align:center;}
</style>
</head>
<body>
	<div style="width:200px;margin:0 auto;margin-top:60px;text-align:center;">
		<span><?php echo $message;?></span>
		<span id="timer">还有1秒跳转<span>
	</div>
</body>
</html>