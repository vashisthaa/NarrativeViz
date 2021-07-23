
function onclickScene1(){
    window.location.replace("./scene1.html");

}
function onclickScene2(){
    window.location.replace("./scene2.html");

}
function onclickScene3(){
    window.location.replace("./scene3.html");
}
    async function drawGraph(countries){
        var dataset1 = [
            [1,1], [12,20], [24,36],
            [32, 50], [40, 70], [50, 100],
            [55, 106], [65, 123], [73, 130],
            [78, 134], [83, 136], [89, 138],
            [100, 140]
        ];

        var dataset2 = [
            [1,5], [12,20], [24,36],
            [32, 70], [40, 10], [50, 100],
            [55, 206], [65, 223], [43, 130],
            [78, 534], [83, 136], [89, 138],
            [100, 140]
        ];

        // Step 3
        var svg = d3.select("svg"),
            margin = 200,
            width = svg.attr("width") - margin, //300
            height = svg.attr("height") - margin //200

        // Step 4
        var xScale = d3.scaleLinear().domain([0, 100]).range([0, width]),
            yScale = d3.scaleLinear().domain([0, 200]).range([height, 0]);

        var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

        // Step 5
        // Title
        svg.append('text')
            .attr('x', width/2 + 100)
            .attr('y', 100)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Helvetica')
            .style('font-size', 20)
            .text('Line Chart');

        // X label
        svg.append('text')
            .attr('x', width/2 + 100)
            .attr('y', height - 15 + 150)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Helvetica')
            .style('font-size', 12)
            .text('Independant');

        // Y label
        svg.append('text')
            .attr('text-anchor', 'left')
            .attr('transform', 'translate(20,' + height + ')rotate(-90)')
            .style('font-family', 'Helvetica')
            .style('font-size', 12)
            .text('Dependant');

        // Step 6
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));

        g.append("g")
            .call(d3.axisLeft(yScale));


        // Step 8
        var line = d3.line()
            .x(function(d) { return xScale(d[0]); })
            .y(function(d) { return yScale(d[1]); })
            .curve(d3.curveMonotoneX)

        svg.append("path")
            .datum(dataset1)
            .attr("class", "line")
            .attr("transform", "translate(" + 100 + "," + 100 + ")")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", "#CC0000")
            .style("stroke-width", "2");
    }


