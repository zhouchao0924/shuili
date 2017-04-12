<?php

//    $c = file_get_contents("/tmp/tt.txt");
//    $t = explode("\n",$c);
//    echo "<pre>";
//
//    $mysql = mysql_connect("127.0.0.1","mysql","mysql");
//    mysql_select_db("tj",$mysql);
//    mysql_set_charset("utf8");
//    $ii = array();
//    $item = array();
//    foreach ($t as $row){
//        $rr = explode(" ",$row);
//
//        $ttt = array();
//        foreach ($rr as $rrrrr){
//            $xxx = trim($rrrrr);
//            if($xxx != ""){
//                $ttt[] = $xxx;
//            }
//        }
//        if(count($ttt) < 7){
//            $ttt[6] = $ttt[5];
//            $ttt[5] = "";
//        }
//
//        $o0 = trim($ttt[0]);
//        $o1 = trim($ttt[1]);
//        $o2 = trim($ttt[2]);
//        $o3 = trim($ttt[3]);
//        $o4 = trim($ttt[4]);
//        $o5 = trim($ttt[5]);
//        $o6 = trim($ttt[6]);
//        $ix = $o6;
//        $sql = "select * from tjw_user_base where id = ".$o0;
//        $result = mysql_query($sql);
//        $row = mysql_fetch_row($result);
//        if(empty($row)){
//            print_r($ttt);
//        }else{
//            $item[] = array($o0,$o1,$o2,$o3,$o4,$o5,$o6);
//        }
//        if($ix == "" || $ix == "\""){
//            print_r($ttt);
//        }
//        $ii[$ix] = $ix;
//    }
//
////    print_r($ii);
////    print_r($item);
//    die;
//    echo (htmlspecialchars_decode("<p>城管收车子时。车主不让收。城管就强制收车 &nbsp;收车过程中把人的脚弄骨折了 &nbsp;要城管赔偿他们不肯 &nbsp;我们应该怎么办</p>"));
//    die;
//    $row['url'] = "aaa.bb.com";
//    var_dump(strpos($row['url'],"http://"));
//    if(strpos($row['url'],"http://") === false){
//        $row['url'] = "http://".$row['url'];
//        echo "xxx";
//    }
//    var_dump(filter_var($row['url'],FILTER_VALIDATE_URL));
//    die;
//    public static $serviceLegalAdviceCategory = array(
//    PopularData::SERVICE_LEGAL_ADVICE_WOMAN_CHILD_HANDICAPPED    => "妇女儿童与残疾人维权",
//    PopularData::SERVICE_LEGAL_ADVICE_LABOUR_PROTECTION          => "劳动就业及社会保障",
//    PopularData::SERVICE_LEGAL_ADVICE_FAMILY_LEGACY              => "婚姻家庭与遗产纠纷",
//    PopularData::SERVICE_LEGAL_ADVICE_ACCIDENT_TREATMENT         => "交通事故与医患纠纷",
//    PopularData::SERVICE_LEGAL_ADVICE_OBLIGATIONS_DAMAGE         => "债权及损害赔偿",
//    PopularData::SERVICE_LEGAL_ADVICE_SHOPPING                   => "网络交易与购物纠纷",
//    PopularData::SERVICE_LEGAL_ADVICE_TOUR_INSURANCE             => "旅游消费与保险纠纷",
//    PopularData::SERVICE_LEGAL_ADVICE_PROPERTY_TENEMENT          => "房地产与物业纠纷",
//    PopularData::SERVICE_LEGAL_ADVICE_DEBT_CONTRACT              => "债权债务及合同纠纷",
//    PopularData::SERVICE_LEGAL_ADVICE_LITIGATION_OTHER           => "形式诉讼其他纠纷"
//);
//   $jf = Array
//    (
//        "其它纠纷" => 10,
//    "未分类" => 10,
//    "家庭调解" => 10,
//    "房屋、物业及相邻权纠纷" => 8,
//    "网络购物或跨境消费纠纷" => 6,
//    "劳动就业及社会保障" => 2,
//    "离婚纠纷" => 3,
//    "房屋买卖或房屋租赁" => 8,
//    "社区物业管理" => 8,
//    "交通事故纠纷" => 4,
//    "人身侵权及轻微伤害" => 10,
//    "医疗纠纷" => 4,
//    "家庭纠纷" => 3,
//    "一般消费纠纷" => 6,
//    "旅游消费纠纷" => 7,
//    "妇女儿童维权" => 1,
//    "其它消费纠纷" => 10,
//    "人身侵权及轻微伤害纠纷" => 10,
//    "网络购物纠纷" => 6,
//    "劳动就业及社会保障纠纷" => 2,
//);
//    $content = file_get_contents("/tmp/xxx.txt");
//    $tt = json_decode($content, true);
//    //{"iphone":18899220011,"isAnonymous":0,"provinceName":"\u6e56\u5317\u7701",
//    //"cityName":"\u6b66\u6c49\u5e02","districtName":"\u6c5f\u5cb8\u533a",
//    //"streetName":"\u4e00\u5143\u8857","communityName":"\u626c\u5b50","headerImg":"","userName":"tj4000"}
////    $mysql = mysql_connect("121.41.98.108","mysql","mysql@121");
////    $mysql = mysql_connect("127.0.0.1","mysql","mysql");
////    mysql_select_db("tj",$mysql);
////    mysql_set_charset("utf8");
////    $sql = "select id,nick_name from tjw_user_base order by id asc";
////    $rs = mysql_query($sql);
////    $xr = array();
////    while ($row = mysql_fetch_array($rs)){
////        $xr[] = $row;
////    }
////    file_put_contents("/tmp/xus.txt",json_encode($xr));
////    die;
//    $cut = file_get_contents("/tmp/xus.txt");
//    $userList = json_decode($cut,true);
//    $user = array();
//    foreach($userList as $uu){
//        $user[$uu['id']] = $uu['nick_name'];
//    }
////    echo "<pre>";print_r($user);die;
//    $tt = json_decode($content, true);
//    $aaa = array(
//        "iphone"=>"",
//        "isAnonymous"=>0,
//        "provinceName"=>"湖北省",
//        "cityName"=>"武汉市",
//        "districtName"=>"",
//        "streetName"=>"",
//        "communityName"=>"",
//        "headerImg"=>"",
//        "userName"=>"",
//    );
//    //$ttttty = array();
//    echo "<pre>";
//    foreach ($tt as $v){
//        //print_r($v);//die;
//        //$ttttty[$v['category_title']] = $v['category'];
//        //continue;
//        $uid = $v['uid'];
//        if(!isset($user[$uid])){
//            continue;
//        }
//        $title = $v['title'];
//        if(!empty($v['category_title'])){
//            $cat = $jf[$v['category_title']];
//        }else{
//            $cat = 10;
//        }
//
//
//        $content = $v['content'];
//        $ct = date("Y-m-d H:i:s",$v['cTime']);
//        $phone = "";
//        if(!empty($v['phone'])){
//            if(strlen($v['phone']) != 11){
//                $phone = "";
//            }else{
//                $phone = $v['phone'];
//            }
//        }
//        $aaa['phone'] = $phone;
//        if(empty($v['name'])) {
//            $aaa['userName'] = $user[$uid];
//        }else{
//            $aaa['userName'] = $v['name'];
//        }
//        $tm = date("Y-m-d H:i:s");
//        $xxxxxx = json_encode($aaa);
//        $end = str_replace("\\","\\\\",$xxxxxx);
//        $sql = "insert into tjw_service (service_type,user_id,title,category,content,tjw_province,tjw_city,create_time,update_time,ext_info,crowd,start_time,end_time,is_top,is_public) values
//                (1,'".$uid."','".$title."','".$cat."','".$content."',17,169,'".$ct."','".$ct."','".$end."','','".$tm."','".$tm."',0,1)";
//        //echo $sql;
////        mysql_query($sql);
//    }
//    //print_r($ttttty);die;
//    die;
//    $ut = Array
//    (
//        "四级调解员" => 4,
//        "五级调解员" => 5,
//        "法科学子志愿者" => "法科学子志愿者",
//        "三级调解员" => 3,
//    );
//    $content = file_get_contents("/tmp/info1.txt");
//    $us = "普通会员";
//    $tmp = explode("\n",$content);
//    $data = array();
//    $userType = array();
//    //$icon = array();
//    echo "<pre>";
//    $mysql = mysql_connect("127.0.0.1","mysql","mysql");
//    mysql_select_db("tj",$mysql);
//    mysql_set_charset("utf8");
//    foreach($tmp as $key=>$v){
//        if($key <= 1){
//            continue;
//        }
//        $v = trim($v);
//        if(empty($v)){
//            continue;
//        }
//        $x = explode("|", $v);
//        if(count($x) != 43){
//            break;
//        }
//        if($us != $x[41]){
//            //print_r($x);
//        }
//        $tuserType = trim($x[41]);
//        $userType[$tuserType] = $tuserType;
//        //print_r($x);
//        $icon = $x[37];
//        $email = $x[2];
//        $pwd = $x[3];
//        $nickname = $x[4];
//        $cell = $x[15];
//        $sex = $x[5];
//        if($sex == 0){
//            $sex = 1;
//        }else{
//            $sex = 0;
//        }
//        $date = date("Y-m-d H:i:s");
//        $time = time() - 100 * 24 * 3600;
//        $uptm = date("Y-m-d H:i:s",$time);
//        //print_r($x);die;
//        $sql = "insert into tjw_user_base (id,password,cell_phone,email,icon_url,nick_name,sex,create_time,last_update_nickname_time)
//                values ('".$x[0]."','".$pwd."','".$cell."','".$email."','".$icon."','".$nickname."','".$sex."','".$time."','".$uptm."')";
//        //echo $sql;die;
//        mysql_query($sql,$mysql);
//    }
//    print_r($userType);
//    print_r($icon);
//    die;
//    $arr = array(
//        "/tmp/ts_dsevent.txt"=>4,//社区调查
//        "/tmp/ts_fsevent.txt"=>5,//考察帮教
//        "/tmp/ts_devent.txt"=>6,//社区矫正
//        "/tmp/ts_esevent.txt"=>7,//社区矫正
//        "/tmp/ts_sevent.txt"=>1,//法在社区
//        "/tmp/ts_asevent.txt"=>2,//法在援助
//        "/tmp/ts_bsevent.txt"=>3,//社区说法
//    );
//    $f = "/tmp/ts_bsevent.txt";
//    $m = file_get_contents($f);
//    $l = explode("\n",$m);
//    $string = '{"headerImg":"","isBold":0,"authorName":"调解网","orgName":"调解网","provinceName":"湖北省","cityName":"武汉市","districtName":""}';
//    $extra = json_decode($string,true);
//    $extra["authorName"] = "调解网";
//    $extra["orgName"] = "调解网";
//    $extra["provinceName"] = "湖北省";
//    $extra["cityName"] = "武汉市";
//    //$mysql = mysql_connect("127.0.0.1","mysql","mysql");
//    //$mysql = mysql_connect("121.41.98.108","mysql","mysql@121");
//    mysql_select_db("tj",$mysql);
//    mysql_set_charset("utf8");
//    echo "<pre>";
//
//    foreach ($l as $k=>$v){
//        $t = explode("^",$v);
//        //print_r($t);die;
//        $title = $t[2];
//        $content = trim($t[3],"\"");
//        $content = str_replace("\"\"","\"",$content);
//        $content = str_replace("'","\'",$content);
//        $creatTime = date("Y-m-d H:i:s",($t[9]));
//        $startTime = date("Y-m-d H:i:s",($t[6]));
//        $endTime = date("Y-m-d H:i:s",($t[7]));
//
//        $end = json_encode($extra);
//        $end = str_replace("\\","\\\\",$end);
//        $sql = "insert into tjw_service (`service_type`,`user_id`,`is_admin`,`title`,`category`,`content`,`tjw_province`,`tjw_city`,`tjw_district`,
//  `tjw_street`,`create_time`,`ext_info`,`crowd`,`start_time`,`end_time`,`is_public`) VALUES (
//    '5','1','1','".$title."','".$arr[$f]."','".$content."','17','169','0','0','".$creatTime."','".$end."','','".$startTime."','".$endTime."','1')";
//        //echo $sql.";";
//
//        //mysql_query($sql,$mysql);
//    }
//    die;
    //error_reporting(E_ALL);
//    $content = '<img s="aaa" src=""http://aa.bb.cc/a.jpg"" />';
//    preg_match("/\<img[\S\s]*src=[\s]*\"([\S\s]+)\"[\S\s]*\/\>/",$content,$mk);
//    print_r($mk);
//    die;
//    $m = file_get_contents("/tmp/ts_tiaojie_news.txt");
//    $l = explode("\n",$m);
//    $string = '{"headerImg":"","isBold":0,"authorName":"调解网","orgName":"调解网","provinceName":"湖北省","cityName":"武汉市","districtName":""}';
//    $extra = json_decode($string,true);
//    $extra["authorName"] = "调解网";
//    $extra["orgName"] = "调解网";
//    $extra["provinceName"] = "调解网";
//    $extra["cityName"] = "调解网";
//    $mysql = mysql_connect("121.41.98.108","mysql","mysql@121");
//    mysql_select_db("tj",$mysql);
//    mysql_set_charset("utf8");
//
//    foreach ($l as $k=>$v){
//        $v = trim($v);
//        if(empty($v)){
//            continue;
//        }
//        $t = explode("^",$v);
//        $title = $t[1];
//        $content = trim($t[2],"\"");
//        $content = str_replace("\"\"","\"",$content);
//        $content = str_replace("'","\'",$content);
//        $creatTime = date("Y-m-d H:i:s",($t[3]));
//        $image = trim($t[7]);
//        if($t[0] ==79){
//            echo $image;
//
//        }
//        if(!empty($image)){
//            $image = "http://www.tiaojie.com/uploadFile/news/".$image;
//        }else{
//            preg_match("/\<img[\S\s]*src=[\s]*\"(.*?)[\"|\&]+[\S\s]*\/\>/",$content,$mk);
//            if(!empty($mk)){
//                $image = trim($mk[1],"\"");
//            }else{
//                $image = "";
//            }
//        }
//        if(!empty($image)){
////            if($t[0] ==80){
////                echo $content;
////                echo $image;
////                echo "<pre>";print_r($t);die;
////            }
////            echo $t[0];
////            echo $image;
////            echo "\r\n";
//        }
//
//        $extra['headerImg'] = $image;
//
//        $end = json_encode($extra);
//        $end = str_replace("\\","\\\\",$end);
//        $sql = "insert into tjw_service (`service_type`,`user_id`,`is_admin`,`title`,`category`,`content`,`tjw_province`,`tjw_city`,`tjw_district`,
//  `tjw_street`,`create_time`,`update_time`,`ext_info`,`crowd`,`start_time`,`end_time`,`is_public`) VALUES (
//    '7','1','1','".$title."','1','".$content."','17','169','0','0','".$creatTime."','".$creatTime."','".$end."','','".date("Y-m-d H:i:s")."','".date("Y-m-d H:i:s")."','1')";
//        //echo $sql.";";
//        mysql_query($sql,$mysql);
//    }
//    die;

//    $t = file_get_contents("/tmp/x.html");
//    $x = explode("\n",$t);
//    $d = array(
////        "江岸区"=>1523,
////        "江汉区"=>1524,
////        "硚口区"=>1525,
////        "汉阳区"=>1526,
////        "武昌区"=>1527,
////        "青山区"=>1528,
////        "洪山区"=>1529,
////        "东西湖区"=>1530,
////        "汉南区"=>1531,
////        "蔡甸区"=>1532,
////        "江夏区"=>1533,
////        "黄陂区"=>1534,
////        "新洲区"=>1535,
////        "东湖生态旅游风景管理区"=>2863,
////        "化工区"=>2864,
////        "东湖新技术开发区"=>2865,
//    );
//    $streetIdList = array();
//    $mysql = mysql_connect("localhost","mysql","mysql");
//    mysql_select_db("tj",$mysql);
//    mysql_set_charset("utf8");
//
//    foreach ($x as $v){
//        $v = trim($v);
//        $ttt = explode(" ",$v);
//        $ttt1 = array();
//        foreach ($ttt as $xxxxxx){
//            $xxxxxx = trim($xxxxxx);
//            if(strlen($xxxxxx)>0){
//                $ttt1[] = $xxxxxx;
//            }
//        }
//        if(count($ttt1) != 1 && count($ttt1) != 3){
//            exit("错误了"+implode($ttt1));
//        }
//        if(count($ttt1) == 1){
//            $sql = "select * from tjw_district where city_id=169 and name ='".$ttt1[0]."'";
//            $result = mysql_query($sql,$mysql);
//            $row = mysql_fetch_array($result);
//            if(empty($row)){
//                exit("错误了");
//            }
//            $d[$ttt1[0]] = $row['id'];
//            mysql_free_result($result);
//        }
//
//        if(count($ttt1) == 3){
//            $district = $ttt1[0];
//            $street = $ttt1[1];
//            $co = $ttt1[2];
//            if($co == "东湖村"){
//                echo implode($ttt1);echo "<br>";
//            }
//            $sssIIIddd = $district.$street;
//            if(!isset($streetIdList[$sssIIIddd])){
//                $sql = "select * from tjw_street where district_id=".$d[$district]." and name ='".$street."'";
//                $result = mysql_query($sql,$mysql);
//                $row = mysql_fetch_array($result);
//                mysql_free_result($result);
//                if(empty($row)){
//                    $sql = "insert into tjw_street (district_id,name) VALUES (".$d[$district].",'".$street."')";
//                    mysql_query($sql,$mysql);
//                    $streetId = mysql_insert_id($mysql);
//                    $streetIdList[$sssIIIddd] = $streetId;
//                }else{
//                    $streetIdList[$sssIIIddd] = $row['id'];
//                }
//            }
//            $sql = "insert into tjw_community (street_id,name) VALUES (".$streetIdList[$sssIIIddd].",'".$co."')";
//            mysql_query($sql,$mysql);
//        }
//
//    }
//
//    echo "<pre>";
//    print_r($d);
//    die;
//    $url = "https://api.weixin.qq.com/cgi-bin/menu/get?access_token=2M0mRNnNKHvNK6-Rra0Vzc2Ry8WCIizuLWwOVxlUD8Ygo3unKSgm2kC-WZzOZ5TPVo_dvBuQz4o6599TqbCPsKxHYTvhlOdOeZBHXwnYC74TPReAHADZB";
//    echo file_get_contents($url);
//    die;
//echo date("Y-m-d",strtotime("-7 days",strtotime(date("Y-m-d",strtotime("this week")))));
//    echo "<br>";
//    echo date("Y-m-d",strtotime("this week"));die;
//    $xx = array(
//        "provinceId"=>1,
//        "cityId"=>1,
//        "districtId"=>1,
//        "streetId"=>1,
//        "communityId"=>1
//    );
//
//    echo json_encode($xx);
//    die;
//$x = array();
//for ($i = 0; $i < 28; $i++){
//    $x[] = array("pointType"=>3,"count"=>2,"hour"=>1,"actionType"=>$i,"score"=>1);
//}
//$ss = array(
//    "config"=>$x
//);
//echo json_encode($ss);
//    die;
//    $conn = mysql_connect("127.0.0.1","mysql","mysql");
//    mysql_select_db("tj",$conn);
//    $id = 3;
//    for($i = 1; $i < 13; $i++){
//        $p = 18094215678+$i;
//        $id+=1;
//        //$sql = "INSERT INTO `tjw_user_base` VALUES ('".$id."', 'e10adc3949ba59abbe56e057f20f883e', '".$p."', '', 'http://www.tj.com/aa/bb/dd/cc/s.jpg', '18094215676', '0', '22', '23', '24', '25', '27', 'sign-xx哈哈哈', '', '0', '', '0', '', '0', '', '0', '1', '2', '五道口金融学院', '清华大学', '1', '5', '[{\"desc\":\"xxdd\\u6c99\\u7687\",\"url\":\"http:\\/\\/aa.bb.cc\\/ss\"},{\"desc\":\"xxdd\\u6c99\\u76871\",\"url\":\"http:\\/\\/aa.bb.cc\\/s1\"}]', '[{\"desc\":\"1xxdd\\u6c99\\u7687\",\"url\":\"http:\\/\\/2aa.bb.cc\\/ss\"},{\"desc\":\"4xxdd\\u6c99\\u76871\",\"url\":\"http:\\/\\/6aa.bb.cc\\/s1\"}]', '[{\"desc\":\"2xxdd\\u6c99\\u7687\",\"url\":\"http:\\/\\/3aa.bb.cc\\/ss\"},{\"desc\":\"5xxdd\\u6c99\\u76871\",\"url\":\"http:\\/\\/7aa.bb.cc\\/s1\"}]', '1', '2016-07-03 20:06:26', '2016-07-25 22:22:28', '0', '0', '1', '0', '2016-07-03 20:06:26', '0', '2', '0', '0', '0', '0', '2')";
//
//        //$sql= "INSERT INTO `tjw_user_lawyer_verify_base` VALUES ('".$i."', '".$i."', 'test".$i."', '1', '1', '1', '1', '1', '0', '0', '1', '0', '1', '0', '1', '1', '0', '1', '0000-00-00 00:00:00', '2016-07-25 00:46:52', '0', '', '0', '0', '0', '0')";
//        $sql = "INSERT INTO `tjw_user_lawyer_verify_extra` VALUES ('".$i."', '".$i."', 'test".$i."', '".$i."', '7', 'xxxxx啊', 'sssssss', '[\"http:\\/\\/aa.bb.cc\\/a\\/b.jpg\",\"http:\\/\\/aa.bb.cc\\/a\\/b.jpg\",\"http:\\/\\/aa.bb.cc\\/a\\/b.jpg\"]', '2016-07-23 20:38:13', '2016-07-27 23:16:50', '1', '0', '1', '北京市', '2', '', '3', '', '4', '', '5', 'message', '0')";
//
//        echo $sql;echo ";";
//        mysql_query($sql,$conn);
//    }
//
//
//
//    die;
//$xx = array(
//    "id"=>4,
//        "userId"=>1,
//      "list"=>array(
//                array("id"=>"1","verifyType"=>1,"message"=>"message")
//        ),
//        "level"=>2
//);
//echo json_encode($xx);die;
//
//function getCode($code,$w,$h) {
//    //创建图片，定义颜色值
//    header("Content-type: image/PNG");
//    $im = imagecreate($w, $h);
//    $black = imagecolorallocate($im, 0, 0, 0);
//    $gray = imagecolorallocate($im, 200, 200, 200);
//    $bgcolor = imagecolorallocate($im, 255, 255, 255);
//    //填充背景
//    imagefill($im, 0, 0, $gray);
//    //画边框
//    imagerectangle($im, 0, 0, $w-1, $h-1, $black);
//    //随机绘制两条虚线，起干扰作用
//    $style = array ($black,$black,$black,$black,$black,
//            $gray,$gray,$gray,$gray,$gray
//    );
//    imagesetstyle($im, $style);
//    $y1 = rand(0, $h);
//    $y2 = rand(0, $h);
//    $y3 = rand(0, $h);
//    $y4 = rand(0, $h);
//    imageline($im, 0, $y1, $w, $y3, IMG_COLOR_STYLED);
//    imageline($im, 0, $y2, $w, $y4, IMG_COLOR_STYLED);
//    //在画布上随机生成大量黑点，起干扰作用;
//    for ($i = 0; $i < 80; $i++) {
//        imagesetpixel($im, rand(0, $w), rand(0, $h), $black);
//    }
//    //将数字随机显示在画布上,字符的水平间距和位置都按一定波动范围随机生成
//    $strx = rand(3, 8);
//    for ($i = 0; $i < strlen($code); $i++) {
//        $strpos = rand(1, 6);
//        imagestring($im, 5, $strx, $strpos, substr($code, $i, 1), $black);
//        $strx += rand(8, 12);
//    }
//    imagepng($im);//输出图片
//    imagedestroy($im);//释放图片所占内存
//}
//getCode("1234",60,30);
//die;
//
//$data = file_get_contents("/tmp/tt.txt");
//$arr = json_decode($data, true);
//$p = $arr[0]['provs'];
//$x = array();
//foreach ($p as $row){
//    foreach ($row['univs'] as $r){
//        $x[] = $r;
//    }
//}
//echo json_encode($x);die;
//print_r($arr[0]);die;
//print_r($arr);die;
//$a = array(
//        "realName"=>"lzm",
//        "profession"=>1,
//        "photos"=>array("http://a.b.cc/a.jpg")
//);
//echo json_encode($a);die;
//    $x = array(
//        "verify"=>1,
//        "communityInfo"=>array(
//            "id"=> 7,
//            "provinceId"=>17,
//            "cityId"=>169,
//            "districtId"=>1527,
//            "streetId"=>1,
//            "communityId"=>3,
//
//        ),
//    );
//    echo json_encode($x);die;
//
//$x = array(
//    "id"=>15,
//    "userId"=>1,
//    "verifyList"=>array(
//        array("id"=>17,"verifyType"=>1,"message"=>"xxx"),
//        array("id"=>18,"verifyType"=>1,"message"=>"xxx"),
//    ),
//    "level"=>3,
//    "communityInfo"=>array(
//        "id"=> 6,
//        "provinceId"=>17,
//        "cityId"=>169,
//        "districtId"=>1527,
//        "streetId"=>1,
//        "communityId"=>2,
//        "verify"=>1,
//    ),
//);
//echo json_encode($x);die;
//$a = array(
//        "realName"=>"lizhimin",
//        "publicIdentity"=>array(
//                'isVolunteer'=>0,
//                'isMediator'=>0,
//                'isCommunityLawyer'=>1,
//                'isLegalAid'=>1
//
//        ),
//        "action"=>array(
//                'isHotLine'=>1,
//                'isCommunityExplain'=>0,
//                'isCommunityLegal'=>0,
//                'isMinorIllegal'=>1,
//                'isMinorIllegalInvestigate'=>0,
//                'isMinorIllegalHelp'=>1,
//                'isMinorIllegalRectify'=>0,
//                'isOtherOvent'=>1,
//        ),
//        "service"=>array(
//                'isFreeMediate'=>1,
//                'isUndertakeLegalAid'=>0,
//                'isBecomeCommunityLawyer'=>1
//        ),
//        "jobIdentityList"=>array(
//                array(
//                        "profession"=>2,
//                        "job"=>"xxx经理",
//                        "company"=>"xxxxxx",
//                        "province"=>11,
//                        "city"=>12,
//                        "district"=>13,
//                        "street"=>14,
//                        "address"=>15,
//                        "photos"=>array("http://aa.bb.cc/a/b.jpg","http://aa.bb.cc/a/b.jpg","http://aa.bb.cc/a/b.jpg"),
//                ),
//                array(
//                        "profession"=>3,
//                        "job"=>"xxxxx啊",
//                        "company"=>"sssssss",
//                        "province"=>1,
//                        "city"=>2,
//                        "district"=>3,
//                        "street"=>4,
//                        "address"=>5,
//                        "photos"=>array("http://aa.bb.cc/a/b.jpg","http://aa.bb.cc/a/b.jpg","http://aa.bb.cc/a/b.jpg"),
//                ),
//        ),
//);
//echo json_encode($a);
//die;
//$a = array(
//        "realName"=>"李志民",
//        "creditNo"=>"1234567890",
//        "photoUrl"=>"http://www.aa.cc/aa/xx/cc/a.jpg"
//);
//echo json_encode($a);
//die;
//
//$params = array(
//        "degree"=>1,
//        "specialty"=>2,
//        "school"=>3,
//        "skill"=>5,
//        "successfulCase"=>ARRAY(ARRAY("desc"=>"xxdd沙皇","url"=>"http://aa.bb.cc/ss"),ARRAY("desc"=>"xxdd沙皇1","url"=>"http://aa.bb.cc/s1")),
//        "publishArticle"=>ARRAY(ARRAY("desc"=>"1xxdd沙皇","url"=>"http://2aa.bb.cc/ss"),ARRAY("desc"=>"4xxdd沙皇1","url"=>"http://6aa.bb.cc/s1")),
//        "mediaReport"=>ARRAY(ARRAY("desc"=>"2xxdd沙皇","url"=>"http://3aa.bb.cc/ss"),ARRAY("desc"=>"5xxdd沙皇1","url"=>"http://7aa.bb.cc/s1")),
//);
//echo json_encode($params);die;
//$url="http://www.baidu.com/aa/aabb/cc?xx=ss";
//var_dump(filter_var($url,FILTER_VALIDATE_URL));die;
//
//class xx{
//    public static function c($match){
//        $b = array("-a","-b","-c","-d","-3","33");
//        return $b[$match[1]];
//    }
//
//    public static function xx1(){
//        $subject = "{0} , 1111{1} ,33344--{2},444343{3},44哈哈哈4{4}。哈哈";
//        $a = preg_replace_callback("/{(\d)}/","xx::c", $subject);
//        echo $a;
//    }
//}
//xx::xx1();
//
//
//die;
//// function aaa(){
////     print_r($_args);
//// }
//// preg_replace_callback($pattern, aaa, $subject)
//// echo $a;
//echo $subject;die;
// $query = 'aaa=aaaaaaaaaaa<script type="text/javascript">alert("aaa");</script>';
// //$query = 'aaa=aaa';
// $ch = curl_init();//初始化curl
// curl_setopt($ch,CURLOPT_URL,'http://www.mt.com/user/complateUserInfo?'.$query);//抓取指定网页
// curl_setopt($ch, CURLOPT_HEADER, 0);//设置header
// curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//要求结果为字符串且输出到屏幕上
// curl_setopt($ch, CURLOPT_POST, 0);//post提交方式
// //curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
// $data = curl_exec($ch);//运行curl
// curl_close($ch);

// echo $data;

// echo "test";

// $a = array(
// 	    "content" => "xxxxxx",
//         'serviceType'=>2,
//         'serviceId'=>1,
//         'isAnonymous'=>0,
//         'commentId'=>4
// );

// echo json_encode($a);
// die;

// $a = array(
//         'serviceType'=>2,
//         'serviceId'=>1,
//         'commentId'=>1,
// );

// echo json_encode($a);

//$a = array(
//        'serviceType'=>2,
//        'serviceId'=>1,
//);
//
//echo json_encode($a);