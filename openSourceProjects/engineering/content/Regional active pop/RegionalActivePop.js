//绘制svg主体的函数
var Gdraw = function (divname,Tmg,Rdt) {
    //定义svg宽高及svg生成
    var _svgwidth = $("#" + divname).width();
    var _svgheight = $("#" + divname).height();
    var _svg = d3.select("#" + divname)
        .append("svg")
        .attr("width",_svgwidth)
        .attr("height",_svgheight);
    //定义主区域与四边之间的距离
    var _margin = {top:0,right:0,bottom:0,left:50};
    //定义主区域
    var _gdraw1 = _svg.append("g")
        .attr("class","_gdraw1")
        .attr("transform","translate(" + _margin.left + "," + _margin.top + ")");
    //定义核心区域
    var _gdraw2 = _gdraw1.append("g")
        .attr("class","_gdraw2")
        .attr("transform","translate(0," + Tmg + ")");
    //定义xy轴与核心区域四边距离
    var _chartmargin = {top:0,right:0,bottom:30,left:Rdt};
    //计算核心区域宽高
    var _chartwidth = _svgwidth - _margin.left - _margin.right;
    var _chartheight = _svgheight - _margin.top - _margin.bottom - Tmg;
    //计算X轴和Y轴的位置
    var _xaxiswidth = _chartwidth - _chartmargin.left - _chartmargin.right;
    var _yaxisheght = _chartheight - _chartmargin.top - _chartmargin.bottom;

    return {a:_xaxiswidth,b:_yaxisheght}
};


var china_geo = "./111china.json"; // geojson from Jiachuan, can use either of it
// get data from url
d3.queue()
    .defer(d3.json, china_geo)//使用以工程文件夹为根目录的绝对路径
    .await(cmap);


//地图相关函数
function cmap(error,china_geo) {
    var _svgwidth = $("#wq-upOne").width();
    var _svgheight = $("#wq-upOne").height();

    //地图映射函数
    var _projection = d3.geoMercator()
        .center([108.9404296875, 34.252676117101515])
        .scale("500")
        .fitExtent([[0,0],[_svgwidth,_svgheight]],china_geo);
    var _geopath = d3.geoPath()
        .projection(_projection);

    //绘制svg
    var _svg = d3.select("#wq-upOne")
        .append("svg")
        .attr("id","svg-0")
        .attr("width", _svgwidth)
        .attr("height", _svgheight);

    //绘制地图
    _svg.selectAll("path")
        .data(china_geo.features)
        .enter()
        .append("path")
        .attr("d",function(d,i){
            return _geopath(d)
        })
        .attr("stroke","rgba(255,255,255,0.1")
        .attr("stroke-width",1)
        .attr("fill","gray")
        .attr("id",function (d) {
            return  d.properties.name;

        })
        .attr("cursor","pointer")
        .on("click",function (d) {
            // var _mapname = d.properties.name;
            var _mapid = d.properties.id;
            shengMap("wq-downOne",_mapid);
            //点击事件变色
            if($(this).attr("fill") == "gray"){
                d3.select(this.parentNode)
                    .selectAll("path")
                    .attr("fill","gray");
                $(this).attr("fill","red")
            }else {
                d3.select(this.parentNode)
                    .selectAll("path")
                    .attr("fill","gray");
            }
        });
    // 循环克隆堆叠形成立体
    var sourceNode = document.getElementById("svg-0"); // 获得被克隆的节点对象
    for (var i = 1; i < 10; i++) {
        var clonedNode = sourceNode.cloneNode(true); // 克隆节点
        clonedNode.setAttribute("id", "_svg-" + i); // 修改一下id 值，避免id 重复
        sourceNode.parentNode.appendChild(clonedNode); // 在父节点插入克隆的节点
        // console.log(clonedNode);
        $("#_svg-" + i).css({
            top: - i / 2 + "px",
            left: - i / 2 + 8 + "px"
        });
    }

    //点击事件变色
    // d3.select("#wq-upOne")
    //     .selectAll("svg")
    //     .selectAll("path")
    //     .on("click",function (){
    //         // console.log(000);
    //         if($(this).attr("fill") == "gray"){
    //             d3.select(this.parentNode)
    //                 .selectAll("path")
    //                 .attr("fill","gray");
    //             $(this).attr("fill","red")
    //         }else {
    //             d3.select(this.parentNode)
    //                 .selectAll("path")
    //                 .attr("fill","gray");
    //         }
    //     });

    //优化加载在最上层svg添加text
    d3.select("#wq-upOne")
        .select("#svg-0")
        .selectAll("text")
        .data(china_geo.features)
        .enter()
        .append("text")
        .attr("x",function (d,i) {
            var xypoint=_geopath.centroid(d);
            return xypoint[0]
        })
        .attr("y",function (d,i) {
            var xypoint=_geopath.centroid(d);
            return xypoint[1]
        })
        .attr('text-anchor','middle')
        .text(function(d,i){
            return d.properties.name;
        })
        .attr('font-size',10)
        .attr("cursor","pointer")
        .attr("fill","yellow")
        .on("click",function (d) {
            var _name = d.properties.name;
//点击事件变色
            d3.select("#wq-upOne")
                .select("#svg-0")
                .selectAll("path")
                .attr("fill","gray");
            d3.select("#wq-upOne")
                .select("#svg-0")
                .selectAll("#" + _name)
                .attr("fill","red");
            var _mapid = d.properties.id;
            shengMap("wq-downOne",_mapid);
    });
}


//饼图数据
var pieDataset=[
    {'name':'商品3','value':100},
    {'name':'商品1','value':60},
    {'name':'商品2','value':80},
    {'name':'商品4','value':30},
    {'name':'商品5','value':50}
];
var drawPie = function (divname,dataset) {
    pieFlag=0;
    var _svgwidth = $("#" +divname).width();
    var _svgheight = $("#" +divname).height();
    dataset.sort(function(a,b){
        return d3.ascending(a.value,b.value)
    });
    var _pie = d3.pie()
        // .padAngle(Math.PI * 0.005)
        .sort(null)
        .value(function (d,i) {
            return d.value;
        });
    var _arcdata = _pie(dataset);
    var _arc = d3.arc()
        .innerRadius(0)
        .outerRadius(100);
    var _svg = d3.select("#" + divname)
        .append("svg")
        .attr("width",_svgwidth)
        .attr("height",_svgheight);
    var _totalduration=0;
//定义画饼及饼外线文字的g组
    var _gpie1 = _svg.append("g")
        .attr("id",divname + "_gpie1");
    var _gpie = _svg.append("g")
        .attr("id",divname + "_gpie");
//画饼图外线及文字
    var textLine = function () {
//园内外延线
    _gpie1.selectAll("line")
            .data(_arcdata)
            .enter()
            .append("line")
            .attr("transform","translate(" + _svgwidth / 2 + "," + _svgheight / 2 + ")")
            .attr("x1",function(d){
                var deviation = _arc.centroid(d);
                var deviationx = deviation[0];
                return deviationx * 0.8;
            })
            .attr("y1",function(d){
                var deviation = _arc.centroid(d);
                var deviationy = deviation[1];
                return deviationy * 0.8;
            })
            .attr("x2",function(d){
                var deviation = _arc.centroid(d);
                var deviationx = deviation[0];
                return deviationx * 2.5;
            })
            .attr("y2",function(d){
                var deviation = _arc.centroid(d);
                var deviationy = deviation[1];
                return deviationy * 2.5;
            })
            .attr("stroke","red");
//横线
        var _gpie2 = _svg.append("g")
            .attr("id",divname + "_gpie2");
        _gpie2.selectAll("line")
            .data(_arcdata)
            .enter()
            .append("line")
            .attr("transform","translate(" + _svgwidth / 2 + "," + _svgheight / 2 + ")")
            .attr("x1",function(d){
                var deviation = _arc.centroid(d);
                var deviationx = deviation[0];
                return deviationx * 2.5;
            })
            .attr("y1",function(d){
                var deviation = _arc.centroid(d);
                var deviationy = deviation[1];
                return deviationy * 2.5;
            })
            .attr("x2",function (d) {
                var deviation = _arc.centroid(d);
                var deviationx = deviation[0];
                if(deviationx > 0){
                    return  (deviationx * 2.5) + 40;
                }else{
                    return  (deviationx * 2.5) - 40;
                }

            })
            .attr("y2",function (d) {
                var deviation = _arc.centroid(d);
                var deviationy = deviation[1];
                return deviationy * 2.5;
            })
            .attr("stroke","red");
//饼外的文字
        _gpie1.selectAll("text")
            .data(_arcdata)
            .enter()
            .append("text")
            .attr("transform","translate(" + _svgwidth / 2 + "," +( _svgheight / 2 + 4) + ")")
            .attr("x",function(d){
                var deviation = _arc.centroid(d);
                var deviationx = deviation[0];
                var _xtext = deviationx * 3.0;
                if (deviationx >= -20 && deviationx <= 20){
                    if (deviationx >= -20 && deviationx <= 0){
                        return (_xtext - 10);
                    }else {
                        return (_xtext + 10);
                    }
                }else {
                    return _xtext;
                }
            })
            .attr("y",function(d){
                var deviation = _arc.centroid(d);
                var deviationy = deviation[1];
                var _ytext = deviationy * 2.9;
                if (deviationy >= 40 || deviationy <= -40) {
                    if(deviationy >= 40){
                        return (_ytext - 8);
                    }else {
                        return (_ytext + 10);
                    }
                }else {
                    return _ytext;
                }

            })
            .attr("text-anchor","middle")
            .text(function(d){
                return d.data.name
            })
            .attr("fill","red");
//饼图内部文字
        _gpie.selectAll("text")
            .data(_arcdata)
            .enter()
            .append("text")
            .attr("transform","translate(" + (_svgwidth / 2 - 20) + "," + _svgheight / 2 + ")")
            .attr('x',function(d,i){
                return _arc.centroid(d)[0] * 1.1
            })
            .attr('y',function(d,i){
                return _arc.centroid(d)[1] * 1.1
            })
            .text(function(d,i){
                return d.data.value;
            })
            .attr("cursor","pointer")
            .attr('fill','rgb(10,16,42)')
            .on('mouseover',function(d,i){
                if(pieFlag == 1){
                    var deviation=_arc.centroid(d);
                    var deviationx=deviation[0] / 4;
                    var deviationy=deviation[1] / 4;
                    d3.select(this)
                        .transition()
                        .duration(function(d,i){
                            return 400;
                        })
                        .attr("transform","translate(" + (_svgwidth / 2 - 20 + deviationx) + "," + (_svgheight / 2 + deviationy) + ")");
                    _gpie.selectAll('#' + d.data.name)
                        .transition()
                        .duration(function (d, i) {
                            return 400;
                        })
                        .attr("transform","translate(" + (_svgwidth / 2 + deviationx) + "," + (_svgheight / 2 + deviationy) + ")");
                }
            })
            .on('mouseout',function(d,i){
                if(pieFlag == 1){
                    d3.select(this)
                        .transition()
                        .duration(function(d,i){
                            return 400;
                        })
                        .attr("transform","translate(" + (_svgwidth / 2 - 20) + "," + _svgheight / 2 + ")")
                    _gpie.selectAll('#' + d.data.name)
                        .transition()
                        .duration(function (d, i) {
                            return 400;
                        })
                        .attr("transform","translate("+ _svgwidth / 2 + "," + _svgheight / 2 + ")");            }
            })
            .attr('class',function(d,i){
                return d.data.name
            });
    };
//画饼
    _gpie.selectAll("path")
        .data(_arcdata)
        .enter()
        .append("path")
        .attr("transform","translate(" + _svgwidth / 2 + "," + _svgheight / 2 + ")")
        .attr("fill",function (d,i) {
            return d3.schemeCategory10[i];
        })
        .attr("cursor","pointer")
        .on('mouseover',function(d,i){
            if(pieFlag == 1){
                var deviation=_arc.centroid(d);
                var deviationx=deviation[0] / 4;
                var deviationy=deviation[1] / 4;
                d3.select(this)
                    .transition()
                    .duration(function(d,i){
                        return 400;
                    })
                    .attr("transform","translate(" + (_svgwidth / 2 + deviationx) + "," + (_svgheight / 2 + deviationy) + ")");
                _gpie.selectAll('.'+d.data.name)
                    .transition()
                    .duration(function(d,i){
                        return 400;
                    })
                    .attr("transform","translate(" + (_svgwidth / 2 - 20 + deviationx) + "," + (_svgheight / 2 + deviationy) + ")");
            }
        })
        .on('mouseout',function(d,i){
            if(pieFlag == 1){
                d3.select(this)
                    .transition()
                    .duration(function(d,i){
                        return 400;
                    })
                    .attr("transform","translate("+ _svgwidth / 2 + "," + _svgheight / 2 + ")");
                _gpie.selectAll('.'+d.data.name)
                    .transition()
                    .duration(function(d,i){
                        return 400;
                    })
                    .attr("transform","translate(" + (_svgwidth / 2 - 20) + "," + _svgheight / 2 + ")")
            }
        })
        .each(function (d,i) {
            d.duration = (d.endAngle - d.startAngle) / (2 * Math.PI) * 10;
            d.delay = _totalduration;
            _totalduration = _totalduration + d.duration;
        })
        .transition()
        .duration(function (d,i) {
            return d.duration * 500
        })
        .delay(function (d){
            return d.delay * 500
        })
        .ease(d3.easeLinear)
        .tween("path",function (d,i) {
            var _this = this;
            var initEndAngle = d.endAngle;
            return function (t) {
                d.endAngle = d.startAngle + t * (initEndAngle - d.startAngle);
                d3.select(_this)
                    .attr("d",_arc(d))
            }
        })
        .call(function () {
            setTimeout(textLine,5000)
        })
        .attr('id',function(d,i){
            return d.data.name
        });

    function wwwa(){
        pieFlag=1;
    }
    setTimeout(wwwa,5000);
};
drawPie("wq-upLeft",pieDataset);

//柱图数据堆叠
var barYdata1=[180,80,450,900,456,361,280];
var barXdata=['0~50','50~100','100~200','200~500','500~1000','1000~2000','>2000'];
var drawBar = function (divname,xdata,ydata) {
    //绘制核心区域
    var arr = Gdraw(divname,50,30);
    var _clone_gdraw2 = d3.select("#" + divname)
        .select("._gdraw2")
        .append("g")
        .attr("id",divname + "_clone_gdraw2");
    //定义存放x轴及y轴的g组
    var _gxaxis = _clone_gdraw2.append("g")
        .attr("id",divname + "_gxaxis")
        .attr("transform","translate(0,"+arr.b+")");
    var _gyaxis = _clone_gdraw2.append("g")
        .attr("id",divname + "_gyaxis");
    //定义坐标轴
    var _scaleband = d3.scaleBand()
        .padding(0.2)
        .domain(xdata)
        .range([0,arr.a]);
    var _xaxis = d3.axisBottom()
        .scale(_scaleband);
    _xaxis(_gxaxis);
    var _scaleline = d3.scaleLinear()
        .domain([0,d3.max(ydata)])
        .nice()
        .range([arr.b,0]);
    var _yaxis = d3.axisLeft()
        .scale(_scaleline);
    _yaxis(_gyaxis);
    //添加g组绘制柱图
    var _gbar = _clone_gdraw2.append("g")
        .attr("id",divname + "_gbar");
    //添加提示框
    var _odiv=d3.select('#'+divname)
        .append('div')
        .attr('class','prompts');
    var _updatarect = _gbar.selectAll("rect")
        .data(ydata)
        .enter()
        .append("rect")
        .attr("x",function (d,i) {
            return _scaleband(xdata[i])
        })
        .attr("y",arr.b)
        .attr("width",_scaleband.bandwidth())
        .attr("height",function (d,i) {
            return 0
        })
        .attr("fill","steelblue")
        .on("mouseover",function(d,i) {
            _odiv.style("left",function () {
                var distance = d3.event.clientX;
                if((distance + 180) >= $(window).width()){
                    return d3.event.clientX - 150 + 'px';
                }else {
                    return d3.event.clientX + 10 + 'px';
                }
            })
                .style("top",d3.event.clientY + 10 + 'px')
                .style("opacity",1)
                .html("值为："+d);
        })
        .on("mousemove",function(d,i) {
            _odiv.style("left",function () {
                var distance = d3.event.clientX;
                if((distance + 180) >= $(window).width()){
                    return d3.event.clientX - 150 + 'px';
                }else {
                    return d3.event.clientX + 10 + 'px';
                }
            })
                .style("top",d3.event.clientY+ 10 +'px')
                .html("值为："+d)
        })
        .on("mouseout",function(d,i){
            _odiv.style("opacity",0)
        })
        .transition()
        .duration(5 * 1000)
        .ease(d3.easeLinear)
        .attr("y",function (d,i) {
            return _scaleline(d)
        })
        .attr("height",function (d,i) {
            return arr.b - _scaleline(d)
        })
        .attr("cursor","pointer");

    //添加文字
    _updatatext = _gbar.selectAll("text")
        .data(ydata)
        .enter()
        .append("text")
        .attr("x",function (d,i) {
            return _scaleband(xdata[i]);
        })
        .attr("y",arr.b)
        .attr("text-anchor","middle")
        .attr("dx",_scaleband.bandwidth() / 2)
        .attr("dy",15)
        .style("fill","yellow")
        .on("mouseover",function(d,i) {
            _odiv.style("left",function () {
                var distance = d3.event.clientX;
                if((distance + 180) >= $(window).width()){
                    return d3.event.clientX - 150 + 'px';
                }else {
                    return d3.event.clientX + 10 + 'px';
                }
            })
                .style("top",d3.event.clientY + 10 + 'px')
                .style("opacity",1)
                .html("值为："+d);
        })
        .on("mousemove",function(d,i) {
            _odiv.style("left",function () {
                var distance = d3.event.clientX;
                if((distance + 180) >= $(window).width()){
                    return d3.event.clientX - 150 + 'px';
                }else {
                    return d3.event.clientX + 10 + 'px';
                }
            })
                .style("top",d3.event.clientY+ 10 +'px')
                .html("值为："+d)
        })
        .on("mouseout",function(d,i){
            _odiv.style("opacity",0)
        })
        .transition()
        .duration(5 * 1000)
        .ease(d3.easeLinear)
        .tween("text",function (d) {
            var _this = this;
            return  function (t) {
                _this.textContent = Math.round(d * t);
                _this.setAttribute("y",_scaleline(t * d));
            }
        })
        .attr("cursor","pointer")
};
drawBar("wq-upRight",barXdata,barYdata1);


//左下地图
var shengMap = function (divname,_mapid) {
    var sheng_map = "./geometryProvince/" + _mapid + ".json";
    d3.queue()
        .defer(d3.json,sheng_map)
        .await(drawmap);
    function drawmap(error,sheng_map) {
        d3.select("#" + divname)
            .selectAll("svg")
            .remove();
        var _svgwidth = $("#" + divname).width() * 0.98;
        var _svgheight = $("#" + divname).height();
        //地图映射函数
        var _projection = d3.geoMercator()
            .center([108.9404296875, 34.252676117101515])
            .scale("500")
            .fitExtent([[0,0],[_svgwidth,_svgheight]],sheng_map);
        var _geopath = d3.geoPath()
            .projection(_projection);

        //绘制svg
        var _svg = d3.select("#" + divname)
            .append("svg")
            .attr("id",divname + "svg-0")
            .attr("width", _svgwidth)
            .attr("height", _svgheight);

        //绘制地图
        _svg.selectAll("path")
            .data(sheng_map.features)
            .enter()
            .append("path")
            .attr("d",function(d,i){
                return _geopath(d)
            })
            .attr("stroke","rgba(255,255,255,0.1")
            .attr("stroke-width",1)
            .attr("fill","gray")
            .attr("cursor","pointer");

        // 循环克隆堆叠形成立体
        var sourceNode = document.getElementById(divname + "svg-0"); // 获得被克隆的节点对象
        for (var i = 1; i < 10; i++) {
            var clonedNode = sourceNode.cloneNode(true); // 克隆节点
            clonedNode.setAttribute("id", divname + "_svg-" + i); // 修改一下id 值，避免id 重复
            sourceNode.parentNode.appendChild(clonedNode); // 在父节点插入克隆的节点
            // console.log(clonedNode);
            $("#" +divname+ "_svg-" + i).css({
                top: - i / 2 + 8 + "px",
                left: - i / 2 + 8 + "px"
            });
        }

        //优化加载在最上层svg添加text
        d3.select("#wq-downOne")
            .select("#wq-downOnesvg-0")
            .selectAll("text")
            .data(sheng_map.features)
            .enter()
            .append("text")
            .attr("x",function (d,i) {
                var xypoint=_geopath.centroid(d);
                return xypoint[0]
            })
            .attr("y",function (d,i) {
                var xypoint=_geopath.centroid(d);
                return xypoint[1]
            })
            .attr('text-anchor','middle')
            .text(function(d,i){
                return d.properties.name;
            })
            .attr('font-size',10)
            .attr("cursor","pointer")
            .attr("fill","yellow")
    }
};


//折现数据堆叠
var lineXdata = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
var lineYdata = ['1000','2540','1356','4560','4511','4456','7410','8520','9632','7894','8561','1234'];
var lineYdata1 = ['1520','1561','4456','8151','1301','1511','8794','4894','5641','1231','2354','4894'];
var Max = d3.merge([lineYdata,lineYdata1]);
//折现图绘制
var drawLine = function (divname,xdata,ydata,ydata1) {
    var dataset = d3.zip(xdata,ydata);
    var dataset1 = d3.zip(xdata,ydata1);
    var arr = Gdraw(divname,50,30);
    //定义存放x轴G组，及存放y轴G组
    var _gxaxis = d3.select("#" + divname)
        .select("._gdraw2")
        .append("g")
        .attr("id",divname+"_gxaxis")
        .attr("transform","translate(0," + arr.b+")");
    var _gyaxis = d3.select("#" + divname)
        .select("._gdraw2")
        .append("g")
        .attr("id",divname+"_gyaxis");
    //定义X轴并生成
    var _scaleband = d3.scaleBand()
        .domain(xdata)
        .range([0,arr.a]);
    var _xaxis = d3.axisBottom()
        .scale(_scaleband);
    _xaxis(_gxaxis);
    //定义y轴并生成
    var _scaleline = d3.scaleLinear()
        .domain([0,d3.max(Max)])
        .nice()
        .range([arr.b,0]);
    var _yaxis = d3.axisLeft()
        .scale(_scaleline);
    _yaxis(_gyaxis);
    var drawLct = function (dataset,ydata) {
        var color = ['red','yellow','green','#ccc','blue','gray','purple','orange','cyan','pink'];
        var indexs = parseInt(Math.random() * 10);
        //定义折现
        var _line = d3.line()
            .x(function (d,i) {
                return _scaleband(d[0]) + _scaleband.bandwidth() / 2;
            })
            .y(function (d,i) {
                return _scaleline(d[1]);
            })
            .curve(d3.curveCatmullRom);
        d3.select("#" + divname)
            .select("._gdraw2")
            .append("g")
            .attr("id","line1")
            .append("path")
            .attr("d",_line(dataset))
            .attr("stroke",function (d,i) {
                return color[indexs]
            })
            .attr("strole-width",1)
            .attr("fill","none")
            .attr("cursor","pointer");
    //定义散点
        var _gscatter = d3.select("#" + divname)
            .select("._gdraw2")
            .append("g")
            .attr('id',divname+'_gyscatter');
        var _updaatacircle = _gscatter.selectAll("circle")
            .data(dataset);
        _entercircle = _updaatacircle.enter()
            .append("circle")
            .attr("cx",function (d,i) {
                return _scaleband(xdata[i]) + _scaleband.bandwidth() / 2;
            })
            .attr("cy",function (d,i) {
                return _scaleline(ydata[i]);
            })
            .attr("fill",function (d,i) {
                return d3.schemeCategory10[i];
            })
            .attr("r","5")
            .attr("cursor","pointer");
        //定义文字
        var _gtext = d3.select("#" + divname)
            .select("._gdraw2")
            .append("g")
            .attr('id','gtext');
        _updatatext = _gtext.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text(function (d,i) {
                return  d[1]
            })
            .attr("x",function (d,i) {
                return _scaleband(xdata[i]) + _scaleband.bandwidth() / 2 + 10;
            })
            .attr("y",function (d,i) {
                return _scaleline(ydata[i]);
            })
            .attr("fill","gray");
    };
    drawLct(dataset,ydata);
    drawLct(dataset1,ydata1);
    //添加图例
    var _length = d3.select("#" + divname)
        .selectAll("svg")
        .append("g")
        .attr("id",divname + "length")
        .attr("width","100%")
        .attr("height","50");
    _length.append("text")
        .attr("x",arr.a / 2)
        .attr("y",50 / 2)
        .text(function () {
            return "图例未加"
        })
        .attr("fill","gray");

};
drawLine("wq-upTwo",lineXdata,lineYdata,lineYdata1);


