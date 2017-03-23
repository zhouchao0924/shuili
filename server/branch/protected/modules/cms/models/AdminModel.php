<?php
use Qiniu\json_decode;
/**
 * 管理-权限模块
 * @author lzm
 *
 */
class AdminModel {
    CONST SESSION_KEY_USER = "user";
    CONST SESSION_KEY_IS_SUPER = "isSuper";
    CONST SESSION_KEY_ROLE = "role";
    CONST SESSION_KEY_ORG = "orgList";
    CONST SESSION_KEY_USER_CURRENT_MANAGER_ORG = "curMagOrg";
    
    CONST SUPER_USER_FLAG = 1;
    
    /**
     * 生成对应的session 信息
     */
    public function createSession($key, $value){
        $_SESSION[$key] = $value;
    }
    
    /**
     * 获取登录用户id
     * @return number
     */
    public static function getLogInUserId(){
        if(isset($_SESSION[AdminModel::SESSION_KEY_USER]) && !empty($_SESSION[AdminModel::SESSION_KEY_USER])){
            return $_SESSION[AdminModel::SESSION_KEY_USER]['id'];
        }
        return 0;
    }
    
    /**
     * 获取登录用户id
     * @return number
     */
    public static function setCurrentManagerOrg($orgId){
        $_SESSION[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG] = $orgId;
    }
    
    /**
     * 用户是否登录
     * @return boolean
     */
    public static function isUserLogIn(){
        if(isset($_SESSION[AdminModel::SESSION_KEY_USER]) && !empty($_SESSION[AdminModel::SESSION_KEY_USER])){
            return true;
        }
        return false;
    }
    /**
     * 检查org是否是登录管理员管理的部分
     * @param unknown $orgId
     * @return boolean
     */
    public static function isUserManagerOrg($orgId){
        $userManagerOrgList = AdminModel::getUserSessionDataByKey(AdminModel::SESSION_KEY_ORG, array());
        if(empty($userManagerOrgList)){
            return false;
        }
        foreach ($userManagerOrgList as $item){
            if($item == $orgId){
                return true;
            }
        }
        return false;
    }
    
    /**
     * 获取session信息根据key
     * @param string $key
     * @param unknown $default
     * @return unknown
     */
    public static function getUserSessionDataByKey($key, $default){
        if(isset($_SESSION[$key])){
            return $_SESSION[$key];
        }
        return $default;
    }
    
    /**
     * 是否超级用户
     * @return boolean
     */
    public static function isSuper(){
        if(isset($_SESSION[AdminModel::SESSION_KEY_IS_SUPER]) && $_SESSION[AdminModel::SESSION_KEY_IS_SUPER] == AdminModel::SUPER_USER_FLAG){
            return true;
        }
        return false;
    }
    
    /**
     * 获取登录用户全部信息
     * @return multitype:Ambigous <boolean, string> Ambigous <multitype:, string>
     */
    public static function getLogInUserFullInfo(){
        return array(
                AdminModel::SESSION_KEY_USER=>isset($_SESSION[AdminModel::SESSION_KEY_USER])?$_SESSION[AdminModel::SESSION_KEY_USER]:ARRAY(),
                AdminModel::SESSION_KEY_IS_SUPER=>isset($_SESSION[AdminModel::SESSION_KEY_IS_SUPER])?$_SESSION[AdminModel::SESSION_KEY_USER]:FALSE,
                AdminModel::SESSION_KEY_ROLE=>isset($_SESSION[AdminModel::SESSION_KEY_ROLE])?$_SESSION[AdminModel::SESSION_KEY_ROLE]:ARRAY(),
                AdminModel::SESSION_KEY_ORG=>isset($_SESSION[AdminModel::SESSION_KEY_ORG])?$_SESSION[AdminModel::SESSION_KEY_ORG]:ARRAY(),
                AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG=>isset($_SESSION[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG])?$_SESSION[AdminModel::SESSION_KEY_USER_CURRENT_MANAGER_ORG]:0,
                
        );
    }
    
    /**
     * 登录
     * @param unknown $userName
     * @param unknown $password
     */
    public function doLogIn($userName,$password){
        $userInfo = $this->getUserByNamePwd($userName, $password);
        if(empty($userInfo)){
            return false;
        }
        
        $this->createSession(AdminModel::SESSION_KEY_USER, $userInfo);
        $this->createSession(AdminModel::SESSION_KEY_IS_SUPER, $userInfo['isSuper']);
        if($userInfo['isSuper'] != AdminModel::SUPER_USER_FLAG){
            $roleInfo = $this->getRoleInfoByRoleId($userInfo['roleId']);
            $this->createSession(AdminModel::SESSION_KEY_ROLE, $roleInfo);
        }
        
        $orgIdList = !empty($userInfo['orgList'])?json_decode($userInfo['orgList']):array();
        $this->createSession(AdminModel::SESSION_KEY_ORG, $orgIdList);
        
        return true;
    }
    
    public function doLogOut(){
        @session_destroy();
    }
    
    /**
     * 检查角色是否存在
     * @param string $roleName
     */
    public function isRoleExist($roleName){
        $conditions = array(
                "and",
                "role_name=:roleName",
                "del_flag=0"
        );
        $params = array(
                ":roleName"=>$roleName
        );
        $tjwCmsUserRoleDao = TjwCmsUserRoleDao::getInstance("TjwCmsUserRole");
        $data = $tjwCmsUserRoleDao->select("count(*) as cnt", $conditions, $params);
        if(isset($data['cnt']) && $data['cnt'] > 0){
            return true;
        }
        return false;
    }
    
    /**
     * 创建角色
     */
    public function createRole($params,$adminInfo){
        if($this->isRoleExist($params['roleName'])){
            return array();
        }
        $tjwCmsUserRoleDao = TjwCmsUserRoleDao::getInstance("TjwCmsUserRole");
        $cols = array(
                "role_name"=>$params['roleName'],
                "desc"=>$params['desc'],
                "create_time"=>date("Y-m-d H:i:s"),
                "add_user_name"=>$adminInfo['name'],
                "add_user_id"=>$adminInfo['id']
        );
        $id = $tjwCmsUserRoleDao->baseInsert($cols);
        return array("roleId"=>$id, "roleName"=>$params['roleName']);
    }
    
    /**
     * 获取角色列表
     */
    public function getRoleList(){
        $list = array();
        $conditions = array(
                "and",
                "del_flag=0"
        );
        $tjwCmsUserRoleDao = TjwCmsUserRoleDao::getInstance("TjwCmsUserRole");
        $data = $tjwCmsUserRoleDao->select("*", $conditions, array(),true,"id desc");
        foreach ($data as $row){
            $list[] = array(
                    "roleId"=>$row["id"],
                    "roleName"=>$row["role_name"],
                    "desc"=>$row["desc"],
                    "adminName"=>$row["add_user_name"],
                    "createTime"=>$row["create_time"],
            );
        }
        return $list;
    }
    
    /**
     * 根据角色id获取信心
     * @param int $roleId
     */
    public function getRoleInfoByRoleId($roleId){
        $roleInfo = array();
        $conditions = array(
                "and",
                "id=:id",
                "del_flag=0"
        );
        $params = array(
                ":id"=>$roleId
        );
        $tjwCmsUserRoleDao = TjwCmsUserRoleDao::getInstance("TjwCmsUserRole");
        $data = $tjwCmsUserRoleDao->select("*", $conditions, $params,false,"","",0,1);
        if(empty($data)){
            return $roleInfo;
        }
        $roleInfo["roleId"] = $data['id'];
        $roleInfo["roleName"] = $data['role_name'];
        $roleInfo['auth'] = empty($data['auth'])?array():json_decode($data['auth'],true);
        return $roleInfo;
    }
    /**
     * 更新角色权限信息
     * @param int $roleId
     * @param array $auth
     */
    public function upateRoleAuth($roleId, $auth){
        $roleInfo = $this->getRoleInfoByRoleId($roleId);
        if(empty($roleInfo)){
            return false;
        }
        $columns = array(
                "auth"=>json_encode($auth),
        );
        
        $conditions = array(
                'and',
                "id=:id",
        );
        $params = array(
                ":id"=>$roleId,
        );
        $roleDao = TjwCmsUserRoleDao::getInstance("TjwCmsUserRole");
        $roleDao->update($columns,$conditions,$params);
        return true;
    }

    public function getRoleAuth($roleId){
        $roleInfo = $this->getRoleInfoByRoleId($roleId);
        if(empty($roleInfo)){
            return array();
        }
        return $roleInfo;
    }

    /**
     * 根据登录名获取数据
     * @param string $loginName
     */
    public function getUserByNamePwd($loginName,$pwd){
        $conditions = array(
                "and",
                "login_name=:loginName",
                "password=:password"
        );
        $params = array(
                ":loginName"=>$loginName,
                ":password"=>$this->convertPassword($pwd),
        );
        $cmsUserDao = TjwCmsUserDao::getInstance("TjwCmsUser");
        $data = $cmsUserDao->select("*", $conditions, $params,false,"","",0,1);
        
        if(empty($data)){
            return array();
        }
        return $this->_userDb2ProgramArray($data);
    }
    
    private function _userDb2ProgramArray($userInfo){
        return array(
                "id" => $userInfo['id'],
                "loginName"=>$userInfo['login_name'],
                "realName"=>$userInfo['real_name'],
                "roleId"=>$userInfo['role_id'],
                "firstLogin"=>$userInfo['first_login'],
                "isSuper"=>$userInfo['is_super'],
                "orgList"=>$userInfo['org_list'],
                "createUserName"=>$userInfo['create_user_name'],
                "createUserId"=>$userInfo['create_user_id'],
                "createTime"=>$userInfo['create_time']
        );
    }
    
    /**
     * 根据登录名获取数据
     * @param string $loginName
     */
    public function getUserByLoginName($loginName){
        $conditions = array(
                "and",
                "login_name=:loginName"
        );
        $params = array(
                ":loginName"=>$loginName,
        );
        $cmsUserDao = TjwCmsUserDao::getInstance("TjwCmsUser");
        $data = $cmsUserDao->select("*", $conditions, $params,false,"","",0,1);
        if(empty($data)){
            return array();
        }
        return $this->_userDb2ProgramArray($data);
    }
    /**
     * 根据登录名检查用户是否已经存在
     * @param string $loginName
     */
    public function isUserExistByLoginName($loginName, $adminId=0){
        $userInfo = $this->getUserByLoginName($loginName);
        if(empty($userInfo)){
            return false;
        }
        if($adminId != 0 && $userInfo['id'] == $adminId){
            return false;
        }
        return true;
    }
    
    /**
     * 加密密码
     * @param unknown $password
     */
    private function convertPassword($password){
        return md5($password);
    }
    
    /**
     * 添加管理员
     */
    public function addAdmin($params){
        if($this->isUserExistByLoginName($params['loginName'])){
            return false;
        }
        $roleInfo = $this->getRoleInfoByRoleId($params['roleId']);
        if(empty($roleInfo)){
            return false;
        }
        $cols = array(
                "login_name"=>$params['loginName'],
                "real_name"=>$params['realName'],
                "password"=>$this->convertPassword($params['password']),
                "role_id"=>$params['roleId'],
                "create_time"=>date("Y-m-d H:i:s"),
                "create_user_id"=>$params['createUserId'],
                "create_user_name"=>$params['createUserName']
        );
        $cmsUserDao = TjwCmsUserDao::getInstance("TjwCmsUser");
        $cmsUserDao->baseInsert($cols);
        return true;
    }
    
    /**
     * 修改密码
     * @param int $userId
     * @param string $password
     */
    public function updatePassword($adminId, $password){
        $columns = array(
                "password"=>$this->convertPassword($password),
        );
        $conditions = array(
                "and",
                "id=:id",
        );
        $params = array(
                ":id"=>$adminId
        );
        $cmsUserDao = TjwCmsUserDao::getInstance("TjwCmsUser");
        $cmsUserDao->update($columns,$conditions,$params);
        return ;
    }
    
    /**
     * 用户绑定机构
     * @param int $userId
     * @param string $password
     */
    public function bindOrg($userId, $orgIdList){
        $columns = array(
                "org_list"=>json_encode($orgIdList),
        );
        $conditions = array(
                "and",
                "id=:id",
        );
        $params = array(
                ":id"=>$userId
        );
        $cmsUserDao = TjwCmsUserDao::getInstance("TjwCmsUser");
        $cmsUserDao->update($columns,$conditions,$params);
        return ;
    }
    
    /**
     * 搜索用户
     * @param unknown $userName
     * @param string $isLike
     * @param number $limit
     */
    public function searchUsers($userName, $isLike=false, $limit=5){
        $conditions = array();
        $params = array();
        $conditions[] = "and";
        if(!empty($userName)){
            $conditions[] = $isLike?array("like","login_name",array("%".$userName."%")):"name=:name";
            $params[":name"] = $userName;
        }
        $conditions[] = "del_flag=0";
        $orgDao = TjwCmsUserDao::getInstance("TjwCmsUser");
        $data = $orgDao->select("*", $conditions,$params,true,'','',0,$limit);
        $list = array();
        foreach ($data as $row){
            if($row['login_name'] == "system" || $row['is_super'] == 1){
                continue;
            }
            $list[] = $this->_userDb2ProgramArray($row);
        }
        return $list;
    }

    /**
     * 根据角色id获取信心
     * @param int $roleId
     */
    public function updateRoleInfo($roleId,$name,$desc,$adminInfo){
        $cols = array(
            "role_name"=>$name,
            "desc"=>$desc,
            "add_user_name"=>$adminInfo['name'],
            "add_user_id"=>$adminInfo['id']
        );
        $conditions = array(
            "and",
            "id=:id",
            "del_flag=0"
        );
        $params = array(
            ":id"=>$roleId
        );
        $tjwCmsUserRoleDao = TjwCmsUserRoleDao::getInstance("TjwCmsUserRole");
        $tjwCmsUserRoleDao->update($cols,$conditions,$params);
        return ;
    }

    /**
     * 更新管理员
     */
    public function updateAdmin($params){
        $adminInfo = $this->getUserByUserId($params['userId']);
        if(empty($adminInfo)){
            return false;
        }
        if($this->isUserExistByLoginName($params['loginName'],$params['userId'])){
            return false;
        }
        $roleInfo = $this->getRoleInfoByRoleId($params['roleId']);
        if(empty($roleInfo)){
            return false;
        }
        $update = array(
            "login_name"=>$params['loginName'],
            "real_name"=>$params['realName'],
            "password"=>$this->convertPassword($params['password']),
            "role_id"=>$params['roleId'],
            "create_user_id"=>$params['createUserId'],
            "create_user_name"=>$params['createUserName']
        );
        $conditions = array(
            "and",
            "id=".$params['userId']
        );
        $cmsUserDao = TjwCmsUserDao::getInstance("TjwCmsUser");
        $cmsUserDao->update($update,$conditions);
        return true;
    }

    /**
     * 根据登录名获取数据
     * @param string $loginName
     */
    public function getUserByUserId($userId){
        $conditions = array(
            "and",
            "id=".$userId
        );

        $cmsUserDao = TjwCmsUserDao::getInstance("TjwCmsUser");
        $data = $cmsUserDao->select("*", $conditions, array(),false,"","",0,1);

        if(empty($data)){
            return array();
        }
        return $this->_userDb2ProgramArray($data);
    }

    public function deleteAdmin($userId){
        $info = $this->getUserByUserId($userId);
        if(empty($info) || $info['isSuper']){
            return false;
        }
        $update = array(
            "del_flag"=>1,
        );
        $conditions = array(
            "and",
            "id=".$userId
        );
        $cmsUserDao = TjwCmsUserDao::getInstance("TjwCmsUser");
        $cmsUserDao->update($update,$conditions);
    }
}