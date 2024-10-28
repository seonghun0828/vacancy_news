import { WebsiteContent } from './types';

export default async function Home() {
  const { data }: { data: WebsiteContent[] } = await fetch(
    'http://localhost:3000/api/news'
  ).then((res) => res.json());

  return (
    <div>
      {data.map(({ name, url, news }) => (
        <div key={name}>
          <a href={url} target='_blank'>
            <h3>{name}</h3>
          </a>

          <ul>
            {news?.slice(0, 5).map((text, idx) => (
              <li key={text + idx}>{text}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
