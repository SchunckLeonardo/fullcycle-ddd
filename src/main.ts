import { Customer } from "./entity/customer";
import { Order } from "./entity/order";
import { OrderItem } from "./entity/order-item";
import { Address } from "./entity/value-objects/address";

const customer = new Customer("123", "Leonardo Rainha")
const address = new Address('Rua dos Bobos', 0, '12345-678', 'São Paulo')
customer.address = address
customer.activate()