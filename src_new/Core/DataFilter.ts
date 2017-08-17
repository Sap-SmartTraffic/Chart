import _ = require("lodash")
export module DataFilter {
    export function dataFilter(ds:any[],type:string):any[] {
        switch(type) {
            case "line":
                return lineFilter(ds)
            case "bar" :
                return barFilter(ds)
            default:
                return ds
        }
    }

    function lineFilter(ds:any) {
        ds.data = _.sortBy(ds.data,(m:any)=>{return m.x})
        _.each(ds.data,(v:{x:any,y:any},k)=>{
            if(typeof(v.x) == "string")
                v.x = new Date(v.x)
        })
        return ds
    }

    function barFilter(ds) {
        ds.data = _.sortBy(ds.data,(m:any)=>{return m.x})
        return ds
    }
}

export interface BarData {
    x:string,
    y:number
}

export interface BoxplotData {
    min:number,
    lowerQuartile:number,
    median:number,
    largerQuartile:number,
    max:number
}

export interface HeatData {
    day:string,
    value:number
}

export interface LineData {
    x:any,
    y:any
}

export interface RangeData {

}