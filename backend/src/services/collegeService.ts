import College from "../models/College";

export const getAllColleges = async () => {
  return await College.find({ isActive: true }).sort({ name: 1 });
};

// Create college 
export const createCollege = async (collegeData: {
  name: string;
  shortName: string;
  city: string;
  state: string;
  logo?: string;
}) => {
  return await College.create(collegeData);
};

export const getCollegeById = async (id:string) => {
    return await College.findById(id);
}

export const updateCollege = async (id:string, collegeData : {
    name?: string;
  shortName?: string;
  city?: string;
  state?: string;
  logo?: string;
  isActive ?: boolean;
}) =>{
    return await College.findByIdAndUpdate(
        id,
        collegeData,
        {
            new :  true ,
            runValidators : true
        });
}

export const deleteCollege = async (id:string) => {
    return await College.findByIdAndUpdate(id , 
        {
            isActive: false 
        },

        {
            new : true
        } 
    );
}