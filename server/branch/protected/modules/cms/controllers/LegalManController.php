<?php

class LegalManController extends CmsBaseController {
    
    /**
     * 获取法律身份认证列表信息
     */
    public function actionGetAuthLegalIdList(){
        $params = $this->getAjaxRequestParam();
        $name = isset($params['name'])&&!is_null($params['name'])?$this->xssFilter(trim($params['name'])):"";
        $status = isset($params['status'])&&!is_null($params['status'])?intval($params['status']):-1;
        $profession = isset($params['profession'])&&!is_null($params['profession'])?intval($params['profession']):-1;
        $startDate = isset($params['startDate'])&&!is_null($params['startDate'])?trim($params['startDate']):"";
        $endDate = isset($params['endDate'])&&!is_null($params['endDate'])?trim($params['endDate']):"";
        $page = isset($params['page'])&&!is_null($params['page'])?intval($params['page']):1;
        $authModel = new UserAuthenticationModel();
        $list = $authModel->searchLegalIdList(array(
                "name"=>$name,
                "status"=>$status,
                "profession"=>$profession,
                "startDate"=>$startDate,
                "endDate"=>$endDate
        ), $page);
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $list));
    }
    
    private function _checkVerifyList($verifyList){
        if(empty($verifyList)){
            return false;
        }
        $list = array();
        $totalVerifyType = UserAuthenticationModel::USER_REAL_AUTH_FAILED;
        foreach($verifyList as $row){
            $id = isset($row['id'])?intval($row['id']):0;
            $verifyType = isset($row['verifyType'])?intval($row['verifyType']):0;
            
            if($verifyType !=UserAuthenticationModel::USER_REAL_AUTH_OK && $verifyType != UserAuthenticationModel::USER_REAL_AUTH_FAILED){
                return array();
            }
            $message = isset($row['message'])?trim($row['message']):"";
            if($verifyType == UserAuthenticationModel::USER_REAL_AUTH_OK){
                $totalVerifyType = UserAuthenticationModel::USER_REAL_AUTH_OK;
            }
            $list[$id] = array(
                    "id"=>$id,
                    "verifyType"=>$verifyType,
                    "message"=>$message
            );
        }
        
        return array('list'=>$list, "verifyType"=>$totalVerifyType);
    }

    private function cmpComInfo($info){
        if(empty($info)){
            return array();
        }
        $id = isset($info['id'])?intval($info['id']):0;
        $verify = isset($info['verify'])?intval($info['verify']):0;
        $provinceId = isset($info['provinceId'])?intval($info['provinceId']):0;
        $cityId = isset($info['cityId'])?intval($info['cityId']):0;
        $districtId = isset($info['districtId'])?intval($info['districtId']):0;
        $streetId = isset($info['streetId'])?intval($info['streetId']):0;
        $communityId = isset($info['communityId'])?intval($info['communityId']):0;
        if($id <= 0 || $verify <= 0 || $provinceId <= 0 || $cityId <= 0|| $districtId <= 0||$streetId<=0||$communityId <= 0){
            return false;
        }
        $areaModel = new AreaModel();
        $province = $areaModel->getProvinceById($provinceId);
        if(empty($province)){
            return false;
        }
        $city = $areaModel->getCityById($cityId,$provinceId);
        if(empty($city)){
            return false;
        }
        $district = $areaModel->getDistrictById($districtId,$cityId);
        if(empty($district)){
            return false;
        }
        $street = $areaModel->getStreetById($streetId,$districtId);
        if(empty($street)){
            return false;
        }
        $community = $areaModel->getCommunityById($communityId,$streetId);
        if(empty($community)){
            return false;
        }

        return array(
            "id"=>$id,
            "verify"=>$verify,
            "provinceId"=>$provinceId,
            "cityId"=>$cityId,
            "districtId"=>$districtId,
            "streetId"=>$streetId,
            "communityId"=>$communityId,
            "provinceName"=>$province['name'],
            "cityName"=>$city['name'],
            "districtName"=>$district['name'],
            "streetName"=>$street['name'],
            "communityName"=>$community['name'],
        );
    }

    /**
     * 验证身份信息
     */
    public function actionVerifyLegalAuthInfo(){
        $params = $this->getAjaxRequestParam();
        $id = isset($params['id'])?intval($params['id']):0;
        $userId = isset($params['userId'])?intval($params['userId']):0;
        $verifyList = isset($params['verifyList'])?$params['verifyList']:array();
        $level = isset($params['level'])?trim($params['level']):"";
        $communityInfo = isset($params['communityInfo']) && is_array($params['communityInfo'])?$params['communityInfo']:array();
        if($id <= 0 || $userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR , array()));
        }
        $verifyListInfo = $this->_checkVerifyList($verifyList);
        if(empty($verifyListInfo)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR , array()));
        }
        $communityInfo = $this->cmpComInfo($communityInfo);
        if($communityInfo === false){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR , array()));
        }
        if($verifyListInfo['verifyType'] == 2){
            $communityInfo['verify'] = 2;
        }
        $adminFullInfo = AdminModel::getLogInUserFullInfo();
        $orgModel = new OrgModel();
        $orgInfo = $orgModel->getOrgInfoByIdList(array($adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG]));
        $adminInfo = array(
            "id"=>$this->adminId,
            "name"=>$this->adminName,
            "orgId"=>$adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG],
            "orgName"=>isset($orgInfo[0])?$orgInfo[0]['name']:"",
        );
        $userAuthModel = new UserAuthenticationModel();
        $result = $userAuthModel->verifyLegalManInfo($id, $userId, $verifyListInfo['verifyType'], $verifyListInfo['list'],$level,$communityInfo,$adminInfo);
        if($result == false){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "审核失败", ErrorCode::ERROR_COMMON_FAILED , array()));
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "审核成功", ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 获取完整的法律人审核信息
     */
    public function actionGetLegalVerifyInfo(){
        $params = $this->getAjaxRequestParam();
        $id = isset($params['id'])?intval($params['id']):0;
        $userId = isset($params['userId'])?intval($params['userId']):0;
        
        if($userId <= 0 || $id <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR , array()));
        }
        
        $userAuthModel = new UserAuthenticationModel();
        $info = $userAuthModel->getFuleLegalManAuthInfoByUserIdAndBaseId($userId,$id);
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $info));
    }

    /**
     * 获取社区律师申请
     */
    public function actionGetApplyCommunityListAjax(){
        $params = $this->getAjaxRequestParam();
        $name = isset($params['name'])?$this->xssFilter(trim($params['name'])):"";
        $verifyType = isset($params['verifyType'])?intval($params['verifyType']):0;
        $dateStart = isset($params['dateStart'])?$this->xssFilter(trim($params['dateStart'])):"";
        $dateEnd = isset($params['dateEnd'])?$this->xssFilter(trim($params['dateEnd'])):"";
        $page = isset($params['pageNo'])?intval($params['pageNo']):1;

        $userAuthModel = new UserAuthenticationModel();
        $list = $userAuthModel->searchCommunityList(
            array(
                "name"=>$name,
                "verifyType"=>$verifyType,
                "dateStart"=>$dateStart,
                "dateEnd"=>$dateEnd
            ),
            $page
        );
        $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,$list));
    }

    /**
     * 获取社区律师申请
     */
    public function actionVerifyCommunityLawyerAjax(){
        $params = $this->getAjaxRequestParam();
        $verifyType = isset($params['verifyType'])?intval($params['verifyType']):0;
        $communityInfo = isset($params['communityInfo']) && is_array($params['communityInfo'])?$params['communityInfo']:array();
        $communityInfo['verify'] = $verifyType;
        $communityInfo = $this->cmpComInfo($communityInfo);
        if($communityInfo === false){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR , array()));
        }

        $userAuthModel = new UserAuthenticationModel();
        $data = $userAuthModel->getCommunityLawyerInfoByIdNOVerify($communityInfo['id']);
        if(empty($data)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR , array()));
        }
        $adminFullInfo = AdminModel::getLogInUserFullInfo();
        $orgModel = new OrgModel();
        $orgInfo = $orgModel->getOrgInfoByIdList(array($adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG]));
        $adminInfo = array(
            "id"=>$this->adminId,
            "name"=>$this->adminName,
            "orgId"=>$adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG],
            "orgName"=>isset($orgInfo[0])?$orgInfo[0]['name']:"",
        );
        $userAuthModel->verifyCommunityLawyerInfo($data['user_id'],$communityInfo['id'],$communityInfo,$adminInfo,true);
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,array()));
    }

    private function _convertIdentity($identity){
        $a = array();
        if($identity <= -1){
            return $a;
        }
        if($identity == 0){
            $a['isVolunteer'] = 1;
        }elseif ($identity == 1){
            $a['isMediator'] = 1;
        }elseif ($identity == 2){
            $a['isCommunityLawyer'] = 1;
        }elseif ($identity == 3){
            $a['isLegalAid'] = 1;
        }
        return $a;
    }

    /**
     * 搜索援助律师
     */
    public function actionSearchServiceLawyerAjax(){
        $params = $this->getAjaxRequestParam();
        $name = isset($params['name'])?trim($params['name']):"";
        $skill = isset($params['skill'])?intval($params['skill']):-1;
        $identity = isset($params['identity'])?intval($params['identity']):-1;
        $page = isset($params['page'])?intval($params['page']):1;
        $idArray = $this->_convertIdentity($identity);

        $userModel = new UserModel();
        $query = array(
            'pIdStart'=>6,
            'pIdEnd'=>9,
            'name'=>$name,
            'skill'=>$skill,
        );
        if(!empty($idArray)){
            foreach ($idArray as $k=>$v){
                $params[$k] = $v;
            }
        }
        $list = $userModel->cmsSearchLegalManInfoList($query,1,$page);
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,$list));
    }

    /**
     * 搜索调解员
     */
    public function actionSearchMediatorAjax(){
        $params = $this->getAjaxRequestParam();
        $name = isset($params['name'])?trim($params['name']):"";
        $skill = isset($params['skill'])?intval($params['skill']):-1;
        $identity = isset($params['identity'])?intval($params['identity']):-1;
        $page = isset($params['page'])?intval($params['page']):1;
        $idArray = $this->_convertIdentity($identity);

        $userModel = new UserModel();
        $query = array(
            'pIdStart'=>6,
            'pIdEnd'=>10,
            'name'=>$name,
            'skill'=>$skill,
        );
        if(!empty($idArray)){
            foreach ($idArray as $k=>$v){
                $params[$k] = $v;
            }
        }
        $list = $userModel->cmsSearchLegalManInfoList($query,2,$page);
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,$list));
    }

    /**
     * 搜索援助律师
     */
    public function actionSearchLawyerAjax(){
        $params = $this->getAjaxRequestParam();
        $name = isset($params['name'])?trim($params['name']):"";
        $skill = isset($params['skill'])?intval($params['skill']):-1;
        $identity = isset($params['identity'])?intval($params['identity']):-1;
        $page = isset($params['page'])?intval($params['page']):1;
        $idArray = $this->_convertIdentity($identity);

        $userModel = new UserModel();
        $query = array(
            'pIdStart'=>6,
            'pIdEnd'=>9,
            'name'=>$name,
            'skill'=>$skill,
            "cityId" => isset($params['cityId'])?intval($params['cityId']):-1,
            "provinceId" => isset($params['provinceId'])?intval($params['provinceId']):-1,
        );
        if(!empty($idArray)){
            foreach ($idArray as $k=>$v){
                $params[$k] = $v;
            }
        }
        $list = $userModel->cmsSearchLawyerInfoList($query,$page);
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,$list));
    }

    /**
     * 获取律师信息
     */
    public function actionGetLawyerInfoAjax(){
        $params = $this->getAjaxRequestParam();
        $lawyerUserId = isset($params['userId'])?intval($params['userId']):0;
        if($lawyerUserId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR , array()));
        }
        $userModel = new UserModel();
        if(!$userModel->isLawyerUser($lawyerUserId)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "用户不是律师", ErrorCode::ERROR_CLIENT_PARAMS_ERROR , array()));
        }
        $info = $userModel->getCmsLawyerUserCenter($lawyerUserId,0);
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR , $info));
    }

    /**
     * 给搜索的律师发送私信
     */
    public function actionSendMail(){
        $params = $this->getAjaxRequestParam();
        $name = isset($params['name'])?trim($params['name']):"";
        $skill = isset($params['skill'])?intval($params['skill']):-1;
        $identity = isset($params['identity'])?intval($params['identity']):-1;
        $idArray = $this->_convertIdentity($identity);
        $content = isset($params['content'])?$this->xssFilter(trim($params['content'])):"";
        $images = (isset($params['images']) && is_array($params['images']))?$params['images']:array();
        $userId = isset($params['userId'])?intval($params['userId']):0;
        if(empty($content)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR , array()));
        }
        if(!empty($images)){
            foreach($images as $row){
                if(!CommonComponent::isUrl($row)){
                    return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
                }
            }
        }
        $sendMailTaskModel = new SendMailTaskModel();
        $query = array(
            'pIdStart'=>6,
            'pIdEnd'=>9,
            'name'=>$name,
            'skill'=>$skill,
            "cityId" => isset($params['cityId'])?intval($params['cityId']):-1,
            "provinceId" => isset($params['provinceId'])?intval($params['provinceId']):-1,
            "userId"=>$userId,
        );
        if(!empty($idArray)){
            foreach ($idArray as $k=>$v){
                $params[$k] = $v;
            }
        }
        $adminFullInfo = AdminModel::getLogInUserFullInfo();
        $orgModel = new OrgModel();
        $orgInfo = $orgModel->getOrgInfoByIdList(array($adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG]));
        $adminInfo = array(
            "id"=>$this->adminId,
            "name"=>$this->adminName,
            "orgId"=>$adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG],
            "orgName"=>isset($orgInfo[0])?$orgInfo[0]['name']:"",
        );
        $userModel = new UserModel();
        $count = $userModel->cmsSendMail2LawyerInfoListCount($query);
        $list = $sendMailTaskModel->addSendMail2LawyerTask($query,$adminInfo,$content,$images,$count);
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,$list));
    }

    public function actionGetOrgSendMailList(){
        $params = $this->getAjaxRequestParam();
        $page = (isset($params['page']))?intval($params['page']):0;

        $adminFullInfo = AdminModel::getLogInUserFullInfo();
        $orgId = $adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG];
        $orgModel = new OrgModel();
        $orgInfoList = $orgModel->getOrgInfoByIdListV2(array($orgId));
        if(!isset($orgInfoList[$orgId])){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "没有选择对应的管理机构", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $sendMailTaskModel = new SendMailTaskModel();
        $list = $sendMailTaskModel->getOrgSendMailList($orgId,$orgInfoList[$orgId]['name'],$page);
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,$list));
    }

    public function actionOrgDeleteSendMail(){
        $params = $this->getAjaxRequestParam();
        $mailId = (isset($params['mailId']))?intval($params['mailId']):0;

        if($mailId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $adminFullInfo = AdminModel::getLogInUserFullInfo();
        $orgId = $adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG];
        $sendMailTaskModel = new SendMailTaskModel();
        $result = $sendMailTaskModel->deleteMailTask($mailId,$orgId);
        if($result == false){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数不匹配", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,array()));
    }

    public function actionOrgReSendMail(){
        $params = $this->getAjaxRequestParam();
        $mailId = (isset($params['mailId']))?intval($params['mailId']):0;

        if($mailId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $adminFullInfo = AdminModel::getLogInUserFullInfo();
        $orgId = $adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG];
        $sendMailTaskModel = new SendMailTaskModel();
        $result = $sendMailTaskModel->reSendMailTask($mailId,$orgId, $this->adminId);
        if($result == false){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数不匹配", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,array()));
    }

    public function getIdName($list,$id){
        if(isset($list['id']) && $list['id'] == $id){
            return $list['name'];
        }
        foreach($list as $row){
            if($row['id'] == $id){
                return $row['name'];
            }
        }
        return "";
    }

    public function actionAddCommunityLawyerAjax(){
        $params = $this->getAjaxRequestParam();
        $userId = isset($params['userId'])?intval($params['userId']):0;
        $provinceId = isset($params['provinceId'])?intval($params['provinceId']):0;
        $cityId = isset($params['cityId'])?intval($params['cityId']):0;
        $districtId = isset($params['districtId'])?intval($params['districtId']):0;
        $streetId = isset($params['streetId'])?intval($params['streetId']):0;
        $communityId = isset($params['communityId'])?intval($params['communityId']):0;
        if($userId <= 0 || $provinceId <= 0 || $cityId <=0 || $districtId <= 0 || $streetId <= 0 || $communityId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR,array()));
        }
        $areaModel = new AreaModel();
        $provinceInfo = $areaModel->getProvinceInfoById($provinceId);
        if(empty($provinceInfo)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR,array()));
        }
        $cityList = $areaModel->getCityListInfoByProviceId($provinceId);
        $cityName = $this->getIdName($cityList, $cityId);
        if(empty($cityName)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR,array()));
        }
        $districtList = $areaModel->getDistrictListInfoByCityId($cityId);
        $districtName = $this->getIdName($districtList, $districtId);
        if(empty($districtName)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR,array()));
        }
        $streetList = $areaModel->getStreetListInfoByDistrictId($districtId);
        $streetName = $this->getIdName($streetList, $streetId);
        if(empty($streetName)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR,array()));
        }
        $communityList = $areaModel->getCommunityListInfoByStreetId($streetId);
        $communityName = $this->getIdName($communityList, $communityId);
        if(empty($communityName)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR,array()));
        }

        $userModel = new UserModel();
        if(!$userModel->isLawyerUser($userId)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR,array()));
        }
        $userAuthModel = new UserAuthenticationModel();
        $info = $userAuthModel->getCommunityLawyer($communityId);
        if(!empty($info)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "此社区已经有社区律师", ErrorCode::ERROR_COMMON_FAILED,array()));
        }
        $adminFullInfo = AdminModel::getLogInUserFullInfo();
        $orgModel = new OrgModel();
        $orgInfo = $orgModel->getOrgInfoByIdList(array($adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG]));
        $adminInfo = array(
            "adminId"=>$this->adminId,
            "adminName"=>$this->adminName,
            "orgId"=>$adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG],
            "orgName"=>isset($orgInfo[0])?$orgInfo[0]['name']:"",
        );

        $userAuthModel->addCommunityLawyer(
            $userId,
            array(
                "provinceId" =>$provinceId,
                "cityId" =>$cityId,
                "districtId" =>$districtId,
                "streetId" =>$streetId,
                "communityId" =>$communityId,
                "provinceName" =>$provinceInfo['name'],
                "cityName" =>$cityName,
                "districtName" =>$districtName,
                "streetName" =>$streetName,
                "communityName" =>$communityName,
            ),
            $adminInfo
        );
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR,array()));
    }

    /**
     * 获取公益身份认证列表信息
     */
    public function actionGetPublicLegalList(){
        $params = $this->getAjaxRequestParam();
        $name = isset($params['name'])&&!is_null($params['name'])?$this->xssFilter(trim($params['name'])):"";
        $status = isset($params['status'])&&!is_null($params['status'])?intval($params['status']):-1;
        $profession = isset($params['profession'])&&!is_null($params['profession'])?intval($params['profession']):-1;
        $startDate = isset($params['startDate'])&&!is_null($params['startDate'])?trim($params['startDate']):"";
        $endDate = isset($params['endDate'])&&!is_null($params['endDate'])?trim($params['endDate']):"";
        $page = isset($params['page'])&&!is_null($params['page'])?intval($params['page']):1;
        $authModel = new UserAuthenticationModel();
        $list = $authModel->searchPublicManList(array(
            "name"=>$name,
            "status"=>$status,
            "profession"=>$profession,
            "startDate"=>$startDate,
            "endDate"=>$endDate
        ), $page);
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $list));
    }

    public function actionVerifyPublicMan(){
        $params = $this->getAjaxRequestParam();
        $id = isset($params['id'])?intval($params['id']):0;
        $userId = isset($params['userId'])?intval($params['userId']):0;
        $verifyType = isset($params['verifyType'])?$params['verifyType']:0;
        $verifyMessage = isset($params['verifyMessage'])?$params['verifyMessage']:"";
        if($id <= 0 || $userId <= 0 || $verifyType <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR , array()));
        }

        $adminFullInfo = AdminModel::getLogInUserFullInfo();
        $orgModel = new OrgModel();
        $orgInfo = $orgModel->getOrgInfoByIdList(array($adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG]));
        $adminInfo = array(
            "id"=>$this->adminId,
            "name"=>$this->adminName,
            "orgId"=>$adminFullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG],
            "orgName"=>isset($orgInfo[0])?$orgInfo[0]['name']:"",
        );
        $userAuthModel = new UserAuthenticationModel();
        $result = $userAuthModel->verifyPublicManInfo($id, $userId, $verifyType, $verifyMessage,$adminInfo);
        if($result == false){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "审核失败", ErrorCode::ERROR_COMMON_FAILED , array()));
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "审核成功", ErrorCode::NO_ERROR, array()));
    }
}