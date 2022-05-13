import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { createLogEntry } from "./API";

const LogEntryForm = ({ location, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
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
      <div class="field">
        <label class="label">UserName</label>
        <div class="control">
          <input class="input" type="text" placeholder="e.g Abel Birhanu" />
        </div>
      </div>

      <div class="field">
        <label class="label">Title</label>
        <div class="control">
          <input class="input" type="text" placeholder="e.g Ye Mebrat Pole" />
        </div>
      </div>

      <div class="field">
        <label class="label">Image</label>
        <p class="control has-icons-left">
          <input class="input" type="text" placeholder="Image URL" />
          <span class="icon is-small is-left">
            <i class="fas fa-file-image"></i>
          </span>
        </p>
      </div>
      <div className="field">
        <label class="label">Description</label>
        <textarea class="textarea" placeholder="e.g. Hello world"></textarea>
      </div>

      <div class="field">
        <label class="label">Date</label>
        <div class="control">
          <input class="input" type="date" placeholder="" />
        </div>
      </div>

      <div className="field">
        <button type="submit" className="button is-primary">
          Save
        </button>
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
