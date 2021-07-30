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
    const input_type_checkbox_part1 = '<input type="checkbox" id=chk_"';
    const input_type_checkbox_part2 = '" name="';
    const input_type_checkbox_part3 = '" value=';
    const input_type_checkbox_part4 = ' onclick="handleCheckBoxEvent(this)"';

    const closing_bracket = '>';

    const input_type_label_part1 = '<label for=chk_"';
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
        vizobject.countryList = countries;

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

        let scene_param_value = scene_param==null? 1: parseInt(scene_param);
        drawGraph(scene_param_value);
        if(scene_param_value == 1){
            drawLineChartForCountry('WLD');
        }
        if(scene_param_value == 2){
            drawLineChartForCountry('LIC');
            drawLineChartForCountry('MIC');
            drawLineChartForCountry('HIC');
        }
        if(scene_param_value == 3){
            drawLineChartForCountry('SOM');
            drawLineChartForCountry('ARE');
            drawLineChartForCountry('ARG');

            checkbox = document.getElementById('chk_'+'"SOM"');
            checkbox.checked = true;
            checkbox = document.getElementById('chk_'+'"ARE"');
            checkbox.checked = true;
            checkbox = document.getElementById('chk_'+'"ARG"');
            checkbox.checked = true;
        }

        addcaption(scene_param_value);
        addannotations(scene_param_value);
        addFooter(scene_param_value);
        //alert('hello');
        //console.log(vizobject.countryMap);
    })

}


function drawGraph(scene) {
    var margin = 200;

    var svg = d3.select("svg");
    width = svg.attr("width") - margin, //300
    height = svg.attr("height") - margin //200


    vizobject.graph.xScale = d3.scaleLinear().domain([vizobject.graph.xAxis_Origin, vizobject.graph.xAxis_Length]).range([0, width]);
    vizobject.graph.yScale = d3.scaleLinear().domain([vizobject.graph.yAxis_Origin, vizobject.graph.yAxis_Length]).range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    if(scene ==1){
        svg.append('text')
            .attr('x', width / 2 + 100)
            .attr('y', 90)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Helvetica')
            .style('font-size', 20)
            .text('Adolescent Fertility Rate Trends (World)');
    }else if(scene==2){
        svg.append('text')
            .attr('x', width / 2 + 100)
            .attr('y', 90)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Helvetica')
            .style('font-size', 20)
            .text('Adolescent Fertility Rate Trends (By Income Groups)');
    }else if(scene == 3){
        svg.append('text')
            .attr('x', width / 2 + 100)
            .attr('y', 90)
            .attr('text-anchor', 'middle')
            .style('font-family', 'Helvetica')
            .style('font-size', 20)
            .text('Compare [Adolescent Fertility Rate Trends] By Countries/Regions');
    }



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
        drawLineChartForCountry(country.id.substring(5,country.id.length-1));
    } else {
        removeLineChartForCountry(country.id.substring(5,country.id.length-1));
    }
    //console.log(country.id);
}

function drawLinceChartForCountries(countries){
    for(i in countries){
        drawLineChartForCountry(countries[i]);
    }
}

const caption_box_html_1 = '</br></br><li>Adolescent Fertility Rate is steadily declining in the world.</li></br><li>More than 100% reduction since 1960. Since 2018 the decline is slower.\n' +
    '            </li>\n' +
    '            </br>\n' +
    '            <li>\n' +
    '                The Average drop per year is 0.75.\n' +
    '            </li>\n' +
    '            </br>\n' +
    '            <li>\n' +
    '                Average drop per year = (Rate in 1960 - Rate in 2019) / 59\n' +
    '            </li>';
const caption_box_html_2 = '</br></br><li> There is universal decline since 1990.' +
    '</br></br><li> The Low Income categories though have improved a lot but the gap is still pretty high.' +
    '</br></br><li> The highest of High Income group in 1960 is still lower than the lowest of Low income in 2019.' +
    '</br></br><li> The gap is narrowed down between middle income and high income groups compared to start of year 1960.' +
    '</br></br><li> The gap is widened between low income and middle income groups compared to start of year 1960.';
const caption_box_html_scene_3_clear = '</br></br><li> Explore the trends for various countries/regions by selecting in the filter box in the right hand pane';
const caption_box_html_3 = '</br></br><li> Explore the trends for various countries/regions by selecting in the filter box in the right hand pane. For example shown here' +
    '</br></br><li> Somalia has worst performance since 1960. ' +
    '</br></br><li> UAE has best performance since 1960. ' +
    '</br></br><li> Argentina has almost flat performance ';
function addcaption(sceneid){
    if(sceneid == 1){
        document.getElementById("caption_box").innerHTML= caption_box_html_1;
    }else if(sceneid == 2){
        document.getElementById("caption_box").innerHTML= caption_box_html_2;
    }else if (sceneid == 3){
        document.getElementById("caption_box").innerHTML= caption_box_html_3;
    }

}
var footer_box_html_1;
var footer_box_html_2;
var footer_box_html_3 = '<b>Data Source: <a href="https://data.worldbank.org/indicator" target="_blank">World Data Indicators</a></b>';
function addFooter(sceneid){
    if(sceneid == 3){
        document.getElementById("footer_box").innerHTML= footer_box_html_3;

    }
}
function addannotations(sceneid){
    if(sceneid == 1){
        var group = d3.select("#svg_viz")
            .select("svg")
            .append("g");

        //console.log(vizobject.graph.xScale(2000));
        //console.log(vizobject.graph.yScale(56.32864573));

        group.append('rect')
            .attr("x", vizobject.graph.xScale(2010))
            .attr("y", vizobject.graph.yScale(56.32864573)-190)
            .attr('width', 345)
            .attr('height', 70)
            .attr('rx', 8)
            .attr('ry', 8)
            .attr("fill", "lightgreen")
            .attr("class", "annotationBox");

        group.append("text")
            .attr("x", vizobject.graph.xScale(2010)+10)
            .attr("y", vizobject.graph.yScale(56.32864573)-165)
            .attr("class", "annotationText")
            .style('font','15px Helvetica')
            .text("[1996-2004] Avg drop in Fertility rate = 1.33/year.");
        group.append("text")
            .attr("x", vizobject.graph.xScale(2010)+10)
            .attr("y", vizobject.graph.yScale(56.32864573)-135)
            .attr("class", "annotationText")
            .style('font','15px Helvetica')
            .text("2002 is the best year with Average drop as 1.70");
        group
            .append("line")
            .attr("opacity", 1)
            .attr("style", "stroke:rgb(0,0,0);stroke-width:0.5px")
            .attr("x1", vizobject.graph.xScale(1996)+100)
            .attr("y1", vizobject.graph.yScale(61.33489281)+100)
            .attr("x2", vizobject.graph.xScale(2017)+70)
            .attr("y2", vizobject.graph.yScale(56.32864573)-120);

        group
            .append("line")
            .attr("opacity", 1)
            .attr("style", "stroke:rgb(0,0,0);stroke-width:0.5px")
            .attr("x1", vizobject.graph.xScale(2004)+100)
            .attr("y1", vizobject.graph.yScale(50.52434826)+100)
            .attr("x2", vizobject.graph.xScale(2017)+70)
            .attr("y2", vizobject.graph.yScale(56.32864573)-120);
        //group.remove();
    }else if(sceneid == 2){
        var group = d3.select("#svg_viz")
            .select("svg")
            .append("g");

        //console.log(vizobject.graph.xScale(2000));
        //console.log(vizobject.graph.yScale(56.32864573));

        group.append('rect')
            .attr("x", vizobject.graph.xScale(2005))
            .attr("y", vizobject.graph.yScale(56.32864573)-245)
            .attr('width', 345)
            .attr('height', 70)
            .attr('rx', 8)
            .attr('ry', 8)
            .attr("fill", "lightgreen")
            .attr("class", "annotationBox");

        group.append("text")
            .attr("x", vizobject.graph.xScale(2005)+10)
            .attr("y", vizobject.graph.yScale(56.32864573)-220)
            .attr("class", "annotationText")
            .style('font','15px Helvetica')
            .text(" 1989 marks final upward trend before major");
        group.append("text")
            .attr("x", vizobject.graph.xScale(2005)+10)
            .attr("y", vizobject.graph.yScale(56.32864573)-190)
            .attr("class", "annotationText")
            .style('font','15px Helvetica')
            .text(" improvements starts in 21st Century.");
        group
            .append("line")
            .attr("opacity", 1)
            .attr("style", "stroke:rgb(0,0,0);stroke-width:0.5px")
            .attr("x1", vizobject.graph.xScale(1989)+100)
            .attr("y1", vizobject.graph.yScale(129.1096599)+100)
            .attr("x2", vizobject.graph.xScale(2012)+70)
            .attr("y2", vizobject.graph.yScale(200)+95);

        //group.remove();
    }
}
function getCol(matrix, col){
    var column = [];
    for(var i=0; i<matrix.length; i++){
        column.push(matrix[i][col]);
    }
    return column; // return column data..
}

function drawLineChartForCountry(countryid) {
    let svg = d3.select("svg");
    console.log(countryid);
    let countrydata = Object.values(vizobject.countryMap.get(countryid));
    for (i in countrydata) {
        var row = countrydata[i];
        countrydata[i] = Object.values(row);
    }
    var maxRow = countrydata.map(function(row){ return Math.max.apply(Math, row); });

    let color = vizobject.CountryColorMap.get(countryid);
    col = getCol(countrydata, 3);
    //console.log(col);
    maxVal = Math.max.apply(null, col);
    minVal = Math.min.apply(null, col)
    //console.log('Max For:' + countrydata[0][1] + ' ' + Math.max.apply(null, col));
    //console.log('Min For:' + countrydata[0][1] + ' ' + Math.min.apply(null, col));
    percentage = ((col[0] - col[59])*100)/maxVal;
    console.log(countrydata[0][1]+','+ percentage);
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
                .style("opacity", 1);
            tooltipdiv.html( "Country: <b>"+ d[1] +"</b><br/>Year:<b> " + d[0] + " </b><br/>Fertility:<b> "  + d[3] + "</b>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 70) + "px");
        })
        .on("mouseout", function(d) {
            tooltipdiv.transition()
                .style("opacity", 0);
        })
        .style("fill", color);




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


function onclickClearFilter(){
    var clist = document.getElementsByTagName("input");
    for (var i = 0; i < clist.length; ++i) {
        console.log(clist[i]);
        clist[i].checked = false;
    }
    for(i in vizobject.countryList){
        removeLineChartForCountry(vizobject.countryList[i]);
    }
    document.getElementById("caption_box").innerHTML= caption_box_html_scene_3_clear;
}
function onclickScene1() {
    window.location.replace("./index.html?scene=1");

}

function onclickScene2() {
    window.location.replace("./index.html?scene=2");

}

function onclickScene3() {
    window.location.replace("./index.html?scene=3");
}


