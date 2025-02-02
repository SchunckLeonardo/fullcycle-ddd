import { Address } from "./value-objects/address"

export class Customer {
    private _id: string
    private _name: string = ""
    private _address: Address
    private _active: boolean = true
    private _rewardPoints: number = 0

    constructor(id: string, name: string) {
        this._id = id
        this._name = name
        this.validate()
    }

    validate() {
        if (this._name.length < 1) {
            throw new Error("Name is required")
        }
        if (this._id.length < 1) {
            throw new Error("ID is required")
        }
    }

    changeName(name: string) {
        this._name = name
        this.validate()
    }

    changeAddress(address: Address) {
        this._address = address
    }

    addRewardPoints(points: number) {
        if (points < 0) {
            throw new Error('Points must be a positive number')
        }
        this._rewardPoints += points
    }

    isActive(): boolean {
        return this._active
    }
    
    activate() {
        if (!this._address) {
            throw new Error('Address is mandatory')
        }
        this._active = true
    }

    deactivate() {
        this._active = false
    }

    get name(): string {
        return this._name
    }

    get rewardPoints(): number {
        return this._rewardPoints
    }

    get id(): string {
        return this._id
    }

    get address(): Address {
        return this._address
    }
}