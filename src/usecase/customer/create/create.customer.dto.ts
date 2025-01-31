export interface InputCreateCustomerDto {
    name: string
    address: {
        street: string
        city: string
        zip: string
        number: number
    }
}

export interface OutputCreateCustomerDto {
    id: string
    name: string
    address: {
        street: string
        city: string
        zip: string
        number: number
    }
}