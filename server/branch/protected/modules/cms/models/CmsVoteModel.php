<?php
/**
 * 活动模块
 * @author zhous
 *
 */

class CmsVoteModel{
    
    CONST CURRENT_SERVICE_TYPE = 6;
    
    CONST VOTE_STATUS_UN_START = 0; //未开始;
    CONST VOTE_STATUS_UNDER_WAY= 1; //进行中;
    CONST VOTE_STATUS_END      = 2; //已结束
    
    private static $_voteStatusWriter = array(
        self::VOTE_STATUS_UN_START  =>  '未开始',
        self::VOTE_STATUS_UNDER_WAY =>  '进行中',
        self::VOTE_STATUS_END       =>  '已结束',
        );
    
    /**
     * 获取投票列表
     * @param  [type] $params [description]
     * @return [type]         [description]
     */
    public function getVoteList($params){
        $voteDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $conditions = array(
            "and",
            "service_type=".self::CURRENT_SERVICE_TYPE,
            "del_flag=0",
            );
        $sqlParams = array();
        if (!is_null($params['voteId'])){
            $conditions[] = "id=:voteId";
            $sqlParams[':voteId'] = $params['voteId'];
        }
        if (!is_null($params['title'])){
            $conditions[] = "title=:title";
            $sqlParams[':title'] = $params['title'];
        }
        if (!is_null($params['startTime']) && is_null($params['endTime'])){
            $conditions[] = 'start_time >= :startTime'.$params['startTime'];
            $conditions[] = 'end_time <= :endTime'.$params['endTime'];
            $sqlParams[':startTime'] = $params['startTime'];
            $sqlParams[':endTime'] = $params['endTime'];
        }
        $order = array(
            'is_top desc',
            'create_time desc',
            );
        $data = $voteDao->select('*', $conditions, $sqlParams, true, $order, array(), ($params['pageNo']-1)*15, ($params['pageNo'])*15-1);
        $list = array();
        foreach($data as $row){
            $list[] = $this->_voteDbRow2BaseArray($row);
        }
        return $list;
    }
    
    /**
     * [_voteDbRow2BaseArray description]
     * @param  [type] $row [description]
     * @return [type]      [description]
     */
    private function _voteDbRow2BaseArray($row){
        $status = ($row['start_time'] <= date("Y-m-d H:i:s") && $row['end_time'] >= date("Y-m-d H:i:s")) ? 1 : ($row['start_time'] > date("Y-m-d H:i:s") ? 0 : 2);
        return array(
            'voteId'                => intval($row['id']),
            'title'                 => $row['title'],
            'createTime'            => $row['create_time'],
            'statusName'            => self::$_voteStatusWriter[$status],
            'isStick'               => intval($row['is_top']),
            );
    }
    
    
    public function getListCount($params){
        $voteDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $conditions = array(
            "and",
            "service_type=".self::CURRENT_SERVICE_TYPE,
            "del_flag=0",
            );
        $sqlParams = array();
        if (!is_null($params['voteId'])){
            $conditions[] = "id=:voteId";
            $sqlParams[':voteId'] = $params['voteId'];
        }
        if (!is_null($params['title'])){
            $conditions[] = "title=:title";
            $sqlParams[':title'] = $params['title'];
        }
        if (!is_null($params['startTime']) && is_null($params['endTime'])){
            $conditions[] = 'start_time >=:startTime';
            $conditions[] = 'end_time <=:endTime';
            $sqlParams[':startTime'] = $params['startTime'];
            $sqlParams[':endTime'] = $params['endTime'];
        }
        
        return $voteDao->select('count(1) as num', $conditions, $sqlParams, false);
    }
    
    /**
     * 根据Ids获取投票关注&参与数据
     * @param  [type] $ids [description]
     * @return [type]      [description]
     */
    public function getVoteCountByIds($ids){
        $voteRecordDao = TjwCmsServiceRecordDao::getInstance('tjw_cms_service_record');
        
        $conditions = array(
            'and',
            'legal_service_id in ('.join($ids,",").')',
            'type in (1,2)',
            );
        $order = array(
            'legal_service_id',
            'type',
            );
        $group = array(
            'legal_service_id',
            'type',
            );
        $data = $voteRecordDao->select('legal_service_id, type, count(1) as num', $conditions, array(),true, $order, $group);
        $result = array();
        foreach($data as $item){
            $result[$item['legal_service_id']][$item['type']] = $item['num'];
        }
        return $result;
    }
    
    /**
     * 置顶投票项
     * @param  [type] $legalServiceId [description]
     * @param  [type] $isStick        [description]
     * @return [type]                 [description]
     */
    public function updateVoteStick($legalServiceId, $isStick=0){
        $voteDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
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
        return $voteDao->update($columns,$conditions,$params);
    }
    
    /**
     * 删除投票活动
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function deleteVote($legalServiceId){
        $voteDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $columns = array(
            'del_flag'        => 1,
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
        return $voteDao->update($columns,$conditions,$params);
    }
    
    
    /**
     * 新建投票
     * @param [type] $data [description]
     */
    public function addVote($data){
        $voteDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
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
            'ext_info'      => json_encode($data['extInfo']),
            'crowd'         => json_encode($data['crowd']),
            'start_time'    => $data['startTime'],
            'end_time'      => $data['endTime'],
            );
        return $voteDao->baseInsert($cols);
    }
    
    /**
     * 获取单体信息
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function getVote($legalServiceId){
        $voteDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $conditions = array(
            "and",
            "id=".$legalServiceId,
            "service_type=".self::CURRENT_SERVICE_TYPE,
            );
        return $voteDao->select('*', $conditions, array());
    }
    
    /**
     * 更新投票信息
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function updateVote($data, $legalServiceId){
        $voteDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $columns = array(
            'user_id'       => $data['userId'],
            'title'         => $data['title'],
            'content'       => $data['content'],
            'tjw_province'  => $data['province'],
            'tjw_city'      => $data['city'],
            'tjw_district'  => $data['district'],
            'tjw_street'    => $data['street'],
            'create_time'   => date("Y-m-d H:i:s"),
            'update_time'   => date("Y-m-d H:i:s"),
            'ext_info'      => json_encode($data['extInfo']),
            'crowd'         => json_encode($data['crowd']),
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
        return $voteDao->update($columns,$conditions,$params);
    }
    
    /**
     * [addVoteItem description]
     * @param [type] $data [description]
     */
    public function addVoteItem($data){
        $voteItemDao = TjwCmsVoteItemDao::getInstance("tjw_cms_vote_item");
        $cols = array(
                'item_title'        =>  $data['itemTitle'],
                'item_image_url'    =>  $data['itemImg'],
                'item_url'          =>  $data['itemUrl'],
                'create_time'       =>  date("Y-m-d H:i:s"),
                'update_time'       =>  date("Y-m-d H:i:s"),
            );
        return $voteItemDao->baseInsert($cols);
    }
    
    /**
     * [updateVoteItem description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function updateVoteItem($data){
        $voteItemDao = TjwCmsVoteItemDao::getInstance("tjw_cms_vote_item");
        $col = array(
            'item_title'        =>  $data['itemTitle'],
            'item_image_url'    =>  $data['itemImg'],
            'item_url'          =>  $data['itemUrl'],
            'update_time'       =>  date("Y-m-d H:i:s"),
            );
        $conditions = array(
            'AND',
            'id=:id'
            );
        $params = array(
            ':id' => $data['itemId'],
            );
        return $voteItemDao->update($col, $conditions, $params);
    }
    
    /**
     * [delVoteItem description]
     * @param  [type] $data [description]
     * @return [type]       [description]
     */
    public function delVoteItem($data){
        $voteItemDao = TjwCmsVoteItemDao::getInstance("tjw_cms_vote_item");
        $col = array(
            'del_flag'      => 1,
            );
        $conditions = array(
            'AND',
            'id=:id'
            );
        $params = array(
            ':id' => $data['itemId'],
            );
        return $voteItemDao->update($col, $conditions, $params);
    }
    
}