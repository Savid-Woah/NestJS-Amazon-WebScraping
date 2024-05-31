import { Product } from "@prisma/client";
import { ProductRequest } from "../request/ProductRequest";
import Decimal from "decimal.js";
import { ProductRepository } from "../repository/ProductRepository";
import { Injectable } from "@nestjs/common";
import { BackendException } from "../../exception/BackendException";
import { MsgCode } from "../../exception/MsgCode";
import { UserRepository } from "../../user/repository/UserRepository";

@Injectable()
export class ProductService {

    constructor(
        private readonly productRepository: ProductRepository,
        private readonly userRepository: UserRepository,
    ) {}

    public async getAllProductsByUser(userId: string): Promise<Product[]> {
        const existsUser = await this.userRepository.findById(userId)
        if(!existsUser) throw new BackendException(MsgCode.USER_NOT_FOUND)
        return await this.productRepository.findAllByUser(userId)
    }

    public async addProductToWishlist(productRequest: ProductRequest): Promise<Product> {
        this.validateProductReqest(productRequest)
        const product = this.buildProduct(productRequest)
        return await this.productRepository.save(product)
    }

    public async updateProduct(productId: string, productRequest: ProductRequest): Promise<Product> {
        const existsProduct = await this.productRepository.findById(productId)
        if(!existsProduct) throw new BackendException(MsgCode.PRODUCT_NOT_FOUND)
        return await this.productRepository.update(productId, productRequest.name, productRequest.price)
    }

    public async deleteProduct(productId: string) {
        return await this.productRepository.delete(productId)
    }

    private buildProduct(productRequest: ProductRequest): Product {
        return {
            id: undefined,
            name: productRequest.name,
            price: new Decimal(productRequest.price),
            userId: productRequest.userId
        }
    }

    private async validateProductReqest(productRequest: ProductRequest) {
        const userId = productRequest.userId
        const existsUser = await this.userRepository.findById(userId)
        if(!existsUser) throw new BackendException(MsgCode.USER_NOT_FOUND)
    }
}