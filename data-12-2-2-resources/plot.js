// sort data by population growth
var sortedCities = cityGrowths.sort((a,b) =>
a.Increase_from_2016 - b.Increase_from_2016).reverse(); 

// check result
console.log(sortedCities);

// get top 5 cities
var topFiveCities = sortedCities.slice(0,5);

// get name and growth arrays of top 5 cities
var topFiveCityNames = topFiveCities.map(city => city.City);
var topFiveCityGrowths = topFiveCities.map(city => parseInt(city.Increase_from_2016));

// check results
console.log(topFiveCityNames);
console.log(topFiveCityGrowths);

// create trace for bar chart
var trace = {
    x: topFiveCityNames,
    y: topFiveCityGrowths,
    type: "bar"
};

// create data for bar chart
var data = [trace];
var layout = {
    title: "Most Rapidly Growing Cities",
    xaxis: { title: "City" },
    yaxis: { title: "Population Growth, 2016-2017"}
};

// render the bar chart @ the "bar-plot" section
Plotly.newPlot("bar-plot", data, layout);