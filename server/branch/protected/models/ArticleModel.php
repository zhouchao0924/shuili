<?php
/**
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-02
 */
class ArticleModel extends BaseModel{

    /**
     * 获取文章列表
     * @param articleType $
     */
    public function getArticleList($streetId,$articleType){

        $conditions = array(
            "and",
            "article_type = :articleType",
            "street_id = :streetId",
            "del_flag = 0",
        );
        $params = array(
            ":articleType"=>$articleType,
            ":streetId"=>$streetId,
        );
        $list = $this->_getWpArticleDao()->select("*",$conditions,$params,true);
        $returnList = array();
        foreach($list as $key => $value){
            $returnList[] = $this->_formatWpArticleInfo($value);
        }
        return $returnList;
    }

    /**
     * format信息
     * @param $info
     */
    private function _formatWpArticleInfo($info){
        return array(
            "title" => $info["title"],
            "isBoldTitle" =>$info["is_bold_title"],
            "titleImgUrl" =>$info["title_img_url"],
            "content" =>$info["content"],
            "originalUrl" =>$info["original_url"],
            "articleType" =>$info["article_type"],
            "addTime" =>$info["add_time"],
        );
    }

    /**
     * 获取单个文章信息
     * @param $articleId
     * @return Ambigous
     */
    public function getArticleInfo($articleId){

        $conditions = array(
            "id = :id",
        );
        $params = array(
            ":id"=>$articleId
        );
        $info = $this->_getWpArticleDao()->select("*",$conditions,$params,true);
        return $this->_formatWpArticleInfo($info);
    }
    /**
     * @param $title
     * @param $isBoldTitle
     * @param $titleImgUrl
     * @param $articleType
     * @param $userId
     * @param $originalUrl
     * @param $content
     */
    public function addArticle($title,$isBoldTitle,$titleImgUrl,$articleType,$userId,$originalUrl,$content,$streetId){
        $cols = array(
            "title"=>$title,
            "is_bold_title"=>($isBoldTitle == 0) ? 0 : 1 ,
            "title_img_url"=>$titleImgUrl,
            "article_type"=>$articleType,
            "add_user_id"=> $userId,
            "original_url"=>$originalUrl,
            "content"=>$content,
            "street_id"=>$streetId,
        );
        $this->_getWpArticleDao()->baseInsert($cols);
    }

    /**
     * @param $id
     * @param $title
     * @param $isBoldTitle
     * @param $titleImgUrl
     * @param $articleType
     * @param $originalUrl
     * @param $content
     */
    public function editArticleInfo($id,$title,$isBoldTitle,$titleImgUrl,$articleType,$originalUrl,$content){
        $cols = array(
            "title"=>$title,
            "is_bold_title"=>($isBoldTitle == 0) ? 0 : 1 ,
            "title_img_url"=>$titleImgUrl,
            "article_type"=>$articleType,
            "original_url"=>$originalUrl,
            "content"=>$content,
        );
        $conditions = array(
            "and",
            "id=:id",
        );
        $params = array(
            ":id"=>$id
        );
        $this->_getWpArticleDao()->update($cols,$conditions,$params);
    }

    /**
     * @return WpProvinceDao
     */
    private function _getWpArticleDao(){
        return WpArticleDao::getInstance("wp_article");
    }
}