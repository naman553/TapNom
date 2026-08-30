import MenuItem from "../models/MenuItem";
import Canteen from "../models/Canteen";
import Category from "../models/Category";


export const createMenuItem = async (menuItemData: {
  canteenId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  preparationTime: number;
}) => {
  const canteen = await Canteen.findById(menuItemData.canteenId);

  if (!canteen) {
    return null;
  }

  const category = await Category.findById(menuItemData.categoryId);

  if (!category) {
    return null;
  }

  if (category.canteenId.toString() !== menuItemData.canteenId) {
    return null;
  }

  return await MenuItem.create(menuItemData);
};


export const getMenuItems = async(
    canteenId?: string,
  categoryId?: string
)=>{
      const filter: {
    isActive: boolean;
    canteenId?: string;
    categoryId?: string;
  } = {
    isActive: true
  };

  if (canteenId) {
    filter.canteenId = canteenId;
  }

  if (categoryId) {
    filter.categoryId = categoryId;
  }
console.log("filter:", filter);
  return await MenuItem.find(filter).sort({name: 1});
};

export const getMenuItemById = async(id: string)=>{
      return await MenuItem.findById(id);
}

export const updateMenuItem = async(id:string, menuItemData :{
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    preparationTime?: number;
    isActive?: boolean;
}) =>{
    return await MenuItem.findByIdAndUpdate(id, menuItemData,
        {
            new : true,
            runValidators : true
        }
    );
}

export const deleteMenuItem = async(id: string) =>{
    return await MenuItem.findByIdAndUpdate(id, {isActive : false}, {new :true});
}