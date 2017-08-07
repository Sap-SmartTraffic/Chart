import d3 = require("d3")
import _ = require("lodash")
import {BaseLayer} from "../../Core/BaseLayer"
import { IViewConfig, IViewConfigValue } from "../../Core/View";
import { CompareChart } from "../CompareChart";
type ScaleFunction=(c:CompareChart,l:LineLayer)=>[number,number]
export interface ILineLayerConfig extends IViewConfig{
    xDomain?:[number,number]|ScaleFunction,
    yDomain?:[number,number]|ScaleFunction
}
export interface ILineLayerConfigValue extends IViewConfigValue{
    xDomain?:[number,number],
    yDomain?:[number,number]
}
type line={
    id:string|number,
    data:{x:number,y:number}[]
}
export class LineLayer extends BaseLayer{
    lines:{[id:string]:line}
    addLine(l:line){
        this.lines[l.id]=l
        return this
    }
    maxX(){
       _.chain(this.lines).values().
    }

}
