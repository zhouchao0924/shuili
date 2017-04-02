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
        $name = isset($params['name'])&&!empty($params['name'])?trim($params['name']):"";
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
        $result = $userModel->doLogin($name,$password);

        if($result != ErrorCode::SUCCESS){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户名或密码错误",$result,array()));
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
    }

    /**
     * 添加用户
     */
    public function actionAddUser(){
        $params = $this->getAjaxRequestParam();
        $name = isset($params['name'])&&!empty($params['name'])?trim($params['name']):"";
        $password = isset($params['password'])&&!empty($params['password'])?trim($params['password']):"";
        $desc = isset($params['desc'])&&!empty($params['desc'])?trim($params['desc']):"";
        $roleId = isset($params['roleId'])&&!empty($params['roleId'])?intval($params['roleId']):0;

        if(!CommonComponent::checkUserNameFormat($name)
            || !CommonComponent::checkUserPasswordFormat($password)
            || !RoleModel::isRightRole($roleId)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"参数错误",ErrorCode::ERROR_PARAMS,array()));
        }
        $component = new ClientComponent();
        $userId = $component->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        $userModel = new UserModel();
        $result = $userModel->addUser($name,$password,$roleId,$desc);

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
        $clientComponent->unsetUserClientInfo();
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
    }

    public function actionResetPassword(){
        $params = $this->getAjaxRequestParam();
        $password = isset($params['password'])&&!empty($params['password'])?trim($params['password']):"";
        if(!CommonComponent::checkUserPasswordFormat($password)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"参数错误",ErrorCode::ERROR_PARAMS,array()));
        }
        $clientComponent = new ClientComponent();
        $userId = $clientComponent->getUserId();
        if($userId == 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        $userModel = new UserModel();
        $userModel->resetPassword($userId,$password);
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
    }

    /**
     * 获取管理员管理的地区
     */
    public function actionGetAdminManageDistrict($adminId){
        $clientComponent = new ClientComponent();
        $userInfo = $clientComponent->getUserInfo();

        if(empty($userInfo)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
//        if($clientComponent->isSuper() == false){
//            return $this->renderAjaxResponse($this->getAjaxResponse(false,"登录用户权限不够",ErrorCode::ERROR_COMMON_ERROR,array()));
//        }
        $userModel = new UserModel();
        if($userModel->isCommonAdmin($adminId) == false){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"管理员信息错误",ErrorCode::ERROR_COMMON_ERROR,array()));
        }
        $userModel->getAdminManageDistrict($adminId);
    }
}