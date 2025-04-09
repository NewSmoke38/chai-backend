import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from
const videoSchema = new Schema(
    {
        videoFile: {
            type: String,    // clodinary url se aayega
            required: true
        },
        thumbnail: {
            type: String,    // clodinary url se aayega
            required: true
        },
        
        title: {
            type: String,    
            required: true
        },
        description: {
            type: String,    
            required: true
        },
        duration: {
            type: String,    
            required: true
        },
        views: {
            type: string,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)


videoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video", videoSchema)