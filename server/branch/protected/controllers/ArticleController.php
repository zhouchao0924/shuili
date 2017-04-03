<?php
/**
 * 文章处理action
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-02
 */

class ArticleController extends Controller{

    /**
     * 增加一篇文章
     */
    public function actionAddArticleAjax($title,$isBoldTitle=0,$titleImgUrl="",$articleType=1,$originalUrl="",$content=""){
        $client = new ClientComponent();

        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        $streetId = $client->getCurrentArea();
        if($streetId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"管理的城市id不存在",ErrorCode::ERROR_USER_DENY,array()));
        }

        ArticleModel::getInstance()->addArticle($title,$isBoldTitle,$titleImgUrl,$articleType,$userId,$originalUrl,$content,$streetId);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::SUCCESS, ""));
    }

    /**
     * 获取文章列表（根据type）
     */
    public function actionGetArticleListAjax($cityId,$articleType){

        $client = new ClientComponent();

        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }
        $returnList = ArticleModel::getInstance()->getArticleList($cityId,$articleType);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::SUCCESS, $returnList));

    }


    /**
     * 获取单条文章的内容
     */
    public function actionGetArticleInfoAjax($articleId){

        $client = new ClientComponent();

        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }

        $returnInfo = ArticleModel::getInstance()->getArticleInfo($articleId);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::SUCCESS, $returnInfo));
    }

    /**
     * 修改单条文章的内容
     */
    public function actionEditArticleInfoAjax($id,$title,$isBoldTitle=0,$titleImgUrl="",$articleType=1,$originalUrl="",$content=""){

        $client = new ClientComponent();

        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }

        ArticleModel::getInstance()->editArticleInfo($id,$title,$isBoldTitle,$titleImgUrl,$articleType,$originalUrl,$content);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::SUCCESS, ""));
    }

}
