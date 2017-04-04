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
        if($excelType >= count(ExcelTemplateModel::$excelTypeMAP)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "参数错误", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
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
}