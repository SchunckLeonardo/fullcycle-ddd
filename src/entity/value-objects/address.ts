export class Address {
    _street: string = ""
    _number: number = 0
    _zip: string = ""
    _city: string = ""

    constructor(street: string, number: number, zip: string, city: string) {
        this._street = street
        this._number = number
        this._city = city
        this._zip = zip

        this.validate()
    }

    validate() {
        if (this._street.length < 1) {
            throw new Error("Street is required")
        }
        if (this._number < 1) {
            throw new Error("Number is required")
        }
        if (this._zip.length < 1) {
            throw new Error("Zip is required")
        }
        if (this._city.length < 1) {
            throw new Error("City is required")
        }
    }

    toString(): string {
        return `${this._street}, ${this._number}, ${this._zip} ${this._city}`
    }
}