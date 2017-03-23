<?php /*layout模板*/?>
<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="language" content="en" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<meta content="telephone=no" name="format-detection">
	<meta name="apple-touch-fullscreen" content="yes">
	<meta name="keywords" content="调解,居民调解,社区律师,法律援助,公益法律服务,法律服务志愿者,法律咨询,法律服务,法律,律师"/>
	<meta name="description" content="调解网 （www.tiaojie.com）是周冶陶创办的一个公益网站，通过法律咨询、说服疏导、居民调解等方式，促使当事人互相理解，在平等协商基础上自愿达成居民调解协议，解决居民纠纷，化解居民矛盾纠纷，实现基层社会治理创新。" />
	<link rel="shortcut icon" href="<?php echo $this->createUrl('images/common/favicon.ico'); ?>" />
	<title><?php echo $this->pageHeader['title'];?></title>
	<script type="application/javascript">
		window.logOutGoToHomePage = <?php echo $this->pageHeader['logOutGoToHomePage'];?>;
	</script>
</head>
<body>
<div class="container" id="page">
	<?php echo $content; ?>
</div><!-- page -->
</body>
</html>
