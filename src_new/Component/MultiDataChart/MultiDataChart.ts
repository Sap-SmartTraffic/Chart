import d3 = require("d3")
import _ = require('lodash');
import { BaseChart } from '../../Core/BaseChart';
import { MultiDataMeasure } from "./MultiTypeMeasure";
import { DataFilter } from "../../Core/DataFilter"
export interface IGetDomain {
    getDomain:(key?:string)=>number[]
    max:(key?:string)=>number
    min:(key?:string)=>number
}
export interface IMeasureManager{
    measures:MultiDataMeasure[]
    addMeasure:(d:any,type?:string)=>this
    addMeasures:(ds:any,type?:string)=>this
    loadMeasures:(ds:any[],type?:string)=>this
    removeMeasure:(m:MultiDataMeasure|string)=>this
    getAllMeasure:()=>MultiDataMeasure[]
    getMeasure:(type:string)=>MultiDataMeasure[]
    clearMeasure():any
}
export interface IMultiDataChart extends BaseChart,IMeasureManager,IGetDomain{}
export class MultiDataChart extends BaseChart implements IMultiDataChart{
    measures:MultiDataMeasure[]=[]
    colorManager={}
    colorIndex=0
    addMeasure(d:any, type?:string){
        d = DataFilter.dataFilter(d, type)
        let m = new MultiDataMeasure(d.id, d.data, type)
        let i=_.findIndex(this.measures,(mm)=>mm.id==m.id)
        if(i!=-1){
            this.measures[i]=m
        }else{
            this.measures.push(m)
        }
        this.fire("measure_change measure_add",{measure:m})
        return this
    }
    addMeasures(ds:any[],type?:string) {
        _.each(ds,(d)=>{
            d = DataFilter.dataFilter(d,type)
            let m = new MultiDataMeasure(d.id, d.data, type)
            let i=_.findIndex(this.measures,(mm)=>mm.id==m.id)
            if(i!=-1){
                this.measures[i]=m
            }else{
                this.measures.push(m)
            }
        })
        this.fire("measure_change measure_add")
        return this
    }
    clearMeasure(){
        this.measures=[]
        this.fire("measure_change measure_clear")
    }
    loadMeasures(ds:any[],type?:string) {
        let measures:MultiDataMeasure[] = []
        if(ds == null || ds == undefined || !_.isArray(ds))
            console.log("Data wrong!")
        else {
            _.each(ds, (d)=>{
                d = DataFilter.dataFilter(d,type)
                let measure = new MultiDataMeasure(d.id, d.data, type)
                measures.push(measure)
            }) 
            this.measures = measures
            this.fire("measure_change")
        }
    
        return this
    }
    removeMeasure(m?:string){
        if(_.some(this.measures,(mm)=>mm.id==m)){
            let rm=_.find(this.measures,{id:m})
            this.measures=_.filter(this.measures,(mm)=>mm.id!=m)
            this.fire("measure_change measure_remove",{measure:rm})
        }
        else if(_.some(this.measures,(mm)=>mm.type == m)) {
            this.measures=_.filter(this.measures,(mm)=>mm.type!=m)
            this.fire("measure_change measure_remove")
        }
        else {
            let rm = _.last(this.measures)
            this.measures = _.initial(this.measures)
            this.fire("measure_change measure_remove",{measure:rm})
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

    getColor(id) {
        if(this.colorManager[id]){
            return this.colorManager[id]
        }else{
            this.colorManager[id]=d3.schemeCategory10[this.colorIndex++%10]
            return this.colorManager[id]
        }
    }
    
}