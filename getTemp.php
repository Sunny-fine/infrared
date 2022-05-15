<?php
 $d = json_decode(file_get_contents('php://input'), true);
 #var_dump($d["x"]);
 #if (!file_exists('/tmp/temp1.csv') {
 #  shell_exec('cp ./temp1.csv /tmp/');
 #}
 #$spl = new SplFileObject('temp1.csv');
 $spl = new SplFileObject('FLIR_9.csv');
 $spl->seek($d["y"]*480+$d["x"]+1);
 $csv = explode(",",$spl->current());
 print_r("X: ".$csv[1].", "."Y: ".$csv[0].", "."T: ".$csv[2]); 
 #echo strval($data->x).' '.strval($data->y);
 #print("=$data->x=\n");
 #phpinfo();
 #echo 'Hello, World!';
?>
