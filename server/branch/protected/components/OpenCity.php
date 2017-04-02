<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/3/28
 * Time: 22:08
 */
class OpenCity{
    //开放的城市列表
    public $list = array(
        array(
            "province"=>11,//浙江
            "name"=>"浙江省",
            "city"=>array(
                array(
                    "id"=>88,
                    "name"=>"宁波市",
                    "district"=>array(
                        array("id"=>865,"name"=>"余姚市"),
                    ),
                )
            ),
        ),
    );

    public function getOpenDistrict(){
        $list = array();
        foreach($this->list as $key=>$value){
            
        }
    }
}