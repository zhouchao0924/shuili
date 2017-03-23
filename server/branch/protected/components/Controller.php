<?php
use Qiniu\json_decode;
/**
 * Controller is the customized base controller class.
 * All controller classes for this application should extend from this base class.
 */
class Controller extends CController
{
    CONST UA_WECHAT = "micromessenger";
	CONST DATA_FORMAT_JSON = "json";
	CONST DATA_FORMAT_BASE64 = "base64";
    public $ua = "";
	public static $hostList = array(
        "www.shuili.com"=>array(
            "name"=>"www.shuili.com",
            "viewPrefix"=>"pc",
            "main"=>'//layouts/main'
        ),
	);
    private static $uaMap =  Array("iphone", "ipod", "ipad", "android", "mobile", "blackberry", "webos", "incognito", "webmate", "bada", "nokia", "lg", "ucweb", "skyfire","micromessenger");

    public $isLogin = false;
	/**
	 * url中host
	 * @var unknown
	 */
	private $host = null;
    private $isM = false;
	/**
	 * @var string the default layout for the controller view. Defaults to '//layouts/column1',
	 * meaning using a single column layout. See 'protected/views/layouts/column1.php'.
	 */
	public $layout='//layouts/column1';
    public $main='//layouts/main';
	/**
	 * @var array context menu items. This property will be assigned to {@link CMenu::items}.
	 */
	public $menu=array();
	/**
	 * @var array the breadcrumbs of the current page. The value of this property will
	 * be assigned to {@link CBreadcrumbs::links}. Please refer to {@link CBreadcrumbs::links}
	 * for more details on how to specify this property.
	 */
	public $breadcrumbs=array();

    protected $city = array("name"=>"武汉","id"=>169);

	/**
	 * 公共头部
	 */
	public $pageHeader = array(
		'show'=>true,
		'title'=>'水利',
        'headerName'=>'header',
        'prefix'=>'pc',
        'logo'=>'',
        'city'=>array("name"=>"南京","id"=>169),
        'renderJs'=>false,
        'isLogin'=>false,
        'userId'=>0,
        'mailUnReadCount'=>0,
        'logOutGoToHomePage'=>0,
        'homePage'=>"",
        'ua'=>"",
        'isWeChat'=>false,
	);
	/**
	 * 公共的尾部
	 */
	public $pageFooter = array(
		'show'=>true,
		'footer'=>"",
        'footerName'=>'footer',
        'prefix'=>'pc',
	);
	/**
	 * 允许的ajax数据格式
	 */
	public $ajaxDataFormat = array('json','base64');
	/**
	 * css 文件列表
	 */
	public $cssFileList = array();
	/**
	 * js 文件列表
	 */
	public $jsFileList =  array();

	public $noBrowserCacheFlag = false;
	/**
	 * @var int
	 */
	public $exprieTime = 86400;

	private $_cssVersion = 2017022201;
	private $_jsVersion = 2017022201;
	protected $dataType = null;
	/**
	 * 获得request的参数，如果无参数则返回默认值
	 * @access public
	 * @param string $param
	 * @param mixed $default
	 * @return array
	 */
	public function getRequestParam($param, $default = null) {
		$value = Yii::app()->getRequest()->getParam($param);
		if (!isset($value) && isset($default)) {
			return $default;
		} elseif(is_string($value)){
			return trim($value);
		} elseif(is_array($value)){
			return $value;
		} else{
			return trim($value);
		}
	}

	/**
	 * 获取数据编码的类型，默认值为json
	 * @access public
	 * @return string
	 */
	public function getDataType() {
		if (!isset($this->dataType)) {
			$this->dataType = $this->getRequestParam('dataType');
			if (!in_array($this->dataType, $this->ajaxDataFormat)) {
				$this->dataType = "json";
			}
		}
		return $this->dataType;
	}

	/**
	 * 取得ajax的参数
	 * @access public
	 * @return array
	 */
	public function getAjaxRequestParam() {
		$data = $this->getRequestParam('data');
		$dataType = strtolower($this->getDataType());
		switch ($dataType) {
			case self::DATA_FORMAT_JSON :
				$data = json_decode($data, true);
				break;
			case self::DATA_FORMAT_BASE64:
				$data = str_replace(array('-','_'),array('+','/'), $data);
				$data = json_decode(base64_decode($data), true);
				break;
			default:
				$data = json_decode($data, true);
				break;
		}
		return $data;
	}

	/**
	 * 将数据按照指定的格式返回
	 * @param array $response
	 * @return string
	 */
	public function renderAjaxResponse($response) {
		$dataType = strtolower($this->getDataType());
		switch ($dataType) {
			case self::DATA_FORMAT_JSON :
				$data = json_encode($response);
				break;
			case self::DATA_FORMAT_BASE64:
				$data = base64_encode(json_encode($response));
				break;
			default:
				$data = json_encode($response);
				break;
		}
		echo $data;
	}

	/**
	 * xss
	 * @param string $param
	 * @param string $default
	 * @return string
	 */
	public function getYiiRequestParamRemoveXss($param, $default = null){
	    $var = $this->getYiiRequestParam($param, $default);
	    $purifier=new CHtmlPurifier();
	    $var = $purifier->purify($var);
	    return htmlspecialchars(preg_replace("/[\'\"\/<>\\\\]/", '', strip_tags($var)));
	}

	/**
	 * xss过滤
	 * @param unknown $string
	 * @return string
	 */
	public function xssFilter($string, $delHtmlTag = false){
	    $purifier=new CHtmlPurifier();
	    $var = $purifier->purify($string);
	    if($delHtmlTag){
	       return htmlspecialchars(preg_replace("/[\'\"\/<>\\\\]/", '', strip_tags($var)));
	    }else{
	       return htmlspecialchars($var);
	    }
	}


	/**
	 * 获取链接host
	 */
	public function getHost(){
		if(!isset($this->host)){
			$host = $_SERVER['HTTP_HOST'];
			$port = '';
			if(strpos($host, ":") !== false){
				$tmp = explode(":", $host);
				$host = $tmp[0];
				$port = $tmp[1];
			}
			if(!empty($port)){
				$port = ":".$port;
			}
			if(ip2long($host)){
				$this->host = $host.$port;
			}else{
				$hostArr = explode(".", $host);
				if (count($hostArr) == 4) {
					unset($hostArr[0]);
					$this->host = implode(".", $hostArr).$port;
				} else {
					$this->host = $host.$port;
				}
			}
		}
		return $this->host;
	}

	/**
	 * 获取host url
	 */
	public function getHostUrl(){
	    return "http://".$this->host;
	}

	/**
	 * createurl(non-PHPdoc)
	 * @see CController::createUrl()
	 */
	public function createUrl($route,$params=array(),$hostHolder=false,$ampersand='&'){
		if(!is_array($route) && empty($route)){
			return $this->getHostUrl();
		}
		if($hostHolder){
		    return PopularData::$hostHolder.parent::createUrl($route,$params,$ampersand);
        }
		return $this->getHostUrl().parent::createUrl($route,$params,$ampersand);
	}

	/**
	 * 添加css文件
	 * @param string/array $file
	 */
	public function addCssFile($file){
		if (is_array($file)) {
			foreach ($file as $cssFile){
				if(!isset($this->cssFileList[$cssFile])){
					$this->cssFileList[] = $cssFile;
				}
			}

		} else {
			if(!isset($this->cssFileList[$file])){
				$this->cssFileList[] = $file;
			}
		}
	}
	/**
	 * 添加js文件
	 * @param string/array $file
	 */
	public function addJsFile($file){
		if (is_array($file)) {
			foreach ($file as $jsFile){
				if(!isset($this->jsFileList[$jsFile])){
					$this->jsFileList[] = $jsFile;
				}
			}

		} else {
			if(!isset($this->jsFileList[$file])){
				$this->jsFileList[] = $file;
			}
		}
	}
	/**
	 * 输出css文件
	 */
	public function flushCssFiles(){
		if(empty($this->cssFileList)){
			return;
		}
		$cssBaseString = Yii::app()->params['css']['path'];
		foreach ($this->cssFileList as $file){
			$cssFile = str_replace(
						array('{HOST}', '{VERSION}', '{FILE}'),
						array($this->getHostUrl(), $this->_cssVersion, $file),
						$cssBaseString
			);
			Yii::app()->clientScript->registerCssFile($cssFile);
		}
	}
	/**
	 * 输出js文件
	 */
	public function flushJsFiles(){
		if(empty($this->jsFileList)){
			return;
		}
		$jsBaseString = Yii::app()->params['js']['path'];
		foreach ($this->jsFileList as $file){
			$jsFile = str_replace(
					array('{HOST}', '{VERSION}', '{FILE}'),
					array($this->getHostUrl(), $this->_jsVersion, $file),
					$jsBaseString
			);
			Yii::app()->clientScript->registerScriptFile($jsFile, CClientScript::POS_END);
		}
	}

	/**
	 * 输出js css文件
	 */
	public function flushScriptFiles(){
		$this->flushJsFiles();
		$this->flushCssFiles();
	}

	/**
	 * 浏览器不缓存
	 * @access public
	 */
	public function noBrowserCache() {
		$this->noBrowserCacheFlag=true;
		header("cache-control:no-store,no-control,must-revalidate");
		header("expires: ".gmdate('D, d M Y H:i:s \G\M\T',time()-1));
	}
	/**
	 * 要求浏览器缓存
	 */
	public function useCache(){
		//cdn缓存时间，秒数
		$exprieTime = $this->exprieTime;
		header("Cache-Control: max-age={$exprieTime}");
		header("Expires: ".gmdate('D, d M Y H:i:s \G\M\T',time()+$exprieTime));
	}
	/**
	 * 转到登录页面
	 */
	public function redirectLogin(){
		header("Location: ".$this->createUrl("user/login"));
		Yii::app()->end();
	}

	/**
	 * 转到pc首页
	 */
	public function redirectPC(){
	    header("Location: ".$this->createUrl("/"));
	    Yii::app()->end();
	}

	/**
	 *
	 * 发放header允许跨域
	 * @access publi
	 */
	public function allowAjaxDomain() {
	    $hostList = array();
	    if(isset($_SERVER['HTTP_ORIGIN'])){
	        $hostList[] = rtrim($_SERVER['HTTP_ORIGIN'],'/');
	    }
	    if(empty($hostList) && isset($_SERVER['HTTP_REFERER'])){
	        $hostList[] = rtrim($_SERVER['HTTP_REFERER'], '/');
	    }
	    $hostList = array_unique($hostList);
	    if(!empty($hostList)){
	        header('Access-Control-Allow-Origin: '.implode(",", $hostList));
	        header('Access-Control-Allow-Credentials: true');
	    }else{
	        header('Access-Control-Allow-Origin: ' . $this->getHost());
	        header('Access-Control-Allow-Credentials: true');
	    }
	}

	public function init(){
	    CookieComponent::setCookie(CookieComponent::$cityCode,"169",CookieComponent::COOKIE_EXPIRE_WEEK);
        CookieComponent::setCookie(CookieComponent::$cityName,"武汉市",CookieComponent::COOKIE_EXPIRE_WEEK);
	    $this->allowAjaxDomain();
        $host = strtolower($this->getHost());
        if(isset($_SERVER['HTTP_USER_AGENT'])){
            $this->ua = trim(strtolower($_SERVER['HTTP_USER_AGENT']));
            $pos = strpos($this->ua,self::UA_WECHAT);
            if($pos !== false){
                $this->pageHeader['ua'] = "weChat";
                $this->pageHeader['isWeChat'] = true;
            }
        }
        //检查ua是否需要跳转到m站或者pc
        foreach (self::$uaMap as $value){
            $ps = stripos($this->ua,$value);
            if($ps !== false){
                $this->isM = true;
                break;
            }
        }
        if(!isset(self::$hostList[$host])){
            if($this->isM){
                $this->host = self::$hostList['wap.tiaojie.com']['name'];
            }else{
                $this->host = self::$hostList['www.tiaojie.com']['name'];
            }
            $this->redirectPC();
            return;
        }

        if(strtolower($_SERVER['REQUEST_METHOD']) == "get"){
            $hostInfo = self::$hostList[$host];
            if($this->isM && $hostInfo['viewPrefix'] != "m"){
                $mUrl = "http://".self::$hostList['wap.tiaojie.com']['name'].$_SERVER['REQUEST_URI'];
                header("Location: ".$mUrl);
                Yii::app()->end();
                return;
            }
            if($this->isM == false && $hostInfo['viewPrefix'] != "pc"){
                $mUrl = "http://".self::$hostList['www.tiaojie.com']['name'].$_SERVER['REQUEST_URI'];
                header("Location: ".$mUrl);
                Yii::app()->end();
                return;
            }
        }
        $this->main = self::$hostList[$host]['main'];
        if(isset($this->pageHeader)){
            $this->pageHeader['logo'] = $this->createUrl('images/common/logo.png');
        }
        $this->pageHeader['homePage'] = "http://".self::$hostList[$host]['name'];
        $clientComponent = new ClientComponent();
        $userId = $clientComponent->getUserId();
        if($userId > 0){
            $this->pageHeader['isLogin'] = true;
            $this->pageHeader['userId'] = $userId;
            $mailModel = new MailModel();
            $info = $mailModel->getMailUnReadCount($userId);
            $this->pageHeader['mailUnReadCount'] = $info['cnt'];
        }
	}

	/**
	 * 转化为真正的view视图名称
	 * @param unknown $view
	 */
	private function page2HostView($page){
	    $this->pageHeader['prefix'] = self::$hostList[$this->host]['viewPrefix'];
        $this->pageFooter['prefix'] = self::$hostList[$this->host]['viewPrefix'];
	    return self::$hostList[$this->host]['viewPrefix']."_".$page;
	}

	/**
	 * 渲染(non-PHPdoc)
	 * @param $final : false 调整view添加对应host的prefix, true 不作调整
	 * @see CController::render()
	 */
	public function render($view,$data=null,$final=false,$return=false){
	    if($final === false){
    	    $view = trim($view);
    	    if(empty($view)){
    	        $view = Yii::app()->getUrlManager()->parseUrl($this->getRequest());
    	    }
    	    if(empty($view)){
    	        return;
    	    }

    	    $tmp = explode("/", $view);
    	    $count = count($tmp);
    	    $tmp[$count -1] = $this->page2HostView($tmp[$count -1]);
    	    $view = implode("/", $tmp);
	    }
	    return parent::render($view,$data,$return);
	}

	/**
	 * ajax response
	 */
	public function getAjaxResponse($success, $message, $code, $data){
	    return array(
	            'success'=>$success,
	            'message'=>$message,
	            'code'=>$code,
	            'data'=>$data,
	    );
	}

    public function setIFooter(){
        $this->pageFooter['footerName'] = "ifooter";
    }

    public function disableHeader(){
        $this->pageHeader['show'] = false;
    }

    public function disableFooter(){
        $this->pageFooter['show'] = false;
    }
    public function logOutGoToHomePage(){
        $this->pageHeader['logOutGoToHomePage'] = 1;
    }

    public function setTitle($title){
        $this->pageHeader['title'] = $title;
    }

}
