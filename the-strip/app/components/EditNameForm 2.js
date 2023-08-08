import React, { useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserContext from "../components/utils/UserContext";

const EditNameForm = ({ user }) => {
  const { updateUserName } = useContext(UserContext);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
  });

  // Function to handle form submission
  const handleEditNameSubmit = async (values, { setSubmitting }) => {
    try {
      // Call the updateUserName function from UserContext to update the user's name
      await updateUserName(values.name);
      // Handle any additional logic after successful name update if needed
      // ...
    } catch (error) {
      console.error("Failed to update name:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik initialValues={{ name: user.name || "" }} validationSchema={validationSchema} onSubmit={handleEditNameSubmit}>
      <Form>
        <div className="mb-4">
          <label htmlFor="name" className="block mb-2 font-medium">
            New Name
          </label>
          <Field type="text" id="name" name="name" className="w-full p-2 border border-gray-300 rounded" />
          <ErrorMessage name="name" component="div" className="text-red-500" />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </Form>
    </Formik>
  );
};

export default EditNameForm;
