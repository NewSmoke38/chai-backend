// promise wala method


const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
        catch((err) => next(err))
    }
}




export {asyncHandler}



// TRY AND CATCH METHOD


// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}}      // inn curly braces ko hata dete hai
// const asyncHandler = (func) => async () => {}     // to make it async

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(error.code || 404).json({
//             success: false,
//             message: error.message
//         })
//     }
// }