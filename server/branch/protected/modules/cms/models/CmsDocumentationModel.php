<?php
/**
 * 帮助文档模块
 * @author zhous
 *
 * @todo 1. 没有判断权限
 */

class CmsDocumentationModel{
    
    CONST CURRENT_SERVICE_TYPE = 8;
    
    /**
     * 获取帮助文档列表
     * @param  [type] $params [description]
     * @return [type]         [description]
     */
    public function getDocList($params){
        $docDao = TjwCmsServiceDao::getInstance('tjw_cms_service');
        $conditions = array(
            'and',
            "service_type=".self::CURRENT_SERVICE_TYPE,
            'del_flag=0',
            );
        $sqlParams = array();
        if (!is_null($params['docId'])){
            $conditions[] = "legal_service_id=:docId";
            $sqlParams[":docId"] = $params['docId'];
        }
        if (!is_null($params['title'])){
            $conditions[] = "title=:title";
            $sqlParams[":title"] = $params['title'];
        }
        $order = array(
            'is_top desc',
            'update_time desc',
        );
        $data = $docDao->select('*', $conditions, $sqlParams, true, $order, array(), ($params['pageNo']-1)*15, ($params['pageNo'])*15-1);
        $list = array();
        foreach($data as $row){
            $list[] = $this->_docDbRow2BaseArray($row);
        }
        return $list;
    }
    
    /**
     * [getListCount description]
     * @param  [type] $params [description]
     * @return [type]         [description]
     */
    public function getListCount($params){
        $docDao = TjwCmsServiceDao::getInstance('tjw_cms_service');
        $conditions = array(
            'and',
            "service_type=".self::CURRENT_SERVICE_TYPE,
            'del_flag=0',
            );
        $sqlParams = array();
        if (!is_null($params['docId'])){
            $conditions[] = "legal_service_id=:docId";
            $sqlParams[':docId'] = $params['docId'];
        }
        if (!is_null($params['title'])){
            $conditions[] = "title=:title";
            $sqlParams[':title'] = $params['title'];
        }
        return $docDao->select('count(1) as num', $conditions, $sqlParams, false);
    }
    
    /**
     * [_docDbRow2BaseArray description]
     * @param  [type] $row [description]
     * @return [type]      [description]
     */
    private function _docDbRow2BaseArray($row){
        return array(
            'docId'                 => $row['id'],
            'title'                 => $row['title'],
            'createTime'            => $row['create_time'],
            'isStick'               => $row['is_top'],
            );
    }
    
    /**
     * 置顶帮助文档
     * @param  [type] $legalServiceId [description]
     * @param  [type] $isStick        [description]
     * @return [type]     [description]
     */
    public function updateDocStick($legalServiceId, $isStick=0){
        $docDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
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
            ':id'           => $legalServiceId,
            ':service_type' => self::CURRENT_SERVICE_TYPE,
            );  
        return $docDao->update($columns,$conditions,$params);
        
    }
    
    /**
     * [deleteDoc description]
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function deleteDoc($legalServiceId){
        $docDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
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
        return $docDao->update($columns,$conditions,$params);
    }
    
    /**
     * 获取单体信息
     * @param  [type] $legalServiceId [description]
     * @return [type]                 [description]
     */
    public function getDoc($legalServiceId){
        $docDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $conditions = array(
            "and",
            "id=".$legalServiceId,
            "service_type=".self::CURRENT_SERVICE_TYPE,
            );
        return $docDao->select('*', $conditions, array());
    }
    
/**
     * 新建帮助文档
     * @param [type] $data [description]
     */
    public function addDoc($data){
        $docDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
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
            'start_time'    => date("Y-m-d H:i:s"),
            'end_time'      => date("Y-m-d H:i:s"),
            );
        return $docDao->baseInsert($cols);
    }
    
   /**
     * 更新帮助文档信息
     * @param  [type] $data [description]
     * @param  [type] $legalServiceId [description]
     * @return [type]       [description]
     */
    public function updateDoc($data, $legalServiceId){
        $docDao = TjwCmsServiceDao::getInstance("tjw_cms_service");
        $columns = array(
            'user_id'       => $data['userId'],
            'title'         => $data['title'],
            'content'       => $data['content'],
            'tjw_province'  => $data['province'],
            'tjw_city'      => $data['city'],
            'tjw_district'  => $data['district'],
            'tjw_street'    => $data['street'],
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
        return $docDao->update($columns,$conditions,$params);
    }
    
}