<?php
/**
 * 机构模块
 * @author lzm
 *
 */
class OrgModel{
    /**
     * 添加机构
     */
    public function addOrg($params){
        if($this->isOrgExist($params['name'])){
            return false;
        }
        $cols = array(
                "name"=>$params['name'],
                "province_id"=>$params['provinceId'],
                "city_id"=>$params['cityId'],
                "district_id"=>$params['districtId'],
                "street_id"=>$params['streetId'],
                "address"=>$params['address'],
                "manager_province_id"=>$params['mProvinceId'],
                "manager_city_id"=>$params['mCityId'],
                "manager_district_id"=>$params['mDistrictId'],
                "manager_street_id"=>$params['mStreetId'],
                "show_name"=>$params['showName'],
                "support"=>$params['support'],
                "create_time"=>date("Y-m-d H:i:s"),
                "admin_id"=>$params['adminId'],
                "admin_name"=>$params['adminName'],
        );
        $orgDao = TjwOrganizationDao::getInstance("tjw_organization");
        return $orgDao->baseInsert($cols);
    }

    /**
     * 编辑机构
     */
    public function updateOrg($params){
        $cols = array(
            "name"=>$params['name'],
            "province_id"=>$params['provinceId'],
            "city_id"=>$params['cityId'],
            "district_id"=>$params['districtId'],
            "street_id"=>$params['streetId'],
            "address"=>$params['address'],
            "manager_province_id"=>$params['mProvinceId'],
            "manager_city_id"=>$params['mCityId'],
            "manager_district_id"=>$params['mDistrictId'],
            "manager_street_id"=>$params['mStreetId'],
            "show_name"=>$params['showName'],
            "support"=>$params['support'],
            "create_time"=>date("Y-m-d H:i:s"),
            "admin_id"=>$params['adminId'],
            "admin_name"=>$params['adminName'],
        );
        $conditions = array(
            "and",
            "id=".$params['id'],
        );
        $orgDao = TjwOrganizationDao::getInstance("tjw_organization");
        return $orgDao->update($cols,$conditions);
    }

    /**
     * 根据机构名称查看是否已经存在
     * @param unknown $orgName
     */
    public function isOrgExist($orgName,$orgId = 0){
        $orgInfo = $this->getOrgInfoByName($orgName);
        if(empty($orgInfo)){
            return false;
        }
        if(!empty($orgInfo) && $orgId == $orgInfo[0]['id']){
            return false;
        }
        return true;
    }
    
    /**
     * 根据机构id list 获取机构信息
     * @param array $orgIdList
     */
    public function getOrgInfoByIdList($orgIdList){
        if(empty($orgIdList)){
            return array();
        }
        $orgDao = TjwOrganizationDao::getInstance("tjw_organization");
        $conditions = array(
                    "and",
                    array("in","id",$orgIdList),
                    "del_flag=0"
        );
        $data = $orgDao->select("*", $conditions,array(),true);
        $list = array();
        foreach ($data as $row){
            $list[] = $this->orgDbRow2BaseArray($row);
        }
        return $list;
    }

    /**
     * 根据机构id list 获取机构信息
     * @param array $orgIdList
     */
    public function getOrgInfoByIdListV2($orgIdList){
        if(empty($orgIdList)){
            return array();
        }
        $orgDao = TjwOrganizationDao::getInstance("tjw_organization");
        $conditions = array(
            "and",
            array("in","id",$orgIdList),
        );
        $data = $orgDao->select("*", $conditions,array(),true);
        $list = array();
        foreach ($data as $row){
            $list[$row['id']] = $this->orgDbRow2BaseArray($row);
        }
        return $list;
    }
    
    /**
     * db row 2 program array
     * @param unknown $row
     * @return multitype:unknown
     */
    private function orgDbRow2BaseArray($row){
        return array(
                "id"=>$row['id'],
                "name"=>$row['name'],
                "provinceId"=>$row['province_id'],
                "cityId"=>$row['city_id'],
                "districtId"=>$row['district_id'],
                "streetId"=>$row['street_id'],
                "address"=>$row['address'],
                "mProvinceId"=>$row['manager_province_id'],
                "mCityId"=>$row['manager_city_id'],
                "mDistrictId"=>$row['manager_district_id'],
                "mStreetId"=>$row['manager_street_id'],
                "showName"=>$row['show_name'],
                "support"=>$row['support'],
                "adminId"=>$row['admin_id'],
                "adminName"=>$row['admin_name'],
                "createTime"=>$row['create_time']
            );
    }
    
    /**
     * 根据名字获取org
     * @param string $orgName
     * @param bool $isLike  是否模糊匹配
     */
    public function getOrgInfoByName($orgName, $isLike=false,$limit = 1){
        $conditions = array();
        $params = array();
        $conditions[] = "and";
        if(!empty($orgName)){
            $conditions[] = $isLike?array("like","name",array("%".$orgName."%")):"name=:name";
            $params[":name"] = $orgName;
        }
        $conditions[] = "del_flag=0";
        $orgDao = TjwOrganizationDao::getInstance("tjw_organization");
        $data = $orgDao->select("*", $conditions,$params,true,'','',0,$limit);
        $list = array();
        foreach ($data as $row){
            $list[] = $this->orgDbRow2BaseArray($row);
        }
        return $list;
    }
}