var divHeight=function(){
    var height1 = $("#wq-sidebar").height();
    var height2 = $(".wq-top").height();
    var height3 = $(".wq-middle").height();
    var height4 = $(".wq-down").height();
    var height5 = height2 + height3 + height4;
    // console.log(height1,height2,height3,height4,height5);
    if(height1<height5){
        $("#wq-content").css({
            "height":height5
        });
    }else{
        $("#wq-content").css({
                "height":"100%"
        });
    }
};
divHeight();
$(window).on("resize",divHeight);
$("#RegionalActivePop").on("click",function () {
    $("#wq-content iframe").css({
        display: "none"
    });
    $(".RegionalActivePop").css({
        display: "block"
    });
});
$("#RegionalMigration").on("click",function () {
    $("#wq-content iframe").css({
        display: "none"
    });
    $(".RegionalMigration").css({
        display: "block"
    });
});



