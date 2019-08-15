//定义画布
var _svg = d3.selectAll('.circle')
    .append('svg')
    .attr('width', 22)
    .attr('height', 22);
//空心圆
var _circle = _svg.append('circle')
    .attr('cx', 11)
    .attr('cy', 11)
    .attr('r', 10)
    .attr('fill', 'none')
    .attr('stroke', '#fff');
//实心圆
var _circle2 = _svg.append('circle')
    .attr('cx', 11)
    .attr('cy', 11)
    .attr('r', 7)
    .attr('class', 'one')
    .attr('fill', 'rgb(62,102,67)')
    .style('display', 'none');
//点击实心圆出现字体变色
var cleanCircle = function () {
    $("#kuang>.btnone").find('.li').css({
        'color': '#fff'
    });
    $("#kuang>.btnone").find('.one').css({
        'display': 'none'
    });
    $("#kuang>.btnone").find('.cne>img').css({
        'opacity': '0'
    });
    $("#kuang>.btnone").find('.font').css({
        'color': '#fff'
    });
};
var highlightCircle = function ($el) {
    $el.find('.li').css({
        'color': 'rgb(62,102,67)'
    });
    $el.find('.one').css({
        'display': 'block'
    });
    $el.find('.cne>img').css({
        'opacity': '1'
    });
    $el.find('.font').css({
        'color': 'rgb(62,102,67)'
    });
};
$('.btnone').on('click', function () {
    cleanCircle();
    highlightCircle($(this));
});
//点击页面事件
var flag = 0;
$("#kuang>.btnone").click(function (e) {
    //console.log('a');
    flag = 1;
    // e.stopPropagation();
    // e.preventDefault();
    var idx = $(this).index() / 2;
    var newSrcollTop = $(".content .item").eq(idx).offset().top - 110;//offsetTop
    //document.documentElement.scrollTop||document.body.scrollTop
    $("body,html").animate({scrollTop: newSrcollTop}, 1000, function () {
        flag = 0;
        $('body').removeAttr("onmousewheel");
    });
});
var flag3 = 0;
var flag4 = 0;
$("#center>.Eject").click(function () {
    var w = 0;
    if (flag4 == 1) {
        return;
    }
    if (flag3 == 0) {
        flag4 = 1;
        $("#111").animate({"left": "0%"}, 500);
        //$("#center>.Eject").animate({"left": "22%"},800,function () {
        w = $(window).width() / 10 - 17.5 + 'px';
        $("#center>.Eject").animate({"left": w}, 500, function () {
            flag3 = 1;
            flag4 = 0;
        });
        // flag3=1;
        // flag4=0;
    } else {
        flag4 = 1;
        $("#111").animate({"left": "-22%"}, 500);
        $("#center>.Eject").animate({"left": "2px"}, 500, function () {
            flag3 = 0;
            flag4 = 0;
        });
        // flag3=0;
        // flag4=0;
    }
});


var flag2 = 1;

// loadImage
(function () {
    var preLoaded = ['./img/loading.gif', './img/cover.gif', './img/cover2.png', './img/1gifpig.gif',
        './img/1.jpg',
        './img/frame.png', './img/ScreenShot.png'
    ];
    var i = 0;

    var allLoaded = function () {
        var allNumber = preLoaded.length;
        // console.log(allNumber);
        i++;
        // console.log(i, Math.round(i / allNumber * 100) + '%');
        $('#loading').html(Math.round(i / allNumber * 100) + '%');

        if (i === allNumber) {
            // -1 为了容错
            //退出函数
            // console.log('loaded');
            $('body').removeClass('loading');
            $('body').show();
        }
    };

    preLoaded.forEach(function (d) {
        var imageObj = new Image();
        imageObj.onload = allLoaded;//图片加载后触发allLoaded函数
        imageObj.src = d;//图片对象的src方法
    });
}());

//touch事件取消menu样式
$('#touch').on("touchmove", function (e) {
    if (flag == 1) {
        $("body").attr("onmousewheel", "return false");
    }
    if (flag2 == 0) {
        e.preventDefault();
    }
});
$('#header').on("touchstart", function (e) {
    if (flag2 == 0) {
        e.preventDefault();
    }
});
$('#touch').on("touchstart", function (e) {
    if (flag2 == 0) {
        e.preventDefault();
    }


    var _this = this;
    var recentItem = null;
    $('.content .item').each(function (i) {
        // console.log($(this).offset().top, $(window).scrollTop());
        if ($(this).offset().top - 300 < $(window).scrollTop()) {
            console.log(i);
            // return;
            recentItem = i;
        }
    });
    cleanCircle();
    if (recentItem !== null) {
        highlightCircle($("#kuang>.btnone").eq(recentItem));
    }

    $("#111").animate({"left": "-22%"}, 500);
    $("#center>.Eject").animate({"left": "2px"}, 500);
    flag3 = 0;
});