<?php

class CmsController extends CmsBaseController{
    /**
     * cms登录
     * @return void|string
     */
    public function actionLoginAjax(){
        $params = $this->getAjaxRequestParam();
        $userName = isset($params['name'])?trim($params['name']):"";
        $password = isset($params['password'])?trim($params['password']):"";
        
        if(empty($userName) || empty($password)){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }
        $adminModel = new AdminModel();
        $result = $adminModel->doLogIn($userName, $password);
        if($result == false){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "登录失败", ErrorCode::ERROR_USER_NAME_OR_PASSWORD, array()));
        }
        $orgModel = new OrgModel();
        $authInfo = AdminModel::getLogInUserFullInfo();
        $orgInfoList = $orgModel->getOrgInfoByIdList($authInfo['orgList']);
        $simpleInfoList = array();
        foreach ($orgInfoList as $item){
            $simpleInfoList[] = array(
                    "orgId"=>$item['id'],
                    "orgName"=>$item['name'],
            );
        }
        
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "登录成功", ErrorCode::NO_ERROR, array("name"=>$userName,"orgList"=>$simpleInfoList,"role"=>!empty($authInfo[AdminModel::SESSION_KEY_ROLE])?$authInfo[AdminModel::SESSION_KEY_ROLE]['auth']:array(),"isSuper"=>AdminModel::isSuper())));
    }
    
    /**
     * 登出
     */
    public function actionLogoutAjax(){
        $adminModel = new AdminModel();
        $adminModel->doLogOut();
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 获取管理员管理的机构
     */
    public function actionGetUserManagerOrgListAjax(){
        $orgModel = new OrgModel();
        $orgInfoList = $orgModel->getOrgInfoByIdList($this->orgList);
        
        $simpleInfoList = array();
        foreach ($orgInfoList as $item){
            $simpleInfoList[] = array(
                        "orgId"=>$item['id'],
                        "orgName"=>$item['name'],
            );
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $simpleInfoList));
    }
    
    /**
     * 确认登录管理员管理的机构
     */
    public function actionConfirmCurrentManagerOrg(){
        $params = $this->getAjaxRequestParam();
        $managerOrg = isset($params['orgId'])?intval($params['orgId']):0;
        if($managerOrg <= 0 || !AdminModel::isUserManagerOrg($managerOrg)){
            $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
            return ;
        }
        AdminModel::setCurrentManagerOrg($managerOrg);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, array()));
        return ;
    }
    
    /**
     * 获取上次图片token
     * @return string
     */
    public function actionGetUploadTokenAjax(){
        $params = $this->getAjaxRequestParam();
        $bucket = isset($params['bucket'])?$this->xssFilter(trim($params['bucket'])):"";
        if(empty($bucket)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $data = QiniuModel::getUploadToken($this->adminId,$bucket);
        if(empty($data)){
            return $this->renderAjaxResponse($this->getAjaxResponse(
                false,
                "failed",
                ErrorCode::ERROR_COMMON_FAILED,
                array()
            ));
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(
                    true, 
                    "success", 
                    ErrorCode::NO_ERROR,
                    $data
            )
        );
    }
    
    /**
     * 获取上次图片token
     * @return string
     */
    public function actionGetUploadImageUrlAjax(){
        $params = $this->getAjaxRequestParam();
        $key = isset($params['key'])?trim($params['key']):"";
        if(empty($key)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR,array()));
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(
                true,
                "success",
                ErrorCode::NO_ERROR,
                array(
                        "url"=>QiniuModel::getImageUrl($key),
                )
        )
        );
    }
}