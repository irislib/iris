import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2">
      <div
        className="card bg-neutral shadow-xl cursor-pointer hover:opacity-90"
        onClick={() => navigate('/explorer')}
      >
        <div className="card-body">
          <h2 className="card-title">Explorer</h2>
        </div>
      </div>
      <div
        className="card bg-neutral shadow-xl cursor-pointer hover:opacity-90"
        onClick={() => navigate('/canvas')}
      >
        <div className="card-body">
          <h2 className="card-title">Canvas</h2>
        </div>
      </div>
      <div>
        <a className="link link-accent" href="https://github.com/mmalmi/nostree">
          GitHub
        </a>
      </div>
    </div>
  );
}