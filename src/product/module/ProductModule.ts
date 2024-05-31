import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { ProductController } from "../controller/ProductController";
import { ProductService } from "../service/ProductService";
import { ProductRepository } from "../repository/ProductRepository";
import { UserRepository } from "../../user/repository/UserRepository";

@Module({
    controllers: [ProductController],
    providers: [
        ProductService,
        UserRepository,
        ProductRepository,
    ],
    imports: [PrismaModule]
})
export class ProductModule {}