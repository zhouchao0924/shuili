<?php
/**
 * memcache 组件
 * @author lzm
 *
 */
class MemCacheComponent{
	//CACHE 1分钟
	CONST MINUTE = 60;
    CONST FIVE_MINUTE = 300;
	CONST TEN_MINUTE = 600;
	//CACHE 半小时
	CONST HALF_HOUR = 1800;
	//CACHE 1小时
	CONST HOUR = 3600;
	//CACHE 半天
	CONST HALF_DAY = 43200;
	//CACHE 1天
	CONST DAY = 86400;
	//CACHE 7天
	CONST WEEK = 604800;
	//cache实例
	public static $cache = NULL;
	/**
	 * 获取cache
	 */
	public static function getCacheInstance(){
		if(self::$cache == NULL){
			self::$cache = Yii::app()->cache;
		}
		return self::$cache;
	}
	
	/**
	 * 添加
	 */
	public static function setCache($key, $data, $expire){
		return self::getCacheInstance()->set($key, json_encode($data),$expire);
	}
	/**
	 * 删除
	 */
	public static function deleteCache($key){
		return self::getCacheInstance()->delete($key);
	}
	/**
	 * 获取
	 */
	public static function getCacheByKey($key){
		$data = self::getCacheInstance()->get($key);
		if($data !== false){
			$data = json_decode($data,true);
		}
		return $data;
	}
}
