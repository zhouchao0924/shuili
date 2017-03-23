<div class="head">
  <div class="w1190 clearfix">
    <div class="head-area">
      <i class="icon-area"></i>
      <span class="text"><?php echo $city['name'];?></span>
    </div>
    <h1 class="head-logo">
      <a href="<?php echo $homePage;?>"><img src="<?php echo $logo; ?>"></a>
      <span class="head-text">调解的力量，身边的公益，法律人在社区！</span>
    </h1>
    <ul class="head-nav">
      <li>
        <a href="<?php echo $homePage;?>">
          <b class="icon-home"></b>
          首页
        </a>
      </li>
      <li>
        <a href="/legal/list/service/0/0/<?php echo $city['id'];?>/0/1">
          <b class="icon-server"></b>
          法律服务
        </a>
      </li>
      <li>
        <a href="/legal/list/event/0/0/<?php echo $city['id'];?>/0/1">
          <b class="icon-activity"></b>
          公益法律活动
        </a>
      </li>
      <li>
        <a href="/introduction/index">
          <b class="icon-introduce"></b>
          调解网介绍
        </a>
      </li>
      <li>
        <a href="javascript:;">
          <b class="icon-user"></b>
          个人中心
          <?php if($mailUnReadCount>0){
            echo '<span class="msgnum">'.$mailUnReadCount.'</span>';
          }?>

        </a>
        <?php
          if($isLogin){
            echo '<div class="drop-down">
              <s class="sanjiao"></s>
              <a href="/user/center/'.$userId.'">
                <i class="down-home"></i>
                我的主页
              </a>
              <a href="/user/mylist">
                <i class="down-server"></i>
                我的法律服务
              </a>
              <a href="/user/legal/event/list/0/2/1">
                <i class="down-activity"></i>
                我的活动
              </a>
              <a href="/mail/list">
                <i class="down-letter"></i>
                我的私信
              </a>
              <a href="/user/settings">
                <i class="down-set"></i>
                设置
              </a>
              <a href="javascript:;" id="quit">
                <i class="down-return"></i>
                退出
              </a>
            </div>';
          }else{
            echo '<div class="drop-down">
              <s class="sanjiao"></s>
              <a href="/user/login">
                <i class="down-home"></i>
                登录
              </a>
              <a href="/user/register">
                <i class="down-server"></i>
                注册
              </a>
            </div>';
          }
        ?>
      </li>
    </ul>
  </div>
</div>
