
var svg = d3.select("body").append("svg")
            .attr("width",1500)
            .attr("height", 600);
                         
d3.json("subs.json", function(json){
    
        var scale = 0 

        var elemBody = svg.selectAll("image")
            .data(json.submarines)
            .enter().append("g")
            .attr("transform", function(d){return "translate(30,0)"})             

        var body = elemBody.append("ellipse")
            .attr("id", function(d){return d.id} )
            .attr("rx", function(d){return d.bodyrx})
            .attr("ry", function(d){return d.bodyrx - d.bodyrx / 2.5}) 
            .attr("cx", function(d){
                if(d.id != 0){ var id = d.id.substr(3); var sum = json.submarines[id].bodyrx
                    while(id != 0) { sum = sum + json.submarines[id-1].bodyrx * 2 + 20; id --; }}
                else {sum = d.bodyrx;}
                return sum;
                })
            .attr("cy", 80 )
            .attr("stroke","black")
            .attr("fill", "yellow")
            .on("click", function() {clickFunction("body")})    
        
        var i = 0;

        var porthole = elemBody.append("circle")
            .attr("id", function(d){return d.id} )
            .attr("cx", function(d){var cx = body[0][i].getBBox().x + json.submarines[i].bodyrx; 
                                    i++; return cx})
            .attr("cy", 80 )
            .attr("r", function(d){return d.portr})
            .attr("stroke","black")
            .attr("fill", "rgb(12,240,233)")
            .on("click", function() {clickFunction("porthole")})
                
        // adding towers
        
            i = 0;
        var j = 0;

        var tower = elemBody.append("rect")
            .attr("id", function(d){return d.id} )
            .attr("x", function(d){var cx = porthole[0][i].getBBox().x + d.portr  - 
                (d.towHeight + d.towHeight / 1.5) / 2;
                i++; return cx } )
            .attr("y", function(d){var cy = porthole[0][j].getBBox().y - d.towHeight
                - body[0][j].getBBox().height / 2 + d.portr + 4; j++; return cy})  
            .attr("width", function(d){return d.towHeight + d.towHeight / 1.5} )
            .attr("height", function(d){return d.towHeight} )
            .attr("stroke","black")
            .attr("fill", "yellow")
            .on("click", function() {clickFunction("tower")})

        // adding periscopes

        j = 0
        i = 0
        var h = 0;

        var periscope = elemBody.append("rect")
            .attr("id", function(d){id = h; h++; return "per" + id.toString()} )
            .attr("x", function(d){var cx = tower[0][i].getBBox().x + tower[0][i].getBBox().width - 10; 
                            i++; return cx } )
            .attr("y", function(d){var cy = tower[0][j].getBBox().y - d.perHeight ; j++; return cy})
            .attr("width", 6 )
            .attr("height", function(d){return d.perHeight} )
            .attr("stroke","black")
            .attr("fill", "yellow")
            .on("click", function() {clickFunction("periscope")});

        // adding helix

        j = 0
        i = 0
        h = 0
        var z = 0

        var helix1 = elemBody.append("ellipse")
            .attr("id", function(d){id = h; h++; return "hel" + id.toString()} )
            .attr("rx", function(d){return d.helrx} )
            .attr("ry", function(d){return d.helrx - d.helrx / 1.4} )
            .attr("cx", function(d){var cx = porthole[0][i].getBBox().y; 
                            i++; return cx })
            .attr("cy", function(d){var cy = -body[0][z].getBBox().x ; 
                            z++; return cy })
            .attr("stroke","black")
            .attr("fill", "grey")
                                //con rotate si invertono x e y della traslazione
            .attr("transform", function(d){var cx = body[0][j].getBBox().x; var cy = -d.helrx + d.portr;
                                return "translate("+cx+","+cy+") rotate(90)"})
            .on("click", function() {clickFunction("helix")});

       i = 0
       j = 0
       h = 0    
       z = 0

       var helix2 = elemBody.append("ellipse")
            .attr("id", function(d){id = h; h++; return "hel" + id.toString()} )
            .attr("rx", function(d){return d.helrx} )
            .attr("ry", function(d){return d.helrx - d.helrx / 1.4} )
            .attr("cx", function(d){var cx = porthole[0][i].getBBox().y; 
                            i++; return cx })
            .attr("cy", function(d){var cy = -body[0][z].getBBox().x ; 
                            z++; return cy })
            .attr("stroke","black")
            .attr("fill", "grey")
                //con rotate si invertono x e y della traslazione
            .attr("transform", function(d){var cx = body[0][j].getBBox().x; var cy = +d.helrx + d.portr;
                                return "translate("+cx+","+cy+") rotate(90)"})
            .on("click", function() {clickFunction("helix")});

        var button = document.createElement('button');
            button.id = 'myButton';
            button.innerHTML = 'Reset';
            button.style.position = 'sticky';
            button.style.left = "1400px";
            button.style.width = "100px";
            button.style.height = "30px";
            button.style.bottom = "800px";
            document.body.appendChild(button);
    
            button.onclick = function() {
                clickFunction("reset")};

        function clickFunction(String) {   
            var data = json.submarines
            for (i = 0; i < json.submarines.length; i++) {                              
                var bodyId = "#" + data[i].id
                var perId = "#" + periscope[0][i].id
                var helId = "#" + helix1[0][i].id
                var traslate;

                if(String == "body") 
                    traslate = data[i].bodyrx * 10;
                else if(String == "porthole")
                    traslate = data[i].portr * 33
                else if(String == "tower")
                    traslate = data[i].towHeight * 13
                else if(String == "periscope")
                    traslate = data[i].perHeight * 13
                else if(String == "helix")
                    traslate = data[i].helrx * 23
                else if (String == "reset")
                    var traslate = 80;

                svg.selectAll(bodyId).transition().duration(1500)
                    .attr("cy", traslate)
                    .attr("y", traslate - tower[0][i].getBBox().height - body[0][i].getBBox().height / 2 + 3)
                svg.selectAll(perId).transition().duration(1500)
                    .attr('y', traslate - tower[0][i].getBBox().height - body[0][i].getBBox().height / 2 
                    - periscope[0][i].getBBox().height + 3)
                svg.selectAll(helId).transition().duration(1500)
                    .attr('cx', traslate - data[i].portr)
                }
            }
                           
});