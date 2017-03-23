<?php /*layout模板*/?>
<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="language" content="en" />
	<title><?php echo $this->pageHeader['title'];?></title>
	<link rel="stylesheet" type="text/css" href="/css/cms/header.css" />
	<link rel="stylesheet" type="text/css" href="/css/cms/menu.css" />
	<script type="text/javascript" src="/js/3th/jqueryMobile/jquery-1.11.1.min.js"></script>
	<script type="text/javascript" src="/js/3th/jqueryMobile/jquery.cookie.js"></script>
	<script type="text/javascript" src="/js/user/leftmenu.js"></script>
	<script>
		var imageUrlHost = "http://lzmtest.u.qiniudn.com/";
	</script>
</head>

<body>
<div class="container" id="page">
	<?php echo $content; ?>
</div><!-- page -->
</body>
</html>
