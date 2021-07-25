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
const vizobject = {
    color_category: d3.schemeCategory20,
    CountryColorMap: new Map(),
    graph: null,
    countryMap: new Map()
}

function generateCheckBoxes(countries){
    countries.sort();
    const input_type_checkbox_part1 = '<input type="checkbox" id="';
    const input_type_checkbox_part2 = '" name="';
    const input_type_checkbox_part3 = '" value=';
    const closing_bracket = '>';

    const input_type_label_part1 = '<label for="';
    const input_type_label_part2 = '">';
    const input_type_label_part3 = '</label><br>';

    let colorpalette = '<svg width="12" height="12">\n' +
        '  <rect width="12" height="12" style="fill:color_code_placeholder;stroke-width:3;stroke:color_code_placeholder"/>\n' +
        '</svg>';
    var finalResult = '';
    for(i in countries){
        let newcolorpalette = colorpalette.replace('color_code_placeholder', vizobject.countryMap.get(vizobject.countryMap.get(countries[i])[0].Country_Code));
        let temp = newcolorpalette+ input_type_checkbox_part1
                        +vizobject.countryMap.get(countries[i])[0].Country_Code
                        +input_type_checkbox_part2
                        +vizobject.countryMap.get(countries[i])[0].Country_Code
                        +input_type_checkbox_part3
                        +vizobject.countryMap.get(countries[i])[0].Country
                        +closing_bracket
                        +input_type_label_part1
                        +vizobject.countryMap.get(countries[i])[0].Country_Code
                        +input_type_label_part2
                        +vizobject.countryMap.get(countries[i])[0].Country
                        +input_type_label_part3
       //console.log(vizobject.countryMap.get(countries[i])[0]);
        console.log(temp);
        finalResult = finalResult + temp;

    }
    //console.log(finalResult);
    let container = document.getElementById('filter_container');
    container.innerHTML = finalResult;
}
function onbodyload(scene) {
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
        generateCheckBoxes(countries);

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

        //drawLineChartForCountry('LMC');
        //drawLineChartForCountry('HIC');
        drawLineChartForCountry('GAB');
        //removeLineChartForCountry('ZWE');

        //alert('hello');
        //console.log(vizobject.countryMap);
    })

}

function createChk(countrycode) {
    let container = document.getElementById('filter_container');
    var chk = document.createElement('input');  // CREATE CHECK BOX.
    chk.setAttribute('type', 'checkbox');       // SPECIFY THE TYPE OF ELEMENT.
    chk.setAttribute('id', countrycode);     // SET UNIQUE ID.

    chk.setAttribute('value', vizobject.countryMap.get(countrycode).Country);
    chk.setAttribute('name', 'Country');

    var lbl = document.createElement('label');  // CREATE LABEL.
    lbl.setAttribute('for', countrycode);

    // CREATE A TEXT NODE AND APPEND IT TO THE LABEL.
    lbl.appendChild(document.createTextNode(vizobject.countryMap.get(countrycode).Country));

    // APPEND THE NEWLY CREATED CHECKBOX AND LABEL TO THE <p> ELEMENT.
    container.appendChild(chk);
    container.appendChild(lbl);
}

function drawGraph() {

    var svg = d3.select("svg"),
        margin = 125,
        width = svg.attr("width") - margin, //300
        height = svg.attr("height") - margin //200


    vizobject.graph.xScale = d3.scaleLinear().domain([vizobject.graph.xAxis_Origin, vizobject.graph.xAxis_Length]).range([0, width]);
    vizobject.graph.yScale = d3.scaleLinear().domain([vizobject.graph.yAxis_Origin, vizobject.graph.yAxis_Length]).range([height, 0]);

    var g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")");

    // Step 5
    // Title
    svg.append('text')
        .attr('x', width / 2 + 100)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Adolescent Fertility Rate Trends');

    // X label
    svg.append('text')
        .attr('x', width / 2 + 100)
        .attr('y', height - 15 + 170)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 14)
        .text('Year [1960 - 2019]');

    // Y label
    svg.append('text')
        .attr('text-anchor', 'right')
        .attr('transform', 'translate(60,' + height + ')rotate(-90)')
        .style('font-family', 'Helvetica')
        .style('font-size', 14)
        .text('Adolescent Fertility Rate');

    // Step 6
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(vizobject.graph.xScale));

    g.append("g")
        .call(d3.axisLeft(vizobject.graph.yScale));

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
        .style("fill", "none")
        .style("stroke", color)
        .style("stroke-width", "2")
        .transition()
        .duration(5000)
        .attr("d", function (d) {
            return d3.line()
                .x(function (d) {
                    return vizobject.graph.xScale(d[0]) + 100;
                })
                .y(function (d) {
                    return vizobject.graph.yScale(d[3]);
                })
                (d)
        })
    var finalx;
    var finaly;
    var label;
    group
        .selectAll("dot")
        .data(countrydata)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            finalx = d[0];
            return vizobject.graph.xScale(d[0]) + 100;
        })
        .attr("cy", function (d) {
            finaly = d[3];
            label = d[1];
            return vizobject.graph.yScale(d[3]);
        })
        .attr("r", 2.5)
        .attr("stroke", 'white')
        .style("fill", color)
    console.log(finalx);
    console.log(finaly);
    console.log(label);

    group.selectAll("text")
        .append("text")
        .attr("x", 1200)
        .attr("y", 400)
        .attr("fill", 'black')
        .text(label);
}


function removeLineChartForCountry(countryid) {
    d3.select('#' + countryid).remove();

}


function onclickScene1() {
    let countries = d3.map(vizobject.dataset, function (d) {
        return (d.Country_Code)
    }).keys();
    alert(countries.size);
    window.location.replace("./scene1.html");
}

function onclickScene2() {
    window.location.replace("./scene2.html");

}

function onclickScene3() {
    window.location.replace("./scene3.html");
}


