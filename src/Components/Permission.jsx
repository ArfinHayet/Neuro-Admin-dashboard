import { useEffect, useState } from "react";
import { getRoles } from "../api/role";

const Permission = ({ children, requiredPermissions, permissionType }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await getRoles();
      console.log(response?.data);
      setRoles(response?.data || []);
    };

    fetchRoles();
  }, []);

  const allPermissions = roles
    .map((role) => role[permissionType])
    .filter(Boolean)
    .flatMap((str) => str.split(","))
    .map((perm) => perm.trim());
  console.log(allPermissions);
  const hasPermission = requiredPermissions.some((perm) =>
    allPermissions.includes(perm)
  );

  return hasPermission ? <>{children}</> : null;
};

export default Permission;
