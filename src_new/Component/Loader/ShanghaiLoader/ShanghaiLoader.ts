import {IProgressLoader} from "../ILoader"
import {Util} from "../../../Core/Util"

export class ShanghaiLoader implements IProgressLoader {
    id = "shanghaiLoader"
    el: HTMLElement
    width: number
    height: number
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
        el.appendChild(this.el)
        return this
    }

    toElement() {
        this.el = document.createElementNS("http://www.w3.org/1999/xhtml", "div")
        this.el.setAttribute("id",this.id)
        this.el.setAttribute("class","shanghaiLoaderContainer")

        let svgNode = this.makeSVG("svg",{width:this.width, height:this.height})

        let shanghaiPath = this.makeSVG("path",{id:"shanghaiPath", d:
            "m0 250 h5 v-50 l5 -5 v-50 l20 5 v90 "+
            "h5 v-45 h20 v60 " +
            "h8 v-50 l20 -10 v55" +
            "h12 v-80 h25 v70" +
            "h3 v-40 l18 5 v45" +
            "h8 v-50 h22 v55 h3 v10 h13 v10" +
            "q10 3 20 0 q5 -5 0 -12 q-15 -23 10 -35 v-60 q-20 -20 5 -35 v-30 q-12 -15 5 -25 v-20 q-8 -8 0 -15 l3 -20"+
            "l3 20 q8 8 0 15 v20 q17 10 5 25 v30 q25 15 5 35 v60 q25 12 10 35 q-5 7 0 12 q10 3 20 0" +
            "v-10 h20 v-18 h20 v8 h5 v-25 h20 v40" +
            "q5 5 10 0 l-10 -100 l30 -50 l5 150" +
            "h5 v-10 h15 v-40 h20 v40" +
            "h8 l5 -30 q10 -10 20 0 l5 30" +
            "h8 v-62 h20 v60" +
            "q8 5 15 0 v-220 h5 v-8 h5 v-8 h5 v-8 h5 l3 -15 l3 15 h5 v8 h5 v8 h5 v8 h5 v220 h10"
        })
        let shanghaiText = this.makeSVG("text",{transform:`translate(${this.width/2}, 320)`})
        shanghaiText.textContent = "Loading..."
        svgNode.appendChild(shanghaiPath)
        svgNode.appendChild(shanghaiText)
        this.el.appendChild(svgNode)
        return this.el
    }

    show() {
        requestAnimationFrame(()=>{
            this.el.style.transform = "translate(0,0)"
        })
        return this
    }

    remove() {
        requestAnimationFrame(()=>{
            this.el.style.transform = "translate(-100%,0)"
        })
        setTimeout(()=>{
            this.el.remove()
        },1000)
        return this
    }

    setProgress(ratio:number) {
        document.getElementById("shanghaiPath").style.strokeDashoffset = (2997-(ratio/100 * 2997)).toString()
        return this
    }
}
