<?php
$config = CMap::mergeArray(
    require(dirname(__FILE__) . '/main.php'),
    array(
        'components' => array(
            'log' => array(
                'class' => 'CLogRouter',
                'routes' => array(
                    array(
                        'class' => 'CFileLogRoute',
                        'levels' => 'error, warning, info',
                        'logFile' => 'console.log'
                    ),
                ),
            ),
        ),
    )
);

return $config;