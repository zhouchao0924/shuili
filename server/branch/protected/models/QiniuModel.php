<?php
/**
 * qiniu相关存储操作
 * @author lzm
 *
 */
Yii::import("application.dal.iao.*");
class QiniuModel{
    CONST QINIU_COMMON_STORE = "Common";
    CONST QINIU_PRIVATE_STORE = "Private";
    CONST QINIU_PUBLIC_STORE = "Public";

    CONST THUMB_TYPE_FIT = 2; //PC 自适应可以指定一个
    CONST THUMB_TYPE_FIXED = 5;//PC指定大小按照 w h缩放

    CONST THUMB_SIZE_DEFAULT = "800x520";
    CONST THUMB_SIZE_USER_BIG_ICON = "640x640";
    CONST THUMB_SIZE_USER_ICON = "320x320";
    CONST THUMB_SIZE_USER_AUTH_IMAGE = "152x92";
    CONST THUMB_SIZE_USER_STAR_IMAGE = "133x150";
    CONST THUMB_SIZE_USER_WAP_IMAGE = "480X340";
    private static $commonQiniuIao = array();
    
    private static function getQiniuIao($store){
        if(!isset(self::$commonQiniuIao[$store])){
            self::$commonQiniuIao[$store] = Iao::factory($store."Qiniu");
        }
        return self::$commonQiniuIao[$store];
    }

    public static function getQiniuStoreByHost($host){
        $qiniuConfig = Yii::app()->params['qiniu'];
        foreach($qiniuConfig['bucket'] as $key => $value){
            if(strtolower($value['host']) == strtolower($host)){
                return ucfirst($key);
            }
        }
        return "";
    }

    public static function isBucketCorrect($bucket){
        $qiniuConfig = Yii::app()->params['qiniu'];
        if(isset($qiniuConfig['bucket'][$bucket])){
            return true;
        }
        return false;
    }

    public static function parseSize($size){
        if(empty($size)){
            $size = self::THUMB_SIZE_DEFAULT;
        }
        $tmp = explode("x",strtolower($size));
        $data = array("w"=>"800","h"=>"520");
        if(!isset($tmp[0])){
            $data['w'] = 0;
        }else{
            $data['w'] = intval(trim($tmp[0]));
        }
        if(!isset($tmp[1])){
            $data['h'] = 0;
        }else{
            $data['h'] = intval(trim($tmp[1]));
        }
        return $data;
    }

    /**
     * 根据key获取对应的图片url
     * @param string $key  上传图片返回的对应的key - 图片名称
     */
    public static function getImageUrl($key,$size=self::THUMB_SIZE_DEFAULT, $thumbType=1,$ttl = AbstractQiniuIao::TTL_HOUR){
        $urlInfo = parse_url($key);
        if(empty($urlInfo)){
            return $key;
        }
        if(!isset($urlInfo['host']) || empty($urlInfo['host'])){
            return $key;
        }
        if(!isset($urlInfo['path']) || empty($urlInfo['path'])){
            return $key;
        }
        $store = self::getQiniuStoreByHost($urlInfo['host']);
        if(empty($store)){
            return $key;
        }
        $s = self::parseSize($size);
        $rKey = explode("/",$urlInfo['path']);
        $k = $rKey[count($rKey)-1];
        return self::getQiniuIao($store)->getDownloadUrl($k,$s['w'],$s['h'],$thumbType,$ttl);
    }
    
    /**
     * 获取上传token
     * @param string $store 存储名字
     * @param int $ttl  有效时间
     */
    public static function getUploadToken($userId, $store = QiniuModel::QINIU_PUBLIC_STORE, $ttl = AbstractQiniuIao::TTL_HOUR){
        if(self::isBucketCorrect($store) == false){
            return array();
        }

        return array(
            "token"=>self::getQiniuIao($store)->getUploadToken($store,$ttl),
            "key"=>md5("front".$userId.time().rand(1, 99999)).".jpg",
            "domain"=>Yii::app()->params['qiniu']['bucket'][strtolower($store)]['baseUrl']
        );
    }
}