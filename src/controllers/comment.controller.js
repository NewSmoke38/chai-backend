import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

// fetching stuff
const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params        // for url of vid
    const {page = 1, limit = 10} = req.query

    const comments = await Comment.aggregate([
  {
    $match: {                  // konsa vid
      video: new mongoose.Types.ObjectId(videoId)   //Filter only the comments that belong to the specified video by matching videoId.
    }
  },
  {
    $lookup: {             // konsa aadmi likhne wala
      from: "users",      // user ka info like username and avatar
      localField: "owner",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" }
])

})

// adding smthg
const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
const {videoId} = req.params        // for url of vid
const { text } = req.body        // content will go in text 
const userId = req.user?._id    // req.user is set by JWT middleware

  if (!text) {
    throw new ApiError(400, "Comment text is required")
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized: User must be logged in")
  }

  const newComment = await Comment.create({
    text,
    video: videoId,
    owner: userId
  })

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment added successfully"))
})
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }