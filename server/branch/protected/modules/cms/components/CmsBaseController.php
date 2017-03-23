<?php
class CmsBaseController extends Controller{
	public $layout='/layouts/column1';
	public $loginTrue = false;
	public $cityId = 0;
	public $isSuper = false;
	public $cityInfo=array();
	public $response = array('success'=>'true','message'=>'','url'=>'');
	public $role = array();
	public $orgList = array();
	public $adminId = 0;
	public $adminName = "";
    public $orgId = 0;
	/**
	 * controller + action 需要的权限，所有key全部小写
	 * @var unknown
	 */
	private $actionAuth = array(
//            "admin"=>array(
//                'addroleajax'=>array(AuthIdentity::AUTH_ROLE_CREATE),
//                'addorgajax'=>array(AuthIdentity::AUTH_ORG_CREATE),
//                'updateorginfo'=>array(AuthIdentity::AUTH_ORG_EDIT),
//                'addroleajax'=>array(AuthIdentity::AUTH_ROLE_CREATE),
//                'updateroleinfoajax'=>array(AuthIdentity::AUTH_ROLE_EDIT),
//                'bindroleauthajax'=>array(AuthIdentity::AUTH_ROLE_AUTH_ALLOC),
//                'adduserajax'=>array(AuthIdentity::AUTH_ADMIN_CREATE),
//                'updatepasswordajax'=>array(AuthIdentity::AUTH_ADMIN_RESET_PWD),
//                'binduserorgajax'=>array(AuthIdentity::AUTH_ADMIN_ALLOC_ORG),
//                'deleteadminajax'=>array(AuthIdentity::AUTH_ADMIN_DELETE),
//                'updateadmininfoajax'=>array(AuthIdentity::AUTH_ADMIN_EDIT),
//            ),
//            "cmsevent"=>array(
//            ),
//            "cmslegalservice"=>array(
//            ),
//            "cmsmainevent"=>array(
//            ),
//            "cmsnews"=>array(
//            ),
//            "cmsvote"=>array(
//            ),
//            "legalman"=>array(
//                'getlegalverifyinfo'=>array(AuthIdentity::AUTH_WATCH_AUTH_ATTACHMENT),
//                'verifylegalauthinfo'=>array(AuthIdentity::AUTH_LAWYER_VERIFY)
//            ),
//            "pointsaction"=>array(
//                'setconfig'=>array(AuthIdentity::AUTH_POINTS_RULE)
//            ),
//            "realuser"=>array(
//                'realuserinfo'=>array(AuthIdentity::AUTH_REALNAME_WATCH_ID_CARD),
//                'verifyrealuser'=>array(AuthIdentity::AUTH_REALNAME_VERIFY),
//            ),
	);
	
	
	/**
	 * 框架在类初始化之后调用的函数(non-PHPdoc)
	 * @see CController::init()
	 */
	public function init(){
		@session_start();
		$this->allowAjaxDomain();
		if(trim(strtolower(Yii::app()->getRequest()->getPathInfo()),"/") == strtolower("boss/login")){
			return true;
		}
		
		if(!AdminModel::isUserLogIn()){
			$this->redirectLogIn();
		}
		
		$this->isSuper = AdminModel::isSuper();
		$fullInfo = AdminModel::getLogInUserFullInfo();
		$this->adminId = $fullInfo[AdminModel::SESSION_KEY_USER]['id'];
		$this->adminName = $fullInfo[AdminModel::SESSION_KEY_USER]['loginName'];
		$this->role = $fullInfo[AdminModel::SESSION_KEY_ROLE];
		$this->orgList = $fullInfo[AdminModel::SESSION_KEY_ORG];
        $this->orgId = $fullInfo[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG];
		return true;
	}
	
	public function filters()
	{
	    return array('checkTest');
	}
	
	public function filtercheckTest($filterChain){
	    $controller = strtolower($this->getId());
	    $action = strtolower($this->getAction()->id);
	    if($this->isSuper){
	        return $filterChain->run();
	    }
	    if(isset($this->actionAuth[$controller]) && isset($this->actionAuth[$controller][$action])){
	        if(!empty($this->role)){
	            foreach ($this->actionAuth[$controller][$action] as $item){
	                if(!in_array($item, $this->role['auth'])){
	                    $this->renderAjaxResponse($this->getAjaxResponse(false, "no auth", ErrorCode::ERROR_NO_AUTH, array()));
	                    return false;
	                }
	            }
	        }else{
	            //TODO  这个地方需要处理
	            //$this->renderAjaxResponse($this->getAjaxResponse(false, "no auth", ErrorCode::ERROR_NO_AUTH, array()));
	            return ;
	        }
	    }
	    return $filterChain->run();
	}
	
	/**
	 * 跳到登陆页面
	 */
	public function redirectLogIn(){
        $this->renderAjaxResponse($this->getAjaxResponse(false, "user not login", ErrorCode::ERROR_USER_NOT_LOGIN, array()));
		Yii::app()->end();
	}
	
	/**
	 * 模板（正确）
	 */
	public function success($message,$url=''){
		$this->response['message'] = $message;
		$this->response['url'] = $url;
		$this->render('/public/jump',$this->response);
	}
	/**
	 * 模板（错误）
	 */
	public function error($message,$url=''){
		$this->response['success'] = 'false';
		$this->response['message'] = $message;
		$this->response['url'] = $url;
		$this->render('/public/jump',$this->response);
	}
}