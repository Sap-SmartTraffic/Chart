import {Evented} from "Evented"
export class Measure extends Evented{
    id:string
    data:any[]
    style:any
    
    constructor(id?,data?,style?){
        super()
        this.id=id||0
        this.data=data||[]
        this.style=style||{}
    }
}