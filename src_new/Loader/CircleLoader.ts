export class Loader {
    SVG_NS = "http://www.w3.org/2000/svg";
    id = "loader";
    width:number
    height:number
    strokeWidth:number
    oldRatio:number
    interval:number
    constructor(width,height,strokeWidth) {
        this.width = width;
        this.height = height;
        this.strokeWidth = strokeWidth;
    }

    makeContainer(id) {
        let elem = document.createElementNS("http://www.w3.org/1999/xhtml", "div");  
        elem.style.position="absolute";
        elem.style.left="0px";
        elem.style.right="0px";
        elem.style.top="0px";
        elem.style.bottom="0px";
        elem.setAttribute("id",id)
        elem.classList.add("loaderContainer")
        return elem; 
    }

    makeSVG(tag, attributes) {
        let elem = document.createElementNS(this.SVG_NS, tag);  
        for (let attribute in attributes) {
            let name = attribute;  
            let value = attributes[attribute];  
            elem.setAttribute(name, value);  
        }  
        return elem; 
    }

    addCircleLoader() {
        let container=this.makeContainer(this.id)
        let frament =document.createDocumentFragment();
        let centerX = this.width / 2,
            centerY = this.width / 2,
            radius1 = this.width / 2 - this.strokeWidth,
            radius2 = radius1 - this.strokeWidth * 3;
        let svgNode = this.makeSVG("svg",{width:this.width,height:this.height});
        let group = this.makeSVG("g",{});
        
        let circle1 = this.makeSVG("circle",{cx:centerX, cy:centerY, r:radius1});
        group.appendChild(circle1);
        let path1 = this.makeSVG("path",{class:"path1",d:"M"+centerX+" "+this.strokeWidth+" "+"A"+radius1+" "+radius1+" 0 0 1 "+centerX+" "+(centerY+radius1)});
        let animateTransform1 = this.makeSVG("animateTransform",{attributeName:"transform", type:"rotate", from:"0"+" "+centerX+" "+centerY, to:"360"+" "+centerX+" "+centerY, dur:"2s", repeatCount:"indefinite"});
        path1.appendChild(animateTransform1);
        group.appendChild(path1);

        let circle2 = this.makeSVG("circle",{cx:centerX, cy:centerY, r:radius2});
        group.appendChild(circle2);
        let path2 = this.makeSVG("path",{class:"path2",d:"M"+centerX+" "+(centerY+radius2)+" "+"A"+radius2+" "+radius2+" 0 0 1 "+centerX+" "+(centerY-radius2)});
        let animateTransform2 = this.makeSVG("animateTransform",{attributeName:"transform", type:"rotate", from:"360"+" "+centerX+" "+centerY, to:"0"+" "+centerX+" "+centerY, dur:"2s", repeatCount:"indefinite"});
        path2.appendChild(animateTransform2);
        group.appendChild(path2);

        let ratio = this.makeSVG("text",{transform:"translate("+centerX+","+centerY+")", class:"loaderRatio"});
        ratio.textContent = "0%"
        group.appendChild(ratio)

        let text = this.makeSVG("text",{transform:"translate("+centerX+","+((this.height+this.width)/2)+")", class:"loaderText"});
        let str = "Calculating...";
        for(let i = 0; i < str.length; i++) {
            let tspan = this.makeSVG("tspan",{});
            tspan.textContent=str.charAt(i);
            let animateSize,animateColor
            if (i == 0) {
                animateSize = this.makeSVG("animate",{id:"ani"+i,attributeName:"font-size",values:"20;24;20",begin:"0s;ani13.end",dur:"0.5s"});
                animateColor = this.makeSVG("animate",{attributeName:"fill",from:"yellow",to:"aqua",begin:"0s;ani"+str.length+".end",dur:"0.5s",fill:"freeze"});
            } else {
                animateSize = this.makeSVG("animate",{id:"ani"+i,attributeName:"font-size",values:"20;24;20",begin:("ani"+(i-1)+".end"),dur:"0.5s"});
                animateColor = this.makeSVG("animate",{attributeName:"fill",from:"yellow",to:"aqua",begin:("ani"+(i-1)+".end"),dur:"0.5s",fill:"freeze"});
            }
            tspan.appendChild(animateSize);
            tspan.appendChild(animateColor);
            text.appendChild(tspan);
        }
        group.appendChild(text);

        svgNode.appendChild(group);
        frament.appendChild(svgNode);
        container.appendChild(frament)
        document.body.appendChild(container);
        this.oldRatio = 0;
        this.interval = 0;
    }

    removeLoader() {
        let loader =document.getElementById(this.id)
        loader.remove()
    }

    loadCircleLoader(ratio) {
        var temp = this.oldRatio;
        setTimeout(()=>{
            setInterval(()=>{
                if(this.oldRatio < ratio) {
                    document.getElementsByClassName("loaderRatio")[0].textContent = this.oldRatio + 1 + "%";
                    this.oldRatio += 1;
                }
                else {
                    if(ratio == 100) {
                        this.removeLoader()
                    }
                    else
                        return
                }
            },50)
        },this.interval)
        this.interval = (ratio - temp)*50
    }
}