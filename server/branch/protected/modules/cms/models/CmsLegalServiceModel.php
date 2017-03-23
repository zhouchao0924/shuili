<?php
/**
 * 新闻模块
 * @author zhous
 *
 */

class CmsLegalServiceModel{
    
    CONST SERVICE_LEGAL_CONSULT     = 0;//法律咨询
    CONST SERVICE_LEGAL_AID         = 1;//法律援助
    CONST SERVICE_LEGAL_CONCILIATE  = 2;//调解
    CONST SERVICE_LEGAL_BARRISTER   = 3;//找律师
    
    /**
     * [getListByFilter description]
     * @param  [type] $data     [description]
     * @param  [type] $category [description]
     * @return [type]           [description]
     */
    public function getListByFilter($data){
        $legalServiceDao = TjwCmsServiceDao::getInstance('tjw_cms_service');
        $conditions = array(
            'and',
            'del_flag=0',
            );
        if (!is_null($data['district'])){
            $conditions[] = 'tjw_district='.$data['district'];
        }
        if (!is_null($data['city'])){
            $conditions[] = 'tjw_city='.$data['city'];
        }
        if (!is_null($data['province'])){
            $conditions[] = 'tjw_province='.$data['province'];
        }
        if (!is_null($data['category'])){
            $conditions[] = 'category='.$data['category'];
        }
        $conditions[] = 'service_type='.$data['serviceType'];
        $order = array(
            'is_top desc',
            'update_time desc',
            );
        $data = $legalServiceDao->select('*', $conditions, array(), true, $order, array(), ($data['pageNo']-1)*15, ($data['pageNo'])*15-1);

        $list = array();
        foreach($data as $row){
            $list[] = $this->_legaServiceDbRow2BaseArray($row);
        }
        return $list;
    }
    
    /**
     * [_legaServiceDbRow2BaseArray description]
     * @param  [type] $row [description]
     * @return [type]      [description]
     */
    private function _legaServiceDbRow2BaseArray($row){
        $extInfo = (trim($row['ext_info']) != '') ?  json_decode(trim($row['ext_info']), true) : array();
        return array(
                'id'            => intval($row['id']),
                'userId'        => intval($row['user_id']),
                'publicTime'    => $row['update_time'],
                'category'      => intval($row['category']),
                'categoryName'  => (isset(PopularData::$serviceLegalAdviceCategory[$row['category']])) ? PopularData::$serviceLegalAdviceCategory[$row['category']] : '未知类型',
                'title'         => $row['title'],
                'content'       => $row['content'],
                'headerImg'     => (isset($extInfo['headerImg'])) ? $extInfo['headerImg'] : '',
                'authorName'    => (isset($extInfo['userName'])) ? $extInfo['userName'] : '',
            );
    }
    
    /**
     * [getCountByFilter description]
     * @param  [type] $data     [description]
     * @param  [type] $category [description]
     * @return [type]           [description]
     */
    public function getCountByFilter($data){
        $legalServiceDao = TjwCmsServiceDao::getInstance('tjw_cms_service');
        $conditions = array(
            'and',
            'del_flag=0',
            );
        if (!is_null($data['district'])){
            $conditions[] = 'tjw_district='.$data['district'];
        }
        if (!is_null($data['city'])){
            $conditions[] = 'tjw_city='.$data['city'];
        }
        if (!is_null($data['province'])){
            $conditions[] = 'tjw_province='.$data['province'];
        }
        if (!is_null($data['category'])){
            $conditions[] = 'category='.$data['category'];
        }
        $conditions[] = 'service_type='.$data['serviceType'];
        return $legalServiceDao->select('count(1) as num', $conditions, array(), false);
    }
    
    /**
     * [getCaseById description]
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function getCaseById($legalServiceId){
        $legalServiceDao = TjwCmsServiceDao::getInstance('tjw_cms_service');
        $conditions = array(
            'and',
            'id='.$legalServiceId,
            );
        $data = $legalServiceDao->select('*',$conditions);
        if (!is_null($data)){
            $data['categoryName'] = (isset(PopularData::$serviceLegalAdviceCategory[$data['category']])) ? PopularData::$serviceLegalAdviceCategory[$data['category']] : '未知类型';
        }
        return $data;
    }
    
    /**
     * [addServiceRecordForId description]
     * @param [type] $legalServiceId [description]
     * @param [type] $recordType     [description]
     */
    public function addServiceRecordForId($params){
        $legalServiceRecordDao = TjwCmsServiceRecordDao::getInstance('tjw_cms_service_record');
        $cols = array(
            'legal_service_id'  => $params['legalServiceId'],
            'user_id'           => $params['user_id'],
            'type'              => $params['type'],
            'ip'                => $params['ip'],
            'service_type'      => $params['service_type'],
            'create_time'       => date("Y-m-d H:i:s"),
            'update_time'       => date("Y-m-d H:i:s"),
            );
        return $legalServiceRecordDao->baseInsert($cols);
    }
    
    /**
     * [updateAidLawyerToUnableById description]
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function updateAidLawyerToUnableById($legalServiceId){
        $legalServiceRecordDao = TjwCmsServiceRecordDao::getInstance('tjw_cms_service_record');
        $columns = array(
            'vote_value'    => 1,
            'update_time'   => date("Y-m-d H:i:s"),
            );
        $conditions = array(
            'AND',
            'legal_service_id=:legal_service_id',
            );
        $params = array(
            ':legal_service_id' => $legalServiceId,
            );
        return $legalServiceRecordDao->update($columns,$conditions,$params);
    }
    
    /**
     * [updateAidLawyerToUnableByIdWithLawyerId description]
     * @param  [type] $legalServiceId [description]
     * @param  [type] $lawyerId       [description]
     * @return [type]                 [description]
     */
    public function updateAidLawyerToUnableByIdWithLawyerId($legalServiceId, $lawyerId){
        $legalServiceRecordDao = TjwCmsServiceRecordDao::getInstance('tjw_cms_service_record');
        $columns = array(
            'vote_value'    => 2,
            'update_time'   => date("Y-m-d H:i:s"),
            'del_flag'=>1,
            );
        $conditions = array(
            'AND',
            'legal_service_id=:legal_service_id',
            'user_id=:user_id',
            );
        $params = array(
            ':legal_service_id' => $legalServiceId,
            ':user_id'          => $lawyerId,
            );
        return $legalServiceRecordDao->update($columns,$conditions,$params);
    }
    
    /**
     * [getEventRecordListById description]
     * @param  [type] $legalServiceId [description]
     * @param  [type] $recordType     [description]
     * @return [type]                 [description]
     */
    public function getEventRecordListById($legalServiceId, $recordType){
        $legalServiceRecordDao = TjwCmsServiceRecordDao::getInstance('tjw_cms_service_record');
        $conditions = array(
            'AND',
            'type='.$recordType,
            'legal_service_id='.$legalServiceId,
            'del_flag=0',
            );
        $order = array(
            'create_time',
            );
        $data = $legalServiceRecordDao->select('*', $conditions, array(), true, $order, array(), 0, 25);
        $list = array();
        foreach($data as $row){
            $list[] = $this->_eventRecordDbRow2BaseArray($row);
        }
        return $list;
    }
    
    /**
     * [_eventRecordDbRow2BaseArray description]
     * @param  [type] $row [description]
     * @return [type]      [description]
     */
    private function _eventRecordDbRow2BaseArray($row){
        return array(
            'legalServiceId'    =>  intval($row['legal_service_id']),
            'userId'            =>  intval($row['user_id']),
            'type'              =>  intval($row['type']),
            'value'             =>  intval($row['vote_value']),
            'createTime'        =>  $row['create_time'],
            );
    }
    
    /**
     * 设置案情类型
     * @param  [type] $legalServiceId [description]
     * @param  [type] $caseType       [description]
     * @return [type]                 [description]
     */
    public function updateCaseStatus($legalServiceId, $caseType){
        $legalServiceDao = TjwLegalServiceDao::getInstance("tjw_legal_service");
        $case = $this->getCaseById($legalServiceId);
        
        $extInfo = ($case['ext_info'] == "") ? array() : json_decode($case['ext_info'], true);
        $extInfo['caseType'] = intval($caseType);
        
        $columns = array(
            'ext_info'      =>  json_encode($extInfo),
            'update_time'   =>  date("Y-m-d H:i:s"),
            );
        $conditions = array(
            'AND',
            'id=:id',
            );
        $params = array(
            ':id' => $legalServiceId,
            );
        return $legalServiceDao->update($columns,$conditions,$params);
    }
    
    /**
     * [getCaseProcessById description]
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function getCaseProcessById($legalServiceId, $range = NULL){
        $caseProcessDao = TjwLegalCaseProcessDao::getInstance("tjw_legal_case_process");
        $conditions = array(
            'AND',
            'legal_service_id='.$legalServiceId,
            );
        if (!is_null($range)){
            $conditions['is_confirm'] = intval($range);
        }        
        $order = array(
            'process_type',
            );
        $data = $caseProcessDao->select('*', $conditions, array(), true, $order);
        $list = array();
        foreach ($data as $row) {
            $list[] = $this->_caseProcessDbRow2BaseArray($row);
        }
        return $list;
    }
    
    /**
     * [_caseProcessDbRow2BaseArray description]
     * @param  [type] $row [description]
     * @return [type]      [description]
     */
    private function _caseProcessDbRow2BaseArray($row){
        $extInfo = (!isset($row['ext_info'])) ? array() : json_decode($row['ext_info'], true);
        return array(
            'caseId'    =>  intval($row['legal_service_id']),
            'process'   =>  intval($row['process_type']),
            'content'   =>  $row['content'],
            'images'    =>  (isset($row['images'])) ? $row['images'] : array(),
            'updateTime'=> $row['update_time'],
            );
    }
    
    /**
     * [CaseProcess description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function confirmCaseProcess($data){
        $caseProcessDao = TjwLegalCaseProcessDao::getInstance("tjw_legal_case_process");
        $columns = array(
            'is_confirm'          => 1,
            'confirm_user_type'   => 2,
            'confirm_user_id'     => 2,   //@todo 先写死
            'confirm_time'       => date("Y-m-d H:i:s"),
            );
        $conditions = array(
            'AND',
            'legal_service_id=:legal_service_id',
            'process_type=:process_type'
            );
        $params = array(
            ':legal_service_id' => $data['caseId'],
            ':process_type'     => $data['processType'],
            );
        return $caseProcessDao->update($columns,$conditions,$params);
    }
    
    /**
     * [getEventById description]
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function getEventById($legalServiceId){
        $legalServiceDao = TjwLegalServiceDao::getInstance("tjw_legal_service");
        $conditions = array(
            "and",
            "id=".$legalServiceId,
            );
        $data = $legalServiceDao->select('*', $conditions, array());
        return $this->_eventDbRow2BaseArray($data);
    }
    
    /**
     * [_eventDbRow2BaseArray description]
     * @param  [type] $row [description]
     * @return [type]      [description]
     */
    private function _eventDbRow2BaseArray($row){
        $extInfo = ($row['ext_info'] == "") ? array() : json_decode($row['ext_info'], true);
        return array(
            'eventId'               => intval($row['id']),
            'serviceType'           => intval($row['service_type']),
            'publishTime'           => $row['create_time'],
            'category'              => intval($row['category']),
            'adminId'               => intval($row['user_id']),
            'title'                 => $row['title'],
            'headerImg'             => (isset($extInfo['headerImg'])) ? $extInfo['headerImg'] : '',
            'startTime'             => $row['start_time'],
            'endTime'               => $row['end_time'],
            'province'              => intval($row['tjw_province']),
            'city'                  => intval($row['tjw_city']),
            'district'              => intval($row['tjw_district']),
            'content'               => $row['content'],
            'startTime'             => $row['start_time'],
            'endTime'               => $row['end_time'],
            'address'               => (isset($extInfo['address'])) ? $extInfo['address'] : '',
            'authorName'      => (isset($extInfo['authorName'])) ? $extInfo['authorName'] : 'admin',
            'orgName'         => (isset($extInfo['orgName'])) ? $extInfo['orgName'] : 'system',
            'extInfo'         => $extInfo,
            );
    }
    
    /**
     * [getMyTaskIds description]
     * @param  [type] $userId [description]
     * @param  [type] $pageNo [description]
     * @return [type]         [description]
     */
    public function getMyTaskIds($userId){
        $legalServiceRecordDao = TjwCmsServiceRecordDao::getInstance('tjw_cms_service_record');
        $conditions = array(
            'AND',
            'user_id='.$userId,
            'type in (8,9)',
            );
        $order = array(
            'create_time desc',
            'id desc',
            );
        $data = $legalServiceRecordDao->select('distinct(legal_service_id) as legal_service_id',$conditions, array(), true, $order);
        $list = array();
        foreach ($data as $key => $value) {
            $list[] = $value['legal_service_id'];
        }
        return $list;
    }
    
    /**
     * [getcaseIdsInEnd description]
     * @param  [type] $idList [description]
     * @return [type]         [description]
     */
    public function getCaseIdsInEnd($idList){
        $caseProcessDao = TjwLegalCaseProcessDao::getInstance("tjw_legal_case_process");
        if (empty($idList)){
            return array();
        }
        $conditions = array(
            'AND',
            'is_confirm=1',
            'process_type in (13, 17)',
            'legal_service_id in ('.join($idList, ',').')',
            );
        $order = array(
            'update_time',
            );
        $data = $caseProcessDao->select('legal_service_id', $conditions, array(), true, $order);
        $list = array();
        foreach ($data as $key => $value) {
            $list[] = $value['legal_service_id'];
        }
        return $list;
    }
    
    /**
     * [getCaseIdsInProcess description]
     * @param  [type] $idList [description]
     * @return [type]         [description]
     */
    public function getCaseIdsInProcess($idList){
        $legalServiceRecordDao = TjwCmsServiceRecordDao::getInstance('tjw_cms_service_record');
        if (empty($idList)){
            return array();
        }
        $conditions = array(
            'AND',
            'type=9',
            'legal_service_id in ('.join($idList, ',').')',
            );
        $order = array(
            'update_time',
            );
        $data = $legalServiceRecordDao->select('legal_service_id', $conditions, array(), true, $order);
        $list = array();
        foreach ($data as $key => $value) {
            $list[] = $value['legal_service_id'];
        }
        return $list;
    }
    
    public function getCaseListByIds($ids){
        $legalServiceDao = TjwCmsServiceDao::getInstance('tjw_cms_service');
        if (empty($ids)){
            return array();
        }
        $conditions = array(
            'AND',
            'id in ('.join($ids,',').')',
            );

        $order = array(
            'create_time desc',
            'id desc',
            );
        $data = $legalServiceDao->select('*', $conditions, array(), true, $order);
        $list = array();
        foreach ($data as $row) {
            $list[] = $this->_serviceDbRow2BaseArray($row);
        }
        return $list;
    }
    
    /**
     * [_serviceDbRow2BaseArray description]
     * @param  [type] $row [description]
     * @return [type]      [description]
     */
    private function _serviceDbRow2BaseArray($row){
        $extInfo = ($row['ext_info'] == "") ? array() : json_decode($row['ext_info'], true);
        return array(
            'legalServiceId'  => intval($row['id']),
            'publicTime'      => $row['create_time'],
            'serviceTypeName' => (!isset(PopularData::$legalServiceTypeName[intval($row['service_type'])+1])) ? '未知类型' : PopularData::$legalServiceTypeName[intval($row['service_type'])+1],
            'categoryName'    => (intval($row['category']) == 0) ? '未知类型' : PopularData::$serviceLegalAdviceCategory[intval($row['category'])],
            'title'           => $row['title'],
            'content'         => $row['content'],
            'authorName'      => (isset($extInfo['authorName'])) ? $extInfo['authorName'] : 'admin',
            'orgName'         => (isset($extInfo['orgName'])) ? $extInfo['orgName'] : 'system',
            'headerImg'       => (isset($extInfo['headerImg'])) ? $extInfo['headerImg'] : '',
            );
    }

    /**
     * [getEventCountByIds description]
     * @param  [type] $ids    [description]
     * @param  [type] $userId [description]
     * @return [type]         [description]
     */
    public function getEventCountByIds($ids){
        $legalServiceRecordDao = TjwCmsServiceRecordDao::getInstance('tjw_cms_service_record');
        $conditions = array(
            'AND',
            'type in (0,1,2,5)',
            'legal_service_id in ('.join($ids,',').')',
            );
        $order = array(
            'legal_service_id',
            'type',
            );
        $group = array(
            'legal_service_id',
            'type',
            );
        $data = $legalServiceRecordDao->select('legal_service_id, type, count(1) as num', $conditions, array(),true, $order, $group);

        $result = array();
        foreach($data as $item){
            $result[$item['legal_service_id']][$item['type']] = intval($item['num']);
        }
        return $result;
    }
    
}