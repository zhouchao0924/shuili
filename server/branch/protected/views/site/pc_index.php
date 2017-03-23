<?php
	$this->addCssFile(array("index/index.css"));
	$this->addJsFile(array("sea-modules/seajs/1.3.1/sea.js"));
	$this->addJsFile(array("config.js"));
	$this->addJsFile(array("business-modules/index/index.js"));
	// var_dump($starList['starCommunityLawyer']);
?>

	<div class="web-root">
		<div class="w1190">
			<!-- 公益服务网站 -->
			<div class="web">
				<h2 class="web-logo"><img src="<?php echo $this->createUrl('images/index/web.png'); ?>"></h2>
				<ul class="web-nav">
					<li>
						<a href="javascript:;" id="gotoApplyConsult" data-url="/service/applyconsult">
							<b><img src="<?php echo $this->createUrl('images/index/consultation.png'); ?>"></b>
							提交法律咨询
						</a>
					</li>
					<li>
						<a href="javascript:;" id="gotoApplyAssistance" data-url="/service/applyassistance">
							<b><img src="<?php echo $this->createUrl('images/index/assistance.png'); ?>"></b>
							申请法律援助
						</a>
					</li>
					<li>
						<a href="javascript:;" id="gotoApplyMediate" data-url="/service/applymediate">
							<b><img src="<?php echo $this->createUrl('images/index/mediate.png'); ?>"></b>
							申请居民调解
						</a>
					</li>
					<li>
						<a href="/service/findlawyer" id="gotoFindLawyer" data-url="">
							<b><img src="<?php echo $this->createUrl('images/index/look.png'); ?>"></b>
							找律师
						</a>
					</li>
				</ul>
			</div>
			<!-- 维权列表 -->
			<div class="law mt50">
				<ul>
					<li>
						<a href="/legal/list/service/0/1/169/0/1">
							<b class="law-icon1"></b>
							<span>妇女儿童与残疾人维权</span>
						</a>
					</li>
					<li>
						<a href="/legal/list/service/0/2/169/0/1">
							<b class="law-icon2"></b>
							<span>劳动就业与社会保障</span>
						</a>
					</li>
					<li>
						<a href="/legal/list/service/0/3/169/0/1">
							<b class="law-icon3"></b>
							<span>婚姻家庭与遗产继承</span>
						</a>
					</li>
					<li>
						<a href="/legal/list/service/0/4/169/0/1">
							<b class="law-icon4"></b>
							<span>交通事故与医患纠纷</span>
						</a>
					</li>
					<li>
						<a href="/legal/list/service/0/5/169/0/1">
							<b class="law-icon5"></b>
							<span>侵权及损害赔偿</span>
						</a>
					</li>
					<li>
						<a href="/legal/list/service/0/6/169/0/1">
							<b class="law-icon6"></b>
							<span>网络交易及购物纠纷</span>
						</a>
					</li>
					<li>
						<a href="/legal/list/service/0/7/169/0/1">
							<b class="law-icon7"></b>
							<span>旅游消费及保险纠纷</span>
						</a>
					</li>
					<li>
						<a href="/legal/list/service/0/8/169/0/1">
							<b class="law-icon8"></b>
							<span>房地产及物业纠纷</span>
						</a>
					</li>
					<li>
						<a href="/legal/list/service/0/9/169/0/1">
							<b class="law-icon9"></b>
							<span>债权债务及合同纠纷</span>
						</a>
					</li>
					<li>
						<a href="/legal/list/service/0/10/169/0/1">
							<b class="law-icon10"></b>
							<span>刑事案件及其它</span>
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div class="main">
		<div class="w1190">
			<!-- 新闻 -->
			<div class="new clearfix">
				<div class="slide" id="new-slide">
					<div class="hd">
						<ul>
							<?php foreach ($newsList['scroll'] as $k => $v) {
								if($k<4){
									echo '<li><a href="/legal/detail/news/'.$v['id'].'" target="_blank"><img src="'.$v['image'].'" /></a></li>';
								}
							} ?>
						</ul>
					</div>
					<div class="bd">
						<ul>
							<?php foreach ($newsList['scroll'] as $k => $v) {
								if($k<4){
									echo '<li>
										<a href="/legal/detail/news/'.$v['id'].'" target="_blank"><img src="'.$v['image'].'" /></a>
										<p class="text">'.$v['title'].'</p>
									</li>';
								}
							} ?>
						</ul>
					</div>
				</div>
				<div class="item">
					<h2 class="title clearfix">
						<span class="text fl">新闻动态</span>
						<a class="more fr" href="/legal/list/news/0/169/0/1" target="_blank">更&nbsp;多</a>
					</h2>
					<ul>
						<?php foreach ($newsList['list'] as $k => $v) {
								echo '<li><a href="/legal/detail/news/'.$v['id'].'" target="_blank">'.$v['title'].'</a></li>';
						} ?>
					</ul>
				</div>
			</div>
			<!-- 热门活动 -->
			<div class="hot clearfix">
				<div class="hot-slide" id="hot-slide">
					<div class="bd">
						<ul>
							<?php foreach ($eventList['scroll'] as $k => $v) {
								if($k<2){
									echo '<li data-id="'.$v['id'].'">
										<div class="hot-img fl">
											<a href="/legal/detail/event/'.$v['id'].'" target="_blank"><img src="'.$v['image'].'" /></a>
										</div>
										<div class="hot-info fr">
											<h2 class="tle"><a href="/legal/detail/event/'.$v['id'].'" target="_blank">'.$v['title'].'</a></h2>
											<p class="area">地点：'.$v['address'].'</p>
											<p class="time">时间：'.$v['date'].'</p>
											<p class="num">参与人数：<strong>'.$v['joinCount'].'</strong>人</p>';
											if($v['isJoin']){
												echo '<a class="participate gray" href="javascript:;">已参加</a>';
											}else if($v['isClose']){
												echo '<a class="participate gray" href="javascript:;">已关闭</a>';
											}else{
												echo '<a class="participate join" href="/legal/detail/event/'.$v['id'].'" target="_blank">报名参加</a>';
											}
										echo '</div>
									</li>';
								}
							} ?>
						</ul>
					</div>
					<div class="hd">
						<ul>
							<?php foreach ($eventList['scroll'] as $k => $v) {
								if($k<2){
									echo '<li>'.$k.'</li>';
								}
							}?>
						</ul>
					</div>
				</div>
				<div class="item">
					<h2 class="title clearfix">
						<span class="text fl">热门活动</span>
						<a class="more fr" href="/legal/list/event/0/0/169/0/1" target="_blank">更&nbsp;多</a>
					</h2>
					<ul>
						<?php foreach ($eventList['list'] as $k => $v) {
								echo '<li>
									<a href="/legal/detail/event/'.$v['id'].'" target="_blank"><strong>'.$v['categoryName'].'&nbsp;</strong>|&nbsp;'.$v['title'].'</a>
								</li>';
						}?>
						<!-- <li>
							<a href="###"><strong>法在援助&nbsp;</strong>|&nbsp;七条数据七条数据七条数据七条数据七条数据</a>
						</li>
						<li>
							<a href="###"><strong>法在社区&nbsp;</strong>|&nbsp;条数据七条数据七条数据七条数据七条数据</a>
						</li>
						<li>
							<a href="###"><strong>社区说案&nbsp;</strong>|&nbsp;条数据七条数据七条数据七条数据七条数据</a>
						</li>
						<li>
							<a href="###"><strong>考察帮教&nbsp;</strong>|&nbsp;测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试</a>
						</li>
						<li>
							<a href="###"><strong>社区矫正&nbsp;</strong>|&nbsp;公益活动2016年第1期2016年第1期1期1期</a>
						</li>
						<li>
							<a href="###"><strong>法律热线&nbsp;</strong>|&nbsp;公益活动2016年第1期2016年第1期1期1期</a>
						</li>
						<li>
							<a href="###"><strong>法律热线&nbsp;</strong>|&nbsp;公益活动2016年第1期2016年第1期1期1期</a>
						</li> -->
					</ul>
				</div>
			</div>
			<!-- 律师之星 -->

			<div class="item2">
				<h2 class="title clearfix">
					<span class="text fl">公益法律人风采</span>
				</h2>
				<div class="lawyerStar clearfix" id="lawyerStar-slide">
					<div class="hd fl">
						<ul>
							<li>社区律师<i></i></li>
							<li>法律援助律师<i></i></li>
							<li>居民调解员<i></i></li>
							<li>法律服务志愿者<i></i></li>
						</ul>
					</div>
					<div class="bd fr">
						<div class="ulWrap">
							<ul>
								<!-- 社区律师之星 -->
								<?php foreach ($starList['starCommunityLawyer'] as $k => $v) {
									echo '<li>
										<a href="/user/center/"'.$v['userId'].'">
											<div class="img">
												<img src="'.$v['iconUrl'].'" />
											</div>
											<div class="info">
												<p class="name">'.$v['realName'].'</p>
												<!---->
											</div>
										</a>
									</li>';
								}
								?>
							</ul>
							<ul>
								<!-- 法律援助律师之星 -->
								<?php foreach ($starList['starLegalaid'] as $k => $v) {
									echo '<li>
										<a href="/user/center/"'.$v['userId'].'">
											<div class="img">
												<img src="'.$v['iconUrl'].'" />
											</div>
											<div class="info">
												<p class="name">'.$v['realName'].'</p>

											</div>
										</a>
									</li>';
								}
								?>
							</ul>
							<ul>
								<!-- 居民调解员之星 -->
								<?php foreach ($starList['starMediator'] as $k => $v) {
									echo '<li>
										<a href="/user/center/"'.$v['userId'].'">
											<div class="img">
												<img src="'.$v['iconUrl'].'" />
											</div>
											<div class="info">
												<p class="name">'.$v['realName'].'</p>

											</div>
										</a>
									</li>';
								}
								?>
							</ul>
							<ul>
								<!-- 法律服务志愿者之星 -->
								<?php foreach ($starList['starVolunteer'] as $k => $v) {
									echo '<li>
										<a href="/user/center/"'.$v['userId'].'">
											<div class="img">
												<img src="'.$v['iconUrl'].'" />
											</div>
											<div class="info">
												<p class="name">'.$v['realName'].'</p>

											</div>
										</a>
									</li>';
								}
								?>
							</ul>
							<ul>
								<!-- 法科学子志愿者之星 -->
								<?php foreach ($starList['starVolunteer'] as $k => $v) {
									echo '<li>
										<a href="/user/center/"'.$v['userId'].'">
											<div class="img">
												<img src="'.$v['iconUrl'].'" />
											</div>
											<div class="info">
												<p class="name">'.$v['realName'].'</p>

											</div>
										</a>
									</li>';
								}
								?>
							</ul>
						</div>
					</div>
				</div>
			</div>

			<!-- 调解网介绍 -->
			<div class="introduce clearfix">
				<div class="introduceW clearfix">
					<div class="list">
						<h2>调解网介绍</h2>
						<a href="/introduction/index" target="_blank" style="display:block;"><dl>
							<p>
								“调解网”是周冶陶于2012年3月发起创办的一个公益法律网站，旨在通过普法宣传、法律咨询、居民调解等社区公益法律服务，促使当事人互相理解，解决居民纠纷，化解社区矛盾，推动实现基层社会治理创新。</p>
							<p>
								“调解网”是真正的“第三方”调解平台，是社区服务及普法宣传的线上、线下联动平台，是专业化的互联网微公益平台，是公益性的在线纠纷解决机制（ODR）平台。
							</p>
							<p>
								在线下，“调解网”组织“法在社区”、“社区说案”等社区公益活动，组织未成年人刑事案件之“合适成年人”、“社会调查”、“考察帮教”、“社区矫正”等帮扶涉罪未成年人的公益活动，组织配合人民法院探索进一步深化多元化纠纷解决机制改革的“第三方法律服务”等公益活动。</p>
							<p>
								在线上，“调解网”组织“法律热线”等普法宣传公益活动，提供法律咨询、居民调解、法律援助、推荐诚信律师等公益法律服务，提供ODR及调解服务...</p>
						</dl></a>
					</div>
					<div class="list">
						<h2>发起人介绍</h2>
						<a href="/introduction/index" target="_blank" style="display:block;"><dl>
							<dt class="f16 fb">周冶陶</dt>
							<dd>
								曾任湖北省人民检察院副检察长兼湖北省反贪局首任局长、湖北省检查学校首任校长，历任湖北省人大常委会副秘书长兼研究室主任、省人大常委、省人大法制委员会主任委员、省人大内务司法委员会主任委员等。曾兼任湖北省青少年事务顾问团团长、湖北省妇联常委、湖北省地方人大工作研究会会长、湖北省地方立法研究会会长、武汉仲裁委员会仲裁员等。现为“调解网”发起创始人暨专家咨询委员，湖北省人民检察院专家咨询委员会委员，中南财经政法大学、武汉大学法学院、华中科技大学法学院、武汉工程大学法商学院等多所高校的兼职教授，兼任中国法学会立法研究会常务理事、湖北省地方立法研究会名誉会长、湖北省宪法学研究会副会长、湖北省妇女理论研究会副会长等。1990年以来出版著作（独著或担任主编）8部，在省部级以上刊物公开发表数十篇论文，创办湖北省人大机关刊物并兼任主编10年。
							</dd>
						</dl></a>
					</div>
					<div class="list">
						<h2>发起人寄语</h2>
						<a href="/introduction/index" target="_blank" style="display:block;"><dl>
							<dd>古代哲人亚里士多德在《政治学》一书中提出法治的含义：“已成立的法律获得普遍的服从，而大家所服从的法律本身又应该是制定得良好的法律。”可见，法治的含义包括：一是制定良法，二是制定的法能够得到有效执行。
现代国家应当是法治国家，法律在现代社会具有无比重要的社会功能，它需要执法者、守法者都能熟悉和掌握。可以说，法律规范是全社会从公民领袖到公民每一个人都必须遵守的游戏规则。然而，法学是一门专深的科学知识，它很严谨又很抽象，学起来枯燥难懂难于记忆，很难被大众所掌握，因此宣传和普及法律知识十分重要。
改革开放以来，随着我国法制建设的发展，中国特色社会主义法律体系已经基本形成，国家经济、政治、文化、社会生活各个方面基本做到有法可依，无法可依的混乱局面已经得到根本改变。然而，我国民主与法治的传统比较薄弱，现实生活中有法不依、执法不严、违法不纠的现象还时有发生。法律的生命在于实施，有法不依的法律就是一纸空文。要使“纸上的法”成为“行动中的法”，真正实现...
							</dd>
						</dl></a>
					</div>
				</div>
			</div>
			<!-- 荣誉 -->
			<div class="honor introduce">
				<div class="list">
					<h2>调解网荣誉</h2>
					<div id="demo" style="overflow:hidden;height:112px;">
						<div id="indemo" style="float: left;width:800%;">
							<div id="demo1" style="float:left;">
								<img src="<?php echo $this->createUrl('images/common/1.jpg'); ?>" />
								<img src="<?php echo $this->createUrl('images/common/2.jpg'); ?>" />
								<img src="<?php echo $this->createUrl('images/common/3.jpg'); ?>" />
								<img src="<?php echo $this->createUrl('images/common/4.jpg'); ?>" />
								<img src="<?php echo $this->createUrl('images/common/5.jpg'); ?>" />
								<img src="<?php echo $this->createUrl('images/common/6.jpg'); ?>" />
								<img src="<?php echo $this->createUrl('images/common/7.jpg'); ?>" />
								<img src="<?php echo $this->createUrl('images/common/8.jpg'); ?>" />
								<img src="<?php echo $this->createUrl('images/common/9.jpg'); ?>" />
								<img src="<?php echo $this->createUrl('images/common/10.jpg'); ?>" />
							</div>
							<div id="demo2" style="float:left;"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- 版权 -->

	<!-- 未登录显示弹窗提示 -->
	<div class="dialog" id="LoginDialog" style="display:none;">
		<h2 class="tle">温馨提示<i class="close">X</i></h2>
		<div class="content">
		<img src="<?php echo $this->createUrl('images/server/icons/tip.png'); ?>">
			您需要先登录才能进行此项操作
		</div>
		<div class="btn clearfix">
			<a class="border closedialog" href="javascript:void(0);">我知道了</a>
			<a href="/user/login">登录注册</a>
		</div>
	</div>

	<!-- 律师无法操作显示弹窗提示 -->
	<div class="dialog" id="LawyerDialog" style="display:none;">
		<h2 class="tle">温馨提示<i class="close">X</i></h2>
		<div class="content">
		<img src="<?php echo $this->createUrl('images/server/icons/tip.png'); ?>">
			律师不能提交法律咨询，您可以去“法律服务”里解答回复法律咨询。
		</div>
		<div class="btn clearfix">
			<a class="border closedialog" href="javascript:void(0);">我知道了</a>
			<a class="closedialog" href="javascript:void(0);">取消</a>
		</div>
	</div>

	<!-- 您需要先进行实名认证，才能继续 -->
	<div class="dialog" id="RealNameDialog" style="display:none;">
		<h2 class="tle">温馨提示<i class="close">X</i></h2>
		<div class="content">
		<img src="<?php echo $this->createUrl('images/server/icons/tip.png'); ?>">
			您需要先进行实名认证，才能继续
		</div>
		<div class="btn clearfix">
			<a class="border closedialog" href="javascript:void(0);">我知道了</a>
			<a href="/user/info?tab=2">去认证</a>
		</div>
	</div>

	<div class="dialog" id="AddressDialog" style="display:none;">
		<h2 class="tle">温馨提示<i class="close">X</i></h2>
		<div class="content">
		<img src="<?php echo $this->createUrl('images/server/icons/tip.png'); ?>">
			您需要先填写地址信息，才能继续
		</div>
		<div class="btn clearfix">
			<a class="border closedialog" href="javascript:void(0);">我知道了</a>
			<a href="/user/info">去填写</a>
		</div>
	</div>
	<script>

	<!--

	var speed=20; //数字越大速度越慢
	var tab=document.getElementById("demo");
	var intab = document.getElementById("indemo");
	var tab1=document.getElementById("demo1");
	var tab2=document.getElementById("demo2");
	tab2.innerHTML=tab1.innerHTML;
	function Marquee(){
		// console.log(tab.scrollLeft);
		if(tab2.offsetWidth-tab.scrollLeft<=0){
			tab.scrollLeft-=tab1.offsetWidth
		}else{
			tab.scrollLeft++;
		}
		if(tab.scrollLeft>=tab1.style.width+tab2.style.width){
			intab.appendChild(tab1);
		}
	}
	var MyMar=setInterval(Marquee,speed);
	tab.onmouseover=function() {clearInterval(MyMar)};
	tab.onmouseout=function() {MyMar=setInterval(Marquee,speed)};
	-->

	</script>
