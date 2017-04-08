<?php
/**
 * 地区
 * @author lzm
 *
 */
class AreaModel{
    CONST AREA_PREFIX_KEY = "area_prefix_key";
    private static $provinceList = array();
    private static $cityList = array();
    private static $districtList = array();
    private static $streetList = array();
    /**
     * 根据省名称获取省信息
     * @param String $provinceName
     */
    public function getProvinceInfoByName($provinceName){
        $pInfoList = $this->getProviceInfoList();
        foreach ($pInfoList as $row){
            if(isset($row['name']) == $provinceName){
                return $row;
            }
        }

        return null;
    }

    /**
     * 根据省名称获取省信息
     * @param String $provinceName
     */
    public function getProvinceInfoById($provinceId){
        $pInfoList = $this->getProviceInfoList();
        if(empty($pInfoList)){
            return array();
        }
        foreach ($pInfoList as $row){
            if($row['id'] == $provinceId){
                return $row;
            }
        }
        return array();
    }

    /**
     * db获取省信息
     */
    private function _getProviceInfoListFromDb(){
        $provinceDao = WpProvinceDao::getInstance("wp_province");
        $list = $provinceDao->select("id,name",array("and","del_flag=0"),array(),true);
        $pInfoList = array();
        foreach ($list as $row){
            $pInfoList[$row['id']]=$row;
        }
        return $pInfoList;
    }

    /**
     * 获取城市列表
     */
    public function getProvinceInfoList(){
        if(!empty(AreaModel::$provinceList)){
            return AreaModel::$provinceList;
        }
        $key = md5(AreaModel::AREA_PREFIX_KEY."province_info_list_v");
        $pInfoList = MemCacheComponent::getCacheByKey($key);
        if(empty($pInfoList)){
            $pInfoList = $this->_getProviceInfoListFromDb();
            MemCacheComponent::setCache($key, $pInfoList, MemCacheComponent::WEEK);
        }
        AreaModel::$provinceList = $pInfoList;
        return $pInfoList;
    }

    /**
     * db获取省信息
     */
    private function _getCityInfoListFromDbByProviceId($proviceId){
        $cityDao = WpCityDao::getInstance("wp_city");
        $condition = array(
            "and",
            "province_id=:provinceId",
            "del_flag=0",
        );
        $params = array(
            ":provinceId"=>$proviceId
        );
        $list = $cityDao->select("id,name",$condition,$params,true);
        $pInfoList = array();
        foreach ($list as $row){
            $pInfoList[$row['id']]=$row;
        }
        return $pInfoList;
    }

    /**
     * 根据省id获取城市信息
     * @param int $proviceIdyId
     */
    public function getCityListInfoByProvinceId($provinceId){
        $key = md5(AreaModel::AREA_PREFIX_KEY."city_info_list_".$provinceId);
        $cInfoList = MemCacheComponent::getCacheByKey($key);
        $cInfoList = false;
        if(empty($cInfoList)){
            $cInfoList = $this->_getCityInfoListFromDbByProviceId($provinceId);
            MemCacheComponent::setCache($key, $cInfoList, MemCacheComponent::WEEK);
        }
        return $cInfoList;
    }

    /**
     * db获取省信息
     */
    private function _getDistrictInfoListFromDbByCityId($cityId){
        $districtDao = WpDistrictDao::getInstance("WpDistrict");
        $condition = array(
            "and",
            "city_id=:cityId",
            "del_flag=0"
        );
        $params = array(
            ":cityId"=>$cityId
        );
        $list = $districtDao->select("id,name",$condition,$params,true);
        $dInfoList = array();
        foreach ($list as $row){
            $dInfoList[$row['id']]=$row;
        }
        return $dInfoList;
    }

    /**
     * 根据省id获取城市信息
     * @param int $proviceIdyId
     */
    public function getDistrictListInfoByCityId($cityId){
        $key = md5(AreaModel::AREA_PREFIX_KEY."district_info_list_".$cityId);
        $pInfoList = MemCacheComponent::getCacheByKey($key);
        if(empty($pInfoList)){
            $pInfoList = $this->_getDistrictInfoListFromDbByCityId($cityId);
            MemCacheComponent::setCache($key, $pInfoList, MemCacheComponent::WEEK);
        }
        return $pInfoList;
    }

    /**
     * 根据省id获取省信息
     * @param $provinceId
     */
    public function getCityById($cityId, $provinceId=0){
        $cityDao = WpCityDao::getInstance("WpCity");
        $condition = array(
            "and",
            "id=".intval($cityId),
            "del_flag=0"
        );
        if($provinceId > 0){
            $condition[] = "province_id=".intval($provinceId);
        }
        return $cityDao->select("id,province_id,name",$condition);
    }

    /**
     * 根据省id获取省信息
     * @param $provinceId
     */
    public function getCityProvinceId($cityId){
        $cityDao = WpCityDao::getInstance("WpCity");
        $condition = array(
            "and",
            "id=".intval($cityId),
            "del_flag=0"
        );
        $info = $cityDao->select("id,province_id,name",$condition);
        if(!empty($info)){
            return $info['province_id'];
        }
        return 0;
    }

    /**
     * 根据省id获取省信息
     * @param $provinceId
     */
    public function getDistrictById($districtId,$cityId=0){
        $districtDao = WpDistrictDao::getInstance("WpDistrict");
        $condition = array(
            "and",
            "id=".intval($districtId),
            "del_flag=0"
        );
        if($cityId > 0){
            $condition[] = "city_id=".intval($cityId);
        }
        return $districtDao->select("id,name",$condition);
    }

    public function getStreetListInfoByDistrictId($districtId){
        $streetDao = WpStreetDao::getInstance("WpStreet");
        $condition = array(
            "and",
            "district_id=:districtId",
            "del_flag=0"
        );
        $params = array(
            ":districtId"=>$districtId
        );
        $list = $streetDao->select("id,name",$condition,$params,true);
        $sInfoList = array();
        foreach ($list as $row){
            $sInfoList[$row['id']]=$row;
        }
        return $sInfoList;
    }

    public function getStreetById($streetId){
        $streetDao = WpStreetDao::getInstance("WpStreet");
        $condition = array(
            "and",
            "id=:id",
            "del_flag=0"
        );
        $params = array(
            ":id"=>$streetId
        );
        $streetInfo = $streetDao->select("id,name",$condition,$params,false);

        return $streetInfo;
    }
}