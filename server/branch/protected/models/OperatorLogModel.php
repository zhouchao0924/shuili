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

    public function getLog($page,$limit=20){
        $totalCount = WpOperatorLogDao::getInstance("WpOperatorLog")->select("count(*) as cnt",array(),array(),false);
        $result = array(
            "totalCount"=>$totalCount['cnt'],
            "totalPage"=>ceil($totalCount['cnt']/$limit),
            "curPage"=>$page,
            "pageSize"=>$limit,
            "list"=>array()
        );
        $start = ($page - 1)*$limit;
        if($totalCount['cnt'] < $start){
            return $result;
        }
        $data = WpOperatorLogDao::getInstance("WpOperatorLog")->select("*",array(),array(),true,"id desc",'',$start,$limit);

        foreach ($data as $row){
            $result['list'][] = array(
                'userName'=>$row['user_name'],
                'desc'=>$row['desc'],
                'createTime'=>$row['create_time'],
            );
        }
        return $result;
    }
}