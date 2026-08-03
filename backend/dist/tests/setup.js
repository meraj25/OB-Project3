"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env.test" });
const prisma_1 = require("../db/prisma");
beforeAll(async () => {
    await prisma_1.prisma.roles.createMany({
        data: [
            { role_id: 1, role_name: "owner" },
            { role_id: 2, role_name: "exco-member" },
            { role_id: 3, role_name: "member" },
        ],
        skipDuplicates: true,
    });
});
afterAll(async () => {
    await prisma_1.prisma.$disconnect();
});
