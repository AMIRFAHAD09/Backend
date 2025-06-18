const {z} = require("zod");
const signupSchema = z.object({
    username:z
    .string({required_error:"name is required"})
    .trim()
    .min(3,{message:"name must be atleast 3 character"})
    .max(30,{message:"name length not more than 30 character"}),
    email:z
    .string({required_error:"email is required"})
    .trim()
    .email({message:"Invalid email id"})
    .min(3,{message:"email must be atleast 7 character"})
    .max(50,{message:"name length not more than 30 character"}),
    phone:z
    .string({required_error:"phone number is required"})
    .trim()
    .min(10,{message:"phone must be atleast 10 character"})
    .max(10,{message:"phone number exceed length"}),
    password:z
    .string({required_error:"password required"})
    .trim()
    .min(4,{message:"password must be atleast 4 character"})
    .max(30,{message:"password length not more than 30 character"})
})
module.exports=signupSchema;