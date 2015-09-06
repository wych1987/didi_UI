<?php
$index = $_GET["pageIndex"];

$data=array();
for($i =20;$i>0;$i--){
    $data[]=array("product"=>"уехЩ".rand(10,100),"date"=>rand(100,1000),"boci"=>rand(100,1000),"new_user"=>rand(1000,10000),"new_user_money"=>rand(1000,10000),"sum_new_use"=>rand(1000,10000),"sum_new_money"=>rand(1000,10000));

}
$serverData = array("pageIndex"=>$index,"total_num"=>21,"data"=>$data);
echo json_encode($serverData);
?>