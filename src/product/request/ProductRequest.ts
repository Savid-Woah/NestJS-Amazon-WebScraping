import { IsNotEmpty } from "class-validator"

export class ProductRequest {

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    price: number

    @IsNotEmpty()
    userId: string
}