<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/13
 * Time: 20:30
 */

class LogController extends Controller{
    public function actionGetLog(){
        $params = $this->getAjaxRequestParam();
        $page = isset($params['page'])?intval($params['page']):1;

        if($page <= 0){
            $page = 1;
        }
        $client = new ClientComponent();
        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderUserNotLoginAjaxResponse();
        }
        $operatorLogModel = new OperatorLogModel();
        $log = $operatorLogModel->getLog($page);

        return $this->renderAjaxResponse($this->getAjaxResponse(true,"success",ErrorCode::SUCCESS,$log));
    }
}