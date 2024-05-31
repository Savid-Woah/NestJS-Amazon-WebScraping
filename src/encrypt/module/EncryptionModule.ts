import { Module } from "@nestjs/common";
import { EncryptionService } from "../service/EncryptionService";

@Module({
    providers: [EncryptionService]
})
export class EncryptionModule {}