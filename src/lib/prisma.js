import { PrismaClient } from "@prisma/client";

//prisma ka "client" bnega is File se,,Database ko call krega jo




const globalForPrisma = globalThis;

export const db_Var = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db_Var;

// export const db_Var=globalThis.prisma || new PrismaClient();
// if(process.env.NODE_ENV !=="production"){
//     globalThis.prisma=db_Var;
// }

//---> we use : globalThis,,bcz:

/*Avoids Re-initialization on Every Reload
Hot reloads do not refresh the whole process, but reload modules.
Without globalThis, objects like DB connections may be recreated unnecessarily.
Preserves State Between Reloads
globalThis acts as a persistent, global storage. */