import axios from "axios";

import { LoginBody, LoginParams } from "./casdoor.interface";
import { casdoorConfig, CasdoorConfigAAD } from "./casdoor.config";
import { PUBLIC_URL_CALLBACK } from "./casdoorUrl";

export class CasdoorOAuth {
  public async login(username: string, password: string) {
    const body: LoginBody = {
      application: casdoorConfig.appName,
      autoSignin: true,
      organization: casdoorConfig.organizationName,
      signinMethod: "Password",
      type: "code",
      username: username,
      password: password,
    };
    const params: LoginParams = {
      clientId: casdoorConfig.clientId as string,
      type: "code",
      scope: "read",
      redirectUri: casdoorConfig.hostname + casdoorConfig.redirectPath,
      responseType: "code",
      state: casdoorConfig.appName,
    };

    const res = await axios.post(
      casdoorConfig.authProviderUrl + "/login",
      body,
      {
        params: params,
      },
    );
    return res;
  }

  public async accessToken(code: string) {
    const res = await axios.get(
      casdoorConfig.authProviderUrl + "/access-token",
      {
        headers: { code },
      },
    );
    return res;
  }

  public async accessTokenPasspharse(
    code: string,
    username: string,
    password: string,
  ) {
    const res = await axios.post(
      casdoorConfig.authProviderUrl + "/access-token",
      {
        username, // Mengirimkan username dalam body
        password, // Mengirimkan password dalam body
      },
      {
        headers: { code }, // Mengatur header di sini
        withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
      },
    );

    // Mengembalikan data dari respons
    return res; // Anda bisa mengembalikan res.data untuk mendapatkan data yang relevan
  }

  public async getGroupAkses(token: any, owner: string) {
    const url = casdoorConfig.authProviderUrl + "/auth/get-group";

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        owner: owner, // REQUIRED parameter from Swagger
      },
      withCredentials: true,
    };

    const res = await axios.get(url, config); // Use GET method
    return res;
  }

  public async getGroupAksesDataCiseaLama(token: any) {
    const res = await axios.get(
      casdoorConfig.authProviderUrl + "/organizations",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Menambahkan Bearer Token
        },
        withCredentials: true,
      },
    );
    return res;
  }

  // start multifactor
  public async accessTokenUserExternal(username: string, password: string) {
    const res = await axios.post(
      casdoorConfig.authProviderUrl + "/login",
      {
        password, // Mengirimkan password dalam body
        username, // Mengirimkan username dalam body
      },
      {
        withCredentials: true,
      },
    );

    return res.data;
  }

  public async getCaptcha(sessionId: string) {
    try {
      const res = await axios.post(
        casdoorConfig.authProviderUrl + "/get-capcha",
        { sessionId },
        {
          withCredentials: true,
        },
      );

      return res.data; // Mengembalikan hanya data yang relevan
    } catch (error) {
      console.error("Error fetching CAPTCHA:", error);
      throw new Error("Failed to get CAPTCHA"); // Menangani kesalahan dengan baik
    }
  }

  public async aksesLoginMFA(passcode: string, key: string) {
    const sessionId = localStorage.getItem("sessionId");
    const res = await axios.post(
      casdoorConfig.authProviderUrl + "/login-mfa",
      {
        passcode, // Mengirimkan password dalam body
        key, // Mengirimkan username dalam body
        sessionId, // Mengirimkan sessionId dalam body
      },
    );

    // Mengembalikan data dari respons
    return res; // Anda bisa mengembalikan res.data untuk mendapatkan data yang relevan
  }
  // End multifactor

  // get user information user karyawan
  public async getUserInformation(token: any) {
    const res = await axios.get(
      casdoorConfig.authProviderUrl + "/users/information",
      {
        headers: {
          Authorization: `Bearer ${token}`, // Menambahkan Bearer Token
        },
      },
    );
    return res;
  }
  // End get user information user karyawan

  // reset password casdoor setup
  public async verificationForgotPassword(identity: string) {
    const res = await axios.post(
      casdoorConfig.authProviderUrl + "/forgot/check-identity",
      {
        identity, // Menambahkan Bearer Token
      },
    );

    localStorage.setItem("sessionId", res.data.data.sessionId);

    return res;
  }

  // send captcha
  public async getCaptchaReset(sessionId: string) {
    try {
      const res = await axios.post(
        casdoorConfig.authProviderUrl + "/forgot/send-code",
        { sessionId },
      );

      // Mengembalikan data dari respons
      return res.data; // Mengembalikan hanya data yang relevan
    } catch (error) {
      console.error("Error fetching CAPTCHA:", error);
      throw new Error("Failed to get CAPTCHA"); // Menangani kesalahan dengan baik
    }
  }
  // end send captcha

  // verification captcha
  public async verificationValidateCode(code: string, sessionId: string) {
    const res = await axios.post(
      casdoorConfig.authProviderUrl + "/forgot/verify-code",
      {
        code,
        sessionId,
      },
    );
    return res;
  }
  // end verify captcha

  // confirmation password
  public async verificationConfirmationPassword(
    sessionId: string,
    passwordConfirmation: string,
    password: string,
  ) {
    const res = await axios.post(
      casdoorConfig.authProviderUrl + "/forgot/set-password",
      {
        sessionId: sessionId,
        confirm_password: passwordConfirmation,
        password,
      },
    );
    return res;
  }

  // User Casdoor Manage
  // set user pagination casdoor
  public async getUserPagination(
    token: any,
    page: number,
    size: number,
    owner: string,
  ) {
    try {
      const res = await axios.get(`${casdoorConfig.authProviderUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`, // Menggunakan token dari localStorage
        },
        params: {
          page: page,
          size: size,
          owner: owner,
        },
        withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
      });

      // Mengembalikan data dari respons
      return res.data; // Mengembalikan hanya data yang relevan
    } catch (error) {
      console.error("Error fetching user pagination:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get user pagination: ${error.message}`);
      } else {
        throw new Error("Failed to get user pagination");
      }
    }
  }
  // end set user pagination casdoor

  // get user by username
  public async getUserByName(token: string, name: string): Promise<any> {
    try {
      // Encode the username to handle special characters like '/'
      const encodedName = encodeURIComponent(name);

      const response = await axios.get(
        `${casdoorConfig.authProviderUrl}/users/${encodedName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Using the token from localStorage
          },
          withCredentials: true, // Set option to send cookies
        },
      );

      // Return relevant data from the response
      return response.data; // Return only the relevant data
    } catch (error) {
      console.error("Error fetching user data:", error);

      // Handle error more gracefully
      if (axios.isAxiosError(error)) {
        // If the error is an Axios error, you can access the response
        const errorMessage =
          error.response?.data?.message || "Failed to get user data";
        throw new Error(errorMessage); // Throw a more specific error message
      } else {
        throw new Error("Failed to get user data"); // General error handling
      }
    }
  }
  // end get user by username

  // post user casdoor single
  public async addUserCasdoor(token: string, userDetails: any) {
    try {
      const res = await axios.post(
        `${casdoorConfig.authProviderUrl}/users`,
        userDetails,
        // {
        //   "name": "string",
        //   "password": "string",
        //   "email": "string",
        //   "groups": [
        //     "string"
        //   ],
        //   "id": "string"
        // }
        {
          headers: {
            Authorization: `Bearer ${token}`, // Mengambil token dari localStorage
          },
          withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
        },
      );

      console.log("User added successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error adding user:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to add user");
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  // end post user casdoor single

  // update user casdoor by username
  public async updateUser(token: string, name: any, userDetails: any) {
    try {
      const res = await axios.patch(
        `${casdoorConfig.authProviderUrl}/users/update-user`,
        userDetails,
        {
          params: {
            name: name, // Menggunakan parameter nama pengguna
          },
          headers: {
            Authorization: `Bearer ${token}`, // Mengambil token dari localStorage
          },
          withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
        },
      );

      console.log("User updated successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error updating user:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to update user",
        );
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  // end update user casdoor by username

  // delete user casdoor
  public async deleteUser(token: string, userId: string) {
    try {
      const res = await axios.delete(
        `${casdoorConfig.authProviderUrl}/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Mengambil token dari localStorage
          },
          data: {
            userId: userId, // ID pengguna yang ingin dihapus
          },
          withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
        },
      );

      console.log("User deleted successfully:", res.data);
      return res.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to delete user",
        );
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  // end delete user casdoor

  // get account
  public async getAccount(token: string) {
    try {
      const res = await axios.get(
        `${casdoorConfig.authProviderUrl}/users/account`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Menggunakan token dari localStorage
          },

          withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
        },
      );

      // Mengembalikan data dari respons
      return res.data; // Mengembalikan hanya data yang relevan
    } catch (error) {
      console.error("Error fetching user pagination:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get user pagination: ${error.message}`);
      } else {
        throw new Error("Failed to get user pagination");
      }
    }
  }

  public async getAccessTokenEx(token: string) {
    try {
      const res = await axios.get(
        `${casdoorConfig.authProviderUrl}/access-token-ex`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
        },
      );

      return res.data;
    } catch (error) {
      console.error("Error get access token ex:", error);
    }
  }
  // end get account

  // get

  // End User Casdoor Manage

  // Permission Casdoor Manage
  // set permission pagination casdoor
  public async getPermissionPagination(
    token: any,
    page?: number,
    size?: number,
  ) {
    try {
      const params: any = {};

      // Set pagination parameters only if they are provided
      if (page !== undefined) {
        params.page = 1;
      }
      if (size !== undefined) {
        params.size = 10;
      }

      const res = await axios.get(
        `${casdoorConfig.authProviderUrl}/permissions`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Using token from localStorage
          },
          params: params, // Pass the params object
          withCredentials: true, // Set option to send cookies
        },
      );

      // Return relevant data from the response
      return res.data; // Return only the relevant data
    } catch (error) {
      console.error("Error fetching user pagination:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get user pagination: ${error.message}`);
      } else {
        throw new Error("Failed to get user pagination");
      }
    }
  }

  // end set permission pagination casdoor

  // get permission by username
  public async getPermissionByName(token: string, name: string) {
    try {
      const res = await axios.get(
        `${casdoorConfig.authProviderUrl}/permissions/`,
        {
          params: {
            name: name, // Menggunakan parameter nama
          },
          headers: {
            Authorization: `Bearer ${token}`, // Mengambil token dari localStorage
          },
          withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
        },
      );

      console.log("Permission retrieved successfully:", res.data);
      return res.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error("Error retrieving permission:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to retrieve permission",
        );
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  // end get permission by username

  // post permission casdoor single
  public async addPermission(
    token: string,
    users: string[],
    permissionName: string,
  ) {
    try {
      const res = await axios.post(
        `${casdoorConfig.authProviderUrl}/permission/add-permission`,
        {
          user: users, // Array pengguna
          name: permissionName, // Nama izin
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Mengambil token dari localStorage
          },
          withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
        },
      );

      console.log("Permission added successfully:", res.data);
      return res.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error("Error adding permission:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to add permission",
        );
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  // end post permission casdoor single

  // update permission casdoor
  public async updatePermission(token: string, name: string, users: string[]) {
    try {
      const res = await axios.patch(
        `${casdoorConfig.authProviderUrl}/permissions/`,
        {
          user: users, // Array pengguna
          name: name, // Nama izin yang ingin diperbarui
        },
        {
          params: {
            name: name, // Menggunakan parameter nama
          },
          headers: {
            Authorization: `Bearer ${token}`, // Mengambil token dari localStorage
          },
          withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
        },
      );

      console.log("Permission updated successfully:", res.data);
      return res.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error("Error updating permission:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to update permission",
        );
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  // end update permission casdoor

  // delete permission casdoor
  public async deletePermission(token: string, permissionName: string) {
    try {
      const res = await axios.delete(
        `${casdoorConfig.authProviderUrl}/permissions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("akses-token")}`, // Mengambil token dari localStorage
          },
          data: {
            name: permissionName, // Nama izin yang ingin dihapus
          },
          withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
        },
      );

      console.log("Permission deleted successfully:", res.data);
      return res.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error("Error deleting permission:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to delete permission",
        );
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  // end delete permission casdoor

  // End Permission Casdoor Manage

  // Role Casdoor Manage

  // set role pagination casdoor
  public async getRolePagination(token: any, page: number, size: number) {
    try {
      const res = await axios.get(`${casdoorConfig.authProviderUrl}/roles`, {
        headers: {
          Authorization: `Bearer ${token}`, // Menggunakan token dari localStorage
        },
        params: {
          page: page,
          size: size,
        },
        withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
      });

      // Mengembalikan data dari respons
      return res.data; // Mengembalikan hanya data yang relevan
    } catch (error) {
      console.error("Error fetching user pagination:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to get user pagination: ${error.message}`);
      } else {
        throw new Error("Failed to get user pagination");
      }
    }
  }
  // end set role pagination casdoor

  // get role by name
  public async getRoleByName(token: string, name: string) {
    try {
      const res = await axios.get(
        `${casdoorConfig.authProviderUrl}/roles/`,
        {
          params: {
            name: name, // Menggunakan parameter nama
          },
          headers: {
            Authorization: `Bearer ${token}`, // Mengambil token dari localStorage
          },
          withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
        },
      );

      console.log("Role retrieved successfully:", res.data);
      return res.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error("Error retrieving role:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to retrieve role",
        );
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  // end get role by name

  // post role casdoor single
  public async addRole(
    token: string,
    groups: string[],
    roles: string[],
    users: string[],
    description: string,
    name: string,
  ) {
    try {
      const res = await axios.post(
        `${casdoorConfig.authProviderUrl}/roles`,
        {
          group: groups, // Array grup
          role: roles, // Array peran
          user: users, // Array pengguna
          description: description, // Deskripsi peran
          name: name, // Nama peran
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Mengambil token dari localStorage
          },
          withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
        },
      );

      console.log("Role added successfully:", res.data);
      return res.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error("Error adding role:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || "Failed to add role");
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  // end post role casdoor single

  // update role casdoor
  public async updateRole(
    token: string,
    name: string,
    groups: string[],
    roles: string[],
    users: string[],
    description: string,
  ) {
    try {
      const res = await axios.patch(
        `${casdoorConfig.authProviderUrl}/roles/`,
        {
          group: groups,
          role: roles,
          user: users,
          description: description,
          name: name,
        },
        {
          params: {
            name: name, // Menggunakan parameter nama
          },
          headers: {
            Authorization: `Bearer ${token}`, // Mengambil token dari localStorage
          },
          withCredentials: true, // Mengatur opsi untuk mengirimkan cookie
        },
      );

      console.log("Role updated successfully:", res.data);
      return res.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error("Error updating role:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to update role",
        );
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  // end update role casdoor

  // delete role casdoor
  public async deleteRole(token: string, roleName: string) {
    try {
      const res = await axios.delete(
        `${casdoorConfig.authProviderUrl}/roles`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Mengambil token dari localStorage
          },
          data: roleName, // Mengirimkan nama peran yang ingin dihapus
        },
      );

      console.log("Role deleted successfully:", res.data);
      return res.data; // Mengembalikan data dari respons
    } catch (error) {
      console.error("Error deleting role:", error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to delete role",
        );
      } else {
        throw new Error("An unexpected error occurred");
      }
    }
  }
  // delete role casdoor

  // End Role Casdoor Manage

  // logout session casdoor
  public async logoutAkses(token: string) {
    const res = await axios.post(
      `${casdoorConfig.authProviderUrl}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      },
    );

    return res;
  }
  // end logout session casdoor
}

// verification akses casdoor api nya
export function CasdoorAksesAAD(): string {
  const params = new URLSearchParams({
    authProviderUrl: CasdoorConfigAAD.authProviderUrl,
    client_id: CasdoorConfigAAD.clientId as string,
    redirect_uri: `${PUBLIC_URL_CALLBACK}`,
    scope: CasdoorConfigAAD.scope,
    response_type: CasdoorConfigAAD.responseType,
    state: CasdoorConfigAAD.state,
  });

  const url = CasdoorConfigAAD.authProviderUrl;
  return url + "?" + params;
}
