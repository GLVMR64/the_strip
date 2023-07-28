import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { UserContext } from "../app/components/utils/UserContext";

export default function Register() {
  const router = useRouter();
  const { updateUserContext } = useContext(UserContext);

  // Initial form values
  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = async (values, { setErrors }) => {
    try {
      const response = await fetch("http://127.0.0.1:5555/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok || response.status === 201) {
        // Handle 201 status code
        const newUser = await response.json();
        updateUserContext(newUser);

        // Redirect to the home page after successful registration
        router.push("/");
      } else if (response.status === 400) {
        // Handle validation errors
        const errors = await response.json();
        setErrors(errors);
      } else {
        // Handle other error cases
        console.error("Registration failed:", response.status);
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-red-500 to-purple-900">
      <Navbar />
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-white p-8 rounded shadow-md w-96 bg-gradient-to-r from-purple-300 to-pink-500">
          <h1 className="text-2xl font-bold mb-4">Register</h1>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            <Form className="text-black">
              <div className="mb-4">
                <label htmlFor="name" className="block mb-2 font-medium">
                  Name
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500"
                />
              </div>

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
              {/* Link to login page */}
              <div className="text-center mt-4">
                Already have an account?{" "}
                <Link href="/login">
                  <a className="text-purple-500">Login here</a>
                </Link>
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-red-500 text-white px-4 py-2 rounded mt-4 w-full"
              >
                Register
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}
