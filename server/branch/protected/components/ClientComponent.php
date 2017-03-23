<?php
/**
 * 站客户端数据处理
 * @author lzm
 *
 */
class ClientComponent{
	const EXPIRE_TIME_DEFAULT = 604800;
	private $_userId = 0;
	private $_userInfo = null;
	
	/**
	 * 生成用户sessionkey
	 * @param array $userInfo
	 * @return string
	 */
	private function _getSessionKey($userInfo){
		$key = "tj.client.".time().$userInfo['id'].rand(100000, 999999);
		$map = "0123456789abcdefghijklmnopqrstuvwxyz";
		$bit = rand(0,strlen($map)-1);
		return $map[$bit].md5($key);
	}
	
	/**
	 * 设置登录用户信息
	 * @param array $userInfo
	 */
	public function setUserInfo($userInfo){
		$userKey = $this->_getSessionKey($userInfo);
		//$userType = isset($userInfo['type'])?$userInfo['type']:self::USER_TYPE_WECHAT;
		$data = array(
			'userId'=>$userInfo['id'],
			'userName'=>$userInfo['nickName'],
			'userType'=>"",
			'createTime'=>time(),
			'expirTime'=>time() + self::EXPIRE_TIME_DEFAULT,
            'provinceId'=>$userInfo['province'],
            'cityId'=>$userInfo['city'],
            'districtId'=>$userInfo['district'],
            'streetId'=>$userInfo['street'],
            'communityId'=>$userInfo['community'],
		);
		MemCacheComponent::setCache($userKey, $data, self::EXPIRE_TIME_DEFAULT);
		CookieComponent::setCookie(CookieComponent::$sessionId, $userKey);
		CookieComponent::setCookie(CookieComponent::$userName, $userInfo['nickName']);
	}
	/**
	 * 获取client user信息
	 */
	public function getClientUserInfo(){
		$this->_userId = 0;
		$this->_userInfo = null;
// 		$data = array(
// 			'userId'=>1,
// 			'userName'=>"user-test",
// 			'userType'=>PopularData::USER_TYPE_REGISTER,
// 			'createTime'=>time(),
// 			'expirTime'=>time() + self::EXPIRE_TIME_DEFAULT,
// 		);
// 		$this->_userInfo = $data;
// 		$this->_userId = $data['userId'];
		
// 		return;
		
		
		$userKey = CookieComponent::getCookie(CookieComponent::$sessionId,"");
		if(empty($userKey)){
			return ;
		}
		$userInfo = MemCacheComponent::getCacheByKey($userKey);
		if($userInfo == false){
			return ;
		}
		$this->_userInfo = $userInfo;
		$this->_userId = $userInfo['userId'];
		return ;
	}
	
	/**
	 * 销毁对应的session
	 */
	public function unsetUserClientInfo(){
		$userKey = CookieComponent::getCookie(CookieComponent::$sessionId);
		if(empty($userKey)){
			return ;
		}
		MemCacheComponent::deleteCache($userKey);
		CookieComponent::delCookie(CookieComponent::$sessionId);
		CookieComponent::delCookie(CookieComponent::$userName);
		
		$this->_userId = 0;
		return ;
	}
	/**
	 * 变更用户昵称
	 * @param string $nickname
	 */
	public function changeUserNickname($nickname){
		CookieComponent::setCookie(CookieComponent::$userName, $nickname);
	}
	
	/**
	 * 获取用户id
	 */
	public function getUserId(){
		if($this->_userId == 0){
			$this->getClientUserInfo();
		}
		return $this->_userId;
	}
	
	public function getUserInfo(){
	    if($this->_userId == 0){
	        $this->getClientUserInfo();
	    }
	    return $this->_userInfo;
	}
	/**
	 * 获取当前的城市信息
	 */
	public static function getCurrentCityInfo(){
// 		$cityInfo = CookieComponent::getCurrentCity();
// 		if(empty($cityInfo)){
// 			$params['ip'] = CommonComponent::getClientIp();
// 			$lbsModel = new LbsModel();
// 			$locateCityInfo = $lbsModel->getCityInfo(LbsModel::LOCATE_BY_IP,$params);
// 			CookieComponent::setCurrentCity($locateCityInfo['id'],$locateCityInfo['name']);
// 			$cityInfo = array(
// 					"cityId"=>intval($locateCityInfo['id']),
// 					"cityName"=>$locateCityInfo['name']
// 			);
// 		}
// 		return $cityInfo;
	}
}