import imagekit from "../configs/imageKit.js";
import Resume from "../models/Resume.js";
import fs from "fs";

//controller for creating new resume
// POST : /api/resumes/create

export const createResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {title} = req.body;

        // create new resume
        const newResume = await Resume.create({userId,title});

        //return success message
        return res.status(201).json({ message: "Resume created successfully", resume: newResume });
        
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for deleting a resume
// POST : /api/resumes/delete

export const deleteResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        await Resume.findOneAndDelete({userId,_id: resumeId});

        //return success message
        return res.status(200).json({ message: "Resume deleted successfully" });
        
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//get user resume by id
// GET : /api/resumes/get

export const getResumeById = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId} = req.params;

        const resume = await Resume.findOne({userId,_id: resumeId});

        if(!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        resume.__v = undefined; // remove __v field from response
        resume.createdAt = undefined; // remove createdAt field from response
        resume.updatedAt = undefined; // remove updatedAt field from response
        return res.status(200).json({ resume });
        
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}


//get user resume by id public
// GET : /api/resumes/public

export const getPublicResumeById = async (req, res) => {
    try {

        const {resumeId} = req.params;

        const resume = await Resume.findOne({public:true,_id: resumeId});

        if(!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        return res.status(200).json({ resume });
        
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

//controller for updating a resume
// PUT : /api/resumes/update

export const updateResume = async (req, res) => {
    try {
        const userId = req.userId;
        const {resumeId,resumeData , removeBackground} = req.body;
        // image will be handled by middleware using multer
        const image =req.file;
        //image needs to uploaded on any online storage (imagekit)

        if(image){

            const imageBufferData = fs.createReadStream(image.path);
    
            const response = await imagekit.files.upload({
                file: imageBufferData, // provide buffer image (need file system )
                fileName: 'resume.png',
                folder: 'user-resumes',
                transformation: {
                    pre : 'w-300, h-300,fo-face,z-0.75' + 
                    (removeBackground ? ',e-bgremove' : '')
                }
                });
            
                //in this respone we will get a url 
                resumeDataCopy.personal_info.image = response.url;

        }

        // Important:
        // Frontend often sends data as string (especially with file upload)
        // So you convert it into a proper JS object
        let resumeDataCopy= JSON.parse(resumeData) // copy jo database mein store karni hai 

        const resume = await Resume.findByIdAndUpdate({userId,_id:resumeId},resumeDataCopy,{new:true});

        return res.status(200).json({ message: "Resume updated successfully", resume });
        
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
