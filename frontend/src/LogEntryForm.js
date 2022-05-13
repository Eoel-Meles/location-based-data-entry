import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { createLogEntry } from "./API";

const LogEntryForm = ({ location, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      setLoading(true);
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      await createLogEntry(data);
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label className="label">Title</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="e.g Ye Mebrat Pole"
            {...register("title", { required: true })}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Icon</label>
        <p className="control has-icons-left">
          <input
            className="input"
            type="text"
            placeholder="Icon URL"
            {...register("icon")}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-file-image"></i>
          </span>
        </p>
      </div>

      <div className="field">
        <label className="label">Image</label>
        <p className="control has-icons-left">
          <input
            className="input"
            type="text"
            placeholder="Image URL"
            {...register("image")}
          />
          <span className="icon is-small is-left">
            <i className="fas fa-file-image"></i>
          </span>
        </p>
      </div>
      <div className="field">
        <label className="label">Description</label>
        <textarea
          className="textarea"
          placeholder="e.g. Hello world"
          {...register("description")}
        ></textarea>
      </div>

      <div className="field">
        <label className="label">Date</label>
        <div className="control">
          <input
            className="input"
            type="date"
            placeholder=""
            {...register("date")}
          />
        </div>
      </div>

      <div className="field">
        <input type="submit" className="button is-primary" value="Save" />
      </div>
    </form>
  );
};

// const form = () => {
//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
//       {error ? <h3 className="error">{error}</h3> : null}
//       <label htmlFor="apiKey">API KEY</label>
//       <input type="password" name="apiKey" required ref={register} />
//       <label htmlFor="title">Title</label>
//       <input name="title" required ref={register} />
//       <label htmlFor="comments">Comments</label>
//       <textarea name="comments" rows={3} ref={register}></textarea>
//       <label htmlFor="description">Description</label>
//       <textarea name="description" rows={3} ref={register}></textarea>
//       <label htmlFor="image">Image</label>
//       <input name="image" ref={register} />
//       <label htmlFor="visitDate">Visit Date</label>
//       <input name="visitDate" type="date" required ref={register} />
//       <button disabled={loading}>
//         {loading ? "Loading..." : "Create Entry"}
//       </button>
//     </form>
//   );
// };

export default LogEntryForm;
