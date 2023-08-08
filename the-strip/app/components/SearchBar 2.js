import React from 'react';
import { Formik, Form, Field } from 'formik';

const SearchBar = ({ onSearch }) => {
  return (
    <Formik
      initialValues={{ searchTerm: '' }}
      onSubmit={(values, { setSubmitting }) => {
        onSearch(values.searchTerm);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="flex items-center justify-center"> {/* Flexbox classes to center the content */}
            <Field
              type="text"
              name="searchTerm"
              placeholder="Search Comics..."
              className="text-black"
            />
            <button type="submit" disabled={isSubmitting}>
              Search
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SearchBar;
