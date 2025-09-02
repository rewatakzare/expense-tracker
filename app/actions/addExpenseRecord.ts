'use server'
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function addExpenseRecord(formData: FormData) {
  const textValue = formData.get("text");
  const amountValue = formData.get("amount");
  const categoryValue = formData.get("category");
  const dateValue = formData.get("date");

  if (!textValue || !amountValue || !categoryValue || !dateValue) {
    return { error: "Missing fields" };
  }

  const text = textValue.toString();
  const amount = parseFloat(amountValue.toString());
  const category = categoryValue.toString();

  const [year, month, day] = dateValue.toString().split("-");
  const date = new Date(Date.UTC(+year, +month - 1, +day, 12)).toISOString();

  const { userId } =await auth();
  if (!userId) return { error: "Not authenticated" };

  // ✅ ensure the user exists in your User table
  let user = await db.user.findUnique({ where: { clerkUserid: userId } });
  if (!user) {
    const clerkUser = await currentUser();
    user = await db.user.create({
      data: {
        clerkUserid: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
        name: clerkUser?.fullName ?? "",
        imageUrl: clerkUser?.imageUrl ?? "",
      },
    });
  }

  // ✅ now safe to create record
  const createdRecord = await db.records.create({
    data: {
      text,
      amount,
      category,
      date,
      userId: user.clerkUserid, // must match User.clerkUserid
    },
  });

  revalidatePath("/");

  return {
    data: {
      text: createdRecord.text,
      amount: createdRecord.amount,
      category: createdRecord.category,
      date: createdRecord.date.toISOString(),
    },
  };
}

export default addExpenseRecord;
