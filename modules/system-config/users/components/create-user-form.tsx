"use client";

import { useState } from "react";

export function CreateUserForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "staff_driver",
  });

  async function handleSubmit() {
    setLoading(true);

    const res = await fetch(
      "/api/admin/create-user",
      {
        method: "POST",
        body: JSON.stringify(form),
      }
    );

    setLoading(false);

    if (!res.ok) {
      alert("Failed create user");
      return;
    }

    alert("User created");

    window.location.reload();
  }

  return (
    <div className="rounded-xl border bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">
        Create User
      </h2>

      <div className="grid gap-4">
        <input
          placeholder="Full Name"
          className="border p-2"
          onChange={(e) =>
            setForm({
              ...form,
              full_name: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          className="border p-2"
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <select
          className="border p-2"
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value,
            })
          }
        >
          <option value="staff_driver">
            Driver
          </option>

          <option value="staff_cheff">
            Chef
          </option>

          <option value="staff_security">
            Security
          </option>

          <option value="staff_officeboy">
            Office Boy
          </option>

          <option value="it_staff">
            IT Staff
          </option>

          <option value="staff_admin">
            Staff Admin
          </option>

             <option value="staff_gudang">
            Staff Gudang
          </option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-black p-2 text-white"
        >
          {loading ? "Loading..." : "Create User"}
        </button>
      </div>
    </div>
  );
}