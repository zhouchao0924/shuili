<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 19:08
 */
class AttachmentController extends Controller{
    /**
     * 获取上传图片token
     * @return string
     */
    public function actionGetUploadTokenAjax(){
        $bucket = "public";
        if(empty($bucket)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $clientComponent = new ClientComponent();
        $userId = $clientComponent->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "用户未登录", ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        $data = QiniuModel::getUploadToken($userId,$bucket);
        if(empty($data)){
            return $this->renderAjaxResponse($this->getAjaxResponse(
                false,
                "failed",
                ErrorCode::ERROR_COMMON_ERROR,
                $data
            )
            );
        }
        return $this->renderAjaxResponse($this->getAjaxResponse(
                true,
                "success",
                ErrorCode::SUCCESS,
                $data
            )
        );
    }

    /**
     * excel模板
     * @param $excelType
     * @return string|void
     */
    public function actionExportExample($excelType){
        if($excelType > count(ExcelTemplateModel::$excelTypeMAP)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_PARAMS, array()));
        }
        $clientComponent = new ClientComponent();
        $userId = $clientComponent->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "用户未登录", ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }

        $excelModel = new ExcelTemplateModel::$excelTypeMAP[$excelType]();
        $fileName = $excelModel->getExampleExcelFileName();
        $filePath = dirname(__FILE__)."/../models/excel/example/".$fileName;
        if(!is_file($filePath)){
            return;
        }
        $file = fopen($filePath,"r");
        $length = filesize($filePath);
        header('Content-type: application/csv');
        header('Content-Disposition: attachment; filename="'.$fileName.'"');
        while(($line = fread($file,4096))){
            echo $line;
        }
        fclose($file);
        return;
    }

    /**
     * 统一更新全景图片
     * @return string
     */
    public function actionUpdateFullImage(){
        $params = $this->getAjaxRequestParam();
        $id = (isset($params['id']))?intval($params['id']):0;
        $url = (isset($params['url']) && !empty($params['url']))?trim($params['url']):"";
        $serviceType = isset($params['serviceType'])?intval($params['serviceType']):-1;
        if($id <= 0 || empty($url) || !isset(ExcelTemplateModel::$excelTypeMAP[$serviceType]) || empty(ExcelTemplateModel::$excelTypeMAP[$serviceType])){
            return $this->renderBadParamsAjaxResponse();
        }
        $client = new ClientComponent();
        $userInfo = $client->getUserInfo();
        if(empty($userInfo)){
            return $this->renderUserNotLoginAjaxResponse();
        }

        $templateConfigString = ExcelTemplateModel::$excelTypeMAP[$serviceType];
        $templateConfig = new $templateConfigString();
        $templateConfig->updateFullImage($url,$id,$userInfo['userId'],$userInfo['userName']);

        return $this->renderSuccessAjaxResponse();
    }

    /**
     * 统一更新图片
     * @return string
     */
    public function actionUpdateImage(){
        $params = $this->getAjaxRequestParam();
        $id = (isset($params['id']))?intval($params['id']):0;
        $url = (isset($params['url']) && is_array($params['url']) && !empty($params['url']))?$params['url']:array();
        $serviceType = isset($params['serviceType'])?intval($params['serviceType']):-1;
        if($id <= 0 || empty($url) || !isset(ExcelTemplateModel::$excelTypeMAP[$serviceType]) || empty(ExcelTemplateModel::$excelTypeMAP[$serviceType])){
            return $this->renderBadParamsAjaxResponse();
        }
        if(count($url) > 3){
            return $this->renderBadParamsAjaxResponse();
        }
        $client = new ClientComponent();
        $userInfo = $client->getUserInfo();
        if(empty($userInfo)){
            return $this->renderUserNotLoginAjaxResponse();
        }

        $templateConfigString = ExcelTemplateModel::$excelTypeMAP[$serviceType];
        $templateConfig = new $templateConfigString();
        $templateConfig->updateImage($url,$id,$userInfo['userId'],$userInfo['userName']);

        return $this->renderSuccessAjaxResponse();
    }

    /**
     * 统一更新布置图图片
     * @return string
     */
    public function actionUpdateProjectImage(){
        $params = $this->getAjaxRequestParam();
        $id = (isset($params['id']))?intval($params['id']):0;
        $url = (isset($params['url']) && is_array($params['url']) && !empty($params['url']))?$params['url']:array();
        $serviceType = isset($params['serviceType'])?intval($params['serviceType']):-1;
        if($id <= 0 || empty($url) || !isset(ExcelTemplateModel::$excelTypeMAP[$serviceType]) || empty(ExcelTemplateModel::$excelTypeMAP[$serviceType])){
            return $this->renderBadParamsAjaxResponse();
        }

        $client = new ClientComponent();
        $userInfo = $client->getUserInfo();
        if(empty($userInfo)){
            return $this->renderUserNotLoginAjaxResponse();
        }

        $templateConfigString = ExcelTemplateModel::$excelTypeMAP[$serviceType];
        $templateConfig = new $templateConfigString();
        $templateConfig->updateProjectImage($url,$id,$userInfo['userId'],$userInfo['userName']);

        return $this->renderSuccessAjaxResponse();
    }

    /**
     * 统一更新布置图图片
     * @return string
     */
    public function actionUpdateAdminImage(){
        $params = $this->getAjaxRequestParam();
        $id = (isset($params['id']))?intval($params['id']):0;
        $url = (isset($params['url']) && !empty($params['url']))?trim($params['url']):"";
        $serviceType = isset($params['serviceType'])?intval($params['serviceType']):-1;
        if($id <= 0 || empty($url) || !isset(ExcelTemplateModel::$excelTypeMAP[$serviceType]) || empty(ExcelTemplateModel::$excelTypeMAP[$serviceType])){
            return $this->renderBadParamsAjaxResponse();
        }

        $client = new ClientComponent();
        $userInfo = $client->getUserInfo();
        if(empty($userInfo)){
            return $this->renderUserNotLoginAjaxResponse();
        }

        $templateConfigString = ExcelTemplateModel::$excelTypeMAP[$serviceType];
        $templateConfig = new $templateConfigString();
        $templateConfig->updateAdminImage($url,$id,$userInfo['userId'],$userInfo['userName']);

        return $this->renderSuccessAjaxResponse();
    }
}