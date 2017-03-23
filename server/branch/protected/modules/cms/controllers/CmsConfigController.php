<?php
/**
 * 后台配置controller
 * @author zhous
 *
 */

class CmsConfigController extends CmsBaseController{
    
    /**
     * 获取配置
     * @return eventType
     * @return newsType
     * @return voteUserType
     * @return lawyerIdentity
     * @return legalServiceType
     * @url boss/config/list
     */
    public function actionGetCmsConfgAjax(){
        
        return $this->renderAjaxResponse($this->getAjaxResponse(true, "success",  ErrorCode::NO_ERROR, array(
            'eventType' =>  PopularData::$serviceEventCategory,
            'newsType'  =>  PopularData::$newsCategoryName,
            'voteUserType'      => PopularData::$voteUserTypeList,
            'lawyerIdentity'    => PopularData::$lawyerIdentity,
            'legalServiceType'  => PopularData::$serviceLegalAdviceCategory,
            'publicIdentity'=> PopularData::$publicWelfareIdList,
            )));
    }
    
    
}