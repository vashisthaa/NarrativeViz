const vizobject = {
    color_category: d3.schemeCategory20,
    CountryColorMap: new Map(),
    graph: null,
    countryMap: new Map()
}

const rowConverter = function (d) {
    return {
        //Make a new Date object for each year + month
        Year: parseInt(d.Year),
        //Convert from string to float
        Country: d.Country_Name,
        Country_Code: d.Country_Code,
        Fertility: parseFloat(d.Adolescent_Fertility)
    };
}

function generateCheckBoxes(countries) {
    var countryTuples = [];
    for (i in countries) {
        let code = vizobject.countryMap.get(countries[i])[0].Country_Code;
        let name = vizobject.countryMap.get(countries[i])[0].Country;
        let color = vizobject.CountryColorMap.get(code);
        let tuple = [name, code, color];

        countryTuples.push(tuple);
    }
    countryTuples.sort();
    //console.log(countryTuples);
    const input_type_checkbox_part1 = '<input type="checkbox" id="';
    const input_type_checkbox_part2 = '" name="';
    const input_type_checkbox_part3 = '" value=';
    const input_type_checkbox_part4 = ' onclick="handleCheckBoxEvent(this)"';

    const closing_bracket = '>';

    const input_type_label_part1 = '<label for="';
    const input_type_label_part2 = '">';
    const input_type_label_part3 = '</label><br>';

    let colorpalette = '<svg width="12" height="12">\n' +
        '  <rect width="12" height="12" style="fill:color_code_placeholder;stroke-width:3;stroke:color_code_placeholder"/>\n' +
        '</svg>';
    var finalResult = '';
    for (i in countryTuples) {
        let newcolorpalette = colorpalette.replaceAll('color_code_placeholder', countryTuples[i][2]);
        //let newcolorpalette = '';
        //console.log(countryTuples[i][0]);
        let temp = newcolorpalette + input_type_checkbox_part1
            + countryTuples[i][1]
            + input_type_checkbox_part2
            + countryTuples[i][1]
            + input_type_checkbox_part3
            + countryTuples[i][0]
            + input_type_checkbox_part4
            + closing_bracket
            + input_type_label_part1
            + countryTuples[i][1]
            + input_type_label_part2
            + countryTuples[i][0]
            + input_type_label_part3
        //console.log(vizobject.countryMap.get(countries[i])[0]);
        //console.log(temp);
        finalResult = finalResult + temp;

    }
    //console.log(finalResult);
    let container = document.getElementById('filter_container');
    container.innerHTML = finalResult;
}

function onbodyload() {
    const params = new URLSearchParams(window.location.search);
    const scene_param = params.get('scene');
    if(parseInt(scene_param) == 3){
        //console.log(document.getElementById('filter_country').style.padding);
        //document.getElementById('filter_country').remove();
        document.getElementById("filter_country").style.display = "inline";
    }
    let scene_name = ('Scene ') + (scene_param==null ? '1' : scene_param);
    //console.log(scene_name);
    document.getElementById('top_level_box_id').textContent = scene_name;

    let dataset = d3.csv("./data/WDI_Adolescent_Fertility_cleaned.csv", rowConverter, function (data) {
        const countries = d3.map(data, function (d) {
            return (d.Country_Code)
        }).keys();
        for (const i in countries) {
            vizobject.CountryColorMap.set(countries[i], vizobject.color_category[i % 20]);
        }
        for (const i in data) {
            if (!(data[i].Country_Code == undefined)) {
                let values = vizobject.countryMap.get(data[i].Country_Code);
                if (values == null) {
                    values = [];
                }
                values.push(data[i]);
                vizobject.countryMap.set(data[i].Country_Code, values);

            }

        }

        if(parseInt(scene_param) == 3){
            generateCheckBoxes(countries);
        }


        let graph = {};
        graph.xAxis_Length = 2020;
        graph.xAxis_Origin = 1960;
        graph.yAxis_Length = 240;
        graph.yAxis_Origin = 0;
        vizobject.graph = graph;
        //console.log(graph.xAxis_Origin);
        //console.log(graph.xAxis_Origin);
        //console.log(graph.yAxis_Length);
        //console.log(graph.yAxis_Origin);
        drawGraph();
        if(scene_param==null || parseInt(scene_param) == 1){
            drawLineChartForCountry('WLD');
        }
        if(parseInt(scene_param) == 2){
            drawLineChartForCountry('WLD');
            drawLineChartForCountry('LIC');
        }
        //removeLineChartForCountry('ZWE');

        //alert('hello');
        //console.log(vizobject.countryMap);
    })

}


function drawGraph() {
    var margin = 200;

    var svg = d3.select("svg");
    width = svg.attr("width") - margin, //300
    height = svg.attr("height") - margin //200


    vizobject.graph.xScale = d3.scaleLinear().domain([vizobject.graph.xAxis_Origin, vizobject.graph.xAxis_Length]).range([0, width]);
    vizobject.graph.yScale = d3.scaleLinear().domain([vizobject.graph.yAxis_Origin, vizobject.graph.yAxis_Length]).range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");


    svg.append('text')
        .attr('x', width / 2 + 100)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Adolescent Fertility Rate Trends');


    svg.append('text')
        .attr('x', width / 2 + 100)
        .attr('y', height - 15 + 170)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 14)
        .text('Year [1960 - 2019]');


    svg.append('text')
        .attr('text-anchor', 'right')
        .attr('transform', 'translate(60,' + height + ')rotate(-90)')
        .style('font-family', 'Helvetica')
        .style('font-size', 14)
        .text('Adolescent Fertility Rate');


    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(vizobject.graph.xScale));

    g.append("g")
        .call(d3.axisLeft(vizobject.graph.yScale));

}

function handleCheckBoxEvent(country) {
    //alert(countrycode);
    let checkbox = document.getElementById(country.id);
    if (checkbox.checked) {
        drawLineChartForCountry(country.id);
    } else {
        removeLineChartForCountry(country.id);
    }
    //console.log(country.id);
}

function drawLineChartForCountry(countryid) {
    let svg = d3.select("svg");
    let countrydata = Object.values(vizobject.countryMap.get(countryid));
    for (i in countrydata) {
        var row = countrydata[i];
        countrydata[i] = Object.values(row);
    }
    let color = vizobject.CountryColorMap.get(countryid);
    //console.log(countrydata);
    var group = svg.append('g')
        .attr('id', countryid);
    group.append("path")
        .datum(countrydata)
        .attr("class", "line")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", "none")
        .style("stroke", color)
        .style("stroke-width", "2")
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) {
                    return vizobject.graph.xScale(d[0]);
                })
                .y(function (d) {
                    //console.log(d);
                    return vizobject.graph.yScale(d[3]);
                })(d)
        })
    var finalx;
    var finaly;
    var label;


    // Define the div for the tooltip
    var tooltipdiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    group
        .selectAll("dot")
        .data(countrydata)
        .enter()
        .append("circle")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("cx", function (d) {
            finalx = d[0];
            return vizobject.graph.xScale(d[0]);
        })
        .attr("cy", function (d) {
            finaly = d[3];
            label = d[1];
            return vizobject.graph.yScale(d[3]);
        })
        .attr("r", 4)
        .attr("stroke", 'white')
        .on("mouseover", function(d) {
            //console.log(d3.event.pageX);
            //console.log(d3.event.pageY);
            tooltipdiv.transition()
                .duration(200)
                .style("opacity", 1);
            tooltipdiv.html( "Country: <b>"+ d[1] +"</b><br/>Year:<b> " + d[0] + " </b><br/>Fertility:<b> "  + d[3] + "</b>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 70) + "px");
        })
        .on("mouseout", function(d) {
            tooltipdiv.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .style("fill", color)
    //console.log(finalx);
    //console.log(finaly);
    //console.log(label);
    //if(label.length > 10){
      //  label = label.substring(0,9) + '...'
    //}
    group.append("text")
        .attr("transform", "translate("  + vizobject.graph.xScale(finalx + 7) + "," + vizobject.graph.yScale(finaly-53) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", 'black')
        .style("font-size", '10px')
        .text(label);
}


function removeLineChartForCountry(countryid) {
    d3.select('#' + countryid).remove();

}


function onclickScene1() {
    window.location.replace("./story.html?scene=1");
}

function onclickScene2() {
    window.location.replace("./story.html?scene=2");

}

function onclickScene3() {
    window.location.replace("./story.html?scene=3");
}


