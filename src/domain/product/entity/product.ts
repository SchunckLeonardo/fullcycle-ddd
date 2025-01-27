import { ProductInterface } from "./product.interface"

export class Product implements ProductInterface {
    private _id: string
    private _name: string
    private _price: number

    constructor(id: string, name: string, price: number) {
        this._id = id
        this._name = name
        this._price = price
        this.validate()
    }

    changeName(name: string) {
        this._name = name
        this.validate()
    }

    changePrice(price: number) {
        this._price = price
        this.validate()
    }

    get id(): string {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get price(): number {
        return this._price
    }

    validate(): boolean {
        if (this._id.length < 1) {
            throw new Error("ID is required")
        }
        if (this._name.length < 1) {
            throw new Error("Name is required")
        }
        if (this._price <= 0) {
            throw new Error("Price should be greater than 0")
        }
        return true
    }
}