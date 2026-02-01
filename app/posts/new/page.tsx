import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Form from "next/form";
import { redirect } from "next/navigation";

export default function NewPost() {
  async function createPost(formData: FormData) {
    "use server"

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    await prisma.post.create({
      data: {
        title,
        content,
        authorId: 1 // I filled with fake value
      }
    })

    revalidatePath("/")
    redirect("/")
  }

  return (
    <div>
      <h1>Create New Post</h1>
      <Form action={createPost}>
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" id="title" name="title" placeholder="name" />
        </div>
        <div>
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" placeholder="write your post here..." rows={6} />
        </div>
        <button type="submit">Create a post</button>
      </Form>
    </div>
  )
}
