import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'

@Injectable()
export class EncryptionService {

    private readonly aesKey: Buffer
    private readonly aesIv: Buffer

    constructor() {
        const key = process.env.AES_KEY
        this.aesKey = Buffer.from(key, 'utf8')
        this.aesIv = crypto.randomBytes(16)
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }

    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    encrypt(jwt: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', this.aesKey, iv);
        let encrypted = cipher.update(jwt, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`;
    }
    
    decrypt(encryptedText: string): string {
        const [ivHex, encrypted] = encryptedText.split(':');
        const iv = Buffer.from(ivHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-cbc', this.aesKey, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'base64');
        decrypted += decipher.final('base64');
        return decrypted;
    }
}