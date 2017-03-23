<?php
/**
 * 用户
 * @author lzm
 *
 */
class TestController extends Controller {
    public function isIcon($icon){
        $p = strpos($icon,".");
        if($p ===  false){
            return false;
        }
        return true;
    }
    public function actionTA(){

//        $mysql = mysql_connect("114.55.106.189","mysql","mysql@121");
//        mysql_select_db("tj",$mysql);
//        mysql_set_charset("utf8");
//        $fp = fopen("/tmp/a.sql","w");
//        $files = array("bj.csv","rx.csv","sccnr.csv","shdc.csv","sq.csv","sqjz.csv","sqsf.csv","yz.csv");
//        foreach ($files as $file){
//            $c = file_get_contents("/tmp/ttt/".$file);
//
//            $line = explode("\n",$c);
//            echo "<pre>";
//            //print_r($line);die;
//            $ttt = array();
//            for($i =  1; $i< count($line); $i++){
//                $l = trim($line[$i]);
//                if(empty($l)){
//                    continue;
//                }
//                $tmp = explode(",",$line[$i]);
//                if(count($tmp) != 6){
//                    echo $line[$i];
//                    //print_r($tmp);
//                    echo "xxx";die;
//                }
//
//
//                $id = trim($tmp[0],"\"");
//
//                $title = mb_convert_encoding(trim($tmp[2],"\""),"utf-8","gbk");
//                $sql = "select * from tjw_service where service_type=5 and title = '".$title."'";
//                //echo $sql;echo "<br>";
//                $result = mysql_query($sql);
//                $row=mysql_fetch_row($result);
//                var_dump($row);
//
//                if(empty($row)){
//                    echo "emp";
//                    continue;
//                }
//                $ttt[] = array($title,$row[0],trim($tmp[3],"\""));
//
//                $sqli = "insert into tjw_service_record (legal_service_id,user_id,service_type,type,vote_value,ip,ext_info,create_time,update_time)
//                      values (".$row[0].",".trim($tmp[3],"\"").",5,2,0,'114.55.106.189','',now(),now())";
//                //fwrite($fp,$sqli.";\r\n");
//                mysql_query($sqli);
//            }
//            $s = "";
//            foreach ($ttt as $v ){
//                $s .= implode(",",$v)."\r\n";
//            }
//            file_put_contents("/tmp/bbb/".$file,$s);
//        }
//        fclose($fp);
    }
  public function actionT(){
//      $ut = Array
//      (
//          "四级调解员" => 4,
//          "五级调解员" => 5,
//          "法科学子志愿者" => "法科学子志愿者",
//          "三级调解员" => 3,
//      );
//      $content = file_get_contents("/tmp/info1.txt");
//      $us = "普通会员";
//      $tmp = explode("\n",$content);
//      $data = array();
//      $userType = array();
//      //$icon = array();
//      echo "<pre>";
//      //$mysql = mysql_connect("127.0.0.1","mysql","mysql");
//      $mysql = mysql_connect("121.41.98.108","mysql","mysql@121");
//      mysql_select_db("tj",$mysql);
//      mysql_set_charset("utf8");
//      foreach($tmp as $key=>$v){
//          if($key <= 1){
//              continue;
//          }
//          $v = trim($v);
//          if(empty($v)){
//              continue;
//          }
//          $x = explode("|", $v);
//          if(count($x) != 43){
//              break;
//          }
//          if($us != $x[41]){
//              //print_r($x);
//          }
//          $tuserType = trim($x[41]);
//          $userType[$tuserType] = $tuserType;
//          //print_r($x);
//          $icon = trim($x[37]);
//          if($this->isIcon($icon) == false){
//              $icon = "";
//          }else{
//              if(!is_file("/tmp/tt/".md5($icon).".jpg")) {
//                  $content = file_get_contents($icon);
//                  file_put_contents("/tmp/tt/" . md5($icon) . ".jpg", $content);
//              }
//              $icon = "http://ocywi2374.bkt.clouddn.com/".md5($icon) . ".jpg";
//          }
//          $email = trim($x[2]);
//          $pwd = trim($x[3]);
//          $nickname = trim($x[4]);
//          if(empty($nickname)){
//              $nickname = "tj".$x[0];
//          }
//          $cell = trim($x[15]);
//          $sex = trim($x[5]);
//          if($sex == 0){
//              $sex = 1;
//          }else{
//              $sex = 0;
//          }
//          $date = date("Y-m-d H:i:s");
//          $time = time() - 100 * 24 * 3600;
//          $uptm = date("Y-m-d H:i:s",$time);
//          //print_r($x);die;
//          $sql = "insert into tjw_user_base (id,password,cell_phone,email,icon_url,nick_name,sex,create_time,last_update_nickname_time)
//                values ('".$x[0]."','".$pwd."','".$cell."','".$email."','".$icon."','".$nickname."','".$sex."','".$time."','".$uptm."')";
//          //echo $sql;die;
//          mysql_query($sql,$mysql);
//      }
//      print_r($userType);
//      print_r($icon);
  }

  public function actionImport(){
      $c = file_get_contents("/tmp/xx.txt");
      $t = explode("\n",$c);
      echo "<pre>";
      $userAuthenticationModel = new UserAuthenticationModel();
      $mysql = mysql_connect("127.0.0.1","mysql","mysql");
      //$mysql = mysql_connect("114.55.106.189","mysql","mysql@121");
      mysql_select_db("tj",$mysql);
      mysql_set_charset("utf8");
      $ii = array();
      $item = array();
      foreach ($t as $row){
          $rr = explode(" ",$row);

          $ttt = array();
          foreach ($rr as $rrrrr){
              $xxx = trim($rrrrr);
              if($xxx != ""){
                  $ttt[] = $xxx;
              }
          }
          if(count($ttt) < 7){
              $ttt[6] = $ttt[5];
              $ttt[5] = "";
          }

          $o0 = trim($ttt[0]);
          $o1 = trim($ttt[1]);
          $o2 = trim($ttt[2]);
          $o3 = trim($ttt[3]);
          $o4 = trim($ttt[4]);
          $o5 = trim($ttt[5]);
          $o6 = trim($ttt[6]);
          $ix = $o6;
          $sql = "select * from tjw_user_base where id = ".$o0;
          $result = mysql_query($sql);
          $row = mysql_fetch_row($result);
          $pwd = strtolower(md5("tiaojiewang"));
          //if(empty($row)){
              $name = md5($o0.$o4).".jpg";
              $c = file_get_contents($o4);
              file_put_contents("/tmp/a/".$name,$c);
              $url = "http://ocywi2374.bkt.clouddn.com/".$name;
              //echo $url;echo "<br>";
//              $sssql = "insert into tjw_user_base (id,password,cell_phone,email,icon_url,nick_name,sex,create_time,last_update_nickname_time)
//                values ('".$o0."','".$pwd."','".$o5."','".$o2."','".$url."','".$o3."','0','".date("Y-m-d H:i:s")."','".date("Y-m-d H:i:s")."')";
//              mysql_query($sssql);
              $sssssssss = "update tjw_user_base set  icon_url = '".$url."' where id =  ".$o0.";";
              //echo $sssssssss;
              echo "<br>";
              //print_r($ttt);
//          }
//          {
//              $up = "update tjw_user_base set cell_phone='".$o5."',email='".$o2."' where id=".$o0;
//              mysql_query($up);
//              $item[] = array($o0,$o1,$o2,$o3,$o4,$o5,$o6);
//              $baseInfo = array(
//                  'realName'=>$o3,
//                  'isVolunteer'=>0,
//                  'isMediator'=>0,
//                  'isCommunityLawyer'=>0,
//                  'isLegalAid'=>0,
//                  'isHotLine'=>0,
//                  'isCommunityExplain'=>0,
//                  'isCommunityLegal'=>0,
//                  'isMinorIllegal'=>0,
//                  'isMinorIllegalInvestigate'=>0,
//                  'isMinorIllegalHelp'=>0,
//                  'isMinorIllegalRectify'=>0,
//                  'isOtherEvent'=>0,
//                  'isFreeMediate'=>0,
//                  'isUndertakeLegalAid'=>0,
//                  'isBecomeCommunityLawyer'=>0,
//                  'provinceId' => 17,
//                  'cityId' => 169,
//                  'districtId' => 1527,
//                  'streetId' => 0,
//                  'communityId' => 0,
//                  'provinceName' => "湖北省",
//                  'cityName' => "武汉市",
//                  'districtName' => "武昌区",
//                  'streetName' => "",
//                  'communityName' => ""
//              );
//              $job = array(array(
//                  'profession'=>$o6,
//                  'job'=>"",
//                  'company'=>"",
//                  'province'=>17,
//                  'provinceName'=>"湖北省",
//                  'city'=>169,
//                  'cityName'=>"武汉市",
//                  'district'=>1527,
//                  'districtName'=>"武昌区",
//                  'street'=>0,
//                  'streetName'=>"",
//                  'address'=>"",
//                  'photos'=>array("http://ocyw5px4o.bkt.clouddn.com/1e7292bfae35ff841ccc76095ea72591.png"),
//              ));
//              $userAuthenticationModel->addLegalManAuthInfo($o0,$baseInfo,$job);
////              echo $o0;
////              die;
//          }
//          if($ix == "" || $ix == "\""){
//              print_r($ttt);
//          }
//          $ii[$ix] = $ix;
      }

//      print_r($ii);
//      print_r($item);
  }
}
