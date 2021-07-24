
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
        //console.log('Hello');
        let graph = {};
        //graph.xAxis_Length = d3.max(data, function(d) { return d.Year; }) + 10;
        //graph.xAxis_Origin = d3.min(data, function(d) { return d.Year; });
        //graph.yAxis_Length = d3.max(data, function(d) { return d.Fertility; }) + 10;
        //graph.yAxis_Origin = d3.min(data, function(d) { return d.Fertility; });
        graph.xAxis_Length = 2020;
        graph.xAxis_Origin = 1960;
        graph.yAxis_Length = 240;
        graph.yAxis_Origin = 0;
        vizobject.graph = graph;
        //drawGraphV2();
        //console.log(graph.xAxis_Origin);
        //console.log(graph.xAxis_Origin);
        //console.log(graph.yAxis_Length);
        //console.log(graph.yAxis_Origin);
        drawGraph();

        drawLineChartForCountry('ZWE');
        drawLineChartForCountry('YEM');
        drawLineChartForCountry('WLD');
        //removeLineChartForCountry('ZWE');

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
    let countrydata = Object.values(vizobject.countryMap.get(countryid));
    for(i in countrydata){
        var row = countrydata[i];
        countrydata[i] = Object.values(row);
    }
    let color = vizobject.CountryColorMap.get(countryid);
    console.log(countrydata);
    svg.append("path")
        .datum(countrydata)
        .attr("class", "line")
        .style("fill", "none")
        .style("stroke", 'red')
        .style("stroke-width", "2")
        .attr("d", function(d){
            return d3.line()
                .x(function(d) { return vizobject.graph.xScale(d[0]); })
                .y(function(d) { return vizobject.graph.yScale(d[3]); })
                (d)
        })


}
function removeLineChartForCountry(countryid){
    d3.select("svg").remove(countryid);
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

        var dataset = [[1987,'ZWE','Zimbabwe',110.613],
            [1988,'ZWE','Zimbabwe',109.0396],
            [1989,'ZWE','Zimbabwe',107.4662]];

        // Step 3
        var svg = d3.select("svg"),
            margin = 200,
            width = svg.attr("width") - margin, //300
            height = svg.attr("height") - margin //200

        // Step 4
        var xScale = d3.scaleLinear().domain([1960, 2020]).range([0, width]),
            yScale = d3.scaleLinear().domain([100, 120]).range([height, 0]);

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
            .y(function(d) { return yScale(d[3]); })
            .curve(d3.curveMonotoneX)

        svg.append("path")
            .datum(dataset)
            .attr("class", "line")
            .attr("transform", "translate(" + 100 + "," + 100 + ")")
            .attr("d", line)
            .style("fill", "none")
            .style("stroke", "#CC0000")
            .style("stroke-width", "2");
    }


