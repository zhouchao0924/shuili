<?php
/**
 * cookie 处理组件
 * @author lzm
 *
 */
final class CookieComponent{
	CONST COOKIE_EXPIRE_WEEK = 604800;
	
	static $cookieDomain = '';
	static $cityCode = 'citycode';
	static $cityName = "cityname";
	static $userName = "uname";
	static $sessionId = "sid";
	
	static $cookieCheckMap = array(
            'sid'=>array('preg'=>"/^[0-9A-Za-z]{33}$/"),
	        'citycode'=>array("preg"=>"/^[0-9]{1,6}$/"),
	        'client'=>array("preg"=>"/^[0-9]{1,3}$/")
	);
	
	/**
	 * 获取$_cookies
	 */
	public static function getCookies(){
		return Yii :: app()->request->getCookies();
	}
	/**
	 * 获取cookie对应的域
	 * @return Ambigous <unknown, string>
	 */
	public static function getCookieDomain(){
		if(self::$cookieDomain == ''){
			$host = $_SERVER['HTTP_HOST'];
			if(ip2long($host)){
				self::$cookieDomain = $host;
			}else{
				$hostArr = explode(".", $host);
				if (count($hostArr) == 4) {
					unset($hostArr[0]);
					unset($hostArr[1]);
					self::$cookieDomain = implode(".", $hostArr);
				} else if(count($hostArr) == 3){
					unset($hostArr[0]);
					self::$cookieDomain = implode(".", $hostArr);
				} else {
					self::$cookieDomain = $host;
				}
			}
		}
		
		return self::$cookieDomain;
	}
	
	/**
	 * 设置cookie
	 * @param string $name
	 * @param string $value
	 * @param int $expire
	 */
	public static function setCookie($name, $value, $expire = self::COOKIE_EXPIRE_WEEK){
		$cookie = new CHttpCookie($name, $value);
		$cookie->expire = time() + $expire;
//		$cookie->domain = self::getCookieDomain();
//		$cookie->path = "/";
//		$cookies = self::getCookies();
		Yii::app()->request->cookies[$name] = $cookie;
	}
	
	/**
	 * 删除cookie
	 * @param unknown $name
	 */
	public static function delCookie($name){
	    $cookies = Yii::app()->request->getCookies();
	    if(isset($cookies[$name])){
	        unset($cookies[$name]);
	    }
	}
	
	/**
	 * 获取指定的cookie
	 * @param string $name
	 */
	public static function getCookie($name,$default=""){
		$cookies = Yii::app()->request->getCookies();
		if(isset($cookies[$name])){
			$value = $cookies[$name]->value;
			if(isset(self::$cookieCheckMap[$name])){
				if(preg_match(self::$cookieCheckMap[$name]['preg'], $value)){
					return $value;
				}else{
					return $default;
				}
			}
			return $value;
		}
		return $default;
	}
	/**
	 * 获取当前城市数据cookie
	 */
	public static function getCurrentCity(){
		$cityCode = CookieComponent::getCookie(self::$cityCode, "");
		$cityName = CookieComponent::getCookie(self::$cityName, "");
		return array("cityId"=>intval($cityCode),"cityName"=>$cityName);
	}
	/**
	 * 设置当前城市
	 */
	public static function setCurrentCity($id,$name){
		self::setCookie(self::$cityCode, $id,self::COOKIE_EXPIRE_WEEK);
		self::setCookie(self::$cityCookieName, $name,self::COOKIE_EXPIRE_WEEK);
	}
	
	/**
	 * 相关的cookies
	 */
	public static function getCurrentCookies(){
	    $client = array(
	            "userName"=>CookieComponent::getCookie(CookieComponent::$userName,""),
	            "sessionId"=>CookieComponent::getCookie(CookieComponent::$sessionId,""),
	            "cityCode"=>CookieComponent::getCookie(CookieComponent::$cityCode,0),
	    );
	}
}