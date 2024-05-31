import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Product } from "@prisma/client";
import { BackendException } from "../../exception/BackendException";
import { MsgCode } from "../../exception/MsgCode";
import Decimal from "decimal.js";
import { ProductWithDetails } from "../interface/ProductWithDetails";

@Injectable()
export class ProductRepository {
    
    constructor(private readonly prisma: PrismaService) {}

    public async findAllWithDetails(): Promise<ProductWithDetails[]> {
        
        const products = await this.prisma.product.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                userId: true
            }
        })

        return products.map(product => ({
            name: product.name,
            price: new Decimal(product.price),
            userId: product.userId,
            productId: product.id
        }))
    }

    public async findAllByUser(userId: string): Promise<Product[]> {
        return await this.prisma.product.findMany({where: {userId: userId}})
    }

    public async findById(id: string): Promise<Product> {
        return await this.prisma.product.findUnique({where: {id}})
    }

    public async save(product: any) {
        try {
            return await this.prisma.product.create({data: product})
        } catch (error) {
            throw new BackendException(MsgCode.PERSISTENCE_EXCEPTION)
        }
    }

    public async update(productId: string, name: string, price: number): Promise<Product> {
        try {
            const updatedProduct = await this.prisma.product.update({
                where: { id: productId },
                data: { 
                    name: name,
                    price: price 
                },
            })
            return updatedProduct
        } catch (error) {
            throw new BackendException(MsgCode.PERSISTENCE_EXCEPTION)
        }
    }

    public async delete(productId: string) {
        try {
            return await this.prisma.product.delete({where: {id: productId}})
        } catch (error) {
            console.log(error)
            throw new BackendException(MsgCode.PERSISTENCE_EXCEPTION)
        }
    }
}