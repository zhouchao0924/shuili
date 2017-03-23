<?php
/**
 * 实名用户审核
 * @author lzm
 *
 */
class RealUserController extends CmsBaseController{
    /**
     * 搜索实名用户
     */
    public function actionSearchRealUser(){
        $params = $this->getAjaxRequestParam();
        $realName = isset($params['realName'])?$this->xssFilter($params['realName']):"";
        $page = isset($params['page'])?intval($params['page']):1;
        $verifyType = isset($params['verifyType'])?intval($params['verifyType']):-1;
        $startDate = isset($params['startDate'])?$params['startDate']:"";
        $endDate = isset($params['endDate'])?$params['endDate']:"";
        
        $userAuthenticationModel = new UserAuthenticationModel();
        $list = $userAuthenticationModel->searchRealUserInfoList($realName,$verifyType,$startDate,$endDate,$page);
        
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $list));
    }
    
    /**
     * 获取指定实名审核数据
     */
    public function actionRealUserInfo(){
        $params = $this->getAjaxRequestParam();
        $id = isset($params['id'])?intval($params['id']):0;
        if($id <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $userAuthenticationModel = new UserAuthenticationModel();
        $info = $userAuthenticationModel->getRealUserInfoByRealInfoId($id);
        
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::NO_ERROR, $info));
    }
    
    /**
     * 审核
     */
    public function actionVerifyRealUser(){
        $params = $this->getAjaxRequestParam();
        $id = isset($params['id'])?intval($params['id']):0;
        $verifyType = isset($params['verifyType'])?intval($params['verifyType']):0;
        $message = isset($params['message'])?$this->xssFilter($params['message']):"";
        if($id <= 0 || $verifyType < 0 || $verifyType > 3){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $userAuthenticationModel = new UserAuthenticationModel();
        $result = $userAuthenticationModel->verifyRealUserInfo($id,$verifyType,$message,$this->orgId);
        
        if(!$result){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "审核失败", ErrorCode::ERROR_COMMON_FAILED, array()));
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "审核成功", ErrorCode::NO_ERROR, array()));
    }
}