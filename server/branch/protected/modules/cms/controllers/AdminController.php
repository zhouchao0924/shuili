<?php
/**
 * 管理 权限相关controller
 * @author lzm
 *
 */
class AdminController extends CmsBaseController{
    /**
     * 添加role
     */
    public function actionAddRoleAjax(){
        $params = $this->getAjaxRequestParam();
        $name = isset($params['name'])?$this->xssFilter(trim($params['name'])):"";
        $desc = isset($params['desc'])?$this->xssFilter(trim($params['desc'])):"";
        if(empty($name) || empty($desc)){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
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
        $adminModel = new AdminModel();
        $result = $adminModel->createRole(array("roleName"=>$name,"desc"=>$desc),$adminInfo);
        if(empty($result)){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "添加失败,角色已经存在", ErrorCode::ERROR_COMMON_FAILED, array()));
            return ;
        }
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $result));
        return ;
    }
    
    /**
     * 获取角色列表
     */
    public function actionGetRoleList(){
        $adminModel = new AdminModel();
        $list = $adminModel->getRoleList();
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $list));
    }
    
    /**
     * role绑定权限
     */
    public function actionBindRoleAuthAjax(){
        $params = $this->getAjaxRequestParam();
        $roleId = isset($params['roleId'])?intval($params['roleId']):0;
        $auth = isset($params['auth'])&& is_array($params['auth'])?$params['auth']:array();
        if($roleId <= 0 || empty($auth)){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }
        
        $adminModel = new AdminModel();
        $result = $adminModel->upateRoleAuth($roleId,$auth);
        if(!$result){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "添加失败,角色不存在", ErrorCode::ERROR_COMMON_FAILED, array()));
            return ;
        }
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
        return ;
    }

    public function actionGetRoleAuthAjax(){
        $params = $this->getAjaxRequestParam();
        $roleId = isset($params['roleId'])?intval($params['roleId']):0;
        if($roleId <= 0){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }

        $adminModel = new AdminModel();
        $result = $adminModel->getRoleAuth($roleId);
        if(empty($result)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"参数错误",ErrorCode::ERROR_CLIENT_PARAMS_ERROR,array()));
        }
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $result['auth']));
        return ;
    }
    
    /**
     * 添加管理员
     */
    public function actionAddUserAjax(){
        $params = $this->getAjaxRequestParam();
        $logInName = isset($params['logInName'])?trim($params['logInName']):"";
        $realName = isset($params['realName'])?trim($params['realName']):"";
        $pwd = isset($params['password'])?trim($params['password']):"";
        $roleId = isset($params['roleId'])?intval($params['roleId']):0;
        if(empty($logInName) || empty($realName) || empty($pwd) || strlen($pwd) < 6 || $roleId <= 0){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }
        
        $adminModel = new AdminModel();
        $logInUserInfo = AdminModel::getLogInUserFullInfo();
        $result = $adminModel->addAdmin(
                    array(
                        'loginName'=>$logInName,
                        'realName'=>$realName,
                        'password'=>$pwd,
                        'roleId'=>$roleId,
                        'createUserId'=>$logInUserInfo[AdminModel::SESSION_KEY_USER]['id'],
                        'createUserName'=>$logInUserInfo[AdminModel::SESSION_KEY_USER]['loginName'],
                    )
        );
        if(!$result){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "添加失败", ErrorCode::ERROR_COMMON_FAILED, array()));
            return ;
        }
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
        return ;
    }
    
    /**
     * 修改密码
     */
    public function actionUpdatePasswordAjax(){
        $params = $this->getAjaxRequestParam();
        $adminId = isset($params['adminId'])?intval($params['adminId']):0;
        $pwd = isset($params['password'])?trim($params['password']):"";
        if(empty($pwd) || strlen($pwd) < 6 || $adminId <= 0){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }
    
        $adminModel = new AdminModel();
        $result = $adminModel->updatePassword($adminId, $pwd);
        
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
        return ;
    }
    
    /**
     * 分配机构
     */
    public function actionBindUserOrgAjax(){
        $params = $this->getAjaxRequestParam();
        $userId = isset($params['userId'])?intval($params['userId']):0;
        $orgIdList = isset($params['orgIdList']) && is_array($params['orgIdList'])?$params['orgIdList']:array();
        if(empty($orgIdList) || $userId < 0){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }
    
        $adminModel = new AdminModel();
        $adminModel->bindOrg($userId, $orgIdList);
    
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
        return ;
    }
    
    /**
     * 查找机构
     */
    public function actionSearchOrgByNameAjax(){
        $params = $this->getAjaxRequestParam();
        $orgName = isset($params['orgName'])?trim($params['orgName']):"";
        $adminId = isset($params['adminId'])?intval($params['adminId']):0;
        $limit = 1000;
        $isLike = false;
        if($adminId < 0){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        if(!empty($orgName) || $orgName="0"){
//             $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
//             return ;
            $limit = 5;
            $isLike = true;
        }
        $ol = array();
        if($adminId > 0) {
            $adminModel = new AdminModel();
            $adminInfo = $adminModel->getUserByUserId($adminId);
            if (empty($adminInfo)) {
                $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            }
            $orgList = json_decode($adminInfo['orgList'], true);
            if(!empty($orgList)){
                foreach ($orgList as $row) {
                    $ol[$row] = $row;
                }
            }
        }
        $orgModel = new OrgModel();
        $orgInfoList = $orgModel->getOrgInfoByName($orgName,$isLike,$limit);
        $infoList = array();
        if(!empty($orgInfoList)){
            foreach ($orgInfoList as $item){
                $infoList[] = array(
                        "orgId"=>$item['id'],
                        "orgName"=>$item['name'],
                        "createTime"=>$item['createTime'],
                        "adminName"=>$item['adminName'],
                        "manager"=>isset($ol[$item['id']])?1:0,
                );
            }
        }
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $infoList));
        return ;
    }
    
    /**
     * 添加机构
     */
    public function actionAddOrgAjax(){
        $params = $this->getAjaxRequestParam();
        $orgName = isset($params['orgName'])?trim($params['orgName']):"";
        $province = isset($params['province'])?intval($params['province']):"";
        $city = isset($params['city'])?intval($params['city']):"";
        $district = isset($params['district'])?intval($params['district']):"";
        $street = isset($params['street'])?intval($params['street']):"";
        $address = isset($params['address'])?trim($params['address']):"";
        $mProvince = isset($params['mProvince'])?intval($params['mProvince']):"";
        $mCity = isset($params['mCity'])?intval($params['mCity']):"";
        $mDistrict = isset($params['mDistrict'])?intval($params['mDistrict']):"";
        $mStreet = isset($params['mStreet'])?intval($params['mStreet']):"";
        $showName = isset($params['showName'])?trim($params['showName']):"";
        $support = isset($params['support'])?trim($params['support']):"";
        
        if(empty($orgName) ||$province<=0 || $city<=0 || $district<=0 || $street <=0
               || empty($address) || empty($showName) || empty($support)){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }
    
        $orgModel = new OrgModel();
        $orgId = $orgModel->addOrg(
                array(
                        "name"=>$orgName,
                        "provinceId"=>$province,
                        "cityId"=>$city,
                        "districtId"=>$district,
                        "streetId"=>$street,
                        "address"=>$address,
                        "mProvinceId"=>$mProvince,
                        "mCityId"=>$mCity,
                        "mDistrictId"=>$mDistrict,
                        "mStreetId"=>$mStreet,
                        "showName"=>$showName,
                        "support"=>$support,
                        "adminId"=>$this->adminId,
                        "adminName"=>$this->adminName,
                )
        );
        if($orgId && $orgId >0){
            $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
        }else{
            $this->renderAjaxResponse($this->getAjaxResponse(false, "failed", ErrorCode::ERROR_COMMON_FAILED, array()));
        }
        return ;
    }
    
    /**
     * 搜索用户
     */
    public function actionSelectUser(){
        $params = $this->getAjaxRequestParam();
        $userName = isset($params['userName'])?trim($params['userName']):"";
        $limit = 1000;
        $isLike = false;
        if(!empty($userName) || $userName="0"){
            //             $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            //             return ;
            $limit = 5;
            $isLike = true;
        }
        
        $adminModel = new AdminModel();
        $userInfoList = $adminModel->searchUsers($userName,$isLike,$limit);
        $infoList = array();
        if(!empty($userInfoList)){
            foreach ($userInfoList as $item){
                $infoList[] = array(
                        "userId"=>$item['id'],
                        "loginName"=>$item['loginName'],
                        "realName"=>$item['realName'],
                        "createUserName"=>$item['createUserName'],
                        "createTime"=>$item['createTime']
                );
            }
        }
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $infoList));
        return ;
    }

    /**
     * 更新role信息
     */
    public function actionUpdateRoleInfoAjax(){
        $params = $this->getAjaxRequestParam();
        $roleId = isset($params['roleId'])?intval($params['roleId']):0;
        $name = isset($params['name'])?trim($params['name']):"";
        $desc = isset($params['desc'])?trim($params['desc']):"";

        if($roleId <= 0 || empty($name) || empty($desc)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
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
        $roleModel = new AdminModel();
        $roleModel->updateRoleInfo($roleId,$name,$desc,$adminInfo);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
        return;
    }

    public function actionUpdateAdminInfoAjax(){
        $params = $this->getAjaxRequestParam();
        $logInName = isset($params['logInName'])?trim($params['logInName']):"";
        $realName = isset($params['realName'])?trim($params['realName']):"";
        $pwd = isset($params['password'])?trim($params['password']):"";
        $roleId = isset($params['roleId'])?intval($params['roleId']):0;
        $userId = isset($params['userId'])?intval($params['userId']):0;
        if($userId <= 0 || empty($logInName) || empty($realName) || empty($pwd) || strlen($pwd) < 6 || $roleId <= 0){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }

        $adminModel = new AdminModel();
        $logInUserInfo = AdminModel::getLogInUserFullInfo();
        $result = $adminModel->updateAdmin(
            array(
                'userId'=>$userId,
                'loginName'=>$logInName,
                'realName'=>$realName,
                'password'=>$pwd,
                'roleId'=>$roleId,
                'createUserId'=>$logInUserInfo[AdminModel::SESSION_KEY_USER]['id'],
                'createUserName'=>$logInUserInfo[AdminModel::SESSION_KEY_USER]['loginName'],
            )
        );
        if(!$result){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "更新失败", ErrorCode::ERROR_COMMON_FAILED, array()));
            return ;
        }
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
        return ;
    }

    public function actionDeleteAdminAjax(){
        $params = $this->getAjaxRequestParam();
        $userId = isset($params['userId'])?intval($params['userId']):0;
        if($userId <= 0 ){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }

        $adminModel = new AdminModel();
        $adminModel->deleteAdmin($userId);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
        return ;
    }

    public function actionGetAdminInfo(){
        $params = $this->getAjaxRequestParam();
        $adminId = isset($params['adminId'])?intval($params['adminId']):0;
        if($adminId <=0){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }
        $adminModel = new AdminModel();
        $adminInfo = $adminModel->getUserByUserId($adminId);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $adminInfo));
        return;
    }

    public function actionGetOrgInfo(){
        $params = $this->getAjaxRequestParam();
        $orgId = isset($params['orgId'])?intval($params['orgId']):0;
        if($orgId <= 0){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }
        $orgModel = new OrgModel();
        $list = $orgModel->getOrgInfoByIdListV2(array($orgId));
        $info = array();
        if(isset($list[$orgId])){
            $info = $list[$orgId];
        }
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $info));
    }

    public function actionUpdateOrgInfo(){
        $params = $this->getAjaxRequestParam();
        $orgId = isset($params['orgId'])?intval($params['orgId']):0;
        $orgName = isset($params['orgName'])?trim($params['orgName']):"";
        $province = isset($params['province'])?intval($params['province']):0;
        $city = isset($params['city'])?intval($params['city']):0;
        $district = isset($params['district'])?intval($params['district']):0;
        $street = isset($params['street'])?intval($params['street']):0;
        $address = isset($params['address'])?trim($params['address']):"";
        $mProvince = isset($params['mProvince'])?intval($params['mProvince']):0;
        $mCity = isset($params['mCity'])?intval($params['mCity']):0;
        $mDistrict = isset($params['mDistrict'])?intval($params['mDistrict']):0;
        $mStreet = isset($params['mStreet'])?intval($params['mStreet']):0;
        $showName = isset($params['showName'])?trim($params['showName']):"";
        $support = isset($params['support'])?trim($params['support']):"";

        if(empty($orgName) ||$province<=0 || $city<=0 || $district<=0 || $street <=0
            || empty($address) || empty($showName) || empty($support) || $orgId <=0){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }

        $orgModel = new OrgModel();
        if($orgModel->isOrgExist($orgName,$orgId)){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "机构名字冲突", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }
        $orgInfo = $orgModel->getOrgInfoByIdListV2(array($orgId));
        if(empty($orgInfo) || !isset($orgInfo[$orgId])){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "机构不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }
        $orgId = $orgModel->updateOrg(
            array(
                "id"=>$orgId,
                "name"=>$orgName,
                "provinceId"=>$province,
                "cityId"=>$city,
                "districtId"=>$district,
                "streetId"=>$street,
                "address"=>$address,
                "mProvinceId"=>$mProvince,
                "mCityId"=>$mCity,
                "mDistrictId"=>$mDistrict,
                "mStreetId"=>$mStreet,
                "showName"=>$showName,
                "support"=>$support,
                "adminId"=>$this->adminId,
                "adminName"=>$this->adminName,
            )
        );
        if($orgId && $orgId >0){
            $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
        }else{
            $this->renderAjaxResponse($this->getAjaxResponse(false, "failed", ErrorCode::ERROR_COMMON_FAILED, array()));
        }
        return ;
    }

    /**
     * 获取当前管理的org 管理的区域
     */
    public function actionGetCurOrgManagerArea(){
        if($this->orgId <= 0){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }
        $orgModel = new OrgModel();
        $orgInfo  = $orgModel->getOrgInfoByIdListV2(array($this->orgId));
        if(empty($orgInfo) || !isset($orgInfo[$this->orgId])){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误.", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }

        $area = array(
            'provinceId'=>$orgInfo[$this->orgId]['mProvinceId'],
            'cityId'=>$orgInfo[$this->orgId]['mCityId'],
            'distirctId'=>$orgInfo[$this->orgId]['mDistrictId'],
            'streetId'=>$orgInfo[$this->orgId]['mStreetId'],
        );
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $area));
    }
}