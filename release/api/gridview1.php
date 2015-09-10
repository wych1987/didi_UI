<?php
$index = $_GET["pageIndex"];

$data=array();
for($i =20;$i>0;$i--){
    $data[]=array("product1"=>"张三".rand(10,100),"date1"=>rand(100,1000),"boci1"=>rand(100,1000),"new_user1"=>rand(1000,10000),"new_user_money1"=>rand(1000,10000),"sum_new_use1"=>rand(1000,10000),"sum_new_money1"=>rand(1000,10000));

}
$serverData = array("pageIndex"=>$index,"total_num"=>21,"data"=>$data);
echo json_encode($serverData);
?>