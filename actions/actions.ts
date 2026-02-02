"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addTodo = async (formData: FormData) => {
  const title = formData.get("title");

  try {
    const task = await prisma.task.create({
      data: {
        title: title as string
      }
    })

    revalidatePath('/')
    redirect('/task')
    return { data: task, error: null }
  } catch (e) {
    return {
      error: e, data: null
    }
  }
}
