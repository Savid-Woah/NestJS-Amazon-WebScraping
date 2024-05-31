import Decimal from "decimal.js";

export interface ProductWithDetails {
    name: string
    price: Decimal
    userId: string
    productId: string
}