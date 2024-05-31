import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ProductService } from "../service/ProductService";
import { ProductRequest } from "../request/ProductRequest";
import { ResponseHandler } from "../../response/handler/ResponseHandler";
import { Message } from "../../response/message/Message";
import { JwtAuthGuard } from "../../auth/guard/JwtAuthGuard";
import { Role } from "../../user/enum/Role";
import { Roles } from "../../user/decorator/RoleDecorator";

@Controller('products')
export class ProductController {
    
    constructor(private readonly productService: ProductService) {}

    @Get('get-all-by-user/:userId')
    @Roles(Role.USER)
    @UseGuards(JwtAuthGuard)
    public async getAllProductsByUser(@Param('userId') userId: string) {
        const products = await this.productService.getAllProductsByUser(userId)
        return ResponseHandler.generateResponse(products, HttpStatus.FOUND, Message.DATA_FETCHED)
    }

    @Post()
    @Roles(Role.USER)
    @UseGuards(JwtAuthGuard)
    @UsePipes(ValidationPipe)
    public async addProductToWishlist(@Body() productRequest: ProductRequest) {
        const product = await this.productService.addProductToWishlist(productRequest)
        return ResponseHandler.generateResponse(product, HttpStatus.CREATED, Message.PRODUCT_CREATED)
    }

    @Patch(':productId')
    @Roles(Role.USER)
    @UseGuards(JwtAuthGuard)
    public async updateProduct(
        
        @Param('productId') productId: string,
        @Body() ProductRequest: ProductRequest

    ) {
        const updatedProduct = await this.productService.updateProduct(productId, ProductRequest)
        return ResponseHandler.generateResponse(updatedProduct, HttpStatus.OK, Message.PRODUCT_UPDATED)
    }

    @Delete(':productId')
    @Roles(Role.USER)
    @UseGuards(JwtAuthGuard)
    public async deleteProduct(@Param('productId') productId: string) {
        await this.productService.deleteProduct(productId)
    }
}