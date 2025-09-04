"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { testDatabaseConnection } from "@/lib/db-health";



export const onBoardUser = async () => {
    try {
        const user = await currentUser();

        if (!user) {
            return { success: false, error: "No authenticated user found" };
        }

        // Test database connection first
        const dbTest = await testDatabaseConnection();
        if (!dbTest.success) {
            console.error("❌ Database connection failed:", dbTest.error);
            return { 
                success: false, 
                error: `Database connection failed: ${dbTest.error}` 
            };
        }

        const { id, firstName, lastName, imageUrl, emailAddresses } = user;

        // Check if database is available
        if (!db) {
            console.error("❌ Database not initialized");
            return { success: false, error: "Database connection failed" };
        }

        // Use upsert to create or update user
        const newUser = await db.user.upsert({
            where: {
                clerkId: id
            },
            update: {
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || "",
                updatedAt: new Date(),
            },
            create: {
                clerkId: id,
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || "",
            }
        });

        console.log("✅ User onboarded successfully:", newUser.id);
        
        return { 
            success: true, 
            user: newUser,
            message: "User onboarded successfully" 
        };

    } catch (error) {
        console.error("❌ Error onboarding user:", error);
        return { 
            success: false, 
            error: `Failed to onboard user: ${error instanceof Error ? error.message : 'Unknown error'}` 
        };
    }
};
