<?php
/**
 * IAO的基类
 */
abstract class Iao{
	/**
	 * 保存所有IAO的数组
	 * @var array
	 */
	protected static $INSTANCES = array();
	/**
	 *
	 * 被保护的构造函数
	 * @access protected
	*/
	protected function __construct() {}
	/**
	 *
	 * 被保护的克隆函数
	 * @access protected
	 */
	protected function __clone() {}
	/**
	 * 获取IAO的单例
	 * @param string $iaoName IAO的名字
	 * @return IAO
	 */
	public static function factory($iaoName){
		$iaoName = preg_replace_callback('/(?:^|_)([a-z])/',create_function('$matches','return strtoupper(ltrim($matches[0],"_"));'),(string)$iaoName)."Iao";
		if(!isset(self::$INSTANCES[$iaoName])) {
			self::$INSTANCES[$iaoName] = new $iaoName();
		}
		return self::$INSTANCES[$iaoName];
	}
	/**
	 *
	 * RESTClient
	 * @access protected
	 * @var RESTClient
	 */
	protected static $_RESTClient = null;
	
	/**
	 * curl
	 */
	protected static $_CurlClient = null;
	/**
	 * uri
	 * @access protected
	 * @var string
	 */
	protected $_uri = null;
	/**
	 * 接口的原始返回值
	 * @access protected
	 * @var array
	 */
	protected $_originalReturn = null;
	/**
	 *
	 * 获取RESTClient
	 * @access protected
	 * @return RESTClient
	 */
	public function getRESTClient(){
		if(!isset(self::$_RESTClient)){
			self::$_RESTClient = new AutoRESTClient();
		}
		return self::$_RESTClient;
	}
	/**
	 * get curl instance
	 * @return CURL
	 */
	public function getCurlClient(){
		if(!isset(self::$_CurlClient)){
			self::$_CurlClient = new CURL();
		}
		return self::$_CurlClient;
	}
	
	/**
	 *
	 * 取得接口地址
	 * @access public
	 * @return string
	 */
	public function getUri(){
		return $this->_uri;
	}
	/**
	 *
	 * 从接口查询信息
	 * @access private
	 * @param array $params
	 * @param string $method get/post/delete/put
	 * @param string $func 接口url中跟着的函数名,也可以是原接口地址后面跟着的后缀
	 * @return array
	 */
	private function restFetchData($params, $method, $header = array(), $curlTime=NULL, $format = NULL){
		$errMsg = null;
		try{
			$url = $this->getUri();
			if(!empty($header)){
				foreach($header as $name => $value){
					if(empty($name) || empty($value)){
						continue;
					}
					$this->getRESTClient()->set_header($name, $value);
				}
			}
			$response = $this->getRESTClient()->$method($url, $params, $format, $curlTime);
		}catch(Exception $e){
			$errMsg = $e->getMessage();
		}
		if(!isset($response)){
			$response = NULL;
		}
		$this->_originalReturn = array('response'=>$response,
				'exception'=>$errMsg,
				'info'=>$this->getRESTClient()->info());
		if(!is_array($response)||!isset($response['success'])){
			$logMsg = array(
					'header'=>$header,
					'url'=>$url,
					'method'=>$method,
					'params'=>$params,
					'curlTime'=>$curlTime,
					'response'=>$response,
					'exception'=>$errMsg,
					'time'=>date("Y-m-d H:i:s"),
					'info'=>$this->getRESTClient()->info(),
			);
			Yii::log(json_encode($logMsg), CLogger::LEVEL_ERROR,"iao.curl.rest");
		}
		if(is_array($response)&&isset($response['success']) &&$response['success']==true&&isset($response['data'])){
			return $response['data'];
		}else{
			return array();
		}
	}
	/**
	 *
	 * 用get方式从接口请求信息
	 * @access protected
	 * @param array $params
	 * @param string $func
	 * @return array
	 */
	protected function restGet($params, $func='', $header = array(), $curlTime=NULL, $isReturnData=true, $format = NULL){
		return $this->fetchData($params, 'get', $func, $header, $curlTime, $isReturnData, $format);
	}
	/**
	 *
	 * 用post方式从接口请求信息
	 * @access protected
	 * @param array $params
	 * @param string $func
	 * @return array
	 */
	protected function restPost($params, $func='', $header = array(), $curlTime=NULL, $isReturnData=true, $format = NULL){
		return $this->fetchData($params, 'post', $func, $header, $curlTime, $isReturnData, $format);
	}
	/**
	 *
	 * 用put方式从接口请求信息
	 * @access protected
	 * @param array $params
	 * @param string $func
	 * @return array
	 */
	protected function restPut($params, $func='', $header = array(), $curlTime=NULL, $isReturnData=true, $format = NULL){
		return $this->fetchData($params, 'put', $func, $header, $curlTime, $isReturnData, $format);
	}
	/**
	 *
	 * 用delete方式从接口请求信息
	 * @access protected
	 * @param array $params
	 * @param string $func
	 * @return array
	 */
	protected function restDelete($params, $func='', $header = array(), $curlTime=NULL, $isReturnData=true, $format = NULL){
		return $this->fetchData($params, 'delete', $func, $header, $curlTime, $isReturnData, $format);
	}
	/**
	 * curl获取数据
	 * @param array $params
	 * @param string $method
	 * @param array $header
	 */
	protected function curlFetchData($params,$method,$header=array(),$options = array()){
		$errMsg = null;
		try{
			$url = $this->getUri();
			if(!empty($header)){
				$this->getCurlClient()->http_header_reset();
				foreach($header as $name => $value){
					if(empty($name) || empty($value)){
						continue;
					}
					$this->getCurlClient()->http_header($name, $value);
				}
			}
			$response = $this->getCurlClient()->_simple_call($method, $url, $params, $options);
		}catch(Exception $e){
			$response = '';
			$errMsg = $e->getMessage();
		}
		
		if($this->getCurlClient()->error_code != 0){
			$logMsg = array(
					'header'=>$header,
					'url'=>$url,
					'method'=>$method,
					'options'=>$options,
					'params'=>$params,
					'response'=>$response,
					'exception'=>$errMsg,
					'time'=>date("Y-m-d H:i:s"),
					'info'=>$this->getRESTClient()->info(),
			);
			Yii::log(json_encode($logMsg), CLogger::LEVEL_ERROR,"iao.curl.native");
			return false;
		}
		return $response;
	}
	
	/**
	 * curl get 
	 * @param array $params
	 */
	protected function curlGet($params,$header=array(),$options = array()){
		return $this->curlFetchData($params, "get",$header,$options);
	}
	/**
	 * curl post
	 * @param array $params
	 */
	protected function curlPost($params,$header=array(),$options = array()){
		return $this->curlFetchData($params, "post",$header,$options);
	}
}