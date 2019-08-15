
// get screen width
var screen_width = parseInt(d3.select("div#elevation").style("width"));

draw_elevation()

// draw elevation func
function draw_elevation(){
	// set responsive width/height for line chart
	if (screen_width <= 700){
	    var margin = {top: 0, right: 50, bottom: 50, left: 10},
	        width = screen_width/0.75 - margin.left - margin.right,
	        height = 230 - margin.top - margin.bottom;

	}else{
		var margin = {top: 0, right: 50, bottom: 50, left: 10},
	        width = screen_width/1.3 - margin.left - margin.right,
	        height = 230 - margin.top - margin.bottom;
	}

	// data url
	var csv_url = "geo_with_altitude1.csv"
	var geo_url = "sichuan.geojson" //sichuan county geojson
	var test_geo = "test-shape.json" // geojson from Jiachuan, can use either of it

	// get data from url
	d3.queue()
		.defer(d3.csv, csv_url)
		.defer(d3.json, test_geo)
		.await(ready)


	function ready(error,datapoints,test_geo_data){

		datapoints.forEach(function(d){
			d.out_cnt = +d.out_cnt
		})

		// 做地图
		// map data - can use either geo_url or test_geo geojson, or any other geojson file
		var map_data = test_geo_data['features']

		// set map scale
		var height_map = 450, width_map = 480;

		// draw svg
      	var map_svg = d3.select("#map")
			.append("svg")
			.attr('id','mapsvg')
            .attr('height', height_map)
            .attr('width', "100%")
            .attr('preserveAspectRatio','xMinYMin meet')
            .attr("viewBox","0 0 450 480");

        // map projection, change the value in scale to rescale the map, the translate coordinates defines which part of map is displayed in svg
        var projection = d3.geoMercator()
	        .translate([-width_map*26.3,height_map*8.52])
	        .scale(7200);

	    // saved this part for you to see a full-scaled map, better when do testing, can be deleted later once the final version is done
        // var projection = d3.geoMercator()
	       //  .translate([-width_map*1.5,height_map*1.5])
	       //  .scale(600);

	    // set map scale
	    var ext = d3.extent(datapoints,function(d){
	    	return d.out_cnt
	    })
	    var radiusScale = d3.scaleLinear()
	    	.range([5,20])
	    	.domain(ext);

	    // define line on the map
	    var run = d3.line()
	        .x(function(d) { 
	        	return projection([ d['longitude'], d['latitude'] ])[0]; })
	        .y(function(d) { return projection([ d['longitude'], d['latitude'] ])[1]; });

	    // draw map in svg
	    var path = d3.geoPath().projection(projection);
	    var map = map_svg.append("g");
	    map.selectAll("path")
	        .data(map_data)
	        .enter()
	        .append("path")
	        .attr('d', path)
	        .style('fill', function(d){
	        	if(d.properties.name == "Sichuan" || d.properties.name == "Guizhou"){
	        		// 四川和贵州的填色写在下面
	        		return '#EEEEEE'
	        	}else{
	        		// 云南和其他的填色写在下面
	        		return "white"
	        	}
	        })
	        .style('stroke', function(d){
	        	if(d.properties.name == "Sichuan" ){
	        		// 四川的边框色
	        		return 'grey'
	        	}else if(d.properties.name == "Guizhou"){
	        		// 贵州的边框色
	        		return '#7F7F7F'
	        	}else{
	        		// 其他的边框色
	        		return "white"
	        	}
	        })
	        .style('stroke-width', 1.5)
	        .style('opacity', 0.7)
	        .style('stroke-opacity', 0.5);

	    // draw line
	    group = d3.nest().entries(datapoints)
	    var track = map_svg.append("g");
	    track.append('path')
	        .attr('class', 'route')
	        .attr('d', run(group))
	        .style('fill', 'none')
	        .style('stroke', '#517555')
	        .style('stroke-width', 2);

		// 做完地图

		// 地图上的跑跑
		// runner 是跑跑
		var runner = map_svg.append('g');
        runner.append('circle')
            .attr('class', 'runner2')
            .attr('cx', 0)
            .attr('cy', 0)
            .attr('r', 1)
            .attr('fill','#fff');
	    runner.append('circle')
	        .attr('class', 'runner')
	        .attr('cx', 0)
	        .attr('cy', 0)
	        .attr('r', 1)
            .attr('fill','#e3a059');

	    //这是跑跑边上的站名
	    var float_text = map_svg.append('g');
	    float_text.append('text')
	        .attr('x', 0)
	        .attr('y', 0)
	        .attr('class', 'float-label');

		// 画line chart
		// 清理数据
		datapoints.forEach(function(d) {
		    d.elevation = +d.elevation;
		});

        var xs=width + margin.left + margin.right;
        var yx=height + margin.top;
		// 画svg
		var svg = d3.select('#elevation')
	        .append("svg")
            .attr("height", height + margin.top)
            .attr("width","100%")
            .attr('preserveAspectRatio','xMinYMin meet')
            .attr("viewBox","0 0 "+xs+" "+yx)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	    // define line
		var line = d3.line()
	      .x(function(d){return xScale_trend(d['车站']);})
	      .y(function(d) { return yScale_trend(d.elevation); })

	    // set scales
	    var max = d3.max(datapoints,function(d){
	      	return d.elevation
	    })
	    var cat = datapoints.map(function(d){
	      	return d['车站']
	    })

	    var xScale_trend = d3.scaleBand()
			.range([0,width])
			.domain(cat);

		var yScale_trend = d3.scaleLinear()
			.range([height, 0])
    		.domain([0,max+200]);

    	// draw axis
    	var yAxis = d3.axisRight(yScale_trend)
				.ticks(4)
				.tickSizeInner([-width]);
		svg.append("g")
	      		.call(yAxis)
	      		.attr('class',"yElevation axis")
	      		.attr("transform", "translate(" + width + ",0)");
	    var xAxis = d3.axisBottom(xScale_trend)
				.ticks(5);
      	svg.append("g")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis)
		    .attr('class',"xElevation axis")
		    .selectAll("text")
            .attr("dy", "0.3em")
            .attr('dx','1.8em')
            .attr("rotate","-90")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

		//	单位
		svg.append('text')
			.attr('x',width+10)
			.attr('y',height+3.5)
			.text('(m)')
			.attr('font-size','12px');

		// draw trend line
    	var trend = svg.append('path')
			.data([datapoints])
			.attr('id',"trend")
			.attr('class',"trend")
			.attr('d',line)
			.attr('stroke',"#3e6844")
      		// .style("stroke-dasharray","5,5")
      		.attr('fill','none');

      	// 标注最高海拔&最低海拔站点，因为已知站点名称，直接用了名称filter，也可以用max&min
		svg.selectAll('.ele_line')
			.data(datapoints)
			.enter().append('line')
			.attr('x1',function(d){
				return xScale_trend(d['车站'])
			})
			.attr('x2',function(d){
				return xScale_trend(d['车站'])
			})
			.attr('y1',function(d){
				return yScale_trend(d.elevation)
			})
			.attr('y2',function(d){
				return yScale_trend(height)+11
			})
			.attr('stroke-width','1px')
            .attr('stroke',"#e3a059")
			.attr('display',function(d){
				if(d['车站']=="攀枝花"||d['车站']=="沙马拉达"){
					return "inline"
				}else{
					return "none"
				}	
			})
			.attr('class',"ele_line");

		svg.selectAll('.ele_line_label')
			.data(datapoints)
			.enter().append('text')
			.attr('x',function(d){
				return xScale_trend(d['车站'])+5
			})
			.attr('y',function(d){
				return height - ((height - yScale_trend(d.elevation))/2)+5
			})
			.text(function(d){
				return d3.format(",d")(d.elevation) + " m"
			})
            .attr('fill','#e3a059')
			.attr('display',function(d){
				if(d['车站']=="攀枝花"||d['车站']=="沙马拉达"){
					return "inline"
				}else{
					return "none"
				}	
			})

		// line chart的跑跑
		var circle_area = svg.append('g');
        circle_area.append('circle')
            .attr('class', 'chart-runner2')
            .attr('cx', 0)
            .attr('cy', yScale_trend(datapoints[0].elevation))
            .attr('fill','#fff');
	    circle_area.append('circle')
	        .attr('class', 'chart-runner')
	        .attr('cx', 0)
	        .attr('cy', yScale_trend(datapoints[0].elevation))
            .attr('fill','#e3a059');

		// 下面是画Animation
		// 用d3的的setInterval，加一个loop，基本就是每多少秒动一下loop through whole dataset
		// 增加了一个k值，用余数来确定是正着跑还是反着跑（这样到终点站就会开回来啦）
	      i = 0;
	      k = 0;
	      setInterval(function() {
	      	if (i>= datapoints.length){
	      		k = k+1
	      		i = i-1
	      	}else if(i<0){
	      		k = k + 1
	      		i = i+1
	      	}

	      	if (k % 2 ==0){
	      		var current_loc = datapoints[i];
		        update_location(current_loc);
		        
		        i = i+1;
		        
	      	}else{
		        var current_loc = datapoints[i];
		        update_location(current_loc);
		        
		        i = i-1;
	        }
	      }, 1000);

	    // 每次数值变化就update chart里runner的位置
	    function update_location(current_loc) {
	        current_coor = projection([ current_loc['longitude'], current_loc['latitude'] ]);
	        current_station = current_loc['车站']
	        radius = radiusScale(current_loc.out_cnt)
	        // console.log(radius)
	        runner.selectAll('.runner')
	          .transition()
	          .duration(1200)
	          .attr('r',8) //radius)
	          .attr('cx', current_coor[0] )
	          .attr('cy', current_coor[1] );
            runner.selectAll('.runner2')
                .transition()
                .duration(1200)
                .attr('r', 10) //radius+2)
                .attr('cx', current_coor[0] )
                .attr('cy', current_coor[1] );

	        circle_area.selectAll('.chart-runner')
	          .transition()
	          .duration(1200)
	          .attr('r', 8)
	          .attr('cx', xScale_trend(current_station))
	          .attr('cy', yScale_trend(current_loc['elevation']));

            circle_area.selectAll('.chart-runner2')
                .transition()
                .duration(1200)
                .attr('r', 10)
                .attr('cx', xScale_trend(current_station))
                .attr('cy', yScale_trend(current_loc['elevation']));

	        float_text.selectAll('text')
		        .transition()
		        .duration(1200)
	            .attr('x', current_coor[0]+10)
	            .attr('y', current_coor[1])
	            .text(current_loc['车站'])
	     }; // end of update location
	     // end of animation


	} // end of ready function


}

// end of draw elevation func