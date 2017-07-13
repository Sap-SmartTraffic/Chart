import d3 = require("d3")
import _ = require('underscore');
import { BaseChart } from '../../Core/BaseChart';
import { MultiDataMeasure } from "./MultiTypeMeasure";
export interface IGetDomain {
    getDomain:(key?:string)=>number[]
    max:(key?:string)=>number
    min:(key?:string)=>number
}
export interface IMeasureManager{
    measures:MultiDataMeasure[]
    addMeasure:(m:MultiDataMeasure)=>this
    loadMeasures:(ms:MultiDataMeasure[])=>this
    removeMeasure:(m:MultiDataMeasure|string)=>this
    getAllMeasure:()=>MultiDataMeasure[]
    getMeasure:(type:string)=>MultiDataMeasure[]
    strToTimeMeasure:()=>this
}
export interface IMultiDataChart extends BaseChart,IMeasureManager,IGetDomain{}
export class MultiDataChart extends BaseChart implements IMultiDataChart{
    measures:MultiDataMeasure[]=[]
    addMeasure(m:MultiDataMeasure){
        let i=_.findIndex(this.measures,(mm)=>mm.id==m.id)
        if(i!=-1){
            this.measures[i]=m
        }else{
            this.measures.push(m)
        }
        this.fire("measure_change measure_add",{measure:m})
        return this
    }
    loadMeasures(ms:any[]) {
        _.each(ms, (d)=>{
            let mm = new MultiDataMeasure(d.id, d.data, d.type)
            this.addMeasure(mm)
        })
        this.fire("measure_change")
        return this
    }
    removeMeasure(m:MultiDataMeasure|string){
        if(_.isString(m)){
            if(_.some(this.measures,(mm)=>mm.id==m)){
                let rm=_.findWhere(this.measures,{id:m})
                this.measures=_.filter(this.measures,(mm)=>mm.id!=m)
                this.fire("measure_change measure_remove",{
                    measure:rm
                })
            }
        }else{
            if(_.some(this.measures,(mm)=>mm.id==m.id)){
                this.measures=_.filter(this.measures,(mm)=>mm.id!=m.id)
                this.fire("measure_change measure_remove",{
                    measure:m
                })
            }
        }
        return this
    }
    getMeasure(type:string){
        return _.filter(this.measures,(mm)=>mm.type==type)
    }
    getAllMeasure(){
        return this.measures
    }
    getDomain(k:string){
        return [this.min(k),this.max(k)]
    }
    strToTimeMeasure(type?:string) {
        let ms:MultiDataMeasure[]
        let temp = []
        if(type == undefined) {
            ms = this.measures
            this.measures = [];
        }
        else {
            ms = this.getMeasure(type)
            this.measures = this.measures.filter((d)=>{d.type != type})
        }
        _.each(ms,(d,i)=>{
            let tempData = []
            _.each(d.data,(v:{x:any,y:any},k)=>{
                tempData.push({x:new Date(v.x),y:v.y}) 
            })
            temp.push(new MultiDataMeasure(d.id,tempData,d.type))
        })
        this.measures = temp
        return this
    }
    max(k:string){
        let max
        _.each(this.measures,(mm)=>{
            let _max = mm.max(k)
            if(!max) {
                max = _max
            }
            else {
                if(_max > max){
                    max=_max
                }
            }
        })
        return max
    }
    min(k:string){
        let min
        _.each(this.measures,(mm)=>{
            let _min=mm.min(k)
            if(!min) {
                min=_min
            }
            else {
                if(_min < min){
                    min= _min
                }
            }
        })
        return min
    }

    getColor(color) {
        if(color === undefined)
            return d3.schemeCategory20[Math.round(Math.random()*20)]
        else if(typeof(color) == "number")
            return d3.schemeCategory20[color]
        else 
            return color
    }
    
}