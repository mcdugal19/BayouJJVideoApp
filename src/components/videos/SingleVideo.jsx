// This component is responsible for the detailed description view of each Video in the listing.

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { SingleReview, ReviewForm } from "../reviews";
import { Rating } from "@mui/material";

const SingleVideo = () => {
  const { videos, isLoggedIn } = useAuth();
  let { videoId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [value, setValue] = useState(0);

  const [video] = videos.filter((item) => {
    return item.id == videoId;
  });

  useEffect(() => {
    function getValue() {
      if (video !== undefined) {
        setValue(video.overallRating);
      }
    }
    getValue();
  }, []);

  useEffect(() => {
    function getReviews() {
      if (video !== undefined) {
        setReviews(video.reviews);
      }
    }
    getReviews();
  }, [setReviews]);

  return (
    <>
      {video !== undefined ? (
        <div className="single-video-page">
          <div className="single-video-container">
          <div className="iframe-container">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/hnYvfiz2YpM"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
            <span className="single-video-info">
              <h2 className="single-video-name">{video.name}</h2>
              {video.variation ? <h3>{video.variation}</h3> : null}
              {value ? (
                <Rating
                  name="read-only"
                  value={value}
                  precision={0.5}
                  size="large"
                  readOnly
                />
              ) : null}
              <br />
              {/* <h4>{video.category}</h4> */}
              <p>{video.description}</p>
            </span>
          </div>
          <div className="reviews-container">
            {isLoggedIn ? (
              <span className="review-form-container">
                <h4>
                  We'd love to hear your thoughts on this {video.name}!
                </h4>
                <ReviewForm
                  videoId={video.id}
                  reviews={reviews}
                  setReviews={setReviews}
                />
              </span>
            ) : (
              <h4>Log in to leave a review!</h4>
            )}
            {reviews.length > 0 ? (
              reviews.map((review, idx) => {
                return (
                  <SingleReview
                    key={`review-${idx}`}
                    review={review}
                    reviews={reviews}
                    setReviews={setReviews}
                    video={video}
                  />
                );
              })
            ) : (
              <h4>No Reviews Yet!</h4>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
};

export default SingleVideo;