export class Spending {

    id:number;
    date:string;
    member:string;
    category:string;             
    description:string;
    amount:number;

    constructor( id:number, date:string, member:string, category:string, description:string, amount:number,) {

        this.id = id;
        this.date = date;
        this.member = member;
        this.category = category;
        this.description = description;
        this.amount = amount;
        
    }
    
}