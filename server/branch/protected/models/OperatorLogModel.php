<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/2
 * Time: 13:08
 */
class OperatorLogModel {
    public static function addLog($userId,$userName,$desc){
        $cols = array(
            'user_id'=>$userId,
            'user_name'=>$userName,
            'create_time'=>date("Y-m-d H:i:s"),
            'desc'=>$desc,
        );
        WpOperatorLogDao::getInstance("WpOperatorLog")->baseInsert($cols);
    }
}