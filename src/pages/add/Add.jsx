import React, { useReducer, useState } from "react";
import "./Add.scss";
import { gigReducer, INITIAL_STATE } from "../../reducers/gigReducer";
import upload from "../../utils/upload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import newRequest from "../../utils/newRequest";
import { useNavigate } from "react-router-dom";
import getCurrentUser from "../../utils/getCurrentUser"; 

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null); // To handle any errors during submission

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_FEATURE",
      payload: e.target[0].value,
    });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(singleFile);
      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );
      setUploading(false);
      dispatch({ type: "ADD_IMAGES", payload: { cover, images } });
    } catch (err) {
      console.error("Upload Error:", err);
      setUploading(false);
      setError("Failed to upload images. Please try again."); // Handle upload errors
    }
  };

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
      navigate("/mygigs"); // Navigate after successful gig creation
    },
    onError: (err) => {
      setError(err.response?.data || "Failed to create gig."); // Handle mutation errors
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const currentUser = getCurrentUser(); // Get the current user from local storage

    if (!currentUser) {
      setError("You must be logged in to create a gig."); // Check if the user is logged in
      return;
    }

    // Ensure userId is included in the gig data
    const gigData = {
      ...state,
      userId: currentUser._id, // Add userId from the current user
    };

    mutation.mutate(gigData); // Send the gig data to the API
  };

  return (
    <div className="add">
      <div className="container">
        <h1>Add New Gig</h1>
        {error && <div className="error-message">{error}</div>} {/* Display error messages */}
        <div className="sections">
          <div className="info">
            {/* Form fields */}
            <label htmlFor="">Title<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />
            <label htmlFor="">Category<span style={{ color: "red" }}>*</span></label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option disabled>Add your Category</option>
              <option value="design">Logo Design</option>
              <option value="web-development">Web Development</option>
              <option value="animation">Animation</option>
              <option value="ai-artists">AI Artists</option>
              <option value="wordpress">Word Press</option>
              <option value="video-editor">Video Editor</option>
              <option value="social-media">Social Media</option>
              <option value="seo">SEO</option>
            </select>
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image<span style={{ color: "red" }}>*</span></label>
                <input
                  type="file"
                  onChange={(e) => setSingleFile(e.target.files[0])}
                />
                <label htmlFor="">Upload Images<span style={{ color: "red" }}>*</span></label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <label htmlFor="">Description<span style={{ color: "red" }}>*</span></label>
            <textarea
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              onChange={handleChange}
            ></textarea>
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="details">
            {/* Additional details fields */}
            <label htmlFor="">Service Title<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />
            <label htmlFor="">Short Description<span style={{ color: "red" }}>*</span></label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
            ></textarea>
            <label htmlFor="">Delivery Time (e.g. 3 days)<span style={{ color: "red" }}>*</span></label>
            <input type="number" name="deliveryTime" onChange={handleChange} />
            <label htmlFor="">Revision Number<span style={{ color: "red" }}>*</span></label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
            />
            <label htmlFor="">Add Features<span style={{ color: "red" }}>*</span></label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">Add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map((f) => (
                <div className="item" key={f}>
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_FEATURE", payload: f })
                    }
                  >
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price<span style={{ color: "red" }}>*</span></label>
            <input type="number" onChange={handleChange} name="price" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
