<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
$tmpRuntimeDir = '/tmp/runtime';
if(!file_exists($tmpRuntimeDir)){
    mkdir($tmpRuntimeDir,0777,true);
}
return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'runtimePath'=>$tmpRuntimeDir,
	'name'=>'Web Application',

	// preloading 'log' component
	'preload'=>array('log'),

	// autoloading model and component classes
	'import'=>array(
		'application.models.*',
		'application.components.*',
		'application.dal.dao.*',
		'application.dal.iao.*',
        'application.models.excel.*',
	),

	'modules'=>array(
		// uncomment the following to enable the Gii tool
		/*
		'gii'=>array(
			'class'=>'system.gii.GiiModule',
			'password'=>'Enter Your Password Here',
			// If removed, Gii defaults to localhost only. Edit carefully to taste.
			'ipFilters'=>array('127.0.0.1','::1'),
		),
		*/
	),

	// application components
	'components'=>array(
		// uncomment the following to enable URLs in path-format

		'urlManager'=>array(
			'urlFormat'=>'path',
			'showScriptName'=>false,
			'rules'=>array(
// 				'<controller:\w+>/<id:\d+>'=>'<controller>/view',
// 				'<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
// 				'<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
                'city/list/<proviceId:\d+>'=>'area/getCityListAjax',
                'district/list/<cityId:\d+>'=>'area/getDistrictListAjax',
                'province/list'=>'area/getProvinceListAjax',
                'street/list/<districtId:\d+>'=>'area/GetStreatListAjax',
                'attachment/exportExample/<excelType:\d+>'=>'attachment/exportExample',
			),
		),
		// uncomment the following to use a MySQL database
		'db'=>array(
            'connectionString' => 'mysql:host=139.199.27.165;port=3306;dbname=sl',
            'emulatePrepare' => true,
            'username' => 'mysql',
            'password' => 'shuili@1999',
            'charset' => 'utf8',
//            'enableProfiling'=>true, //分析sql语句
            'enableParamLogging'=>true, //日志中显示每次传参的参数
		),

		'cache'=>array(
			'class' => 'CMemCache',
			'servers'=>array(
				array('host'=>'127.0.0.1','port'=>11211,'weight'=>100),
			),
		),

		'errorHandler'=>array(
			// use 'site/error' action to display errors
			'errorAction'=>'site/error',
		),
		'log'=>array(
			'class'=>'CLogRouter',
			'routes'=>array(
				array(
					'class'=>'CFileLogRoute',
					'levels'=>'error, warning',
				),
                array(
                    'class'=>'CFileLogRoute',
                    'levels'=>'info',
                    'categories'=>'m.wx.*',
                    'logFile'=>'wx.log',
                    'maxFileSize'=>102400000,
                ),
                array(
                    'class'=>'CFileLogRoute',
                    'levels'=>'info,error,warning',
                    'categories'=>'m.excel.*',
                    'logFile'=>'excel.log',
                    'maxFileSize'=>102400000,
                ),
//                array(
//                    //'class'=>'CFileLogRoute',
//                    'class'=>'ext.yii-debug-toolbar.YiiDebugToolbarRoute',
//                    'levels'=>'error, warning',
//                ),
				// uncomment the following to show log messages on web pages
				/*
				array(
					'class'=>'CWebLogRoute',
				),
				*/
			),
		),
	),

	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params'=>array(
		// this is used in contact page
		'js'=>array('path'=>"{HOST}/js/{FILE}?v={VERSION}"),
		'css'=>array('path'=>'{HOST}/css/{FILE}?v={VERSION}'),
		'images'=>array('path'=>'{HOST}/images/{FILE}?v={VERSION}'),
		'baiduIpLocation'=>'http://api.map.baidu.com/location/ip',
		'baiduGeoLocation'=>'http://api.map.baidu.com/geocoder/v2/',

		'imageThumb'=>array(
			'80x80'=>array('80x80','fit')
		),

	   'qiniu'=>array(
	            'accessKey'=>'mxbdgu_LTMTwQfdL5An47bIokSv8Wl6WMLbeYgKf',
	            'secretKey'=>'qKqgyIkicIbsFNrqSBTdgW3hQat1jvkbZozLHxXW',
                'bucket' => array(
                    'public'=>array(
                       'bucket'=>'privateuser',
                       'baseUrl'=>'http://onrnzg8zq.bkt.clouddn.com',
                       'host'=> 'onrnzg8zq.bkt.clouddn.com',
                       'isPublic'=>false,
                    ),
                )
		  ),
	),
);
