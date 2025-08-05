import { useState, useEffect } from "react";
import { CasdoorOAuth } from "./api/casdoor/casdoor.api";

// Define interfaces for user data and roles
interface Role {
  name: string;
  path: string;
}

interface Permission {
  name: string;
  displayName: string;
  groups: string[];
}

interface UserData {
  owner: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  role: Role[];
  rolesByGroup: Role[];
  permissions: Permission[];
  permissionsByGroup: Permission[];
  groups: string[];
  groupsTrigger: string;
  roleTrigger: string;
  roleFlags: { [key: string]: boolean }; // Tambahan properti roleFlags
  user_module:[]
}

// Fungsi bantu untuk mengubah string menjadi PascalCase
const toPascalCase = (str: string): string => {
  return str
    .split(/[-_]/g) // pisah berdasarkan '-' atau '_'
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

// Fungsi untuk mengubah role.name menjadi key boolean dengan format isCamelCase
const transformRoleNameToKey = (roleName: string): string => {
  // Pisah berdasarkan ':'
  const parts = roleName.split(":");

  // Ambil bagian setelah namespace (abaikan bagian pertama)
  const relevantParts = parts.slice(1);

  // Balik urutan array
  const reversedParts = relevantParts.reverse();

  // Ubah setiap bagian ke PascalCase
  const pascalParts = reversedParts.map(toPascalCase);

  // Gabungkan dan tambahkan prefix 'is'
  return "is" + pascalParts.join("");
};

// Custom hook to fetch user information
const useUserInformation = () => {
  const [userData, setUserData] = useState<UserData>({
    owner: "",
    name: "",
    avatar: "",
    email: "",
    phone: "",
    role: [],
    rolesByGroup: [],
    permissions: [],
    permissionsByGroup: [],
    groups: [],
    groupsTrigger: "",
    roleTrigger: "",
    roleFlags: {},
    user_module:[]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInformation = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("jwt");
      const casdoorOAuth = new CasdoorOAuth();

      const response = await casdoorOAuth.getAccount(`${token}`);

      if (response.status_code === 200) {
        const { data } = response;

        let perbandingan =
          localStorage.getItem("groupsAkses") !== null
            ? localStorage.getItem("groupsAkses")
            : data.groups[0].name;

        // Modifikasi untuk memfilter permissions berdasarkan perbandingan
        let permissionsByGroup = data.permission.filter(
          (permissions: Permission) => {
            // Cek apakah ada grup dalam perbandingan yang cocok dengan permission.groups
            const hasMatchingGroup = permissions.groups.some(
              (group) => group === perbandingan,
            );
            return hasMatchingGroup; // Jika ada yang cocok, masukkan permission, jika tidak, abaikan
          },
        );

        // Jika tidak ada yang cocok, kembalikan array kosong
        if (permissionsByGroup.length === 0) {
          permissionsByGroup = []; // Ini sebenarnya sudah default, tapi untuk kejelasan
        }

        const roleFlags = data.role.reduce(
          (acc: { [key: string]: boolean }, role: Role) => {
            const key = transformRoleNameToKey(role.name);
            acc[key] = true;
            return acc;
          },
          {},
        );

        setUserData((prevData) => ({
          ...prevData,
          owner: data.owner,
          name: data.name,
          avatar: data.avatar,
          email: data.email,
          phone: data.phone,
          groups: data.groups || [],
          role: data.role || [],
          groupsTrigger: perbandingan,
          permissions: data.permission || [],
          permissionsByGroup: permissionsByGroup,
          roleFlags: roleFlags, // Simpan roleFlags di state
          user_module:data.user_module,
          statusAkses: "true",
        }));
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Error fetching user information:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Update rolesByGroup when groupsTrigger changes
  useEffect(() => {
    const groupsAksesCheck = localStorage.getItem("groupsAkses");

    if (groupsAksesCheck) {
      // Modifikasi untuk memfilter permissions berdasarkan perbandingan
      let permissionsByGroup = userData.permissions.filter(
        (permissions: Permission) => {
          // Cek apakah ada grup dalam perbandingan yang cocok dengan permission.groups
          const hasMatchingGroup = permissions.groups.some(
            (group) => group === groupsAksesCheck,
          );
          return hasMatchingGroup; // Jika ada yang cocok, masukkan permission, jika tidak, abaikan
        },
      );

      // Jika tidak ada yang cocok, kembalikan array kosong
      if (permissionsByGroup.length === 0) {
        permissionsByGroup = []; // Ini sebenarnya sudah default, tapi untuk kejelasan
      }

      const rolesByGroup = userData.role.filter((role) =>
        role?.path?.includes(groupsAksesCheck),
      );

      setUserData((prevData) => ({
        ...prevData,
        rolesByGroup: rolesByGroup,
        permissionsByGroup: permissionsByGroup,
      }));
    }
  }, [localStorage.getItem("groupsAkses")]); // Run this effect when userData or groupsAkses changes

  // Fetch user information when the component mounts
  useEffect(() => {
    fetchUserInformation();
  }, []);

  return { userData, loading, error };
};

export default useUserInformation;
