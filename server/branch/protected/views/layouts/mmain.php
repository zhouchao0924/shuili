<?php /*layout模板*/?>
<!doctype html>
<html lang="zh">
	<head>
		<meta charset="UTF-8">
	  <meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport">
	  <title><?php echo $this->pageHeader['title'];?></title>
		<meta name="keywords" content="" />
		<meta name="description" content="" />
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta content="black" name="apple-mobile-web-app-status-bar-style" />
		<meta content="telephone=no" name="format-detection" />
		<meta name="keywords" content="调解,居民调解,社区律师,法律援助,公益法律服务,法律服务志愿者,法律咨询,法律服务,法律,律师"/>
		<link rel="shortcut icon " href="" />
		<!-- <link rel="stylesheet" type="text/css" href="../public/css/index/index.css?v=2016080701"/> -->
		<script type="application/javascript">
			var logOutGoToHomePage = <?php echo $this->pageHeader['logOutGoToHomePage'];?>;
		</script>
	</head>
<body>
<div class="containerm" id="page">
	<?php echo $content; ?>
</div><!-- page -->
</body>
</html>
