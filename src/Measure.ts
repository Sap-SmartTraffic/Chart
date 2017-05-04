import {Evented} from "Evented"
export class Measure extends Evented{
    constructor(id?,data?,style?){
        super()
        this.id=id||0
        this.data=data||[]
        this.style=style||{}
    }
    id:string
    data:any []
    style:any
}