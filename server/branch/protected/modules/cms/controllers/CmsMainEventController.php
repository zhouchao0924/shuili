<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 16/8/14
 * Time: 22:08
 */
class CmsMainEventController extends CmsBaseController{
    public function actionGetMainEventAjax(){
        $mainEventModel = new MainEventModel();
        $info = $mainEventModel->getMainEvent();
        $data = array(
            "content"=>isset($info['content'])?$info['content']:"",
        );
        $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,$data));
    }

    public function actionSetMainEventAjax(){
        $params = $this->getAjaxRequestParam();
        $content = isset($params['content'])?$this->xssFilter(trim($params['content'])):"";
        if(empty($content)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR , array()));
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
        $mainEventModel = new MainEventModel();
        $mainEventModel->addMainEvent($content,$adminInfo);

        $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,array()));
    }
}