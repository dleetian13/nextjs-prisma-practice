import prisma from '@/lib/prisma';

export default async function Home() {
  const posts = await prisma.post.findMany();

  return (
    <div>
      {posts.length === 1 ? 'there are posts' : 'there are no posts'}
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title} -
            {post.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
