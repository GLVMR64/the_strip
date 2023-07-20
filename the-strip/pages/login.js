import React, { useContext, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserContext from "../app/components/utils/UserContext";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

export default function Login() {
  const router = useRouter();
  const { logIn, user } = useContext(UserContext);
  const [data, setData] = useState();
  // Initial form values
  const initialValues = {
    email: "",
    password: "",
  };

  // Form validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values, { setErrors }) => {
    try {
      // Handle login logic here (e.g., send API request)
      await fetch("http://127.0.0.1:5555/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((r) => r.json())
        .then((data) => {
          // Call logIn with the ID value
          logIn(data.id);
          console.log(data);
          // Redirect to the root URL after successful login
          router.push("/");
        });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form>
              
              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2 font-medium text-black">
                  Email
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-2 border border-gray-300 rounded text-black"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>

               {/* Password Field */}
               <div className="mb-4">
                
                <label htmlFor="password" className="block mb-2 font-medium text-black">
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className="w-full p-2 border border-gray-300 rounded text-black"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
              >
                Login
              </button>

              {!user && (
                <p className="mt-4 text-center">
                  Not registered yet?{" "}
                  <button
                    type="button"
                    className="text-blue-500 underline"
                    onClick={handleRegister}
                  >
                    Register here
                  </button>
                </p>
              )}
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}
