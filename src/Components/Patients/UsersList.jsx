import { users } from "../utils/Data";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";


const UsersList = () => {
  const navigate = useNavigate();

  return (
   <div className="p-6 w-[75vw] bg-white rounded-xl space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between border-b-2 border-gray-200 pb-4"
        >
          <div className="flex items-center gap-4  px-4">
            <img
              src={user.image}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover"
            />

            <div className="flex flex-col">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className=" px-4 ">
            <p className="font-medium">{user.role}</p>
          </div>

          <div className=" px-4 ">
            {user.isBlocked ? (
              <span className="text-red-600 font-semibold">Blocked</span>
            ) : (
              <span className="text-green-600 font-semibold">Active</span>
            )}
          </div>

          <div className=" px-4 ">
            <button
              onClick={() => navigate(`/patients/${user.id}`)}
              className="flex items-center bg-primary px-3 py-1 text-white rounded-full text-sm"
              aria-label={`View profile of ${user.name}`}
            >
              view profile
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
export default UsersList;
