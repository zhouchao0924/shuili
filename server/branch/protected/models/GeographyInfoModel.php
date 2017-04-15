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
    CONST CAT_RIVER_ADMIN=4;//河长制
    CONST CAT_FLOOD =5;//防汛防台
    CONST CAT_FARM = 6; //农田水利
    CONST CAT_DRINKING = 7;//农民饮用水

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
        return WpGeographyPointsDao::getInstance("WpGeographyPoints")->baseInsert($cols);
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

    /**
     * @param $pointId
     * @param $userId
     * @param $title
     * @param $isBold
     * @param $content
     */
    public function editInfo($pointId,$userId,$title,$isBold,$content){
        //按照志民要求，先删除所有指定id的内容，再增加
        $conditions = array(
            "and",
            "geography_points_id=:pointId",
        );
        $params = array(
            ":pointId"=>$pointId,
        );
        $cols = array(
            "del_flag"=>1,
        );

        $this->_getWpGeographyInfoDao()->update($cols,$conditions,$params);
        //增加一条新的
        $insertData = array(
            'title' => $title,
            'content' => $content,
            'add_time' => date("Y-m-d H:i:s"),
            'is_bold' => $isBold,
            'add_user_id' => $userId,
            'geography_points_id' => $pointId,

        );

        $this->_getWpGeographyInfoDao()->baseInsert($insertData);
    }

    public function getInfo($pointId){
        $conditions = array(
            "and",
            "geography_points_id = :pointId",
            "del_flag = 0",
        );
        $params = array(
            ":pointId"=>$pointId,
        );

        $orderBy = " id desc";
        $returnDate = $this->_getWpGeographyInfoDao()->select("*",$conditions,$params,false,$orderBy);
        if (empty($returnDate)){
            return array();
        }
        return array(
            'pointId' => $pointId,
            'title' => $returnDate['title'],
            'updateTime' => $returnDate['update_time'],
            'isBold' => $returnDate['is_bold'],
            'content' => $returnDate['content'],
            'addTime' => $returnDate['add_time'],
        );
    }

    /**
     * @return WpGeographyInfoDao
     */
    private function _getWpGeographyInfoDao(){
       return WpGeographyInfoDao::getInstance("WpGeographyInfo");
    }

    public function getCatPointAll($cat,$streetId){
        $conditions = array(
            "and",
            "del_flag=:delFlag",
            "street_id=:streetId",
            "cat=:cat",
        );
        $params = array(
            ":delFlag"=>0,
            ":streetId"=>$streetId,
            ":cat"=>$cat
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
}