import _ = require('underscore');
import { BaseChart } from '../Core/BaseChart';
import { IMultiDataMeasure } from "./MultiTypeMeasure";
export interface IGetDomain {
    getDomain:(key?:string)=>number[]
    max:(key?:string)=>number
    min:(key?:string)=>number
}
export interface IMeasureManager{
    measures:IMultiDataMeasure[]
    addMeasure:(m:IMultiDataMeasure)=>this
    removeMeasure:(m:IMultiDataMeasure|string)=>this
    getAllMeasure:()=>IMultiDataMeasure[]
    getMeasure:(type:string)=>IMultiDataMeasure[]
    
}
export interface IMultiDataChart extends BaseChart,IMeasureManager,IGetDomain{}
export class MultiDataChart  extends BaseChart  implements IMultiDataChart{
    measures:IMultiDataMeasure[]=[]
    addMeasure(m:IMultiDataMeasure){
        let i=_.findIndex(this.measures,(mm)=>mm.id==m.id)
        if(i!=-1){
            this.measures[i]=m
        }else{
            this.measures.push(m)
        }
        this.fire("measure_change measure_add",{measure:m})
        return this
    }
    removeMeasure(m:IMultiDataMeasure|string){
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
    max(k:string){
        let max=0
        _.each(this.measures,(mm)=>{
            let _max=mm.max(k)
            if(_.isNumber(_max)){
                max=Math.max(max,_max)
            }
        })
        return max
    }
    min(k:string){
        let min=0
        _.each(this.measures,(mm)=>{
            let _min=mm.min(k)
            if(_.isNumber(_min)){
                min=Math.min(min,_min)
            }
        })
        return min
    }
    
}