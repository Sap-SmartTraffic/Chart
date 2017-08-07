import _ = require('lodash');
export interface IBaseMeasure{
    id:string,
    data:any,
    type:string,
    style:any
}
export class BaseMeasure implements IBaseMeasure{
    id:string
    data:any[]
    type:string
    style:any
    constructor(id?,data?,type?,style?){
        this.id=id==undefined?_.uniqueId("measure"):id
        this.data=data||[]
        this.type=type||"line"
        this.style=style||{}
    }
}