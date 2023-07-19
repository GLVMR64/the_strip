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
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Navbar />
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-medium">
                Email
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 font-medium">
                Password
              </label>
              <Field
                type="password"
                id="password"
                name="password"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Login
            </button>

            {!user && (
              <p className="mt-2">
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
  );
}
