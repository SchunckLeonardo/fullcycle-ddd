export class OrderItem {
    private _id: string
    private _productId: string
    private _name: string
    private _price: number
    private _quantity: number

    constructor(id: string, productId: string, name: string, price: number, quantity: number) {
        this._id = id
        this._productId = productId
        this._name = name
        this._price = price
        this._quantity = quantity
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

    get quantity(): number {
        return this._quantity
    }

    get productId(): string {
        return this._productId
    }

    orderItemTotal(): number {
        return this._price * this._quantity
    }

    validate(): boolean {
        if (this._id.length < 1) {
            throw new Error("ID is required")
        }
        if (this._productId.length < 1) {
            throw new Error("Product ID is required")
        }
        if (this._name.length < 1) {
            throw new Error("Name is required")
        }
        if (this._price <= 0) {
            throw new Error("Price should be greater than 0")
        }
        if (this._quantity < 1) {
            throw new Error("Quantity should be greater than 0")
        }
        return true
    }
}