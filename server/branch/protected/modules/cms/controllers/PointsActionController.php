<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 16/8/2
 * Time: 22:01
 */
class PointsActionController extends CmsBaseController{
    /**
     * 获取action配置信息
     */
    public function actionActionConfigInfo(){
        $pointsModel = new PointsModel();
        $config = $pointsModel->getConfig();

        foreach ($config['list'] as $value){
            if(!isset(PopularData::$pointAction[$value['at']])){
                continue;
            }
            $info[] = array(
                "desc"=>PopularData::$pointAction[$value['at']],
                "actionType"=>$value['at'],
                "pointType"=>$value['pt'],
                "hour"=>$value['h'],
                "count"=>$value['mcnt'],
                "score"=>$value['s']
            );
        }
        $plist = array();
        foreach (PopularData::$pointType as $k=>$v){
            $plist[] = array(
                "actionType"=>$k,
                "actionTypeDesc"=>$v,
            );
        }

        $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,array("list"=>$info, "pointTypeList"=>$plist)));
    }

    private function checkConfig($config){
        if(empty($config)){
            return array();
        }
        $c = array();
        foreach ($config as $k=>$v){
            if($k != $v['actionType']){
                return array();
            }
            $c[] = array(
                "at"=>$v['actionType'],
                "pt"=>$v['pointType'],
                "h"=>$v['hour'],
                "mcnt"=>$v['count'],
                "s"=>$v['score']
            );
        }
        return $c;
    }

    public function actionSetConfig(){
        $params = $this->getAjaxRequestParam();
        $config = (isset($params['config']) && is_array($params['config']))?$params['config']:array();
        $config = $this->checkConfig($config);
        if(empty($config)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"参数错误",ErrorCode::ERROR_CLIENT_PARAMS_ERROR,array()));
        }
        $pointsModel = new PointsModel();
        $pointsModel->addConfig($config);

        $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::NO_ERROR,array()));
    }
}