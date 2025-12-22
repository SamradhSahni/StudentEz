const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  logoUrl: String,            
  salary: String,             
  deadline: Date,             
  openings: Number,          
  description: String,       
  experience: String,         
  skills: [String],     
  createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},      
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("Job", jobSchema);
