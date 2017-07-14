import {IProgressLoader} from "../ILoader"
import {Util} from "../../../Core/Util"

export class BarLoader implements IProgressLoader{
    id = "barLoader"
    el: HTMLElement
    width: number
    height: number
    oldRatio:number
    interval:number
    constructor(width, height) {
        this.width = Util.toPixel(width)
        this.height = Util.toPixel(height)
    }

    setWidth(width:string) {
        this.width = Util.toPixel(width)
        return this
    }

    setHeight(height:string) {
        this.height = Util.toPixel(height)
        return this
    }

    makeSVG(tag, attributes) {
        let elem = document.createElementNS("http://www.w3.org/2000/svg", tag);  
        for (let attribute in attributes) {
            let name = attribute  
            let value = attributes[attribute]  
            elem.setAttribute(name, value)  
        }  
        return elem 
    }

    addTo(el:HTMLElement) {
        this.el.style.transform = "translate(-100%,0)"
        this.oldRatio = 0
        this.interval = 1000
        el.appendChild(this.el)
        return this
    }

    toElement() {
        this.el = document.createElementNS("http://www.w3.org/1999/xhtml", "div")
        this.el.setAttribute("id",this.id)
        this.el.setAttribute("class","barLoaderContainer")

        let svgNode = this.makeSVG("svg",{width:this.width, height:this.height})

        let defs = this.makeSVG("defs",{})
        let linearGradient = this.makeSVG("linearGradient",{id:"color-gradient",x1:"0", y1:"0%", x2:"99.33%", y2:"0%", gradientUnits:"userSpaceOnUse"})
        let stop1 = this.makeSVG("stop",{offset:"0%",style:"stop-color:yellow"})
        let stop2 = this.makeSVG("stop",{offset:"100%",style:"stop-color:aqua"})
        linearGradient.appendChild(stop1)
        linearGradient.appendChild(stop2)
        defs.appendChild(linearGradient)
        svgNode.appendChild(defs)

        let lineBase = this.makeSVG("line",{id:"lineBase", x1:"0", y1:this.height/3,x2:"100%",y2:this.height/3+0.001})
        let lineColor = this.makeSVG("line",{id:"colorful",x1:"0", y1:this.height/3, x2:"0%",y2:this.height/3+0.001})
        svgNode.appendChild(lineBase)
        svgNode.appendChild(lineColor)

        let text = this.makeSVG("text",{transform:`translate(${this.width/2}, ${this.height/3*2})`})
        let str = "Loading..."
        for(let i = 0; i < str.length; i++) {
            let tspan = this.makeSVG("tspan",{})
            tspan.textContent=str.charAt(i)
            let animateSize, animateColor
            if (i == 0) {
                animateSize = this.makeSVG("animate",{id:"ani"+i,attributeName:"font-size",values:"20;24;20",begin:"0s;ani9.end",dur:"0.5s"})
                animateColor = this.makeSVG("animate",{attributeName:"fill",from:"yellow",to:"aqua",begin:"0s;ani"+str.length+".end",dur:"0.5s",fill:"freeze"})
            } else {
                animateSize = this.makeSVG("animate",{id:"ani"+i,attributeName:"font-size",values:"20;24;20",begin:("ani"+(i-1)+".end"),dur:"0.5s"})
                animateColor = this.makeSVG("animate",{attributeName:"fill",from:"yellow",to:"aqua",begin:("ani"+(i-1)+".end"),dur:"0.5s",fill:"freeze"})
            }
            tspan.appendChild(animateSize)
            tspan.appendChild(animateColor)
            text.appendChild(tspan)
        }
        svgNode.appendChild(text)

        this.el.appendChild(svgNode)

        return this.el
    }

    show() {
        requestAnimationFrame(()=>{
            this.el.style.transform = "translate(0,0)"
        })
        return this
    }
    intervalIndex:number
    setProgress(ratio:number) {
        let temp = this.oldRatio
        if(this.intervalIndex){
            clearInterval(this.intervalIndex)
            this.intervalIndex=0
        }
        this.intervalIndex=setInterval(()=>{
            if(this.oldRatio < ratio) {
                document.getElementById("colorful").setAttribute("x2",this.oldRatio+"%")
                this.oldRatio += 1
            }
            else {
                clearInterval(this.intervalIndex)
                this.intervalIndex=0
                if(ratio == 100) {
                    return this
                }
                else
                    return this
            }
        },50)
        this.interval = (ratio - temp)*50
        
        return this
    }

    remove() {
        requestAnimationFrame(()=>{
            this.el.style.transform = "translate(-100%,0)"
        })
        setTimeout(()=>{
            this.oldRatio = 0
            this.el.remove()
        },1000)
        return this
    }
}