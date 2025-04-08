const TestimonialSchema = require('../models/TestimonialModel');


const GetTestimonial = async (req,res)=>{
    try{
   const testimonialData = await TestimonialSchema.find();
   if(!testimonialData) return res.status(401).json({message: "Testimonial not found"})
    return res.status(201).json(testimonialData);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "internal server error"})
    }
}

const PostTestimonial = async(req,res) =>{

    try {
        const {name, designation, data, rating, images} = req.body;
        const NewTestimonial = await TestimonialSchema.create({name, designation, data, rating, images})
        if(!NewTestimonial) return res.status(401).json({message:"From data is uncompleted"})
        
        return res.status(201).json({message:"testimonial created successfully"})

    } catch (error) {
        console.log(error);
        res.status(500).json({message: error})
    }

}


module.exports = {
    GetTestimonial,
    PostTestimonial
}