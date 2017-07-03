import _ =require("underscore")
export interface IBaseMeasure{
    id:string,
    data:any,
    style:any,
    type:string
}
export class BaseMeasure implements IBaseMeasure{
    id:string
    data:any
    style:any
    type:string
    constructor(id?,data?,type?,style?){
        this.id=id==undefined?_.uniqueId("measure"):id
        this.data=data||[]
        this.type=type||"line"
        this.style=style||{}
    }
}