import { OrderItem } from "./order-item"

export class Order {
    private _id: string
    private _customerId: string
    private _items: OrderItem[] = []
    private _total: number

    constructor(id: string, customerId: string, items: OrderItem[]) {
        this._id = id
        this._customerId = customerId
        this._items = items
        this._total = this.total()
        this.validate()
    }

    validate(): boolean {
        if (this._id.length < 1) {
            throw new Error("ID is required")
        }
        if (this._customerId.length < 1) {
            throw new Error("Customer ID is required")
        }
        if (this._items.length < 1) {
            throw new Error("Item quantity must be greater than 0")
        }
        if (this._items.some(item => item.quantity < 1)) {
            throw new Error("Item quantity should be greater than 0")
        }
        return true
    }

    total() {
        return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0)
    }
}