import mongoose, {Mongoose, Schema} from "mongoose";
import mongooseAggregatePaginate from
"mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        video: {
            type: Schema.Types.ObjedId,
            ref: "Video"            //from video model
        },
        owner: {
            type: Schema.Types.ObjedId,
            ref: "User"            // fromUser model
        }
    },

    {
        timestamps: true
    }
)


commentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", commentSchema)
