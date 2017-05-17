import {Evented} from "Evented"
export class Measure extends Evented{

    id:string
    data:any[]
    style:any
    type:string

    constructor(id?,data?,type?,style?){

        super()
        this.id=id||0
        this.data=data||[]
        this.style=style||{}
        this.type=type||"line"
    }

}