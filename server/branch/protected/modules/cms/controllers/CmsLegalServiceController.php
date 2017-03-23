<?php
/**
 * 法律服务模块
 * @author zhous
 *
 * 
 */

class CmsLegalServiceController extends CmsBaseController{
    
    /**
     * 后台获取各法律服务列表
     * @param serviceType   法律服务类型
     * @param provice   省, =0为全部
     * @param city      市, =0为全部省
     * @param district  区, =0为全部市
     * @param category  分类ID
     * @return publicTime   发布时间
     * @return categoryName 分类名称
     * @return title        标题
     * @return content      内容
     * @return headerImg    头图
     * @return authorName   作者
     * @url /boss/legal/list?data={"serviceType":0,"pageNo":1,"province":0,"city":0,"district":0,"category":0}
     * @todo 没有处理匿名的情况
     *       暂缺点援/指派律师信息情况
     */
    public function actionGetLegalListAjax(){
        $params     = $this->getAjaxRequestParam();
        $params['serviceType']= (intval($params['serviceType']) >=PopularData::SERVICE_LEGAL_CONSULT && intval($params['serviceType']) <=PopularData::SERVICE_LEGAL_CONCILIATE) ? intval($params['serviceType']) : NULL;
        $params['pageNo']     = (intval($params['pageNo']) == 0) ? 1 : intval($params['pageNo']);
        $params['province']   = intval($params['province']) ? intval($params['province']) : NULL;
        $params['city']       = intval($params['city']) ? intval($params['city']) : NULL;
        $params['district']   = intval($params['district']) ? intval($params['district']) : NULL;
        $params['category']   = (intval($params['category']) > 0 && intval($params['category']) <=10) ? intval($params['category']) : NULL;
        if(is_null($params['serviceType'])){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $cmslegalServiceModel = new CmsLegalServiceModel();
        $consultList = $cmslegalServiceModel->getListByFilter($params);
        $count = $cmslegalServiceModel->getCountByFilter($params);

        foreach($consultList as $key=>$value){
            $consultList[$key]['content'] = str_replace("&nbsp;"," ",htmlspecialchars_decode($value['content']));
        }

        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array(
                'count' =>  $count['num'],
                'list'  =>  $consultList,
            )));
    }
    
    /**
     * 后台获取法律咨询详情
     * @param caseId   事件ID
     * @return 
     * @url boss/legal/detail?data={"caseId":1}
     */
    public function actionGetLegalDeatilAjax(){
        $params           = $this->getAjaxRequestParam();
        $params['caseId'] = intval($params['caseId']) ? intval($params['caseId']) : NULL;
        if (is_null($params['caseId'])) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的案件不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmslegalServiceModel = new CmsLegalServiceModel();
        $case = $cmslegalServiceModel->getCaseById($params['caseId']);
        $extInfo = (trim($case['ext_info']) != '') ? json_decode(trim($case['ext_info']),true) : array();
        $result = array(
            'title'     => $case['title'],
            'authorName'=> (isset($extInfo['authorName'])) ? $extInfo['authorName'] : '',
            'headerImg' => (isset($extInfo['headerImg']))  ? $extInfo['headerImg']  : '',
            'caseType'  => intval($case['service_type']),
            'categoryName' => $case['categoryName'],
            'createTime'=> $case['create_time'],
            'content'   => str_replace("&nbsp;"," ",htmlspecialchars_decode($case['content'])),
            'caseReport'=> array(),
            );
        $recordList = $cmslegalServiceModel->getEventRecordListById($params['caseId'], PopularData::RECORD_CASE_JOIN);
         //获取useridList
         $userIdList = array();
         foreach ($recordList as $item) {
             $userIdList[] = $item['userId'];
         }
         $userModel = new UserModel();
         $userData = (empty($userIdList)) ? array() : $userModel->getLawyerUserTabInfoList($userIdList);
         $data = array();
         foreach ($recordList as $item) {
             if ($item['userId'] > 0){
                 $item['avatar']         = $userData[$item['userId']]['iconUrl'];
                 $item['nickName']       = $userData[$item['userId']]['nickName'];
                 $item['isCommunityLawyer'] = $userData[$item['userId']]['isCommunityLawyer'];   //是否社区律师
                 $item['isMediator']     = $userData[$item['userId']]['isMediator'];             //是否调解员
                 $item['isLegalAid']     = $userData[$item['userId']]['isLegalAid'];             //是否法律援助
                 $item['isVolunteer']    = $userData[$item['userId']]['isVolunteer'];            //是否志愿者
                 $item['isCommonLawyer'] = $userData[$item['userId']]['isCommonLawyer'];         //是否普通律师
                 $item['isLawLecturer']  = $userData[$item['userId']]['isLawLecturer'];          //是否法律宣讲
                 $item['skill']          = $userData[$item['userId']]['skill'];                      //技能
             }
             $data[] = $item;
         }
         $result['caseJoinList'] = $data;
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, $result));
    }
    
    /**
     * 后台指定律师
     * @param caseId
     * @param lawyerId
     * @return [type] [description]
     * @url boss/legal/assignLawyer?data={"caseId":7, "lawyerId":2}
     */
    public function actionAddAssignLawyerAjax(){
        $params = $this->getAjaxRequestParam();
        $params['caseId'] = intval($params['caseId']);
        $params['lawyerId'] = intval($params['lawyerId']);
        
        $cmsLegalServiceModel = new CmsLegalServiceModel();
        $case = $cmsLegalServiceModel->getCaseById($params['caseId']);
        //@todo 判断下$case的类型为1,2
        
        $data = array(
            'legalServiceId'    => $params['caseId'],
            'user_id'           => $params['lawyerId'],
            'type'              => 9,
            'ip'                => (getenv('HTTP_CLIENT_IP')) ? getenv('HTTP_CLIENT_IP') : (
                                   (getenv('HTTP_X_FORWARDED_FOR')) ? getenv('HTTP_X_FORWARDED_FOR') : (
                                   (getenv('REMOTE_ADDR')) ? getenv('REMOTE_ADDR') : ''
                                    )),
            'service_type'      => $case['service_type'],
            );        
        $result = $cmsLegalServiceModel->addServiceRecordForId($data);
        $cmsLegalServiceModel->updateAidLawyerToUnableById($params['caseId']);

        $adminFullInfo = AdminModel::getLogInUserFullInfo();
        $orgId = $adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG];

        $mailModel = new MailModel();
        $content = '私信告诉律师：你申请的'.$case['title'].'案件，已经为您指派了律师，感谢您是哟哦难过调解网'; //@todo 文案！
        $mailModel->sendMail($orgId, $case['user_id'], $content,0,array(),true);
        SMSModel::cmsFixedLegalApplyLawyer($orgId,$case['user_id'],$case['title']);
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 拒绝点援律师
     * @param caseId
     * @param lawyerId
     * @return [type] [description]
     */
    public function actionDelAidLaywerAjax(){
        $params = $this->getAjaxRequestParam();
        $params['caseId'] = intval($params['caseId']);
        $params['lawyerId'] = intval($params['lawyerId']);
        
        $cmsLegalServiceModel = new CmsLegalServiceModel();
        $result = $cmsLegalServiceModel->updateAidLawyerToUnableByIdWithLawyerId($params['caseId'], $params['lawyerId']);
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 后台获取案情操作记录
     * @param caseId
     * @param recordType
     * @return  Array 循环输出用户信息
     * @return      avatar      头像
     * @return      nickName    昵称
     * @return      identity    身份
     * @return      legalServiceId
     * @return      userId
     * @return      type
     * @return      value
     * @return      createTime
     */
    public function actionGetCaseRecordAjax(){
        $params = $this->getAjaxRequestParam();
        $params['caseId'] = intval($params['caseId']);
        $params['recordType'] = intval($params['recordType']);
        
        
        $cmsLegalServiceModel = new CmsLegalServiceModel();
        $recordList = $cmsLegalServiceModel->getEventRecordListById($params['caseId'], $params['recordType']);
        
         /**
         * @todo  批量组织用户信息
         */
        //获取useridList
        $userIdList = array();
        foreach ($recordList as $item) {
            $userIdList[] = $item['userId'];
        }
        
        $userModel = new UserModel();
        $userData = $userModel->getUsersInfoByUserIdList($userIdList);
        /**
         * @todo  调用用户信息接口，批量获取用户数据，并merge入$recordList
         */
        $data = array();
        foreach ($recordList as $item) {
            $item['avatar'] = $userData[$item['userId']]['iconUrl'];
            $item['nickName'] = $userData[$item['userId']]['nickName'];
            // $item['identity'] = '';      //@todo 已确认先不需要
            $data[] = $item;
        }
            
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, $data));
    }
    
    /**
     * 更新案件状态
     * @param caseId
     * @param caseType  //未定义,1-民事案件; 2-刑事案件
     * @url boss/legal/updateCaseStatus?data={"caseId":10, "caseType":1}
     */
    public function actionUpdateCaseStatusAjax(){
        $params = $this->getAjaxRequestParam();
        $params['caseId'] = intval($params['caseId']);
        $params['caseType'] = intval($params['caseType']);
        
        $cmsLegalServiceModel = new CmsLegalServiceModel();
        $result = $cmsLegalServiceModel->updateCaseStatus($params['caseId'], $params['caseType']);
        
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 获取案情进展
     * @param caseId
     * @return caseList
     * @return list     Array
     * @return      caseId
     * @return      process
     * @return      content
     * @return      updateTime
     * @url boss/legal/detail/getCaseProcess?data={"caseId":7}
     */
    public function actionGetCaseProcessAjax(){
        $params = $this->getAjaxRequestParam();
        $params['caseId'] = intval($params['caseId']);
        if ($params['caseId'] <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "所选择案件不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $legalServiceModel = new CmsLegalServiceModel();
        $case = $legalServiceModel->getEventById($params['caseId']);
        if (empty($case)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "所选择案件不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        if (isset($case['extInfo']['caseType']) && in_array(intval($case['extInfo']['caseType']), array(1,2))){
        }else{
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "所选择案件类型不正确", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        //@todo 类型边界没判断
        $caseProcessList = $legalServiceModel->getCaseProcessById($params['caseId']);
        
        $result = array();
        $catList = (intval($case['extInfo']['caseType']) == 1) ? PopularData::$civilCaseProcess : PopularData::$criminalCaseProcess;
        foreach ($catList as $step => $value) {
            $result[] = array(
                'stepName'  => $value,
                'process'   => array(
                    'caseId'      =>  intval($params['caseId']),
                    'content'     =>  (isset($caseProcessList[$step])) ? $caseProcessList[$step]['content'] : '',
                    'images'      =>  (isset($caseProcessList[$step])) ? $caseProcessList[$step]['images'] : array(),
                    'updateTime'  =>  (isset($caseProcessList[$step])) ? $caseProcessList[$step]['updateTime'] : '',
                    ),
                ); 
        }
        
         $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,$result));
    }
    
    /**
     * 司法局确认进度
     * @param caseId
     * @param processType
     * @return [type] [description]
     * @url boss/legal/detail/PublishCaseProcess?data={"caseId":10, "processType":1}
     */
    public function actionPublishCaseProcessAjax(){
        $params = $this->getAjaxRequestParam();
        $params['caseId'] = intval($params['caseId']);
        $params['processType'] = intval($params['processType']);
        
        if ($params['caseId'] <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "所选择案件不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $legalServiceModel = new CmsLegalServiceModel();
        $case = $legalServiceModel->getEventById($params['caseId']);
        if (empty($case)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "所选择案件不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $data = array(
            'caseId'      => $params['caseId'],
            'processType' => $params['processType'],
            );
        
        $result = $legalServiceModel->confirmCaseProcess($data);
        
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 根据律师获取法律案件
     * @return [type] [description]
     */
    public function actionGetLegalServiceByLawyerAjax(){
        $params = $this->getAjaxRequestParam();
        $params['status'] = intval($params['status']);      //0-全部; 1-进行中; 2-完结    
        $params['lawyerId'] = intval($params['lawyerId']);
        
        $legalServiceModel = new CmsLegalServiceModel();
        
        $allList = $legalServiceModel->getMyTaskIds($params['lawyerId']);
        $list = array();
        switch ($params['status']) {
            case 1:
                $list = $legalServiceModel->getCaseIdsInProcess($allList);
                break;
            case 2:
                $list = $legalServiceModel->getCaseIdsInEnd($allList);
                break;
            default:
                $list = $allList;
                break;
        }
        $caseList = $legalServiceModel->getCaseListByIds($list);
        
        $countList = (count($list)==0) ? array() : $legalServiceModel->getEventCountByIds($list);
        
        $simpleInfoList = array();
        foreach ($caseList as $item) {
            $item = array_merge($item, array(
                'readCount'     => (isset($countList[$item['legalServiceId']][0])) ? intval($countList[$item['legalServiceId']][0]) : 0,
                'followedCount' => (isset($countList[$item['legalServiceId']][1])) ? intval($countList[$item['legalServiceId']][1]) : 0,
                'replyCount'    => 0,       //todo 需要获取
                'shareCount'    => (isset($countList[$item['legalServiceId']][5])) ? intval($countList[$item['legalServiceId']][5]) : 0,
                'joinCount'     => (isset($countList[$item['legalServiceId']][2])) ? intval($countList[$item['legalServiceId']][2]) : 0,
                ));
            unset($item['orgName']);
            $simpleInfoList[] = $item;
        }
        
        $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,$caseList));
    }
    
    
    public function actionDeleteCaseAjax(){
        $params = $this->getAjaxRequestParam();
        $caseId = isset($params['caseId'])?intval($params['caseId']):0;

        if($caseId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "所选择案件不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $legalService = new LegalServiceModel();
        $legalService->deleteCase($caseId);
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
    }

}