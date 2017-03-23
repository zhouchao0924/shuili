<?php
/**
 * 新闻模块
 * @author zhous
 *
 */

class CmsNewsModel{
    
    CONST CURRENT_SERVICE_TYPE = 7;
    

    /**
     * 获取新闻列表
     * @param  [type] $params [description]
     * @return [type]         [description]
     */
    public function getNewsList($params){
        $newsDao = TjwCmsServiceDao::getInstance('tjw_cms_service');
        $conditions = array(
            'and',
            "service_type=".self::CURRENT_SERVICE_TYPE,
            'del_flag=0',
            );
        $sqlParams = array();
        if (!is_null($params['newsId'])){
            $conditions[] = "legal_service_id=:newsId";
            $sqlParams[":newsId"] = $params['newsId'];
        }
        if (!is_null($params['title'])){
            $conditions[] = "title like '%".mysql_escape_string($params['title'])."%'";
        }
        if ($params['startTime'] != '' && $params['endTime'] != ''){
            $conditions[] = 'start_time >=:startTime';
            $conditions[] = 'end_time <=:endTime';
            $sqlParams[':startTime'] = $params['startTime'];
            $sqlParams[':endTime'] = $params['endTime'];
        }
        if ($params['category'] > 0){
            $conditions[] = 'category =:category';
            $sqlParams[':category'] = $params['category'];
        }
        if (!is_null($params['isStick'])){
            $conditions[] = 'is_top =:isStick';
            $sqlParams[':is_top'] = $params['isStick'];
        }
        $params['pageNo'] = (intval($params['pageNo']) == 0) ? 1 : intval($params['pageNo']);
        $order = array(
            'is_top desc',
            'create_time desc',
            );
        $data = $newsDao->select('*', $conditions, $sqlParams, true, $order, array(), ($params['pageNo']-1)*15, ($params['pageNo'])*15-1);
        $list = array();
        foreach($data as $row){
            $list[] = $this->_newsDbRow2BaseArray($row);
        }
        return $list;
    }
    
    /**
     * [_newsDbRow2BaseArray description]
     * @param  [type] $row [description]
     * @return [type]      [description]
     */
    private function _newsDbRow2BaseArray($row){
        return array(
            'newsId'                => intval($row['id']),
            'title'                 => $row['title'],
            'categoryName'          => (isset(PopularData::$newsCategoryName[$row['category']])) ? PopularData::$newsCategoryName[$row['category']] : '未知类型',
            'createTime'            => $row['create_time'],
            'isStick'               => intval($row['is_top']),
        );
    }
    
    /**
     * [getListCount description]
     * @param  [type] $params [description]
     * @return [type]         [description]
     */
    public function getListCount($params){
        $newsDao = TjwCmsServiceDao::getInstance('tjw_cms_service');
        $conditions = array(
            'and',
            "service_type=".self::CURRENT_SERVICE_TYPE,
            'del_flag=0',
            );
        $sqlParams = array();
        if (!is_null($params['newsId'])){
            $conditions[] = "legal_service_id=:newsId";
            $sqlParams[':newsId'] = $params['newsId'];
        }
        if (!is_null($params['title'])){
            $conditions[] = "title like '%".mysql_escape_string($params['title'])."%'";
        }
        if ($params['startTime'] != '' && $params['endTime'] != ''){
            $conditions[] = 'start_time >= :startTime';
            $conditions[] = 'end_time <= :endTime';
            $sqlParams[':startTime'] = $params['startTime'];
            $sqlParams[':endTime'] = $params['endTime'];
        }
        if ($params['category'] > 0){
            $conditions[] = 'category = :category';
            $sqlParams[':category'] = $params['category'];
        }
        return $newsDao->select('count(1) as num', $conditions, $sqlParams, false);
        
    }
    
    /**
     * 置顶新闻
     * @param  [type] $legalServiceId [description]
     * @param  [type] $isStick        [description]
     * @return [type]     [description]
     */
    public function updateNewsStick($legalServiceId, $isStick=0){
        $newsDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $columns = array(
            'is_top'        => $isStick,
            'update_time'   => date("Y-m-d H:i:s"),
            );
        $conditions = array(
            'and',
            'id=:id',
            'service_type=:service_type',
            );
        $params = array(
            ':id'   => $legalServiceId,
            ':service_type' => self::CURRENT_SERVICE_TYPE,
            );
        return $newsDao->update($columns,$conditions,$params);
        
    }
    
    /**
     * [deleteNews description]
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function deleteNews($legalServiceId){
        $newsDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $columns = array(
            'del_flag'      => 1,
            'update_time'   => date("Y-m-d H:i:s"),
            );
        $conditions = array(
            'and',
            'id=:id',
            'service_type=:service_type',
            );
        $params = array(
            ':id'   => $legalServiceId,
            ':service_type' => self::CURRENT_SERVICE_TYPE,
            );
        return $newsDao->update($columns,$conditions,$params);
    }
    
    /**
     * 新建新闻
     * @param [type] $data [description]
     */
    public function addNews($data){
        $newsDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $cols = array(
            'service_type'  => self::CURRENT_SERVICE_TYPE,
            'user_id'       => $data['userId'],
            'is_admin'      => 1,
            'title'         => $data['title'],
            'category'      => $data['category'],
            'content'       => $data['description'],
            'tjw_province'  => $data['province'],
            'tjw_city'      => $data['city'],
            'tjw_district'  => $data['district'],
            'tjw_street'    => $data['street'],
            'create_time'   => date("Y-m-d H:i:s"),
            'update_time'   => date("Y-m-d H:i:s"),
            'ext_info'      => json_encode($data['extInfo']),
            'start_time'    => date("Y-m-d H:i:s"),
            'end_time'      => date("Y-m-d H:i:s"),
            'is_public'     => $data['isPublic'],
            );
        return $newsDao->baseInsert($cols);
    }
    
    /**
     * 获取单体信息
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function getNews($legalServiceId){
        $newsDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $conditions = array(
            "and",
            "id=".$legalServiceId,
            );
        return $newsDao->select('*', $conditions, array());
    }
    
    /**
     * 更新新闻信息
     * @param  [type] $data           [description]
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function updateNews($data, $legalServiceId){
        $newsDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $columns = array(
            'user_id'       => $data['userId'],
            'title'         => $data['title'],
            'category'      => $data['category'],
            'content'       => $data['description'],
            'tjw_province'  => $data['province'],
            'tjw_city'      => $data['city'],
            'tjw_district'  => $data['district'],
            'tjw_street'    => $data['street'],
            'update_time'   => date("Y-m-d H:i:s"),
            'ext_info'      => json_encode($data['extInfo']),
            'start_time'    => date("Y-m-d H:i:s"),
            'end_time'      => date("Y-m-d H:i:s"),
            'is_public'     => $data['isPublic'],
            );
        $conditions = array(
            'and',
            'id=:id',
            'service_type=:service_type',
            );
        $params = array(
            ':id'   => $legalServiceId,
            ':service_type' => self::CURRENT_SERVICE_TYPE,
            );
        return $newsDao->update($columns,$conditions,$params);
    }

    /**
     * 获取新闻列表
     * @param  [type] $params [description]
     * @return [type]         [description]
     */
    public function getHomePageNewsList($cityId){
        // $key = md5("HOME_PAGE_NEWS_LIST::V2::".$cityId);
        // $list = MemCacheComponent::getCacheByKey($key);
        $list = false;
        // if(empty($list)) {
        $areaModel = new AreaModel();
        $provinceId = $areaModel->getCityProvinceId($cityId);
            $newsDao = TjwCmsServiceDao::getInstance('tjw_cms_service');
            $conditions = array(
                'and',
                'service_type=' . self::CURRENT_SERVICE_TYPE,
                'category='.PopularData::NEWS_CATEGORY_LAW,//新闻
                'del_flag=0',
                array(
                    "or",
                    'tjw_city=' . $cityId,
                    "tjw_province=0",
                    "tjw_province=".$provinceId,
                ),
                'tjw_district<=0',
                'is_public=1',
                'is_top in (0,1)',
            );
            $order = array(
                'is_top desc',
                'create_time desc',
            );
            $data = $newsDao->select('*', $conditions, array(), true, $order, "", 0, 10);
            $newlist = array();
            foreach ($data as $row) {
                $extInfo = json_decode($row['ext_info'], true);
                $newlist[] = array(
                    "title" => $row['title'],
                    "image" => QiniuModel::getImageUrl($extInfo['headerImg'],QiniuModel::THUMB_SIZE_DEFAULT,1),
                    "id" => $row['id'],
                    "serviceType" => $row['service_type'],
                );
            }
            //轮播
            $conditions = array(
                'and',
                'service_type=' . self::CURRENT_SERVICE_TYPE,
                'category='.PopularData::NEWS_CATEGORY_LAW,//新闻
                'del_flag=0',
                array(
                    "or",
                    'tjw_city=' . $cityId,
                    "tjw_province=0",
                    "tjw_province=".$provinceId,
                ),
                'tjw_district<=0',
                'is_public=1',
                'is_top in (2)',
            );
            $order = array(
                'is_top desc',
                'update_time desc',
            );
            $data = $newsDao->select('*', $conditions, array(), true, $order, "", 0, 10);
            $scrolllist = array();
            foreach ($data as $row) {
                $extInfo = json_decode($row['ext_info'], true);
                $scrolllist[] = array(
                    "title" => $row['title'],
                    "image" => QiniuModel::getImageUrl($extInfo['headerImg'],QiniuModel::THUMB_SIZE_DEFAULT,1),
                    "id" => $row['id'],
                    "serviceType" => $row['service_type'],
                );
            }
            $list = array(
                'list' => $newlist,
                'scroll'=> $scrolllist,
                );
            // MemCacheComponent::setCache($key,$list,MemCacheComponent::FIVE_MINUTE);
        // }
        return $list;
    }
}