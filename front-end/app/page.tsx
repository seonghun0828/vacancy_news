import { WebsiteContent } from './types';

export default async function Home() {
  const { data }: { data: WebsiteContent[] } = await fetch(
    'http://localhost:3000/api/news'
  ).then((res) => res.json());

  return (
    <div>
      {data.map(({ name, url }) => (
        <div key={name}>
          <h1>{name}</h1>
          <a href={url} target="_blank">
            {url}
          </a>
          <div>content</div>
        </div>
      ))}
    </div>
  );
}
