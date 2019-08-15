var line = function (){
    var myChartOne = echarts.init(document.getElementById('wq-one'));
    var option ={
        grid: {
            show: false,
            left: '7%',
            right: '20px',
            bottom:"30px"
        },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#fff'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#fff'
                }
            }
        },
        series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
        }]
    };
    myChartOne.setOption(option);
};
line();

var bar = function () {
    var dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
    var data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
    var yMax = 500;
    var dataShadow = [];
    for (var i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
    }
    var myChartTwo = echarts.init(document.getElementById('wq-two'));
    var option = {
        title: {
            text: '特性示例：渐变色 阴影 点击缩放',
            // subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom',
            textStyle: {
                color:"#fff"
            },
            top:"10px"

        },
        grid: {
            show: true,
            left: '7%',
            top: '50px',
            right: '0%',
            bottom: '10%'
        },
        xAxis: {
            data: dataAxis,
            axisLabel: {
                inside: false,
                textStyle: {
                    color: '#fff'
                }
            },
            axisTick: {
                show: true
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color:["#fff"]
                }
            },
            z: 10
        },
        yAxis: {
            axisLine: {
                show: true,
                lineStyle: {
                    color:["#fff"]
                }
            },
            axisTick: {
                show: true
            },
            axisLabel: {
                color:"#fff",
                textStyle: {
                    color: '#999'
                }
            }
        },
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
            { // For shadow
                type: 'bar',
                itemStyle: {
                    normal: {color: 'rgba(0,0,0,0.05)'}
                },
                barGap:'-100%',
                barCategoryGap:'40%',
                data: dataShadow,
                animation: false
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2378f7'},
                                {offset: 0.7, color: '#2378f7'},
                                {offset: 1, color: '#83bff6'}
                            ]
                        )
                    }
                },
                data: data
            }
        ]
    };
    myChartTwo.setOption(option);
};
bar();

var pie = function(){
    var myChartThree = echarts.init(document.getElementById('wq-three'));
    var option = {
        title : {
            text: '某站点用户访问来源',
            subtext: '纯属虚构',
            x:'center',
            top:"20px",
            textStyle: {
                color:"#fff"
            },
            subtextStyle: {
                color: '#fff'
            }
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            top:"35px",
            left: '30px',
            data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎'],
            textStyle: {
                color:"#fff"
            }
        },
        series : [
            {
                name: '访问来源',
                type: 'pie',
                label: {
                    color: '#fff',
                },
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myChartThree.setOption(option);
};
pie();

(function (){
    var myTime;
    var Map = function(){
        var myChartFour = echarts.init(document.getElementById('wq-four'));
        var locations = [{
            name: '上海',
            coord: [121.472644, 31.231706]
        }, {
            name: '北京',
            coord: [116.405285, 39.904989]
        }, {
            name: '广东',
            coord: [113.280637, 23.839463714285714]
        }];
        var option = {
            tooltip: {
                trigger: 'item',
                formatter: '{b}'
            },
            series: [
                {
                    name: '中国',
                    type: 'map',
                    mapType: 'china',
                    roam: true,
                    selectedMode : 'multiple',
                    label: {
                        normal: {
                            show: true
                        },
                        emphasis: {
                            show: true,
                            color: 'yellow'
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: 'rgb(50,60,72)'
                        },
                        emphasis: {
                            areaColor: 'rgb(42,51,61)'
                        }
                    },
                    // markLine: {
                    //     lineStyle: {
                    //         normal: {
                    //             color: "#fff",
                    //             width: 2
                    //         }
                    //
                    //     }
                    // }
                }
            ]
        };
        var currentLoc = 0;
        var Move=function () {
            myChartFour.setOption({
                series: [{
                    center: locations[currentLoc].coord,
                    zoom: 4,
                    data:[
                        {name: locations[currentLoc].name, selected: true}
                    ],
                    animationDurationUpdate: 1000,
                    animationEasingUpdate: 'cubicInOut'
                }]
            });
            currentLoc = (currentLoc + 1) % locations.length;
        };
        myTime=setInterval(Move, 2000);
        myChartFour.setOption(option);
    };
    Map();
    $("#wq-four").hover(
        function (){
            clearInterval(myTime);
        },
        function (){
            Map();
        }
    );
}());