import React, { useContext, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserContext from "../app/components/utils/UserContext";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import Link from "next/link"; // Import Link from next

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
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values, { setErrors }) => {
    try {
      // Handle login logic here (e.g., send API request)
      const response = await fetch("http://127.0.0.1:5555/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      // Call logIn with the ID value
      logIn(data.id);
      console.log(data);
      // Redirect to the root URL after successful login
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  // Check if the user is already logged in on initial load
  useEffect(() => {
    // Get the user token from localStorage
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      // Assuming you have an API route to verify the user token and get user details
      fetch("http://127.0.0.1:5555/verify-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Invalid token");
          }
        })
        .then((data) => {
          // Call logIn with the ID value
          logIn(data.id);
          console.log(data);
          // Redirect to the root URL after successful login
          router.push("/");
        })
        .catch((error) => {
          console.error("Error verifying token:", error);
          // If there's an error verifying the token, remove it from localStorage
          localStorage.removeItem("userToken");
        });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded shadow-md w-96 bg-gradient-to-r from-red-300 to-pink-500">
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
              
              {/* Always show the "Register here" link */}
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
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}
