export default function Filter() {
  return (
    <div className="flex items-center justify-center ">
      <button
        id="dropdownDefault"
        data-dropdown-toggle="dropdown"
        className="text-zinc-700 flex items-center rounded-md bg-white hover:bg-zinc-100 focus:outline-none px-4 py-2 text-sm"
        type="button"
      >
        Filter  
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      <div
        id="dropdown"
        className="z-10 hidden w-56 p-3  rounded-lg shadow bg-gray-700"
      >
        <h6 className="mb-3 text-sm font-medium  text-white">Category</h6>
        <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
          <li className="flex items-center">
            <input
              id="apple"
              type="checkbox"
              value=""
              className="w-4 h-4  rounded text-primary-600 focus:ring-primary-500 focus:ring-primary-600 ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500"
            />

            <label className="ml-2 text-sm font-medium  text-gray-100">
              Apple (56)
            </label>
          </li>

          <li className="flex items-center">
            <input
              id="fitbit"
              type="checkbox"
              value=""
              className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 focus:ring-primary-600 ring-offset-gray-700 focus:ring-2 bg-gray-600 border-gray-500"
            />

            <label className="ml-2 text-sm font-medium  text-gray-100">
              Fitbit (56)
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
}
