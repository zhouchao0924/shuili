<?php
/**
 * 活动模块
 * @author zhous
 *
 */

class CmsEventModel{
    
    CONST CURRENT_SERVICE_TYPE = 5;      //当前服务类型
    CONST EVENT_RECORD_SIGN_IN_TYPE = 3; //签到类型
    
    
    
    private static $_eventStatusWriter = array('未开始','进行中','已结束');
    
    /**
     * 查看活动列表
     */
    public function getList($params){
        
        $eventDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $conditions = array(
            "and",
            "service_type=".self::CURRENT_SERVICE_TYPE,
            "del_flag=0",
            );
        if (!is_null($params['eventId'])){
            $conditions[] = "id=".$params['eventId'];
        }
        if (!is_null($params['title'])){
            $conditions[] = 'title Like "%'.$params['title'].'%"';
        }
        if (!is_null($params['startTime']) && is_null($params['endTime'])){
            $conditions[] = 'start_time >='.$params['startTime'];
            $conditions[] = 'end_time <='.$params['endTime'];
        }
        if ($params['category'] > 0){
            $conditions[] = 'category ='.$params['category'];
        }
        if (!is_null($params['isStick'])){
            $conditions[] = 'is_top =:is_top';
            $sqlParams[':is_top'] = intval($params['isStick']);
        }
        // if (!is_null($params['cityId'])){
        //     $conditions[] = 'tjw_city =:tjw_city';
        //     $sqlParams[':tjw_city'] = intval($params['cityId']);
        // }
        // if (!is_null($params['districtId'])){
        //     $conditions[] = 'tjw_district =:tjw_district';
        //     $sqlParams[':tjw_district'] = intval($params['districtId']);
        // }
        $params['pageNo'] = (intval($params['pageNo']) == 0) ? 1 : intval($params['pageNo']);
        $order = array(
            'is_top desc',
            'create_time desc',
            );
        $data = $eventDao->select('*', $conditions, array(), true, $order, array(), ($params['pageNo']-1)*15, ($params['pageNo'])*15-1);
        $list = array();
        foreach ($data as $row){
            $list[] = $this->_eventDbRow2BaseArray($row);
        }
        return $list;
    }
    
    /**
     * [getCount description]
     * @param  [type] $params [description]
     * @return [type]         [description]
     */
    public function getListCount($params){
        $eventDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $conditions = array(
            "and",
            "service_type=".self::CURRENT_SERVICE_TYPE,
            "del_flag=0",
            );
        if (!is_null($params['eventId'])){
            $conditions[] = "id=".$params['eventId'];
        }
        if (!is_null($params['title'])){
            $conditions[] = 'title Like "%'.$params['title'].'%"';
        }
        if (!is_null($params['startTime']) && is_null($params['endTime'])){
            $conditions[] = 'start_time >='.$params['startTime'];
            $conditions[] = 'end_time <='.$params['endTime'];
        }
        return $eventDao->select('count(1) as num', $conditions, array(), false);
    }
    
    /**
     * [_eventDbRow2BaseArray description]
     * @param  [type] $row [description]
     * @return [type]      [description]
     */
    private function _eventDbRow2BaseArray($row){
        $status = ($row['start_time'] <= date("Y-m-d H:i:s") && $row['end_time'] >= date("Y-m-d H:i:s")) ? 1 : ($row['start_time'] > date("Y-m-d H:i:s") ? 0 : 2);
        return array(
            'eventId'       => intval($row['id']),
            'title'         => $row['title'],
            'category'      => intval($row['category']),
            'categoryName'  => (isset(PopularData::$serviceEventCategory[$row['category']])) ? PopularData::$serviceEventCategory[$row['category']] : '未知类型',
            'statusName'    => self::$_eventStatusWriter[$status],
            'createTime'    => $row['create_time'],
            'isStick'       => intval($row['is_top']),
            );
    }

    /**
     * 根据Ids获取关注活动、参与活动、活动签到的数据
     * @param  [type] $ids [description]
     * @return [type] 0Col:活动ID; 1Col:关注数; 2Col:参与数; 3Col:签到数.
     */
    public function getEventCountByIds($ids){
        
        $eventRecordDao = TjwCmsServiceRecordDao::getInstance('tjw_cms_service_record');
        
        $conditions = array(
            'and',
            'legal_service_id in ('.join($ids,",").')',
            'type in (1,2,3)',
            );
        $order = array(
            'legal_service_id',
            'type',
            );
        $group = array(
            'legal_service_id',
            'type',
            );
        $data = $eventRecordDao->select('legal_service_id, type, count(1) as num', $conditions, array(),true, $order, $group);
        $result = array();
        foreach($data as $item){
            $result[$item['legal_service_id']][$item['type']] = $item['num'];
        }
        return $result;
    }
        
    /**
     * 置顶活动
     * @param  [type] $legalServiceId [description]
     * @param  [type] $isStick        [description]
     * @return [type]     [description]
     */
    public function updateEventStick($legalServiceId, $isStick=0){
        $eventDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
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
        return $eventDao->update($columns,$conditions,$params);
    }
    
    /**
     * 删除活动
     * @param  [type] $legalServiceId [description]
     * @return [type]     [description]
     */
    public function deleteEventStick($legalServiceId){
        $eventDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
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
        return $eventDao->update($columns,$conditions,$params);
        
    }
    
    /**
     * 获取单体信息
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function getEventById($legalServiceId){
        $eventDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $conditions = array(
            "and",
            "id=".$legalServiceId,
            "service_type=".self::CURRENT_SERVICE_TYPE,
            );
        $data = $eventDao->select('*', $conditions, array());
        if (!empty($data)){
            $data['categoryName'] = (isset(PopularData::$serviceEventCategory[$data['category']])) ? PopularData::$serviceEventCategory[$data['category']] : '未知类型';
        }
        return $data;
    }
    
    /**
     * [addEvent description]
     * @param [type] $data [description]
     */
    public function addEvent($data){
        $eventDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $cols = array(
            'service_type'  => self::CURRENT_SERVICE_TYPE,
            'user_id'       => $data['userId'],
            'is_admin'      => 1,
            'title'         => $data['title'],
            'content'       => $data['content'],
            'tjw_province'  => $data['province'],
            'tjw_city'      => $data['city'],
            'tjw_district'  => $data['district'],
            'tjw_street'    => $data['street'],
            'create_time'   => date("Y-m-d H:i:s"),
            'update_time'   => date("Y-m-d H:i:s"),
            'crowd'         => json_encode($data['crowd']),
            'ext_info'      => json_encode($data['extInfo']),
            'start_time'    => $data['startTime'],
            'end_time'      => $data['endTime'],
            'category'      => $data['category'],
            );
        return $eventDao->baseInsert($cols);
    }
    
    /**
     * [updateEvent description]
     * @param  [type] $data           [description]
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function updateEvent($data, $legalServiceId){
        $eventDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $columns = array(
            'user_id'       => $data['userId'],
            'is_admin'      => 1,
            'title'         => $data['title'],
            'content'       => $data['content'],
            'tjw_province'  => $data['province'],
            'tjw_city'      => $data['city'],
            'tjw_district'  => $data['district'],
            'tjw_street'    => $data['street'],
            'update_time'   => date("Y-m-d H:i:s"),
            'crowd'         => json_encode($data['crowd']),
            'ext_info'      => json_encode($data['extInfo']),
            'start_time'    => $data['startTime'],
            'end_time'      => $data['endTime'],
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
        return $eventDao->update($columns,$conditions,$params);
    }
    
    /**
     * extInfo->summary单体信息
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function getSummaryById($legalServiceId){
        $eventDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $conditions = array(
            "and",
            "id=".$legalServiceId,
            "service_type=".self::CURRENT_SERVICE_TYPE,
            );
        $data = $eventDao->select("id,ext_info", $conditions,array());
        $extInfo = ($data['ext_info'] == "") ? array() : json_decode($data['ext_info'], true);
        $summary = (!empty($extInfo['summary']) && is_null($extInfo['summary'])) ? $extInfo['summary'] : array();
        return array(
            'id'            => $data['id'],
            'summary'       => $summary,
            );
    }
    
    /**
     * [updateSummary description]
     * @param  [type] $data [description]
     * @param  [type] $legalServiceId [description]
     * @return [type]       [description]
     */
    public function updateSummary($extInfo, $legalServiceId){
        $eventDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $columns = array(
            'update_time'   => date("Y-m-d H:i:s"),
            'ext_info'      => json_encode($extInfo),
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
        return $eventDao->update($columns,$conditions,$params);
    }
    
    /**
     * [getEventRecordListById description]
     * @param  [type]  $legalServiceId [description]
     * @param  integer $recordType     [description]
     * @return [type]                  [description]
     */
    public function getEventRecordListById($legalServiceId, $recordType=0){
        $eventRecordDao = TjwCmsServiceRecordDao::getInstance('tjw_cms_service_record');
        $conditions = array(
            'and',
            'type='.$recordType,
            'legal_service_id='.$legalServiceId,
            'del_flag=0',
            );
        $data = $eventRecordDao->select("*", $conditions,array(), TRUE);
        $list = array();
        if (!empty($data)){
            foreach ($data as $row){
                $list[] = $this->_eventRecordDbRow2BaseArray($row);
            }
        }
        return $list;
    }
    
    /**
     * [_eventRecordDbRow2BaseArray description]
     * @param  [type] $row [description]
     * @return [type]      [description]
     */
    private function _eventRecordDbRow2BaseArray($row){
        $extInfo = ($row['ext_info'] == '') ? array() : json_decode($row['ext_info'], TRUE);
        $signInType = (intval($extInfo['signInType']) != 1) ? 0 : 1;
        return array(
            'userId'           => intval($row['user_id']),
            'signInTypeName'   => ($signInType) ? '报名用户' : '未报名用户',
            );
    }
 
    /**
     * 根据用户ID获取置顶记录类型数据
     * @param  [type]  $eventId    [description]
     * @param  [type]  $userId     [description]
     * @param  integer $recordType [description]
     * @return [type]              [description]
     */
    public function getRecordInfoByUserId($eventId, $userId, $recordType=0){
        $eventRecordDao = TjwCmsServiceRecordDao::getInstance('tjw_cms_service_record');
        $conditions = array(
            'and',
            'type='.$recordType,
            'legal_service_id='.$eventId,
            'user_id='.$userId,
            'del_flag=0',
            );
        return $eventRecordDao->select("*", $conditions, array(), true);
    }
    
    /**
     * 新建签到
     * @param [type] $data [description]
     */
    public function addSignIn($data){
        $eventRecordDao = TjwCmsServiceRecordDao::getInstance('tjw_cms_service_record');
        $cols = array(
            'legal_service_id'  =>  $data['eventId'],
            'user_id'           =>  $data['userId'],
            'type'              =>  $data['type'],
            'ext_info'          =>  json_encode($data['extInfo']),
            'create_time'       =>  date("Y-m-d H:i:s"),
            'update_time'       =>  date("Y-m-d H:i:s"),
            );
        return $eventRecordDao->baseInsert($cols);
    }

    public function isEventClose($start,$end){
        $s = strtotime($start);
        $e = strtotime($end);
        $t = time();
        if($t > $e){
            return 1;
        }
        return 0;
    }

    /**
     * 首页活动列表
     */
    public function getHomePageList($cityId){
        // $key = md5("HOME_PAGE_EVENT_LIST::V2::".$cityId);
        // $list = MemCacheComponent::getCacheByKey($key);
        //非轮播
        // if(empty($list)){
            $areaModel = new AreaModel();
            $provinceId = $areaModel->getCityProvinceId($cityId);
            $eventDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
            $conditions = array(
                "and",
                "service_type=".self::CURRENT_SERVICE_TYPE,
                "del_flag=0",
                array(
                    "or",
                    "tjw_city=".$cityId,
                    "tjw_province=0",
                    "tjw_province=".$provinceId
                ),
                'tjw_district<=0',
                'is_top in (0,1)',
            );

            $order = array(
                'is_top desc',
                'create_time desc',
            );
            $data = $eventDao->select('*', $conditions, array(), true, $order, array(), 0, 7);
            $eventlist = array();
            foreach ($data as $row){
                $eventlist[] = $this->_eventDbRow2BaseArrayToHomePage($row);
            }
            //轮播
            $conditions = array(
                "and",
                "service_type=".self::CURRENT_SERVICE_TYPE,
                "del_flag=0",
                array(
                    "or",
                    "tjw_city=".$cityId,
                    "tjw_province=0",
                    "tjw_province=".$provinceId
                ),
                'tjw_district<=0',
                'is_top in (2)',
            );
            $order = array(
                'is_top desc',
                'update_time desc',
            );
            $data = $eventDao->select('*', $conditions, array(), true, $order, array(), 0, 2);
            $scrolllist = array();
            foreach ($data as $row){
                $scrolllist[] = $this->_eventDbRow2BaseArrayToHomePage($row);
            }
            $list = array(
                'list' => $eventlist,
                'scroll'=> $scrolllist,
                );
            
            // MemCacheComponent::setCache($key,$list,MemCacheComponent::FIVE_MINUTE);
        // }
        return $list;
    }
    
    private function _eventDbRow2BaseArrayToHomePage($row){
        $extInfo = json_decode($row['ext_info'],true);
        return array(
                "id"            => $row['id'],
                "serviceType"   => $row['service_type'],
                "title"         => $row['title'],
                "title"         => $row['title'],
                "image"         => PopularData::$eventImage[$row['category']],
                "category"      => $row['category'],
                "categoryName"  => (isset(PopularData::$serviceEventCategory[$row['category']])) ? PopularData::$serviceEventCategory[$row['category']] : "未知类型",
                "address"       => $extInfo['address'],
                "date"          => date("Y-m-d",strtotime($row['start_time']))." - ".date("Y-m-d",strtotime($row['end_time'])),
                "joinCount"     => 0,
                "isJoin"        => 0,
                "isClose"       => $this->isEventClose($row['start_time'],$row['end_time']),
            );
    }
}   