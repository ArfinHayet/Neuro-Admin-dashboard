import { users } from "../utils/Data";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline } from "react-icons/io5";

const UsersList = () => {
  const navigate = useNavigate();

  return (
    <div className="p-2 w-[75vw] bg-white rounded-xl overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-center">
        <thead className=" ">
          <tr>
            <th className=" py-3  font-medium">User</th>
            <th className=" py-3  font-medium">Role</th>
            <th className=" py-3  font-medium">Status</th>
            <th className="py-3  font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 ">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 ">
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex flex-col items-start justify-start">
                    <p className="font-medium ">{user.name}</p>
                    <p className="text-sm ">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className=" px-4 py-3 ">{user.role}</td>
              <td className="px-4 py-3 ">
                {user.isBlocked ? (
                  <span className="px-3 py-1 inline-flex  leading-5  rounded-full bg-red-100 text-red-800">
                    Blocked
                  </span>
                ) : (
                  <span className="px-3 py-1 inline-flex leading-5  rounded-full bg-green-100 text-green-800">
                    Active
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
               <div className="flex justify-center"> <button
                  onClick={() => navigate(`/patients/${user.id}`)}
                  className="flex items-center bg-primary px-3 py-1 text-white rounded-full text-sm hover:bg-primary-dark"
                  aria-label={`View profile of ${user.name}`}
                >
                  View profile
                </button></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;