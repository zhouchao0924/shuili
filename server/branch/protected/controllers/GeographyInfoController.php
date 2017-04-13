<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/9
 * Time: 15:45
 */
class GeographyInfoController extends Controller{
    public function actionAddPoint(){
        $params = $this->getAjaxRequestParam();
        $cat = isset($params['cat'])?intval($params['cat']):-1;
        $name = isset($params['name'])?trim($params['name']):"";
        $longitude = isset($params['longitude'])?doubleval($params['longitude']):0;
        $latitude = isset($params['latitude'])?doubleval($params['latitude']):0;
        if($cat > GeographyInfoModel::CAT_DRINKING || empty($name) || $latitude < 0 || $longitude < 0){
            return $this->renderBadParamsAjaxResponse();
        }
        $client = new ClientComponent();
        $userInfo = $client->getUserInfo();
        if(empty($userInfo)){
            return $this->renderUserNotLoginAjaxResponse();
        }
        $areaId = $client->getCurrentArea();
        if($areaId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"no area id",ErrorCode::ERROR_COMMON_ERROR,array()));
        }
        $params = array(
            'cat'=>$cat,
            'name'=>$name,
            'longitude'=>$longitude,
            'latitude'=>$latitude,
            'streetId'=>$areaId,
            'districtId'=>OpenCity::DISTRICT_ID,
            'cityId'=>OpenCity::CITY_ID,
            'provinceId'=>OpenCity::PROVINCE_ID,
            'userId'=>$userInfo['userId'],
            'userName'=>$userInfo['userName'],
        );
        $geographyModel = new GeographyInfoModel();
        $geographyModel->addPoint($params);
        OperatorLogModel::addLog($userInfo['userId'],$userInfo['userName'],"添加".$name."地图坐标");
        return $this->renderSuccessAjaxResponse();
    }

    public function actionGetPointAll(){
        $client = new ClientComponent();
        $userInfo = $client->getUserInfo();
        if(empty($userInfo)){
            return $this->renderUserNotLoginAjaxResponse();
        }
        $areaId = $client->getCurrentArea();
        if($areaId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"no area id",ErrorCode::ERROR_COMMON_ERROR,array()));
        }
        $geographyModel = new GeographyInfoModel();
        $data = $geographyModel->getPointAll($areaId);
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$data));
    }

    public function actionDeletePoint(){
        $params = $this->getAjaxRequestParam();
        $id = isset($params['id'])?intval($params['id']):0;

        if($id <= 0){
            return $this->renderBadParamsAjaxResponse();
        }
        $client = new ClientComponent();
        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderUserNotLoginAjaxResponse();
        }
        $areaId = $client->getCurrentArea();
        if($areaId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"no area id",ErrorCode::ERROR_COMMON_ERROR,array()));
        }

        $geographyModel = new GeographyInfoModel();
        $geographyModel->deletePoint($id,$areaId);

        return $this->renderSuccessAjaxResponse();
    }

    public function actionGetInfoDesc(){
        $params = $this->getAjaxRequestParam();
        $pointId = isset($params['pointId'])?intval($params['pointId']):0;
        if($pointId <= 0){
            return $this->renderBadParamsAjaxResponse();
        }
        $geographyModel = new GeographyInfoModel();
        $data = $geographyModel->getInfo($pointId);

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$data));

    }

    /**
     * 修改详情接口
     */
    public function actionUpdateInfoDesc(){
        $params = $this->getAjaxRequestParam();
        $pointId = isset($params['pointId'])?intval($params['pointId']):0;

        $title = isset($params['title'])?trim($params['title']):"";//标题
        $isBold = isset($params['isBold'])?intval($params['isBold']):0;//是否加粗，0，不加粗，1不加粗
        $content = isset($params['content'])?trim($params['content']):"";//详情内容
        if($pointId <= 0 || empty($title) || empty($content)){
            return $this->renderBadParamsAjaxResponse();
        }
        $client = new ClientComponent();
        $userId = $client->getUserId();

        $geographyModel = new GeographyInfoModel();
        $geographyModel->editInfo($pointId,$userId,$title,$isBold,$content);
        return $this->renderSuccessAjaxResponse();

    }

    /**
     * 获取cat分类所有point
     * @return string
     */
    public function actionGetCatPointAll(){
        $params = $this->getAjaxRequestParam();
        $cat = isset($params['cat'])?intval($params['cat']):-1;
        if($cat < GeographyInfoModel::CAT_RESERVOIR || $cat > GeographyInfoModel::CAT_DRINKING){
            return $this->renderBadParamsAjaxResponse();
        }
        $client = new ClientComponent();
        $userInfo = $client->getUserInfo();
        if(empty($userInfo)){
            return $this->renderUserNotLoginAjaxResponse();
        }
        $areaId = $client->getCurrentArea();
        if($areaId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"no area id",ErrorCode::ERROR_COMMON_ERROR,array()));
        }
        $geographyModel = new GeographyInfoModel();
        $data = $geographyModel->getCatPointAll($cat,$areaId);
        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$data));
    }
}