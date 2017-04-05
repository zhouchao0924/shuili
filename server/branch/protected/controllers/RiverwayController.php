<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/4
 * Time: 13:06
 */
class RiverwayController extends Controller{
    /**
     * 导入
     * @return string
     */
    public function actionImport(){
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
            $excel = new ExcelTemplateModel(new RiverwayExcelTemplateConfig());
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
            return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,array()));
        }catch (Exception $e){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,$e->getMessage(),ErrorCode::ERROR_COMMON_ERROR,array()));
        }
    }

    /**
     * 获取分页数据列表
     * @return string
     */
    public function actionGetList(){
        $params = $this->getAjaxRequestParam();
        $searchText = isset($params['text'])?trim($params['text']):"";
        $page = isset($params['page'])?intval($params['page']):1;

        $excelModel = new ExcelTemplateModel(new RiverwayExcelTemplateConfig());
        $client = new ClientComponent();
        $streetId = $client->getCurrentArea();
        $data = $excelModel->queryRecords($page,$streetId,$searchText,1);

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$data));
    }
}