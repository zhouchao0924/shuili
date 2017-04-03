<?php
/**
 * 用户
 * @author lzm
 *
 */
class TestController extends Controller {
    public function actionT(){
        $csv = new CsvTemplateModel(new TestCsvTemplateConfig());
        $array = array(
            array(
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9",
            ),
            array(
                "11'",
                "21",
                "31",
                "41",
                "51",
                "61",
                "71",
                "81",
                "91",
            ),
        );
        echo "<pre>";
        $data = $csv->data2Db($array);
        print_r($data);
    }

    public function actionX(){
        $csv = new CsvTemplateModel(new TestCsvTemplateConfig());
        $data = $csv->queryRecords(1,1,"222");
        echo "<pre>";
        print_r($data);
    }
}
