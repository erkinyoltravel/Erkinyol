import dynamic from 'next/dynamic';

const Landing = dynamic(() => import('../components/ErkinYolLanding'), { ssr: false });

export default function Home() {
  return <Landing />;
}
