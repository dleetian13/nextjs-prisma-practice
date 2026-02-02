import TaskComponent from '@/components/form';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export default async function Home() {
  const tasks = await prisma.task.findMany();

  const addTask = async (formData: FormData) => {
    "use server"; // runs on the server

    const title = formData.get("title");
    await prisma.task.create({
      data: {
        title: title as string,
      }
    })

    revalidatePath("/")
  }

  return (
    <div>
      <h1>Todos Page</h1>

      <TaskComponent tasks={tasks} />
    </div>
  );
}
