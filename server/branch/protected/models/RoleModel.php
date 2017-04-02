<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/3/27
 * Time: 21:31
 */
class RoleModel {
    CONST ROLE_COMMON = 0;
    CONST ROLE_ADMIN = 1;


    public static function isRightRole($roleId){
        if ($roleId == 0 || $roleId == 1){
            return true;
        }
        return false;
    }
}