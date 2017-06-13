import _ =require("underscore")
export class Measure{
    id:string
    data:any
    style:any
    type:string
    constructor(id?,data?,type?,style?){
        this.id=id||_.uniqueId("measure")
        this.data=data||[]
        this.type=type||"line"
        this.style=style||{}
    }
}