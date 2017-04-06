<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/4
 * Time: 13:06
 */
class FloodController extends Controller{
    /**
     * 导入
     * @return string
     */
    public function actionImportBaseInfo(){
        $uploadInfo = $this->getUploadFileInfo();
        if(empty($uploadInfo)){
            return $this->renderBadParamsAjaxResponse();
        }
        $client = new ClientComponent();
        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderUserNotLoginAjaxResponse();
        }
        $userInfo = $client->getUserInfo();
        try {
            $data = ExcelModel::parseExcel(2, $uploadInfo['fileFullPath']);
            if (empty($data)) {
                return $this->renderAjaxResponse($this->getAjaxResponse(false,"empty file",ErrorCode::ERROR_COMMON_ERROR,array()));
            }
            $excel = new ExcelTemplateModel(new FloodBaseInfoExcelTemplateConfig());
            $extra = array(
                'street_id' => $client->getCurrentArea(),
                'district_id' => OpenCity::DISTRICT_ID,
                'city_id' => OpenCity::CITY_ID,
                'province_id' => OpenCity::PROVINCE_ID,
                'create_time' => date("Y-m-d H:i:s"),
                'add_user_id' => $userId,
                'add_user_name' => $userInfo['userName'],
            );
            $excel->data2Db($data, $extra);
            OperatorLogModel::addLog($this->userId,$this->userName,"导入社区防汛太基本情况");
            return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
        }catch (Exception $e){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,$e->getMessage(),ErrorCode::ERROR_COMMON_ERROR,array()));
        }
    }

    /**
     * 获取分页数据列表
     * @return string
     */
    public function actionGetBaseInfoList(){
        $params = $this->getAjaxRequestParam();
        $searchText = isset($params['text'])?trim($params['text']):"";
        $page = isset($params['page'])?intval($params['page']):1;

        $excelModel = new ExcelTemplateModel(new FloodBaseInfoExcelTemplateConfig());
        $client = new ClientComponent();
        $streetId = $client->getCurrentArea();
        $data = $excelModel->queryRecords($page,$streetId,$searchText,1);

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$data));
    }

    /**
     * 导入乡镇负责人
     * @return string
     */
    public function actionImportFloodLeaderInfo(){
        $uploadInfo = $this->getUploadFileInfo();
        if(empty($uploadInfo)){
            return $this->renderBadParamsAjaxResponse();
        }
        $client = new ClientComponent();
        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderUserNotLoginAjaxResponse();
        }
        $userInfo = $client->getUserInfo();
        try {
            $data = ExcelModel::parseExcel(2, $uploadInfo['fileFullPath']);
            if (empty($data)) {
                return $this->renderAjaxResponse($this->getAjaxResponse(false,"empty file",ErrorCode::ERROR_COMMON_ERROR,array()));
            }
            $excel = new ExcelTemplateModel(new FloodLeaderInfoExcelTemplateConfig());
            $extra = array(
                'street_id' => $client->getCurrentArea(),
                'district_id' => OpenCity::DISTRICT_ID,
                'city_id' => OpenCity::CITY_ID,
                'province_id' => OpenCity::PROVINCE_ID,
                'create_time' => date("Y-m-d H:i:s"),
                'add_user_id' => $userId,
                'add_user_name' => $userInfo['userName'],
            );
            $excel->data2Db($data, $extra);
            OperatorLogModel::addLog($this->userId,$this->userName,"导入乡镇街道防汛台负责人");
            return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
        }catch (Exception $e){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,$e->getMessage(),ErrorCode::ERROR_COMMON_ERROR,array()));
        }
    }

    /**
     * 获取分页数据列表
     * @return string
     */
    public function actionGetFloodLeaderInfoList(){
        $params = $this->getAjaxRequestParam();
        $searchText = isset($params['text'])?trim($params['text']):"";
        $page = isset($params['page'])?intval($params['page']):1;

        $excelModel = new ExcelTemplateModel(new FloodLeaderInfoExcelTemplateConfig());
        $client = new ClientComponent();
        $streetId = $client->getCurrentArea();
        $data = $excelModel->queryRecords($page,$streetId,$searchText,1);

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$data));
    }

    /**
     * 导入乡镇责任人
     * @return string
     */
    public function actionImportFloodOwnerInfo(){
        $uploadInfo = $this->getUploadFileInfo();
        if(empty($uploadInfo)){
            return $this->renderBadParamsAjaxResponse();
        }
        $client = new ClientComponent();
        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderUserNotLoginAjaxResponse();
        }
        $userInfo = $client->getUserInfo();
        try {
            $data = ExcelModel::parseExcel(3, $uploadInfo['fileFullPath']);
            if (empty($data)) {
                return $this->renderAjaxResponse($this->getAjaxResponse(false,"empty file",ErrorCode::ERROR_COMMON_ERROR,array()));
            }
            $excel = new ExcelTemplateModel(new FloodOwnerInfoExcelTemplateConfig());
            $extra = array(
                'street_id' => $client->getCurrentArea(),
                'district_id' => OpenCity::DISTRICT_ID,
                'city_id' => OpenCity::CITY_ID,
                'province_id' => OpenCity::PROVINCE_ID,
                'create_time' => date("Y-m-d H:i:s"),
                'add_user_id' => $userId,
                'add_user_name' => $userInfo['userName'],
            );
            $excel->data2Db($data, $extra);
            OperatorLogModel::addLog($this->userId,$this->userName,"导入乡镇街道防汛台责任人");
            return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
        }catch (Exception $e){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,$e->getMessage(),ErrorCode::ERROR_COMMON_ERROR,array()));
        }
    }

    /**
     * 获取分页数据列表
     * @return string
     */
    public function actionGetFloodOwnerInfoList(){
        $params = $this->getAjaxRequestParam();
        $searchText = isset($params['text'])?trim($params['text']):"";
        $page = isset($params['page'])?intval($params['page']):1;

        $excelModel = new ExcelTemplateModel(new FloodOwnerInfoExcelTemplateConfig());
        $client = new ClientComponent();
        $streetId = $client->getCurrentArea();
        $data = $excelModel->queryRecords($page,$streetId,$searchText,1);

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$data));
    }

    /**
     * 网络负责人
     * @return string
     */
    public function actionImportFloodNetworkOwnerInfo(){
        $uploadInfo = $this->getUploadFileInfo();
        if(empty($uploadInfo)){
            return $this->renderBadParamsAjaxResponse();
        }
        $client = new ClientComponent();
        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderUserNotLoginAjaxResponse();
        }
        $userInfo = $client->getUserInfo();
        try {
            $data = ExcelModel::parseExcel(3, $uploadInfo['fileFullPath']);
            if (empty($data)) {
                return $this->renderAjaxResponse($this->getAjaxResponse(false,"empty file",ErrorCode::ERROR_COMMON_ERROR,array()));
            }
            $excel = new ExcelTemplateModel(new FloodNetworkOwnerExcelTemplateConfig());
            $extra = array(
                'street_id' => $client->getCurrentArea(),
                'district_id' => OpenCity::DISTRICT_ID,
                'city_id' => OpenCity::CITY_ID,
                'province_id' => OpenCity::PROVINCE_ID,
                'create_time' => date("Y-m-d H:i:s"),
                'add_user_id' => $userId,
                'add_user_name' => $userInfo['userName'],
            );
            $excel->data2Db($data, $extra);
            OperatorLogModel::addLog($this->userId,$this->userName,"导入网络负责人");
            return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
        }catch (Exception $e){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,$e->getMessage(),ErrorCode::ERROR_COMMON_ERROR,array()));
        }
    }

    /**
     * 获取分页数据列表
     * @return string
     */
    public function actionGetFloodNetworkOwnerInfoList(){
        $params = $this->getAjaxRequestParam();
        $searchText = isset($params['text'])?trim($params['text']):"";
        $page = isset($params['page'])?intval($params['page']):1;

        $excelModel = new ExcelTemplateModel(new FloodNetworkOwnerExcelTemplateConfig());
        $client = new ClientComponent();
        $streetId = $client->getCurrentArea();
        $data = $excelModel->queryRecords($page,$streetId,$searchText,1);

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$data));
    }

    /**
     * 网络负责人
     * @return string
     */
    public function actionImportTransferPeopleInfo(){
        $uploadInfo = $this->getUploadFileInfo();
        if(empty($uploadInfo)){
            return $this->renderBadParamsAjaxResponse();
        }
        $client = new ClientComponent();
        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderUserNotLoginAjaxResponse();
        }
        $userInfo = $client->getUserInfo();
        try {
            $data = ExcelModel::parseExcel(2, $uploadInfo['fileFullPath']);
            if (empty($data)) {
                return $this->renderAjaxResponse($this->getAjaxResponse(false,"empty file",ErrorCode::ERROR_COMMON_ERROR,array()));
            }
            $excel = new ExcelTemplateModel(new TransferPeopExcelTemplateConfig());
            $extra = array(
                'street_id' => $client->getCurrentArea(),
                'district_id' => OpenCity::DISTRICT_ID,
                'city_id' => OpenCity::CITY_ID,
                'province_id' => OpenCity::PROVINCE_ID,
                'create_time' => date("Y-m-d H:i:s"),
                'add_user_id' => $userId,
                'add_user_name' => $userInfo['userName'],
            );
            $excel->data2Db($data, $extra);
            OperatorLogModel::addLog($this->userId,$this->userName,"导入转移人员清单");
            return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
        }catch (Exception $e){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,$e->getMessage(),ErrorCode::ERROR_COMMON_ERROR,array()));
        }
    }

    /**
     * 获取分页数据列表
     * @return string
     */
    public function actionGetTransferPeopleList(){
        $params = $this->getAjaxRequestParam();
        $searchText = isset($params['text'])?trim($params['text']):"";
        $page = isset($params['page'])?intval($params['page']):1;

        $excelModel = new ExcelTemplateModel(new TransferPeopExcelTemplateConfig());
        $client = new ClientComponent();
        $streetId = $client->getCurrentArea();
        $data = $excelModel->queryRecords($page,$streetId,$searchText,1);

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$data));
    }
}