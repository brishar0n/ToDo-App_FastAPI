import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-lime-900 py-3 text-4xl font-extrabold">hello there !!! ヾ(˶ᵔ ᗜ ᵔ˶)</h1>
        <Link to="/todo">
          <button className="text-grey bg-transparent border-4 border-zinc-600 hover:bg-yellow-200 py-2 px-4 rounded-2xl placeholder:text-gray-300">
            to-do list 📋
          </button>
        </Link>
        <Link to="/profile">
          <button className="text-grey bg-transparent border-4 border-zinc-600 hover:bg-yellow-200 ml-4 py-2 px-4 rounded-2xl placeholder:text-gray-300">
            profile page
          </button>
        </Link>
      </div>
      <div className="text-black text-center">
        <div className="p-3">
          <p>Brigitte Sharon Alexander</p>
          <p>Student ID: 2602119190</p>
        </div>
      </div>
    </div>
  );
}

export default Landing;