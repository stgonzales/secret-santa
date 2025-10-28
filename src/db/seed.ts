import { db } from ".";
import { account, NewAccountType, user } from "./schema";

async function seed() {
    const mockUsers = await fetch("https://jsonplaceholder.typicode.com/users")
        .then(res => res.json() as Promise<{ name: string; email: string }[]>);

    const timestamp = Date.now()

    for (const mockUser of mockUsers) {
        const [first, last = ""] = mockUser.name.split(" ");
        const fullName = `${first} ${last}`;
        const passwordHash = await Bun.password.hash("SupErS3cur3pA$$word");

        // Create user
        const insertedUser = await db.insert(user).values({
            name: fullName,
            email: `${first.toLocaleLowerCase()}.${last.toLocaleLowerCase()}@gmail.com`,
        }).returning({ id: user.id });

        const userId = insertedUser[0].id;

        // Create account record linked to that user
        await db.insert(account).values({
            userId,
            accountId: userId,
            providerId: "credential",
            password: passwordHash,
            // createdAt: timestamp,
            // updatedAt: timestamp,
        } as unknown as NewAccountType);

        console.log(`✅ Seeded: ${user.email}`);
    }

    console.log("🎉 Done seeding Better Auth users!");
}

seed();