<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/3/27
 * Time: 21:07
 */
class WpUserDao extends Dao{
    public function getTableName()
    {
        return "wp_user";
    }
}