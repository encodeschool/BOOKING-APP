import { useEffect, useState } from "react";
import {
  FaUsers,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUserTie,
  FaUser,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../../app/providers/AuthProvider";
import { getUsersApi } from "../../lib/api/users.api";

export default function UsersPage() {
  const { token } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (token) {
      loadUsers();
    }
  }, [token]);

  async function loadUsers() {
    try {
      setLoading(true);

      const data =
        await getUsersApi(token);

      setUsers(data || []);
    } catch (error) {
      console.error(
        "Failed to load users:",
        error
      );

      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter((user) => {
    const fullName = user.fullName || "";
    const email = user.email || "";

    return (
      (fullName.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase())) &&
      (filter === "" || user.role === filter)
    );
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case "SUPERADMIN":
        return {
          icon: <FaUserShield />,
          className:
            "bg-red-100 text-red-700 border border-red-200",
        };

      case "STAFF":
        return {
          icon: <FaUserTie />,
          className:
            "bg-emerald-100 text-emerald-700 border border-emerald-200",
        };

      default:
        return {
          icon: <FaUser />,
          className:
            "bg-blue-100 text-blue-700 border border-blue-200",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 p-8 text-white shadow-2xl">
        {/* Background circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-white/10 rounded-full"></div>
        <div className="absolute top-10 left-1/3 w-24 h-24 bg-white/10 rounded-full"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* LEFT */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg">
                <FaUsers className="text-3xl" />
              </div>

              <div>
                <h1 className="text-4xl font-bold">
                  Users Management
                </h1>

                <p className="text-indigo-100 mt-1 text-lg">
                  Manage admins, staff and customers
                </p>
              </div>
            </div>

            <div className="flex gap-4 mt-6 flex-wrap">
              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                <p className="text-2xl font-bold">
                  {users.length}
                </p>

                <p className="text-sm text-indigo-100">
                  Total Users
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                <p className="text-2xl font-bold">
                  {
                    users.filter(
                      (u) => u.role === "STAFF"
                    ).length
                  }
                </p>

                <p className="text-sm text-indigo-100">
                  Staff Members
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
                <p className="text-2xl font-bold">
                  {
                    users.filter(
                      (u) =>
                        u.role === "SUPERADMIN"
                    ).length
                  }
                </p>

                <p className="text-sm text-indigo-100">
                  Admins
                </p>
              </div>
            </div>
          </div>

          {/* BUTTON */}
          <button className="flex items-center gap-3 bg-white text-indigo-700 px-6 py-4 rounded-2xl font-semibold hover:scale-105 transition-all shadow-xl">
            <FaPlus />
            Add User
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* SEARCH */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          {/* FILTER */}
          <select
            className="px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
          >
            <option value="">
              All Roles
            </option>

            <option value="SUPERADMIN">
              Superadmin
            </option>

            <option value="USER">
              User
            </option>

            <option value="STAFF">
              Staff
            </option>
          </select>
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
          <div className="flex flex-col items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />

            <p className="text-gray-500 text-lg">
              Loading users...
            </p>
          </div>
        </div>
      )}

      {/* TABLE */}
      {!loading && (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* TABLE HEADER */}
          <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                All Users
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {filteredUsers.length} users found
              </p>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User
                  </th>

                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>

                  <th className="px-8 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>

                  <th className="px-8 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const badge = getRoleBadge(
                    user.role
                  );

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/70 transition"
                    >
                      {/* USER */}
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold shadow-md">
                            {(user.fullName || user.email || "U").charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.fullName || "Unnamed User"}
                            </p>

                            <p className="text-sm text-gray-500">
                              User ID: #{user.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="px-8 py-5 text-gray-600">
                        {user.email || "No email"}
                      </td>

                      {/* ROLE */}
                      <td className="px-8 py-5">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${badge.className}`}
                        >
                          {badge.icon}
                          {user.role}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-8 py-5">
                        <div className="flex justify-end gap-3">
                          <button className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition">
                            <FaEdit />
                          </button>

                          <button className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100 transition">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="lg:hidden p-5 space-y-4">
            {filteredUsers.map((user) => {
              const badge = getRoleBadge(
                user.role
              );

              return (
                <div
                  key={user.id}
                  className="border border-gray-100 rounded-2xl p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center font-bold">
                        {(user.fullName || user.email || "U").charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900">
                          {user.fullName || "Unnamed User"}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {user.email || "No mail"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${badge.className}`}
                    >
                      {badge.icon}
                      {user.role}
                    </div>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 bg-blue-50 text-blue-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                      <FaEdit />
                      Edit
                    </button>

                    <button className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-medium flex items-center justify-center gap-2">
                      <FaTrash />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* EMPTY STATE */}
          {filteredUsers.length === 0 && (
            <div className="py-20 text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-indigo-50 flex items-center justify-center mb-6">
                <FaUsers className="text-4xl text-indigo-500" />
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No users found
              </h3>

              <p className="text-gray-500">
                Try changing your search or
                filter settings
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}