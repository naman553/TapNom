import Category from "../models/Category";
import Canteen from "../models/Canteen";

export const createCategory = async (categoryData : {
    canteenId :string,
    name : string ,
    image? : string;
}) => {
    const canteen = await Canteen.findById(categoryData.canteenId);
    if(!canteen){
        return null ;
    }
    return await Category.create(categoryData);
}
export const getCategorises = async (canteenId?: string) => {
    const filter :{
        isActive : boolean,
        canteenId?: string
    } = {
        isActive : true
    };

    if(canteenId){
       filter.canteenId = canteenId; 
    }

    return await Category.find(filter).sort({name:1});
};

export const getCategoryById = async (id: string) => {
  return await Category.findById(id);
};

export const updateCategory = async (
  id: string,
  categoryData: {
    name?: string;
    image?: string;
    isActive?: boolean;
  }
) => {
  return await Category.findByIdAndUpdate(
    id,
    categoryData,
    {
      new: true,
      runValidators: true
    }
  );
};

export const deleteCategory = async (id: string) => {
  return await Category.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );
};