<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/9
 * Time: 15:09
 */
class GeographyInfoModel{
    CONST CAT_RESERVOIR = 0;//水库山塘
    CONST CAT_RIVER_WAY = 1;//河道
    CONST CAT_SLUICE = 2;//水闸
    CONST CAT_PUMPING = 3;//泵站

    public function addPoint($params){
        $cols = array(
            'cat'=>$params['cat'],
            'name'=>$params['name'],
            'longitude'=>$params['longitude'],
            'latitude'=>$params['latitude'],
            'street_id'=>$params['streetId'],
            'district_id'=>$params['districtId'],
            'city_id'=>$params['cityId'],
            'province_id'=>$params['provinceId'],
            'add_user_id'=>$params['userId'],
            'add_user_name'=>$params['userName'],
            'create_time'=>date("Y-m-d H:i:s")
        );
        WpGeographyPointsDao::getInstance("WpGeographyPoints")->baseInsert($cols);
    }

    public function getPointAll($streetId){
        $conditions = array(
            "and",
            "del_flag=:delFlag",
            "street_id=:streetId",
        );
        $params = array(
            ":delFlag"=>0,
            ":streetId"=>$streetId
        );

        $list = WpGeographyPointsDao::getInstance("WpGeographyPoints")->select("*",$conditions,$params,true);
        if(empty($list)){
            return array();
        }

        $data = array();
        foreach ($list as $row){
            $data[] = array(
                'id'=>$row['id'],
                'cat'=>$row['cat'],
                'name'=>$row['name'],
                'longitude'=>$row['longitude'],
                'latitude'=>$row['latitude'],
                'createTime'=>$row['create_time'],
            );
        }
        return $data;
    }

    public function deletePoint($id,$streetId){
        $conditions = array(
            "and",
            "id=:id",
            "street_id=:streetId",
            "del_flag=:delFlag"
        );
        $params = array(
            ":id"=>$id,
            ":streetId"=>$streetId,
            ":delFlag"=>0
        );
        $cols = array(
            "del_flag"=>1,
        );

        WpGeographyPointsDao::getInstance("WpGeographyPoints")->update($cols,$conditions,$params);
    }
}