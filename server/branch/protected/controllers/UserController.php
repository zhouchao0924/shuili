<?php

/**
 * Class UserController
 * 用户模块
 */
class UserController extends Controller{
    /**
     * 用户登录
     */
    public function actionLogin(){
        $params = $this->getAjaxRequestParam();
        $name = isset($params['userName'])&&!empty($params['userName'])?trim($params['userName']):"";
        $password = isset($params['password'])&&!empty($params['password'])?trim($params['password']):"";
        $clientComponent = new ClientComponent();
        $userId = $clientComponent->getUserId();
        if($userId != 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户已登录",ErrorCode::ERROR_USER_LOGIN,array()));
        }
        if(!CommonComponent::checkUserNameFormat($name)
            || !CommonComponent::checkUserPasswordFormat($password)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"参数错误",ErrorCode::ERROR_PARAMS,array()));
        }
        $userModel = new UserModel();
        $userInfo = $userModel->doLogin($name,$password);

        if(empty($userInfo)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户名或密码错误",ErrorCode::ERROR_COMMON_ERROR,array()));
        }
        $userData = array(
            "userName"=>$userInfo['name'],
            "userId"=>$userInfo['id'],
            "roleId"=>$userInfo['role_id']
        );
        OperatorLogModel::addLog($userInfo['id'],$userInfo['name'],$userInfo['name']."登录成功");
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$userData));
    }

    public function actionIsLogin(){
        $clientComponent = new ClientComponent();
        $userId = $clientComponent->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }

        $userInfo = $clientComponent->getUserInfo();
        unset($userInfo['createTime']);
        unset($userInfo['expirTime']);
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$userInfo));
    }

    /**
     * 添加用户
     */
    public function actionAddUser(){
        $params = $this->getAjaxRequestParam();
        $name = isset($params['userName'])&&!empty($params['userName'])?trim($params['userName']):"";
        $password = isset($params['password'])&&!empty($params['password'])?trim($params['password']):"";
        $desc = isset($params['desc'])&&!empty($params['desc'])?trim($params['desc']):"";
        $roleId = isset($params['roleId'])&&!empty($params['roleId'])?intval($params['roleId']):0;

        if(!CommonComponent::checkUserNameFormat($name)
            || !CommonComponent::checkUserPasswordFormat($password)
            || !AuthDefine::isAuthRoleId($roleId)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"参数错误",ErrorCode::ERROR_PARAMS,array()));
        }
        $component = new ClientComponent();
        $userId = $component->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        $userModel = new UserModel();
        $result = $userModel->addUser($name,$password,$roleId,$desc);
        $userInfo = $component->getUserInfo();
        OperatorLogModel::addLog($userInfo['userId'],$userInfo['userName'],"添加管理员".$name);
        if($result != ErrorCode::SUCCESS){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"添加用户错误",$result,array()));
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"添加成功",ErrorCode::SUCCESS,array()));
    }

    /**
     * 登出
     */
    public function actionLogout(){
        $clientComponent = new ClientComponent();
        $userId = $clientComponent->getUserId();
        if($userId == 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        $userInfo = $clientComponent->getUserInfo();

        $clientComponent->unsetUserClientInfo();
        OperatorLogModel::addLog($userInfo['userId'],$userInfo['userName'],$userInfo['userName']."登出成功");

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
    }

    public function actionResetPassword(){
        $params = $this->getAjaxRequestParam();
        $tUserId = isset($params['userId'])?intval($params['userId']):0;
        $password = isset($params['password'])&&!empty($params['password'])?trim($params['password']):"";
        if(!CommonComponent::checkUserPasswordFormat($password)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"参数错误",ErrorCode::ERROR_PARAMS,array()));
        }

        $clientComponent = new ClientComponent();
        $userId = $clientComponent->getUserId();
        if($userId == 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }

        if($tUserId <= 0 || $userId == $tUserId){
            return $this->renderUserNotLoginAjaxResponse();
        }
        $userModel = new UserModel();
        $uinfo = $userModel->getUserById($tUserId);
        if(empty($uinfo)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"参数错误",ErrorCode::ERROR_PARAMS,array()));
        }
        $userModel->resetPassword($tUserId,$password);
        $userInfo = $clientComponent->getUserInfo();

        OperatorLogModel::addLog($userInfo['userId'],$userInfo['userName'],"重置用户".$uinfo['name']."密码");
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
    }

    /**
     * 获取管理员管理的地区
     */
    public function actionGetManageArea(){
        $clientComponent = new ClientComponent();
        $userId = $clientComponent->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        if($this->isSuper){
            $areaModel = new AreaModel();
            $list = array(
                'id'=>OpenCity::DISTRICT_ID,
                'name'=>"余姚市",
                'list'=>array(),
            );
            $areaList = $areaModel->getStreetListInfoByDistrictId(OpenCity::DISTRICT_ID);
            foreach ($areaList as $value){
                $list['list'][] = array(
                    "id"=>$value['id'],
                    "name"=>$value['name']
                );
            }
            return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array($list)));
        }

        $userModel = new UserModel();
        $area = $userModel->getManageArea($userId);
        $manageArea = array();
        if(!empty($area)){
            foreach ($area as $value){
                $manageArea[] = $value;
            }
        }

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$manageArea));
    }

    /**
     * 设置当前管理的县镇
     * @return string
     */
    public function actionSetCurrentArea(){
        $params = $this->getAjaxRequestParam();
        $streetId = isset($params['streetId'])?intval($params['streetId']):0;

        if($streetId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"参数错误",ErrorCode::ERROR_PARAMS,array()));
        }
        $client = new ClientComponent();

        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        $userModel = new UserModel();
        if(!$this->isSuper && !$userModel->isUserManageArea($userId,$streetId)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"无对应权限",ErrorCode::ERROR_USER_DENY,array()));
        }
        $areaModel = new AreaModel();
        $areaInfo = $areaModel->getStreetById($streetId);
        $client->setCurrentArea($streetId,$areaInfo['name']);

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
    }

    /**
     * 获取菜单列表
     * @return string
     */
    public function actionGetMenu(){
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,AuthDefine::genTreeLinkIndex($this->roleId)));
    }

    /**
     * 获取用户列表
     * @return string
     */
    public function actionGetUserList(){
        $clientComponent = new ClientComponent();
        $userId = $clientComponent->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        $page = isset($params['page'])?intval($params['page']):1;
        $pageSize = isset($params['pageSize'])?intval($params['pageSize']):10;

        $userModel = new UserModel();
        $userTotal = $userModel->getUserTotal();
        $userList = $userModel->getUserList($page,$pageSize);
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,
            array(
                'page' => $page,
                'total' => $userTotal,
                'userList' => $userList,
            )));
    }

    public function actionGetCurrentAreaLocation(){
        $clientComponent = new ClientComponent();
        $userId = $clientComponent->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        $area = $clientComponent->getCurrentArea();
        if($area <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"bad area id",ErrorCode::ERROR_COMMON_ERROR,array()));
        }

        $areaModel = new AreaModel();
        $areaInfo = $areaModel->getStreetById($area);
        if(empty($areaInfo)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"bad area info",ErrorCode::ERROR_COMMON_ERROR,array()));
        }
        $location = array(
            "long"=>$areaInfo['long'],
            "lat"=>$areaInfo['lat'],
        );
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$location));
    }

    public function actionGetAreaList(){
        $params = $this->getAjaxRequestParam();
        $userId = isset($params['userId'])?intval($params['userId']):0;

        if($userId <= 0){
            return $this->renderBadParamsAjaxResponse();
        }

        $client = new ClientComponent();
        $superInfo = $client->getUserInfo();
        if(empty($superInfo)){
            return $this->renderUserNotLoginAjaxResponse();
        }

        $areaModel = new AreaModel();
        $areaList = $areaModel->getStreetListInfoByDistrictId(OpenCity::DISTRICT_ID);

        $userModel = new UserModel();
        $manageAreaList = $userModel->getManageArea($userId);

        $streetInfo = array();
        if(!empty($manageAreaList)){
            $sf = $manageAreaList[OpenCity::DISTRICT_ID]['list'];
            foreach ($sf as $value){
                $streetInfo[$value['id']] = $value['name'];
            }
        }

        $data = array();
        foreach ($areaList as $key=>$value){
            $data[] = array(
                "id"=>$value['id'],
                "name"=>$value['name'],
                "isManage"=>isset($streetInfo[$value['id']])?true:false,
            );
        }

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$data));
    }

    public function actionUpdateManageArea(){
        $params = $this->getAjaxRequestParam();
        $userId = isset($params['userId'])?intval($params['userId']):0;
        $pareaList = isset($params['areaList']) && is_array($params['areaList'])?$params['areaList']:array();
        if($userId <= 0 || empty($pareaList)){
            return $this->renderBadParamsAjaxResponse();
        }

        $client = new ClientComponent();
        $superInfo = $client->getUserInfo();
        if(empty($superInfo)){
            return $this->renderUserNotLoginAjaxResponse();
        }

        $areaModel = new AreaModel();
        $areaList = $areaModel->getStreetListInfoByDistrictId(OpenCity::DISTRICT_ID);
        $list = array();
        foreach ($pareaList as $value){
            $tid = intval($value);
            if(!isset($areaList[$tid])){
                return $this->renderBadParamsAjaxResponse();
            }
            $list[] = $tid;
        }

        $userModel = new UserModel();
        $userInfo = $userModel->getUserById($userId);
        if(empty($userInfo)){
            return $this->renderBadParamsAjaxResponse();
        }
        $userModel->updateUserManageArea($list,$userId,$areaList,$superInfo['userId'],$superInfo['userName']);

        OperatorLogModel::addLog($superInfo['userId'],$superInfo['userName'],"编辑管理员".$userInfo['name']."管理地区信息");
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
    }

    public function actionUpdateUser(){
        $params = $this->getAjaxRequestParam();
        $upUserId = isset($params['userId'])&&!empty($params['userId'])?trim($params['userId']):"";
        $name = isset($params['userName'])&&!empty($params['userName'])?trim($params['userName']):"";
        $password = isset($params['password'])&&!empty($params['password'])?trim($params['password']):"";
        $desc = isset($params['desc'])&&!empty($params['desc'])?trim($params['desc']):"";
        $roleId = isset($params['roleId'])&&!empty($params['roleId'])?intval($params['roleId']):0;

        if(!CommonComponent::checkUserNameFormat($name)
            || !CommonComponent::checkUserPasswordFormat($password)
            || !AuthDefine::isAuthRoleId($roleId)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"参数错误",ErrorCode::ERROR_PARAMS,array()));
        }
        $component = new ClientComponent();
        $userId = $component->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        $userModel = new UserModel();
        $eInfo = $userModel->getUserById($upUserId);
        if(empty($eInfo)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户不存在",ErrorCode::ERROR_COMMON_ERROR,array()));
        }
        $userModel->updateUser($upUserId,$name,$password,$roleId,$desc);
        $userInfo = $component->getUserInfo();
        OperatorLogModel::addLog($userInfo['userId'],$userInfo['userName'],"修改管理员".$eInfo['name']."信息");

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"操作成功",ErrorCode::SUCCESS,array()));
    }

    public function actionDeleteUser(){
        $params = $this->getAjaxRequestParam();
        $delUserId = isset($params['userId'])&&!empty($params['userId'])?trim($params['userId']):"";

        $component = new ClientComponent();
        $userId = $component->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        $userModel = new UserModel();
        $eInfo = $userModel->getUserById($delUserId);
        if(empty($eInfo)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户不存在",ErrorCode::ERROR_COMMON_ERROR,array()));
        }
        $userModel->deleteUser($delUserId);
        $userInfo = $component->getUserInfo();
        OperatorLogModel::addLog($userInfo['userId'],$userInfo['userName'],"删除用户".$eInfo['name']);

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"操作成功",ErrorCode::SUCCESS,array()));
    }
}