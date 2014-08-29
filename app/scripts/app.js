/*global define */
define(['d3'], function (d3) {
    'use strict';
    var margin = {top: 20, right: 20, bottom: 50, left: 90};

   	var width = $( window ).width() - margin.left - margin.right,
    	height = ($( window ).height() * .9) - margin.top - margin.bottom;

   	var stack = 0;

   	var svg = d3.select('#container').append('svg')
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append('text')
		.text("Rating (YDS)")
		.attr('x', width/2)
		.attr('y', height + 40);

	svg.append('text')
		.text("Distance climbed (feet)")
		.attr('transform', 'translate(-60,' + height/1.75 + ')rotate(-90)');

   	var x = d3.scale.linear().domain([-1,14]).range([0,width]);
   	var y = d3.scale.linear().range([0, height]);

   	var line = d3.svg.line()
	    .x(function(d) { return x(yds(d.rating)); })
	    .y(function(d) { return y(d.start); })
	    .interpolate("step-before");

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom")
		.tickFormat(function (d){ 
			if(d<0){
				return "4th"
			}
			else{
				return "5." + d
			}
		})
		.ticks(20);

	var yAxis = d3.svg.axis().scale(y).orient("left");

    d3.json("routes.json", function (data){

    	
    	$.map(data, function (d){
    		var pos = 0;
    		$.map(d.pitches, function (f){
    			var start = pos;
    			pos += f.length;
    			
    			f['start'] = start;
    			f['end'] = pos;
    			//console.log(d.name, f)
    		})
    	})

    	var max = d3.max($.map(data, function(d){ return d.pitches} ), function (d){ return d.end});
    	y.domain([max, 0])

    	svg.append("g").attr("transform", "translate(0," + height +")").call(xAxis);
		svg.append("g").call(yAxis);

    	var g = svg.selectAll('.route')
    		.data(data)
    		.enter()
    		.append('g')
    		//.attr('transform', function (d,i){ return 'translate(' + (i * 20) +',0)'})
    		.attr('class', 'route')
    		.on("mouseover", function(e){
    			d3.select(this).moveToFront();
    			$('#route_name').html(e.name);
    			d3.select(this).selectAll('line').attr('class', 'selected');
    			d3.select(this).selectAll('path').attr('class', 'selected');
    		})
    		.on("mouseout", function(e){
    			$('#route_name').html("");
    			d3.select(this).selectAll('line').attr('class', '');
    			d3.select(this).selectAll('path').attr('class', '');
    		})
    		.on("click", function (e){
    			window.open( "http://www.mountainproject.com" + e.link );
    		})

    	g.append("path")
    		.attr("d", function (d){ return line(d.pitches)})
    		.attr("fill", "none")
    		.attr("stroke", "#f2f2f2")


    	g.selectAll('line')
    		.data(function (d){
    			return d.pitches
    		})
    		.enter()
    		.append('line')
    		.attr('x1', function (d){ return x(yds(d.rating)) })
    		.attr('x2', function (d){ return x(yds(d.rating)) })
    		.attr('y1', function (d){ return y(d.start); })
    		.attr('y2', function (d){ return y(d.end); });



    	// g.selectAll('circle')
    	// 	.data(function (d){
    	// 		return d.pitches
    	// 	})
    	// 	.enter()
    	// 	.append('circle')
    	// 	.attr('cx', function (d){ return x(yds(d.rating)) })
    	// 	.attr('cy', function (d, i){
    	// 		if(i == 0){
    	// 			stack = 0;
    	// 		}
    	// 		stack += d.length/4

    	// 		return h - stack;
    	// 	})
    	// 	.attr('r', 2)
    	// 	.attr('opacity', 0.3)
    	// 	.attr('fill', '#000')
    })

    function yds(rating){
    	var rval = 0.0;
    	if(parseInt(rating)>4){
    		rval += parseInt(rating.split('.')[1]);
    		if(rating.split('.')[1].indexOf('\+') > -1){
    			rval += .5;
    		}
    		if(rating.split('.')[1].search('a') > -1){
    			rval += 0;
    		}
    		if(rating.split('.')[1].search('b') > -1){
    			rval += .25;
    		}
    		if(rating.split('.')[1].search('c') > -1){
    			rval += .5;
    		}
    		if(rating.split('.')[1].search('d') > -1){
    			rval += .75;
    		}
    		if(rating.split('.')[1].indexOf('\-') > -1){
    			rval -= .1;
    		}
    	}
    	else{
    		rval = -1;
    	}
    	return rval;
    }
    d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};


});

    		// .append('circle')
    		// .attr('cx', 100)
    		// .attr('cy', function (d){
    		// 	console.log(d)
    		// 	return y(d);
    		// })
    		// .attr('r', 10)
    		// .attr('fill', '#000')