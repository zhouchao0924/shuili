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
    public function actionAddArticleAjax(){
        $params = $this->getAjaxRequestParam();
        $title = trim($params['title']);
        $isBoldTitle= isset($params['isBoldTitle']) && !empty($params['isBoldTitle']) ? trim($params['isBoldTitle']) : "";
        $titleImgUrl=isset($params['titleImgUrl']) && !empty($params['titleImgUrl']) ? trim($params['titleImgUrl']) : "";
        $articleType=isset($params['articleType']) && !empty($params['articleType']) ? intval($params['articleType']) : 1;
        $originalUrl=isset($params['originalUrl']) && !empty($params['originalUrl']) ? trim($params['originalUrl']) : "";
        $content=isset($params['content']) && !empty($params['content']) ? trim($params['content']) : "";

        if(empty($title) || empty($content)){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"参数错误",ErrorCode::ERROR_PARAMS,array()));
        }

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
    public function actionGetArticleListAjax(){

        $params = $this->getAjaxRequestParam();
        $articleType = intval($params['articleType']);
        $client = new ClientComponent();

        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }

        $streetId = $client->getCurrentArea();
        if($streetId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"管理的城市id不存在",ErrorCode::ERROR_USER_DENY,array()));
        }
        $returnList = ArticleModel::getInstance()->getArticleList($streetId,$articleType);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::SUCCESS, $returnList));

    }


    /**
     * 获取单条文章的内容
     */
    public function actionGetArticleInfoAjax(){
        $params = $this->getAjaxRequestParam();
        $articleId = intval($params['articleId']);

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
    public function actionEditArticleInfoAjax(){

        $params = $this->getAjaxRequestParam();
        $id = intval($params['id']);
        $title = trim($params['title']);
        $isBoldTitle= isset($params['isBoldTitle']) && !empty($params['isBoldTitle']) ? trim($params['isBoldTitle']) : "";
        $titleImgUrl=isset($params['titleImgUrl']) && !empty($params['titleImgUrl']) ? trim($params['titleImgUrl']) : "";
        $articleType=isset($params['articleType']) && !empty($params['articleType']) ? intval($params['articleType']) : 1;
        $originalUrl=isset($params['originalUrl']) && !empty($params['originalUrl']) ? trim($params['originalUrl']) : "";
        $content=isset($params['content']) && !empty($params['content']) ? trim($params['content']) : "";


        $client = new ClientComponent();

        $userId = $client->getUserId();
        if($userId <= 0){
            return $this->renderAjaxResponse($this->getAjaxResponse(false,"用户未登录",ErrorCode::ERROR_USER_NOT_LOGIN,array()));
        }

        ArticleModel::getInstance()->editArticleInfo($id,$title,$isBoldTitle,$titleImgUrl,$articleType,$originalUrl,$content);
        $this->renderAjaxResponse($this->getAjaxResponse(true, "success", ErrorCode::SUCCESS, ""));
    }

}
