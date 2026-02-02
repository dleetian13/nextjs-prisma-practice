'use client';

import { addTodo } from "@/actions/actions";
import { useOptimistic, useRef } from "react";
import Button from "./button";
import prisma from "@/lib/prisma";

type Task = {
  id: number;
  title: string;
}

type TaskComponentProps = {
  tasks: Task[];
}

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
