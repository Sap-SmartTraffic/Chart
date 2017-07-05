function Loader(width,height,strokeWidth) {
    this.SVG_NS = "http://www.w3.org/2000/svg";
    this.id = "loader";
    this.width = width;
    this.height = height;
    this.strokeWidth = strokeWidth;
}

Loader.prototype.makeSVG = function(tag, attributes) {
    var elem = document.createElementNS(this.SVG_NS, tag);  
    for (var attribute in attributes) {
        var name = attribute;  
        var value = attributes[attribute];  
        elem.setAttribute(name, value);  
    }  
    return elem; 
}

Loader.prototype.addCircleLoader = function() {
    var frament =document.createDocumentFragment();
    var centerX = this.width / 2,
        centerY = this.height / 2,
        radius1 = this.width > this.height? this.height / 2 - this.strokeWidth : this.width / 2 - this.strokeWidth,
        radius2 = radius1 - this.strokeWidth * 3;

    var svgNode = this.makeSVG("svg",{id:this.id, width:this.width,height:this.height});
    var group = this.makeSVG("g",{});
    
    var circle1 = this.makeSVG("circle",{cx:centerX, cy:centerY, r:radius1});
    group.appendChild(circle1);
    var path1 = this.makeSVG("path",{id:"path1",d:"M"+centerX+" "+this.strokeWidth+" "+"A"+radius1+" "+radius1+" 0 0 1 "+centerX+" "+(centerY+radius1)});
    var animateTransform1 = this.makeSVG("animateTransform",{attributeName:"transform", type:"rotate", from:"0"+" "+centerX+" "+centerY, to:"360"+" "+centerX+" "+centerY, dur:"2s", repeatCount:"indefinite"});
    path1.appendChild(animateTransform1);
    group.appendChild(path1);

    var circle2 = this.makeSVG("circle",{cx:centerX, cy:centerY, r:radius2});
    group.appendChild(circle2);
    var path2 = this.makeSVG("path",{id:"path2",d:"M"+centerX+" "+(centerY+radius2)+" "+"A"+radius2+" "+radius2+" 0 0 1 "+centerX+" "+(centerY-radius2)});
    var animateTransform2 = this.makeSVG("animateTransform",{attributeName:"transform", type:"rotate", from:"360"+" "+centerX+" "+centerY, to:"0"+" "+centerX+" "+centerY, dur:"2s", repeatCount:"indefinite"});
    path2.appendChild(animateTransform2);
    group.appendChild(path2);

    var text = this.makeSVG("text",{transform:"translate("+centerX+","+centerY+")"});
    var str = "Loading...";
    for(var i = 0; i < str.length; i++) {
        var tspan = this.makeSVG("tspan",{});
        tspan.textContent=str.charAt(i);
        if (i == 0) {
            var animateSize = this.makeSVG("animate",{id:"ani"+i,attributeName:"font-size",values:"20;24;20",begin:"0s;ani9.end",dur:"0.5s"});
            var animateColor = this.makeSVG("animate",{attributeName:"fill",from:"yellow",to:"aqua",begin:"0s;ani"+str.length+".end",dur:"0.5s",fill:"freeze"});
        } else {
            var animateSize = this.makeSVG("animate",{id:"ani"+i,attributeName:"font-size",values:"20;24;20",begin:("ani"+(i-1)+".end"),dur:"0.5s"});
            var animateColor = this.makeSVG("animate",{attributeName:"fill",from:"yellow",to:"aqua",begin:("ani"+(i-1)+".end"),dur:"0.5s",fill:"freeze"});
        }
        tspan.appendChild(animateSize);
        tspan.appendChild(animateColor);
        text.appendChild(tspan);
    }
    group.appendChild(text);

    svgNode.appendChild(group);
    frament.appendChild(svgNode);
    document.body.appendChild(frament);
}

Loader.prototype.addBarLoader = function(){
    var frament =document.createDocumentFragment();
    var svgNode = this.makeSVG("svg",{id:this.id, width:this.width,height:this.height});

    var defs = this.makeSVG("defs",{});
    var linearGradient = this.makeSVG("linearGradient",{id:"color-gradient",x1:"0", y1:"0%", x2:"99.33%", y2:"0%", gradientUnits:"userSpaceOnUse"})
    var stop1 = this.makeSVG("stop",{offset:"0%",style:"stop-color:yellow"});
    var stop2 = this.makeSVG("stop",{offset:"100%",style:"stop-color:aqua"});
    linearGradient.appendChild(stop1);
    linearGradient.appendChild(stop2); 
    defs.appendChild(linearGradient);
    svgNode.appendChild(defs);

    var lineBase = this.makeSVG("line",{id:"lineBase", x1:"0", y1:this.height/3,x2:"100%",y2:this.height/3+0.001})
    var lineColor = this.makeSVG("line",{id:"colorful",x1:"0",y1:this.height/3, x2:"99.33%",y2:this.height/3+0.001})
    svgNode.appendChild(lineBase);
    svgNode.appendChild(lineColor);

    var text = this.makeSVG("text",{transform:"translate("+this.width/2+","+this.height/3*2+")"});
    var str = "Loading...";
    for(var i = 0; i < str.length; i++) {
        var tspan = this.makeSVG("tspan",{});
        tspan.textContent=str.charAt(i);
        var animateSize = this.makeSVG("animate",{id:"ani"+i,attributeName:"font-size",values:"20;24;20",begin:(i==0?"0s":("ani"+(i-1)+".end")),dur:"0.5s"});
        var animateColor = this.makeSVG("animate",{attributeName:"fill",from:"yellow",to:"aqua",begin:(i==0?"0s":("ani"+(i-1)+".end")),dur:"0.5s",fill:"freeze"});
        tspan.appendChild(animateSize);
        tspan.appendChild(animateColor);
        text.appendChild(tspan);
    }
    svgNode.appendChild(text);

    frament.appendChild(svgNode);
    document.body.appendChild(frament);
}

Loader.prototype.loadBarLoader =function(value) {
    document.querySelector("#colorful").setAttribute("x2",value+"%");
}

Loader.prototype.removeLoader =function() {
    var loader =document.getElementById("loader")
    loader.remove();
}