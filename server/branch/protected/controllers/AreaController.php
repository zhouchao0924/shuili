<?php
/**
 * 地区
 * @author lzm
 *
 */
class AreaController extends Controller{
    /**
     * 获取省列表
     */
    public function actionGetProvinceListAjax(){
        $areaModel = new AreaModel();
        $pInfoList = $areaModel->getProvinceInfoList();
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::SUCCESS, $pInfoList));
    }
    
    /**
     * 根据省获取城市列表
     */
    public function actionGetCityListAjax($proviceId){
        $areaModel = new AreaModel();
        $cInfoList = $areaModel->getCityListInfoByProvinceId($proviceId);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::SUCCESS, $cInfoList));
    }
    
    /**
     * 根据市获取地区列表
     */
    public function actionGetDistrictListAjax($cityId){
        $areaModel = new AreaModel();
        $dInfoList = $areaModel->getDistrictListInfoByCityId($cityId);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::SUCCESS, $dInfoList));
    }

    public function actionGetStreatListAjax($districtId){
        $areaModel = new AreaModel();
        $dInfoList = $areaModel->getStreetListInfoByDistrictId($districtId);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::SUCCESS, $dInfoList));
    }


}