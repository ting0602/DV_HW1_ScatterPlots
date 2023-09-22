// load iris.csv
d3.csv("http://vis.lab.djosix.com:2023/data/iris.csv").then(function(data) {
    // init setting
    const svg = d3.select("#plot")
        .attr("width", 800)
        .attr("height", 700);
    const margin = { top: 50, right: 50, bottom: 50, left: 100 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    // initialize the options
    const xAxisSelect = document.getElementById("x-axis");
    const yAxisSelect = document.getElementById("y-axis");
    xAxisSelect.value = "sepal length";
    yAxisSelect.value = "sepal width";

    // default (x, y): (sepal length, sepal width)
    // init the scales
    const xScale = d3.scaleLinear()
        .domain([d3.min(data, d => +d['sepal length']), d3.max(data, d => +d['sepal length'])])
        .range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear()
        .domain([d3.min(data, d => +d['sepal width']), d3.max(data, d => +d['sepal width'])])
        .range([height - margin.bottom, margin.top]);

    // init x-axis & y-axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // add x-axis & y-axis to svg
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);

    // add label
    const xAxisLabel = svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom + 40)
        .style("text-anchor", "middle")
        .text("sepal length");

    const yAxisLabel = svg.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -(height / 2))
        .attr("y", margin.left - 40)
        .attr("transform", "rotate(-90)")
        .style("text-anchor", "middle")
        .text("sepal width");

    // mapping class to color
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d['class']))
        .range(["red", "green", "blue"]);

    // add dot (total: 150)
    svg.selectAll(".dot")
        .data(data.filter(d => d['sepal length'] != 0)) // remove null data
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(+d['sepal length']))
        .attr("cy", d => yScale(+d['sepal width']))
        .attr("r", 3)
        .style("fill", d => color(d['class']))
        .on("mouseover", handleMouseOver) // show up the data info
        .on("mouseout", handleMouseOut); // fade away

    // monitor
    d3.select("#x-axis").on("change", function() {
        const newXAttribute = this.value;
        updateXAxis(newXAttribute);
    });

    d3.select("#y-axis").on("change", function() {
        const newYAttribute = this.value;
        updateYAxis(newYAttribute);
    });

    // update x-axis
    function updateXAxis(newXAttribute) {
        xScale.domain([d3.min(data, d => +d[newXAttribute]), d3.max(data, d => +d[newXAttribute])]);
        svg.select(".x-axis")
            .transition()
            .duration(500)
            .call(xAxis);

        // update dots
        svg.selectAll(".dot")
            .transition()
            .duration(500)
            .attr("cx", d => xScale(+d[newXAttribute]));

        // update x-axis label
        xAxisLabel.text(newXAttribute);
    }

    // update y-axis
    function updateYAxis(newYAttribute) {
        yScale.domain([d3.min(data, d => +d[newYAttribute]), d3.max(data, d => +d[newYAttribute])]);
        svg.select(".y-axis")
            .transition()
            .duration(500)
            .call(yAxis);

        svg.selectAll(".dot")
            .transition()
            .duration(500)
            .attr("cy", d => yScale(+d[newYAttribute]));

        yAxisLabel.text(newYAttribute);
    }
});

// Additional Functions
// MouseOver => show info
function handleMouseOver(event, d) {
    // get info
    const sepalLength = d['sepal length'];
    const sepalWidth = d['sepal width'];
    const petalLength = d['petal length'];
    const petalWidth = d['petal width'];
    const flowerClass = d['class'];

    // create info box
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("border", "1px solid #ddd")
        .style("padding", "10px")
        .style("opacity", 0.9);

    // info box HTML
    tooltip.html(`
        <p>Sepal Length: ${sepalLength}</p>
        <p>Sepal Width: ${sepalWidth}</p>
        <p>Petal Length: ${petalLength}</p>
        <p>Petal Width: ${petalWidth}</p>
        <p>Class: ${flowerClass}</p>
    `);

    // info box CSS
    tooltip.style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY + 10) + "px");
}

// MouseOut => fade away
function handleMouseOut() {
    d3.select(".tooltip").remove();
}