<?php
/**
 * 基础model类
 * @copyright (C) 2006-2017 Tuniu All rights reserved
 * @author yulongfei
 * @date 2017-04-02
 */

class BaseModel{

    private static $INSTANCE;

    public function __construct() {

    }

    /**
     * 对象单例
     * @return $this
     */
    public static function getInstance(){
        $className = get_called_class();
        if(!(self::$INSTANCE[$className] instanceof self)){
            self::$INSTANCE[$className] = new $className();
        }
        return self::$INSTANCE[$className];
    }



}