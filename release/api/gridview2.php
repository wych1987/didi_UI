<?php
$index = $_GET["pageIndex"];

$data=array();
for($i =20;$i>0;$i--){
    $data[]=array("product2"=>"张三".rand(10,100),"date2"=>rand(100,1000),"boci2"=>rand(100,1000),"new_user2"=>rand(1000,10000),"new_user_money2"=>rand(1000,10000),"sum_new_use2"=>rand(1000,10000),"sum_new_money2"=>rand(1000,10000));

}
$serverData = array("pageIndex"=>$index,"total_num"=>21,"data"=>$data);
echo json_encode($serverData);
?>