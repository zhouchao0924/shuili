<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/8
 * Time: 11:11
 */
class TableController extends Controller{
    /**
     * 统一删除数据记录 一条
     * @return string
     */
    public function actionDeleteItem(){
        $params = $this->getAjaxRequestParam();
        $id = (isset($params['id']))?intval($params['id']):0;
        $serviceType = isset($params['serviceType'])?intval($params['serviceType']):-1;
        if($id <= 0 || !isset(ExcelTemplateModel::$excelTypeMAP[$serviceType]) || empty(ExcelTemplateModel::$excelTypeMAP[$serviceType])){
            return $this->renderBadParamsAjaxResponse();
        }

        $client = new ClientComponent();
        $userInfo = $client->getUserInfo();
        if(empty($userInfo)){
            return $this->renderUserNotLoginAjaxResponse();
        }

        $templateConfigString = ExcelTemplateModel::$excelTypeMAP[$serviceType];
        $templateConfig = new $templateConfigString();

        try {
            $templateConfig->delete($id, $userInfo['userId'], $userInfo['userName']);
        }catch (Exception $e){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"无效操作",ErrorCode::ERROR_COMMON_ERROR,array()));
        }
        return $this->renderSuccessAjaxResponse();
    }
}