import { useFormStatus } from "react-dom"

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
