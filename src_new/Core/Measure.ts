import _ =require("underscore")
export class Measure{
    id:string
    data:any
    style:any
    type:string
    category:string[]
    constructor(id?,data?,type?,style?,category?){
        this.id=id==undefined?_.uniqueId("measure"):id
        this.data=data||[]
        this.type=type||"line"
        this.style=style||{}
        if(category==undefined){
            this.category=[]
            this.category.push(this.type)
        }else{
<<<<<<< HEAD
            this.category=category
        }
=======
             this.category=category
        }
       
>>>>>>> origin/master
    }
}