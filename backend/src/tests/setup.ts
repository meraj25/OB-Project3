import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

import { prisma } from "../db/prisma";

beforeAll(async () => {
    
    await prisma.roles.createMany({
        data: [
            { role_id: 1, role_name: "owner" },
            { role_id: 2, role_name: "exco-member" },
            { role_id: 3, role_name: "member" },
            
        ],
        skipDuplicates: true, 
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});