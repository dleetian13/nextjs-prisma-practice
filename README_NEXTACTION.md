Server Actions. Server components are asynchronous functions.

You have other way to do backend other than API routes.

Create a server actions at `actions/` directory. Then define all server action in `actions.ts`:
1. Define component as server component `"use server"`
2. Take parameter FormData.
3. Try-catch the function, then revalidatePath()
4. Finally, redirect() or return a result.

```ts
"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: FormData) => {
  const title = formData.get("title");

  try {
    const task = await prisma.task.create({
      data: {
        title: title as string
      }
    })

    revalidatePath('/')
    return { data: task, error: null }
  } catch (e) {
    return {
      error: e, data: null
    }
  }
}

```

Use the server action in a form in the client component.
- Since client component can't fetch data directly, receive a prop from the ancestor server component.
- Second, add the server action through `action` in the form element.
- Use `useRef` to reset the action.
- Use `useOptimistic` to predict that it'll be successful.
- Map through the `optimisticTask` instead of `tasks`

```ts
export default function TaskComponent({ tasks }: TaskComponentProps) {
  const ref = useRef<HTMLFormElement>(null)
  const [optimisticTasks, addOptimisticTask] = useOptimistic(tasks, (state, newTask: Task) => {
    return [...state, newTask]
  }); // currentTask, newTask - optimistic version, which we map

  return (
    <>
      <form
        ref={ref}
        action={async formData => {
          ref.current?.reset();

          addOptimisticTask({
            id: Math.random(),
            title: formData.get("title") as string
          }) // assumming it's successful
          const { data, error } = await addTodo(formData)

          if (error) {
            alert(error instanceof Error ? error.message : String(error))
          }
        }}>
        <label htmlFor='title'>Title: </label>
        <input type='text' id='title' name='title' placeholder='Enter task title' required />
        <Button />
      </form>

      <ul>
        {optimisticTasks.map((task) => (
          <li key={task.id}>
            {task.title}</li>
        ))}
      </ul>
    </>
  )
}
```

Finally, destructure the pending from the `useFormStatus` hook on the button. Disable it when the status is pending.

```ts
export default function Button() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      Add Task
      {/* no longer needed because of optimistic loading, instead reused to disable a button */}
      {/* {pending ? 'Adding task...' : 'Add Task'} */}
    </button>
  )
}
```
