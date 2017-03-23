<?php
/**
 * 通用组件
 * @author lzm
 *
 */
//Yii::import("application.extensions.qiniu.autoload",true);
class PrivateQiniuIao extends AbstractQiniuIao{
    protected function getConfig(){
        return 'private';
    }
}