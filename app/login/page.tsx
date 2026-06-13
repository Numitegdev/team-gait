"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  Mail,
  Lock,
} from "lucide-react";

import {
  createClient,
} from "@/lib/supabase/client";

export default function LoginPage() {

  const router =
    useRouter();

  const supabase =
    createClient();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {

    setLoading(true);

    const { error } =
      await supabase.auth.signInWithPassword({

        email,

        password,

      });

    setLoading(false);

    if (error) {

      alert(
        error.message
      );

      return;

    }

  

    // router.push(
    //   "/dashboard"
    // );
window.location.href = "/dashboard";


  }

  return (

    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-slate-200
        via-slate-200
        to-slate-300
        flex
        items-center
        justify-center
        p-4
      "
    >

      <div
        className="
          w-full
          max-w-6xl
          overflow-hidden
          rounded-3xl
          bg-white
          shadow-2xl
          grid
          md:grid-cols-2
        "
      >

        <div
          className="
            hidden
            md:flex
            items-center
            justify-center
            bg-slate-100
            
          "
        >

          <Image
            src="/a.jpg"
            alt="Login"
            width={700}
            height={700}
            className="
              h-auto
              w-full
             
            "
          />

        </div>

        <div
          className="
            flex
            items-center
            justify-center
            p-8
            md:p-12
          "
        >

          <div
            className="
              w-full
              max-w-md
              text-center
            "
          >

            <h1
              className="
                text-4xl
                font-bold
                text-slate-900
              "
            >
              Selamat Datang
            </h1>

            <p
              className="
                mt-2
                text-slate-500
              "
            >
              Team GA & IT Dashboard
            </p>

            <div
              className="
                mt-8
                space-y-5
              "
            >

              <div
                className="
                  relative
                "
              >

                <Mail
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input

                  value={email}

                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }

                  placeholder="Email"

                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    py-3
                    pl-11
                    pr-4
                    outline-none
                    // transition
                    // focus:border-blue-500
                  "
                />

              </div>

              <div
                className="
                  relative
                "
              >

                <Lock
                  size={18}
                  className="
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input

                  type="password"

                  value={password}

                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }

                  placeholder="Password"

                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    py-3
                    pl-11
                    pr-4
                    outline-none
                    transition
                    focus:border-blue-500
                  "
                />

              </div>

              <button

                onClick={
                  handleLogin
                }

                disabled={
                  loading
                }

                className="
                  w-full
                  rounded-xl
                  bg-blue-600
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-blue-700
                  disabled:opacity-50
                "
              >

                {loading
                  ? "Loading..."
                  : "Login"}

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}