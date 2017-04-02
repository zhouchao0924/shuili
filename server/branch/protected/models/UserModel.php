<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/3/27
 * Time: 21:07
 */
class UserModel {
    private $userDao = null;
    private function getUserDao(){
        if($this->userDao == null){
            $this->userDao = WpUserDao::getInstance("wp_user");
        }

        return $this->userDao;
    }

    private function genPassword($password){
        return md5($password);
    }

    public function addUser($name,$password,$roleId,$desc){
        $userInfo = $this->getUserByName($name);
        if(!empty($userInfo)){
            return ErrorCode::ERROR_USER_NAME_EXIST;
        }
        $cols = array(
            "name"=>$name,
            "password"=>$this->genPassword($password),
            "desc"=>$desc,
            "role_id"=>$roleId,
        );
        $this->getUserDao()->baseInsert($cols);
        return ErrorCode::SUCCESS;
    }

    private function getUserByName($name){
        $conditions = array(
            "and",
            "name = :name",
            "del_flag = 0",
        );
        $params = array(
            ":name"=>$name
        );

        return $this->getUserDao()->select("*",$conditions,$params,false);
    }

    public function doLogin($name,$password){
        $user = $this->getUserByName($name);
        if(empty($user) || $user['password'] != $this->genPassword($password)){
            return ErrorCode::ERROR_LOGIN_FAILED;
        }

        $clientComponent = new ClientComponent();
        $clientComponent->setUserInfo($user);

        return ErrorCode::SUCCESS;
    }

    public function resetPassword($userId, $password){
        $cols = array(
            "password"=>$this->genPassword($password),
        );
        $conditions = array(
            "and",
            "id=:id",
        );
        $params = array(
            ":id"=>$userId
        );

        $this->getUserDao()->update($cols,$conditions,$params);
    }

    public function getAdminManageDistrict($userId){
        $conditions = array(
            "and",
            "admin_id=:adminId",
            "del_flag=0",
        );
        $params = array(
            ":adminId"=>$userId,
        );

        $list = WpAdminAreaDao::getInstance("WpAdminArea")->select("*",$conditions,$params,true,"id desc");
        
    }

    private function getUserById($userId){
        $conditions = array(
            "and",
            "id = :id",
            "del_flag = 0",
        );
        $params = array(
            ":id"=>$userId
        );

        return $this->getUserDao()->select("*",$conditions,$params,false);
    }

    public function isCommonAdmin($userId){
        $userInfo = $this->getUserById($userId);
        if(empty($userInfo) || $userInfo['admin'] == 1){
            return false;
        }
        return true;
    }
}