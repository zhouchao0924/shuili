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
        $result = $userModel->doLogin($name,$password);

        if($result != ErrorCode::SUCCESS){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户名或密码错误",$result,array()));
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
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
    public function actionGetManageArea(){
        $clientComponent = new ClientComponent();
        $userId = $clientComponent->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
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
        if(!$userModel->isUserManageArea($userId,$streetId)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"无对应权限",ErrorCode::ERROR_USER_DENY,array()));
        }

        $client->setCurrentArea($streetId);

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
    }

    /**
     * 获取菜单列表
     * @return string
     */
    public function actionGetMenu(){
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,AuthDefine::genTreeLinkIndex($this->roleId)));
    }
}