export class Spending {

    id:number;
    date:string;
    member:string;
    category:string;         
    description:string;
    unnecessary:number;  
    amount:number;

    constructor( id:number, date:string, member:string, category:string, description:string, unnecessary:number, amount:number,) {

        this.id = id;
        this.date = date;
        this.member = member;
        this.category = category;
        this.description = description;
        this.unnecessary = unnecessary;
        this.amount = amount;
        
    }
    
}