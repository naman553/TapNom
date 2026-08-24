import Canteen from "../models/Canteen";
import College from "../models/College";

export const createCanteen = async(canteenData : {
  collegeId: string;
  name: string;
  description?: string;
  location?: string;
  image?: string;
  openingTime?: string;
  closingTime?: string;
}) =>{

    const college = await College.findById(canteenData.collegeId);

  if (!college) {
    return null;
  }
    return await Canteen.create(canteenData);
}


export const getCanteens = async (collegeId?: string) => {
  const filter: { collegeId?: string; isActive: boolean } = {
    isActive: true
  };

  if (collegeId) {
    filter.collegeId = collegeId;
  }

  return await Canteen.find(filter).sort({ name: 1 });
};


export const getCanteenById = async(id: string) =>{
    return await Canteen.findById(id);
}


export const updateCanteen = async(id:string, canteenData:{
    name?: string;
    description?: string;
    location?: string;
    image?: string;
    openingTime?: string;
    closingTime?: string;
    isActive?: boolean;
})=>{
    return await Canteen.findByIdAndUpdate(
    id,
    canteenData,
    {
      new: true,
      runValidators: true
    }
  );
};


export const deleteCanteen = async(id:string) =>{
    return await Canteen.findByIdAndUpdate(id, {isActive: false},
        {new : true}
    );
}