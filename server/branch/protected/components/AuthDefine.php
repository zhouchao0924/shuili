<?php
/**
 * Created by PhpStorm.
 * User: lzm
 * Date: 17/4/4
 * Time: 19:43
 */
class AuthDefine {
    CONST AUTH_NORMAL = 0;//普通用户
    CONST AUTH_ADMIN = 1;//管理员
    CONST AUTH_SUPER = 2;//超级管理员

    public static function isAuthRoleId($roleId){
        if($roleId >= self::AUTH_NORMAL || $roleId <= self::AUTH_SUPER){
            return true;
        }

        return false;
    }

    /**
     * 通用导航页
     * @var array
     */
    private static $commonLink = array(
        array(
            "name"=>"水利信息",
		    "childrenList"=>array(
		        array(
                    "name"=>"基本情况",
                    "url"=>"#/BasicInformation",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"地理信息",
                    "url"=>"#/GEOInfo",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"水库山塘",
                    "url"=>"#/Reservoir",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"河道",
                    "url"=>"#/River",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"水闸",
                    "url"=>"#/Lock",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"泵站",
                    "url"=>"#/PumpStation",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"河长制",
                    "url"=>"#/LongRiverSystem",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"山洪灾害",
                    "url"=>"#/MountainTorrentDisaster",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"农民饮用水",
                    "url"=>"#/DrinkingWater",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"农田水利",
                    "url"=>"#/Irrigation",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"档案页",
                    "url"=>"#/Archive",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"视频监控",
                    "url"=>"#/VideoMonitoring",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"实时水位",
                    "url"=>"#/WaterLevel",
                    "childrenList"=>array(),
                ),
                array(
                    "name"=>"雨情",
                    "url"=>"#/RainfallRegime",
                    "childrenList"=>array(),
                )
            )
        ),
    );

    private static $userAuthLink = array(
        array(
            "name"=>"账户信息",
            "childrenList"=>array(
                array(
                    "name"=>"账户管理",
                    "url"=>"#/AccountManagement",
                    "childrenList"=>array(),
                ),
            )
        ),
    );

    private static $baseInfoLink = array(
        array(
            "name"=>"基本情况",
            "childrenList"=>array(
                array(
                    "name"=>"账户管理",
                    "url"=>"#/InformationManagement",
                    "childrenList"=>array(),
                ),
            )
        ),
    );

    private static $articleInfoLink = array(
        array(
            "name"=>"档案信息",
            "childrenList"=>array(
                array(
                    "name"=>"账户管理",
                    "url"=>"#/FileInformationManagement",
                    "childrenList"=>array(),
                ),
            )
        ),
    );

    public static function genTreeLinkIndex($role){
        if($role < AuthDefine::AUTH_NORMAL){
            return array();
        }
        if($role == AuthDefine::AUTH_NORMAL){
            return AuthDefine::$commonLink;
        }else{
            $tree = array();

            foreach (AuthDefine::$commonLink as $value){
                $tree[] = $value;
            }
            foreach (AuthDefine::$userAuthLink as $value){
                $tree[] = $value;
            }
            foreach (AuthDefine::$baseInfoLink as $value){
                $tree[] = $value;
            }
            foreach (AuthDefine::$articleInfoLink as $value){
                $tree[] = $value;
            }
            return $tree;
        }
    }
}