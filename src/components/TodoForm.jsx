import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function TodoForm({ addTodo, filterTodo, setFilter }) {
  const [newItem, setNewItem] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (newItem === "") return;

    addTodo(newItem);
    setNewItem("");
  }

  return (
    <div>
      <form>
        <div>
          <div className="absolute top-0 left-0 p-4">
            <button className="bg-stone-300 rounded p-1" onClick={() => {navigate("/landing")}} >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
              </svg>
            </button>
          </div>

          <label class="font-sans font-semibold tracking-widest" htmlFor="item">Enter a new task: </label>
          <input
            type="text"
            id="item"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            className="w-full rounded-lg mt-1"
          />
        </div>
        <button class="bg-lime-900 hover:bg-lime-800 text-white font-medium w-full py-1 px-4 my-5 rounded" onClick={handleSubmit}>
          Add
        </button>

        <div className="mt-0.3 mb-3">
          <select onChange={(e) => setFilter(e.target.value)} className="bg-neutral-400 text-black w-fit p-1 rounded">
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </form>
    </div>
  );
}
