const svg=d3.select("svg"), padding=200;
const width=svg.attr("width")-padding, height=svg.attr("height")-padding;
const g=svg.append("g").attr("transform","translate("+ 100 +","+ 50 +")"); 
const colors = ["#008000","#556B2F","#ADFF2F","#32CD32"];
let county, education;
const tooltip=d3.select("body").append("div").attr("class","tooltip").attr("id", "tooltip").style("opacity", 0);

//TITLE
svg.append("text") 
   .attr("id","title")
   .attr("transform", 'translate(260, 25)')
   .attr("style","font-size:40px; font-weight:bold")
   .text("United States Educational Attainment");

//DESCRIPTION
svg.append("text")
   .attr("id","description")
   .attr("transform", 'translate(310, 50)')
   .attr("font-size", "15px")
   .text("Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)");

const drawing=()=>{
   g.selectAll("path")
    .data(county)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class","county")
    .attr("fill", countyItem=>{
      let id=countyItem['id']
      let countydata=education.find((item)=>{ return item['fips'] === id })
      let percent=countydata['bachelorsOrHigher'];
      return percent <= 20 ? colors[0] : percent <=40 ? colors[1] : percent <=60 ? colors[2] : colors[3] 
   })
    .attr("data-fips", countyItem=>{ return countyItem["id"] })
    .attr("data-education", countyItem=>{
      let id=countyItem['id'];
      let countydata=education.find((item)=>{ return item['fips'] === id})
      let percent=countydata['bachelorsOrHigher'];
      return percent;
   })
  .on("mouseover", (countyItem) => { 
      tooltip.style("opacity", 0.9)
      let id=countyItem['id']
      let countydata=education.find((item)=>{ return item['fips'] === id })
      tooltip.html(countydata['fips'] + '<br />' + countydata['area_name'] + "<br />"+ countydata['state'] + '<br />' + countydata['bachelorsOrHigher'] + "%")
      tooltip.attr("data-education", countydata['bachelorsOrHigher'])
             .style("left", d3.event.pageX + "px")
             .style("top", d3.event.pageY - 28 + "px");
       })   
    .on("mouseout", d => {
             tooltip.style("opacity", 0);
       });
  
  //LEGEND
     svg.append("g")
        .attr("id","legend")
        .attr("transform","translate(670, 80)")
        .selectAll("rect")
        .data(colors)
        .enter()
        .append("rect")
        .attr("x", (d, i)=> i * 50)
        .attr("width", 50)
        .attr("height", 15)
        .attr("fill", d=>d);
  

    svg.append("g")
       .attr("transform","translate(710, 80)")
       .selectAll("text")
       .data(["20%", "60%", "65%"])
       .enter()
       .append("text")
       .text((d) => d)
       .attr("style","font-size:12px; fill:red")
       .attr("x", (d, i)=> i * 50)
       .attr("y", (d, i) => h - (3 * d) - 5);  
}  

fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
     .then(response=>response.json())
     .then(data=>{
       county=topojson.feature(data, data.objects.counties).features;
       fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
        .then(response=>response.json())
        .then(data=>{
          education=data;
          drawing();
       })
    })

     