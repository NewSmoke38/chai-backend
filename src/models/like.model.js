import mongoose, {Mongoose, Schema} from "mongoose";

const likeSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjedId,
            ref: "Video"    
        },
        comment: {
            type: Schema.Types.ObjedId,
            ref: "Comment"    
        },
        tweet: {
            type: Schema.Types.ObjedId,
            ref: "Tweet"    
        },
        likedBy: {
            type: Schema.Types.ObjedId,
            ref: "User"    
        }
    },
    {
        timestamps: true
    }
)

export const Like = mongoose.model("Like", likeSchema)