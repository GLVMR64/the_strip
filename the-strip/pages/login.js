import React, { useContext, useState } from "react";
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
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values, { setErrors, setSubmitting }) => {
    try {
      const response = await fetch("http://127.0.0.1:5555/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        // Check if the response status is not OK (i.e., 2xx)
        throw new Error("Login failed");
      }
  
      const data = await response.json();
  
      // Check if the data contains an "id" property, assuming it's the user ID
      if (data.id) {
        // Call logIn with the ID value
        logIn(data.id);
        console.log(data);
        // Redirect to the root URL after successful login
        router.push("/");
      } else {
        throw new Error("Invalid response data");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      // Handle errors and set custom error messages on the form fields
      setErrors({
        email: "Invalid email or password",
        password: "Invalid email or password",
      });
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded shadow-md w-96 bg-gradient-to-r from--300 to-pink-500">
          <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ isSubmitting }) => (
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
                  disabled={isSubmitting} // Disable the button while submitting
                >
                  {isSubmitting ? 'Logging In...' : 'Login'}
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
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
