<?php
/**
 * 活动相关controller
 * @author zhous
 *
 */

class CmsEventController extends CmsBaseController{
    
    CONST EVENT_RECORD_SIGN_IN = 3; //签到类型
    CONST EVENT_RECORD_JOIN    = 2; //参加类型
    
    /**
     * 获取活动列表
     * @param  pageNo                   页数
     * @param  eventId                  活动Id
     * @param  title                    活动名称
     * @param  startTime                开始时间
     * @param  endTime                  结束时间
     * @return [Array][Dictionary] 
     * @return        eventId    投票ID
     * @return        title             投票名称
     * @return        createTime        投票创建时间
     * @return        statusName        投票状态名称
     * @return        registerCount     参加人数
     * @return        followedCount     关注人数
     * @return        signInCount       签到人数
     * @return        isStick           是否置顶
     * @url boss/event/list?data={"pageNo":1,"eventId":0,"title":"","category":1,"startTime":"","endTime":""}
     */
    public function actionGetEventListAjax(){
        $params = $this->getAjaxRequestParam();
        $params['eventId']  = (intval($params['eventId']) <= 0) ? NULL : $params['eventId'];
        $params['title']    = (trim($params['title']) == '')    ? NULL : $this->xssFilter(trim($params['title']));
        $params['category'] = (intval($params['category'])>0)   ? intval($params['category']) : 0;
        $params['startTime']= (trim($params['startTime']) == '')? NULL : $params['startTime'];
        $params['endTime']  = (trim($params['endTime']) == '')  ? NULL : $params['endTime'];
        if ( (!is_null($params['startTime']) && !$this->_checkDateIsValid($params['startTime']))
           ||(!is_null($params['endTime']) && !$this->_checkDateIsValid($params['endTime']))
           ||(!is_null($params['startTime']) && !is_null($params['endTime']) && $params['startTime'] >= $params['endTime']) ){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "时间选择错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmsEventModel = new CmsEventModel();
        $eventList = $this->_getEventList($params);
        
        //获取总数和页数
        $totalCount = $cmsEventModel->getListCount($params);
        
        $simpleInfoList = array();
        
        //获取idList
        $idList = array();
        foreach($eventList as $item){
            $idList[] = $item['eventId'];
        }
        
        //获取数量
        $countList = (count($idList)==0) ? array() : $cmsEventModel->getEventCountByIds($idList);
        
        foreach($eventList as $item){
            $item = array_merge($item,array(
                'registerCount' => (isset($countList[$item['eventId']][2])) ? intval($countList[$item['eventId']][2]) : 0,
                'followedCount' => (isset($countList[$item['eventId']][1])) ? intval($countList[$item['eventId']][1]) : 0,
                'signInCount' => (isset($countList[$item['eventId']][3])) ? intval($countList[$item['eventId']][3]) : 0,
                ));
            $simpleInfoList[] = $item;
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array(
                'count'     => $totalCount['num'],
                'pageCount' => ceil($totalCount['num']/15),
                'list'      => $simpleInfoList,
                )));
        
    }
    
    private function _getEventList($params){
        $cmsEventModel = new CmsEventModel();
        return $cmsEventModel->getList($params);
    }
        
    /**
     * 判断时间合法性
     * @param  [type] $date    [description]
     * @param  array  $formats [description]
     * @return [type]          [description]
     */
    private function _checkDateIsValid($date, $formats = array("Y-m-d H:i:s", "Y/m/d H:i:s")){
        $unixTime = strtotime($date);
        if (!$unixTime){
            return false;
        }
        foreach ($formats as $format){
            if (date($format, $unixTime) == $date){
                return true;
            }
        }
        return false;
    }
    
    /**
     * 置顶活动操作
     * @param  eventId
     * @param  isStick  0-普通; 1-置顶; 2-轮播
     * @return [type] [description]
     * @url boss/event/stickEvent?data={"eventId":3,"isStick":1}
     */
    public function actionUpdateEventStickAjax(){
        $params = $this->getAjaxRequestParam();
        $params['isStick'] = intval($params['isStick']);
        $params['eventId'] = (intval($params['eventId']) <= 0) ? 0 : $params['eventId'];
        if ($params['eventId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $cmsEventModel = new CmsEventModel();
        $cmsEventModel->updateEventStick($params['eventId'], $params['isStick']);
        
        // if ($params['isStick'] == 2){
        //     $parameters = array(
        //         'isStick'   =>  2,
        //         );
        //     $cmsEventScrollData = $cmsEventModel->getList($params);
        //     $cmsEventScrollCount = count($cmsEventScrollData);
        //     if ($cmsEventScrollCount > 4){
        //         for ($i=4; $i < $cmsEventScrollCount-4; $i++) { 
        //             $cmsNewsModel->updateNewsStick($cmsEventScrollData[$i]['eventId'], 0);
        //         }
        //     }
        // }
        
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 删除活动操作
     * @param  eventId
     * @return [type] [description]
     * @url boss/event/delEvent?data={"eventId":3}
     */
    public function actionDeleteEventAjax(){
        $params = $this->getAjaxRequestParam();
        $params['eventId'] = (intval($params['eventId']) <= 0) ? 0 : $params['eventId'];
        if ($params['eventId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $cmsEventModel = new CmsEventModel();
        $cmsEventModel->deleteEventStick($params['eventId']);
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 取活动信息
     * @param eventId
     * @return [type] [返回数据同actionUpdateEventAjax入参]
     * @url boss/event/getEvent?data={"eventId":3}
     */
    public function actionGetEventAjax(){
        $params = $this->getAjaxRequestParam();
        $params['eventId'] = (intval($params['eventId']) <= 0) ? 0 : $params['eventId'];
        if ($params['eventId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmsEventModel = new CmsEventModel();
        $event = $cmsEventModel->getEventById($params['eventId']);
        $extInfo = (trim($event['ext_info']) != '') ? json_decode(trim($event['ext_info']), TRUE) : array();
        $data = array(
            'eventId'       => intval($event['id']),
            'title'         => $event['title'],
            'category'      => intval($event['category']),
            'startTime'     => $event['start_time'],
            'endTime'       => $event['end_time'],
            'province'      => intval($event['tjw_province']),
            'city'          => intval($event['tjw_city']),
            'district'      => intval($event['tjw_district']),
            'street'        => intval($event['tjw_street']),
            'content'       => $event['content'],
            'crowd'         => json_decode($event['crowd']),
            'address'       => (isset($extInfo['address'])) ? $extInfo['address'] : '',
            );
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, $data));
    }
    
    /**
     * 新建活动
     * @param title         活动名称
     * @param description   描述
     * @param province      省
     * @param city          市
     * @param district      区
     * @param street        街道
     * @param startTime     开始时间
     * @param endTime       结束时间
     * @param [Array] manning 人群: 0-所有用户; 1-实名认证用户; 2-法律人; 3-法律服务志愿者; 4-居民调解员; 5-法律援助律师; 6-社区律师
     * @return [type] [description]
     * @url boss/event/addEvent?data={"title":"123","category":0,"startTime":"","endTime":"","province":0,"city":0,"district":0,"street":0,"address":"bbbb","content":"aaa","manning":0}
     */
    public function actionAddEventAjax(){
        $params = $this->getAjaxRequestParam();
        if (trim($params['title']) == ''){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "标题不能为空", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $params['category'] = (intval($params['category'])<=0) ? 0 : intval($params['category']);
        $params['startTime'] = (trim($params['startTime']) == '') ? NULL : $params['startTime'];
        $params['endTime'] = (trim($params['endTime']) == '') ? NULL : $params['endTime'];
        if ((is_null($params['startTime']))
           ||(is_null($params['endTime']))
           ||(!is_null($params['startTime']) && !is_null($params['endTime']) && $params['startTime'] >= $params['endTime']) ){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "时间选择错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $cmsEventModel = new CmsEventModel();
        $cmsOrgModel = new OrgModel();
        $userFullInfo = AdminModel::getLogInUserFullInfo();
        $currentOrgId = $userFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG];
        $currentOrgName = $cmsOrgModel->getOrgInfoByIdList(array($currentOrgId));
        //@todo 为0要报错
        if ($currentOrgId == 0){
            
        }
        /**
         * @todo 组织data
         */
        $areaModel = new AreaModel();
        $provinceInfo = $areaModel->getProvinceById(intval($params['province']));
        $provinceName = isset($provinceInfo['name']) ? $provinceInfo['name'] : '';
        $cityInfo     = $areaModel->getCityById(intval($params['city']));
        $cityName     = isset($cityInfo['name']) ? $cityInfo['name'] : '';
        $districtInfo = $areaModel->getDistrictById(intval($params['district']));
        $districtName = isset($districtInfo['name']) ? $districtInfo['name'] : '';
        $data = array(
            'userId'    => intval($this->adminId),
            'title'     => $this->xssFilter(trim($params['title'])),
            'category'  => $params['category'],
            'content'   => $this->xssFilter(trim($params['content'])),
            'province'  => intval($params['province']),
            'city'      => intval($params['city']),
            'district'  => intval($params['district']),
            'street'    => intval($params['street']),
            'extInfo'   => array(
                'address'       => $this->xssFilter(trim($params['address'])),
                'authorName'    => $this->adminName,
                'orgName'       => (!isset($currentOrgName[0])) ? 'system' : $currentOrgName[0]['name'],
                'provinceName'  => $provinceName,
                'cityName'      => $cityName,
                'districtName'  => $districtName,
                ),
            'crowd'     => array((intval($params['manning']) <= 0) ? 0 : intval($params['manning'])),
            'startTime' => $params['startTime'],
            'endTime'   => $params['endTime'],
            );
        $result = $cmsEventModel->addEvent($data);
        /**
         * @todo 创建失败的ErrorCode没建
         */
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
        
    }
    
    /**
     * 编辑活动
     * @param eventId活动ID
     * @param title         活动名称
     * @param description   描述
     * @param province      省
     * @param city          市
     * @param district      区
     * @param street        街道
     * @param startTime     开始时间
     * @param endTime       结束时间
     * @param [Array] manning 人群: 0-所有用户; 1-实名认证用户; 2-法律人; 3-法律服务志愿者; 4-居民调解员; 5-法律援助律师; 6-社区律师
     * @return [type] [description]
     * @url boss/event/updateEvent?data={"eventId":3,"title":"mnbvc","category":0,"startTime":"2016-07-17 09:00:00","endTime":"2016-09-17 18:00:00","province":0,"city":0,"district":0,"street":0,"address":"bbbb","content":"aaa","manning":1}
     */
    public function actionUpdateEventAjax(){
        $params = $this->getAjaxRequestParam();
        $params['eventId'] = (intval($params['eventId']) <= 0) ? 0 : $params['eventId'];
        if ($params['eventId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        if (trim($params['title']) == ''){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "标题不能为空", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $params['category'] = (intval($params['category'])<=0) ? 0 : intval($params['category']);
        $params['startTime'] = (trim($params['startTime']) == '') ? NULL : $params['startTime'];
        $params['endTime'] = (trim($params['endTime']) == '') ? NULL : $params['endTime'];
        if (is_null($params['startTime'])
           ||is_null($params['endTime'])
           || $params['startTime'] >= $params['endTime']){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "时间选择错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        
        $cmsEventModel = new CmsEventModel();
        $eventSummary = $cmsEventModel->getSummaryById($params['eventId']);
        /**
         * @todo 组织data
         */
        $areaModel = new AreaModel();
        $provinceInfo = $areaModel->getProvinceById(intval($params['province']));
        $provinceName = isset($provinceInfo['name']) ? $provinceInfo['name'] : '';
        $cityInfo     = $areaModel->getCityById(intval($params['city']));
        $cityName     = isset($cityInfo['name']) ? $cityInfo['name'] : '';
        $districtInfo = $areaModel->getDistrictById(intval($params['district']));
        $districtName = isset($districtInfo['name']) ? $districtInfo['name'] : '';

        $cmsOrgModel = new OrgModel();
        $userFullInfo = AdminModel::getLogInUserFullInfo();
        $currentOrgId = $userFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG];
        $currentOrgName = $cmsOrgModel->getOrgInfoByIdList(array($currentOrgId));

        $data = array(
            'userId'    => intval($this->adminId),
            'title'     => $this->xssFilter(trim($params['title'])),
            'category'  => $params['category'],
            'content'   => $this->xssFilter(trim($params['content'])),
            'province'  => intval($params['province']),
            'city'      => intval($params['city']),
            'district'  => intval($params['district']),
            'street'    => intval($params['street']),
            'extInfo'   => array(
                'address'           => $this->xssFilter(trim($params['address'])),
                'summaryContent'    => (isset($eventSummary['summaryContent'])) ? $eventSummary['summaryContent'] : '',
                'lastUpdateOperater'=> (isset($eventSummary['lastUpdateOperater'])) ? $eventSummary['lastUpdateOperater'] : '',
                'provinceName'  => $provinceName,
                'cityName'      => $cityName,
                'districtName'  => $districtName,
                'orgName'       => (!isset($currentOrgName[0])) ? 'system' : $currentOrgName[0]['name'],
                ),
            'crowd'     => array((intval($params['manning']) <= 0) ? 0 : intval($params['manning'])),
            'startTime' => $params['startTime'],
            'endTime'   => $params['endTime']
            );
        $result = $cmsEventModel->updateEvent($data, $params['eventId']);
        /**
         * @todo 创建失败的ErrorCode没建
         */
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    //===小结相关功能===
    
    /**
     * 获取小结信息
     * @param  eventId  活动id
     * @return content         小结内容
     * @return lastUpdateTime  最近一次更新时间
     * @return lastUpdateOperater  最后更新人
     * @url boss/event/getSummary?data={"eventId":3}
     */
    public function actionGetSummaryAjax(){
        $params = $this->getAjaxRequestParam();
        $params['eventId'] = (intval($params['eventId']) <= 0) ? 0 : $params['eventId'];
        if ($params['eventId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmsEventModel = new CmsEventModel();
        $eventSummary = $cmsEventModel->getSummaryById($params['eventId']);
        $result = array(
            'eventId'           => intval($eventSummary['id']),
            'summaryContent'    => isset($eventSummary['summaryContent']) ? $eventSummary['summaryContent'] : '',
            'lastUpdateOperater'=> isset($eventSummary['lastUpdateOperater']) ? intval($eventSummary['lastUpdateOperater']) : 0,
            );
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $result));
    }
    
    /**
     * 小结更新
     * @param 见actionGetSummaryAjax的出参
     * @return [type] [description]
     * @url boss/event/upateSummary?data={"eventId":3,"summaryContent":"cccc"}
     */
    public function actionUpdateSummaryAjax(){
        $params = $this->getAjaxRequestParam();
        $params['eventId'] = (intval($params['eventId']) <= 0) ? 0 : $params['eventId'];
        if ($params['eventId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        if (trim($params['summaryContent']) == ''){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "小结内容不能为空", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmsEventModel = new CmsEventModel();
        /**
         * @todo 组织数据, 需要记录的数据见actionGetSummaryAjax出参数
         */
        $event = $cmsEventModel->getEventById($params['eventId']);
        if (empty($event)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $extInfo = (trim($event['ext_info']) == '') ? array() : json_decode($event['ext_info'], TRUE);
        $extInfo['summaryContent'] = $this->xssFilter(trim($params['summaryContent']));
        $extInfo['lastUpdateOperater'] = intval($this->adminId);
        
        $cmsEventModel->updateSummary($extInfo, $params['eventId']);
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
    }
    
    //===签到相关功能===
    
    /**
     * 签到列表
     * @param eventId
     * @return [Dictionary] eventInfo
     * @return     title
     * @return     categoryName  
     * @return     crowd           人群  
     * @return     province  
     * @return     city  
     * @return     district  
     * @return     street
     * @return     signInCount
     * @return [Array][Dictionary] recordlistInfo
     * @return     userId
     * @return     signInTypeName  签到类型名
     * @return     userName
     * @return     useridentity
     * @return     iphone
     * @return     email
     * @url boss/event/signInList?data={"eventId":3}
     */
    public function actionGetSignInListAjax(){
        $params = $this->getAjaxRequestParam();
        $params['eventId'] = (intval($params['eventId']) <= 0) ? 0 : $params['eventId'];
        if ($params['eventId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmsEventModel = new CmsEventModel();
        $event = $cmsEventModel->getEventById($params['eventId']);
        if (is_null($event) || empty($event)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $countList = $cmsEventModel->getEventCountByIds(array($params['eventId']));
        $signInCount = (empty($countList) || !isset($countList[$params['eventId']][3])) ? 0 : intval($countList[$params['eventId']][3]);
        $joinCount = (empty($countList) || !isset($countList[$params['eventId']][2])) ? 0 : intval($countList[$params['eventId']][2]);
        $recordList = $cmsEventModel->getEventRecordListById($params['eventId'], self::EVENT_RECORD_SIGN_IN);
        /**
         * @todo  批量组织用户信息
         */
        //获取useridList
        $userIdList = array();
        foreach($recordList as $item){
            if ($item['userId'] == 0){
                continue;
            }
            $userIdList[] = $item['userId'];
        }
        /**
         * @todo  调用用户信息接口，批量获取用户数据，并merge入$recordList
         */
        $userModel = new UserModel();
        $userData = $userModel->getUserSubjectInfoList($userIdList);
        $data = array();
        foreach($recordList as $item){
            if (isset($userData[$item['userId']])){
                $item['userName'] = $userData[$item['userId']]['nickName'];
                $item['identity'] = implode(",",$userData[$item['userId']]['identity']);
                $item['iphone']   = $userData[$item['userId']]['cellPhone'];
                $item['email']    = $userData[$item['userId']]['email'];
                $data[] = $item;
            }
        }
        $crowd = json_decode($event['crowd'], TRUE);
        $crowd = intval($crowd[0]);
        $extInfo = json_decode($event['ext_info'],true);
        $result = array(
            'eventInfo'  => array(
                'eventId'       =>  intval($event['id']),
                'title'         =>  $event['title'],
                'categoryName'  =>  $event['categoryName'],
                'signInCount'   =>  intval($signInCount),
                'crowd'         =>  $crowd,
                'province'      =>  intval($event['tjw_province']),
                'city'          =>  intval($event['tjw_city']),
                'district'      =>  intval($event['tjw_district']),
                'street'        =>  intval($event['tjw_street']),
                'eventTime'     =>  $event['end_time'],
                'address'       =>  $extInfo['address'],
                'joinCount'     =>  $joinCount
                ),
            'recordlistInfo'=> $data,
            );
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $result));
    }
    
    /**
     * 导出功能
     * @return [type] [description]
     */
    public function actionSignInListExport($eventId = 0){
        if ($eventId == 0) {
            echo "您选择的活动不存在";
            die();
        }
        $cmsEventModel = new CmsEventModel();
        $event = $cmsEventModel->getEventById($eventId);
        if (is_null($event) || empty($event)){
            echo "您选择的活动不存在";
            die();
        }
        $recordList = $cmsEventModel->getEventRecordListById($eventId, self::EVENT_RECORD_SIGN_IN);
        /**
         * @todo  批量组织用户信息
         */
        //获取useridList
        $userIdList = array();
        foreach($recordList as $item){
            if ($item['userId'] == 0){
                continue;
            }
            $userIdList[] = $item['userId'];
        }
        /**
         * @todo  调用用户信息接口，批量获取用户数据，并merge入$recordList
         */
        $userModel = new UserModel();
        $userData = $userModel->getUserSubjectInfoList($userIdList);

        $data = array();
        foreach($recordList as $item){
            if (isset($userData[$item['userId']])){
                $item['userName'] = $userData[$item['userId']]['nickName'];
                $item['identity'] = implode(",",$userData[$item['userId']]['identity']);
                $item['iphone']   = $userData[$item['userId']]['cellPhone'];
                $item['email']    = $userData[$item['userId']]['email'];
                $data[] = $item;
            }
        }
       if (empty($data)){
            echo "没有找到数据";
            die();
       }
       $date = date("Y-m-d");
       header("Content-type:text/csv");
       header("Content-Disposition:attachment;filename=".$eventId."-".$date.".csv");
       $title = '昵称或姓名,身份,手机号,签到类型,邮箱';
       echo iconv("utf-8","gb2312",$title);
       echo "\n";
       foreach ($data as $item) {
           echo iconv("utf-8","gb2312",$item['userName'].",".$item['identity'].",".$item['iphone'].",".$item['signInTypeName'].",".$item['email']);
           echo "\n";
       }
       die();
    }
    
    /**
     * [actionAddSignInAjax description]
     * @return [type] [description]
     * @url boss/event/signIn?data={"iphoneNum":18100000000, "eventId":3, "forceSignIn":false}
     */
    public function actionAddSignInAjax(){
        $params = $this->getAjaxRequestParam();
        $params['eventId'] = (intval($params['eventId']) <= 0) ? 0 : $params['eventId'];
        if ($params['eventId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        /**
         * @todo 根据帐号／iphoneNum找userid, 还有报错提示
         */
        $userModel = new UserModel();
        $userInfo = $userModel->getUserByCellPhone($params['iphoneNum']);
        if (!isset($userInfo['id'])){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "用户不存在！", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $userId = $userInfo['id'];
        $cmsEventModel = new CmsEventModel();
        $recordInfo = $cmsEventModel->getRecordInfoByUserId($params['eventId'], $userId, self::EVENT_RECORD_SIGN_IN); 
        if (count($recordInfo) > 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "该用户已签到", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $joinInfo = $cmsEventModel->getRecordInfoByUserId($params['eventId'], self::EVENT_RECORD_JOIN);
        /**
         * @todo 这里要用个新的ErrorCode
         */
        if (empty($joinInfo) && !$params['forceSignIn']){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "该用户不是报名用户", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $signInType = ($params['forceSignIn']) ? 0 : 1; //0-未报名用户; 1-已报名用户
        /**
         * @todo  如果是强制录入，需判断用户的身份类型是否与活动的可参与类型相同,
         */
        /**
         * @todo  组织数据，记录签到, 判断签到类型放入扩展字眼内, 字段名signInType
         */
        $data = array(
            'eventId'   =>  intval($params['eventId']),
            'userId'    =>  $userId,
            'extInfo'   =>  array('signInType'=>$signInType),
            'type'      =>  self::EVENT_RECORD_SIGN_IN,
            );
        $result = $cmsEventModel->addSignIn($data);
        /**
         * @todo 创建失败的ErrorCode没建
         */
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 报名列表
     * @param eventId
     * @return [Dictionary] eventInfo
     * @return     title
     * @return     categoryName  
     * @return     crowd           人群  
     * @return     province  
     * @return     city  
     * @return     district  
     * @return     street
     * @return     signInCount
     * @return [Array][Dictionary] recordlistInfo
     * @return     userId
     * @return     signInTypeName  签到类型名
     * @return     userName
     * @return     useridentity
     * @return     iphone
     * @return     email
     * @url boss/event/enrollList?data={"eventId":3}
     */
    public function actionGetEnrollListAjax(){
        $params = $this->getAjaxRequestParam();
        $params['eventId'] = (intval($params['eventId']) <= 0) ? 0 : $params['eventId'];
        if ($params['eventId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmsEventModel = new CmsEventModel();
        $event = $cmsEventModel->getEventById($params['eventId']);
        if (is_null($event) || empty($event)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的活动不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $countList = $cmsEventModel->getEventCountByIds(array($params['eventId']));
        $signInCount = (empty($countList) || !isset($countList[$params['eventId']][2])) ? 0 : intval($countList[$params['eventId']][2]);
        
        $recordList = $cmsEventModel->getEventRecordListById($params['eventId'], self::EVENT_RECORD_JOIN);
        /**
         * @todo  批量组织用户信息
         */
        //获取useridList
        $userIdList = array();
        foreach($recordList as $item){
            if ($item['userId'] == 0){
                continue;
            }
            $userIdList[] = $item['userId'];
        }
        /**
         * @todo  调用用户信息接口，批量获取用户数据，并merge入$recordList
         */
        $userModel = new UserModel();
        $userData = $userModel->getUserSubjectInfoList($userIdList);
        $data = array();
        foreach($recordList as $item){
            if (isset($userData[$item['userId']])){
                $item['userName'] = $userData[$item['userId']]['nickName'];
                $item['identity'] = implode(",",$userData[$item['userId']]['identity']);
                $item['iphone']   = $userData[$item['userId']]['cellPhone'];
                $item['email']    = $userData[$item['userId']]['email'];
                $data[] = $item;
            }
        }
        $crowd = json_decode($event['crowd'], TRUE);
        $crowd = intval($crowd[0]);
        
        $result = array(
            'eventInfo'  => array(
                'eventId'       =>  intval($event['id']),
                'title'         =>  $event['title'],
                'categoryName'  =>  $event['categoryName'],
                'signInCount'   =>  intval($signInCount),
                'crowd'         =>  $crowd,
                'province'      =>  intval($event['tjw_province']),
                'city'          =>  intval($event['tjw_city']),
                'district'      =>  intval($event['tjw_district']),
                'street'        =>  intval($event['tjw_street']),
                ),
            'recordlistInfo'=> $data,
            );
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $result));
    }
    
    
    
    
    
}