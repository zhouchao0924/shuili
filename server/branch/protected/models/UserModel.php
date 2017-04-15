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
            return array();
        }

        $clientComponent = new ClientComponent();
        $clientComponent->setUserInfo($user);

        return $user;
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

    private function formatManageArea($list){
        if(empty($list)){
            return array();
        }
        $area = array();

        foreach ($list as $row){
            if(!isset($area[$row['district_id']])){
                $area[$row['district_id']] = array(
                    'id'=>$row['district_id'],
                    'name'=>$row['district_name'],
                    'list'=>array(),
                );
            }
            $area[$row['district_id']]['list'][] = array(
                'id'=>$row['street_id'],
                'name'=>$row['street_name'],
            );
        }
        return $area;
    }

    public function getManageArea($userId){
        $conditions = array(
            "and",
            "user_id=:userId",
            "del_flag=0",
        );
        $params = array(
            ":userId"=>$userId,
        );

        $list = WpUserManageAreaDao::getInstance("WpUserManageArea")->select("*",$conditions,$params,true,"id desc");

        return $this->formatManageArea($list);
    }

    public function getUserById($userId){
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

    public function getUserTotal(){
        $conditions = array(
            "and",
            "role_id != 2",
            "del_flag = 0",
        );
        $params = array(
        );

        $data = WpUserDao::getInstance("WpUser")->select("count(1) as c",$conditions,$params,false);
        return $data['c'];
    }

    public function getUserList($page,$pageSize){

        $limit = ($page-1) * $pageSize;
        $limit = $limit > 0 ? $limit : 0;
        $conditions = array(
            "and",
            "role_id != 2",
            "del_flag = 0",
        );
        $params = array(
        );

        $data = WpUserDao::getInstance("WpUser")->select("*",$conditions,$params,true,'',$limit,$pageSize);
        if(empty($data)){
            return array();
        }
        $returnArray = array();
        foreach($data as $key => $val){
            $returnArray[] = array(
                'id' => $val['id'],
                'name' => $val['name'],
                'createTime' => $val['create_time'],
                'roleId' => $val['role_id'],
                'desc' => $val['desc'],
            );
        }
        return $returnArray;
    }

    public function isUserManageArea($userId,$streetId){
        $conditions = array(
            "and",
            "user_id = :userId",
            "del_flag = 0",
            "street_id = :streetId",
        );
        $params = array(
            ":userId"=>$userId,
            ":streetId"=>$streetId,
        );

        $data = WpUserManageAreaDao::getInstance("WpUserManageArea")->select("*",$conditions,$params,false);
        if(empty($data)){
            return false;
        }
        return true;
    }

    public function updateUserManageArea($areaList,$userId,$streetList,$opUid,$opUname){
        $conditions = array(
            "and",
            "user_id=:userId",
        );
        $params = array(
            ":userId"=>$userId,
        );
        $cols = array(
            "del_flag"=>1
        );
        $dao = WpUserManageAreaDao::getInstance("WpUserManageArea");
        $dao->update($cols,$conditions,$params);

        foreach ($areaList as $id){
            $cols = array(
                'province_name'=>'浙江省',
                'province_id'=>OpenCity::PROVINCE_ID,
                'city_name'=>'宁波市',
                'city_id'=>OpenCity::CITY_ID,
                'district_name' =>'余姚市',
                'district_id' =>OpenCity::DISTRICT_ID,
                'street_name' =>$streetList[$id]['name'],
                'street_id' =>$id,
                'user_id' =>$userId,
                'operator_user_id'=>$opUid,
                'operator_user_name'=>$opUname,
                'create_time' =>date("Y-m-d H:i:s"),
            );
            $dao->baseInsert($cols);
        }
    }

    public function updateUser($userId,$name,$password,$roleId,$desc){
        $cols = array(
            "name"=>$name,
            "password"=>$this->genPassword($password),
            "desc"=>$desc,
            "role_id"=>$roleId,
        );
        $conditions = array(
            "and",
            "id=:id",
            "del_flag=0",
        );
        $params = array(
            "id"=>$userId,
        );
        $this->getUserDao()->update($cols,$conditions,$params);
    }

    public function deleteUser($userId){
        $cols = array(
            "del_flag"=>1,
        );
        $conditions = array(
            "and",
            "id=:id",
            "del_flag=0",
        );
        $params = array(
            "id"=>$userId,
        );
        $this->getUserDao()->update($cols,$conditions,$params);
    }
}