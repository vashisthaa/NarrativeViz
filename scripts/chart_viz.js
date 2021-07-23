
const rowConverter = function(d) {
    return {
        //Make a new Date object for each year + month
        Year: parseInt(d.Year),
        //Convert from string to float
        Country: d.Country_Name,
        Country_Code: d.Country_Code,
        Fertility: parseFloat(d.Adolescent_Fertility)
    };
}
const vizobject = {
    color_category : d3.schemeCategory20,
    CountryColorMap : new Map(),
    graph:null,
    countryMap: new Map()
}


function onbodyload(scene){
    let dataset = d3.csv("./data/WDI_Adolescent_Fertility_cleaned.csv", rowConverter, function (data){
        if(vizobject.CountryColorMap.size == 0){
            //alert('hello2');
            const countries = d3.map(data, function(d){return(d.Country_Code)}).keys();
            for(const i in countries){
                vizobject.CountryColorMap.set(countries[i], vizobject.color_category[i%20]);
            }
            for(const i in data){
                if(!(data[i].Country_Code == undefined)){
                    let values = vizobject.countryMap.get(data[i].Country_Code);
                    if(values ==null){
                        values = [];
                    }
                    values.push(data[i]);
                    vizobject.countryMap.set(data[i].Country_Code, values);
                }

            }
        }
        //console.log('Hello');
        let graph = {};
        graph.xAxis_Length = d3.max(data, function(d) { return d.Year; }) + 10;
        graph.xAxis_Origin = d3.min(data, function(d) { return d.Year; });
        graph.yAxis_Length = d3.max(data, function(d) { return d.Fertility; }) + 10;
        graph.yAxis_Origin = d3.min(data, function(d) { return d.Fertility; });
        vizobject.graph = graph;
        drawGraph();
        drawLineChartForCountry('ZWE');
        //alert('hello');
        //console.log(vizobject.countryMap);
    })

}

function drawGraph(){
    var svg = d3.select("svg"),
        margin = 200,
        width = svg.attr("width") - margin, //300
        height = svg.attr("height") - margin //200


    vizobject.graph.xScale = d3.scaleLinear().domain([vizobject.graph.xAxis_Origin, vizobject.graph.xAxis_Length]).range([0, width]);
    vizobject.graph.yScale = d3.scaleLinear().domain([vizobject.graph.yAxis_Origin, vizobject.graph.yAxis_Length]).range([height, 0]);

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
        .text('Year');

    // Y label
    svg.append('text')
        .attr('text-anchor', 'left')
        .attr('transform', 'translate(20,' + height + ')rotate(-90)')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Adolescent Fertility Rate');

    // Step 6
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(vizobject.graph.xScale));

    g.append("g")
        .call(d3.axisLeft(vizobject.graph.yScale));

}

function drawLineChartForCountry(countryid){
    let svg = d3.select("svg");
    var data = [[1987,'ZWE','Zimbabwe',110.613],
        [1988,'ZWE','Zimbabwe',109.0396],
        1989,'ZWE','Zimbabwe',107.4662];
    var color = vizobject.CountryColorMap.get(countryid);

    svg.selectAll(".line")
        .datum(data)
        .enter()
        .attr('stroke', function (d){console.log(d[0])});

    svg.selectAll(".line")
        .datum(data)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("id", countryid)
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return vizobject.graph.xScale(d[0]); })
                .y(function(d) { return vizobject.graph.yScale(+d[3]); })
        })
}
function removeLineChartForCountry(countryid){

}

function onclickScene1(){
    let countries = d3.map(vizobject.dataset, function(d){return(d.Country_Code)}).keys();
    alert(countries.size);
    window.location.replace("./scene1.html");
}
function onclickScene2(){
    window.location.replace("./scene2.html");

}
function onclickScene3(){
    window.location.replace("./scene3.html");
}
    async function drawGraphV2(countries){
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


