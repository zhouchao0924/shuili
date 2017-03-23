<?php
/**
 * 帮助文档
 * @author zhous
 *
 * @todo 1. 没有判断权限
 *       2. 大事记还没做
 */

class CmsDocumentationController extends CmsBaseController{
    
    /**
     * 获取帮助文档列表
     * @param docId           帮助文档Id
     * @param title           帮助文档
     * @return [Array][Dictionary] 
     * @return docId           帮助文档Id
     * @return title           帮助文档名称
     * @return creatTime       开始时间
     * @return isStick         是否置顶
     * @url boss/doc/list?data={"docId":0,"title":""}
     */
    public function actionGetDocListAjax(){
        $params = $this->getAjaxRequestParam();
        $params['pageNo'] = (intval($params['pageNo']) == 0) ? 1 : intval($params['pageNo']);
        $params['docId'] = (intval($params['docId']) <= 0) ? NULL : $params['docId'];
        $params['title'] = (trim($params['title']) == '') ? NULL : $this->xssFilter(trim($params['title']));
        $cmsDocModel = new CmsDocumentationModel();
        $docList = $cmsDocModel->getDocList($params);
        $totalCount = $cmsDocModel->getListCount($params);
        
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array(
            'count'     => $totalCount['num'],
            'pageCount' => ceil($totalCount['num']/15),
            'list'      => $docList,
            )));
    }
    
    /**
     * 置顶帮助文档操作
     * @param  docId
     * @param  isStick
     * @return [type] [description]
     * @url boss/doc/stickDoc?data={"docId":2,"isStick":1}
     */
    public function actionUpdateDocStickAjax(){
        $params = $this->getAjaxRequestParam();
        $params['isStick'] = (intval($params['isStick']) >=0 || intval($params['isStick']) <=2) ? intval($params['isStick']) : 0;
        $params['docId'] = (intval($params['docId']) <= 0) ? 0 : $params['docId'];
        if ($params['docId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的帮助文档不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $cmsDocModel = new CmsDocumentationModel();
        $cmsDocModel->updateDocStick($params['docId'], $params['isStick']);
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 是否删除帮助文档
     * @param  docId
     * @return [type] [description]
     * @url boss/doc/delDoc?data={"docId":2}
     */
    public function actionDeleteDocAjax(){
        $params = $this->getAjaxRequestParam();
        $params['docId'] = (intval($params['docId']) <= 0) ? 0 : $params['docId'];
        if ($params['docId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的帮助文档不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $cmsDocModel = new CmsDocumentationModel();
        $cmsDocModel->deleteDoc($params['docId']);
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array()));
    }
    
    /**
     * 获取帮助文档
     * @param docId
     * @return [type] [返回数据同actionUpdateDocAjax入参]
     * @url boss/doc/getDoc?data={"docId":2}
     */
    public function actionGetDocAjax(){
        $params = $this->getAjaxRequestParam();
        $params['docId'] = (intval($params['docId']) <= 0) ? 0 : $params['docId'];
        if ($params['docId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的帮助文档不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $cmsDocModel = new CmsDocumentationModel();
        $doc = $cmsDocModel->getDoc($params['docId']);
        if (empty($doc) || count($doc) == 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的帮助文档不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        $data = array(
            'docId'         => intval($doc['id']),
            'title'         => $doc['title'],
            'content'       => $doc['content'],
            'province'      => intval($doc['tjw_province']),
            'city'          => intval($doc['tjw_city']),
            'district'      => intval($doc['tjw_district']),
            'street'        => intval($doc['tjw_street']),
            );
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, $data));
    }
    
    /**
     * 新建帮助文档
     * @param title
     * @param content
     * @param province
     * @param city
     * @param district
     * @param street
     * @return [type] [description]
     * @url boss/doc/addDoc?data={"title":"12345","province":0,"city":0,"district":0,"street":0,"content":"aaa"}
     */
    public function actionAddDocAjax(){
        $params = $this->getAjaxRequestParam();
        if ($params['title'] == ''){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "标题不能为空", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $areaModel = new AreaModel();
        $provinceInfo = $areaModel->getProvinceById(intval($params['province']));
        $provinceName = isset($provinceInfo['name']) ? $provinceInfo['name'] : '';
        $cityInfo     = $areaModel->getCityById(intval($params['city']));
        $cityName     = isset($cityInfo['name']) ? $cityInfo['name'] : '';
        $districtInfo = $areaModel->getDistrictById(intval($params['district']));
        $districtName = isset($districtInfo['name']) ? $districtInfo['name'] : '';
        
        $params['title']    = $this->xssFilter(trim($params['title']));
        $params['province'] = intval($params['province']);
        $params['city']     = intval($params['city']);
        $params['district'] = intval($params['district']);
        $params['street']   = intval($params['street']);
        $params['content']  = isset($params['content'])?$this->xssFilter(trim($params['content'])):'';
        $params['userId']   = intval($this->adminId);
        $params['extInfo']  = array(
            'provinceName'  => $provinceName,
            'cityName'      => $cityName,
            'districtName'  => $districtName,
            );
        $cmsDocModel = new CmsDocumentationModel();
        $result = $cmsDocModel->addDoc($params);
        /**
         * @todo 创建失败的ErrorCode没建
         */
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array())); 
    }
    
    /**
     * 更新帮助文档
     * @param title
     * @param content
     * @param province
     * @param city
     * @param district
     * @param street
     * @return [type] [description]
     * @url boss/doc/updateDoc?data={"docId":2,"title":"23445","content":"doc_content_update","province":0,"city":0,"district":0,"street":0}
     */
    public function actionUpdateDocAjax(){
        $params = $this->getAjaxRequestParam();
        $params['docId'] = (intval($params['docId']) <= 0) ? 0 : $params['docId'];
        if ($params['docId'] == 0) {
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "您选择的帮助文档不存在", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        if ($params['title'] == ''){
            return $this->renderAjaxResponse($this->getAjaxResponse(false, "标题不能为空", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array()));
        }
        
        $areaModel = new AreaModel();
        $provinceInfo = $areaModel->getProvinceById(intval($params['province']));
        $provinceName = isset($provinceInfo['name']) ? $provinceInfo['name'] : '';
        $cityInfo     = $areaModel->getCityById(intval($params['city']));
        $cityName     = isset($cityInfo['name']) ? $cityInfo['name'] : '';
        $districtInfo = $areaModel->getDistrictById(intval($params['district']));
        $districtName = isset($districtInfo['name']) ? $districtInfo['name'] : '';
        
        $params['userId']   = intval($this->adminId);
        $params['province'] = intval($params['province']);
        $params['city']     = intval($params['city']);
        $params['district'] = intval($params['district']);
        $params['street']   = intval($params['street']);
        $params['title']    = $this->xssFilter(trim($params['title']));
        $params['content']  = isset($params['content'])?$this->xssFilter(trim($params['content'])):'';
        
        $params['extInfo']  = array(
            'provinceName'  => $provinceName,
            'cityName'      => $cityName,
            'districtName'  => $districtName,
            );
        
        $cmsDocModel = new CmsDocumentationModel();
        $result = $cmsDocModel->updateDoc($params, $params['docId']);
        /**
         * @todo 创建失败的ErrorCode没建
         */
        return (!$result) ? $this->renderAjaxResponse($this->getAjaxResponse(false, "创建失败", ErrorCode::ERROR_CLIENT_PARAMS_ERROR, array())) : $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array())); 
    }
}