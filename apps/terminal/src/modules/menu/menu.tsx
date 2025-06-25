import * as React from "react";
import admin from "../../services/api/admin/admin";
import { ClipLoader } from "react-spinners";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import CreateOrEditDishModal from "./components/CreateOrEditDishModal";
import { GiForkKnifeSpoon } from "react-icons/gi";
import api from "../../services/api/admin/admin";

interface IDish {
  id: number;
  name: string;
  description: string;
  isAvailable: boolean;
  price: number;
}

interface IData {
  data: IDish[] | [];
  loadingApi: boolean;
}

const MenuModule = () => {
  const [Dishes, setDishes] = React.useState<IData>({
    data: [],
    loadingApi: true,
  });
  const [modalIsOpen, setModalIsOpen] = React.useState(false);
  const [selectedDish, setselectedDish] = React.useState<IDish | null>(null);

  const OpenOrCloseModal = (clearDish = false) => {
    setModalIsOpen((prev) => {
      if (!prev && clearDish) {
        setselectedDish(null);
      }
      return !prev;
    });
  };

  React.useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      const AllDishes = await admin.dishes.findAll();

      if (AllDishes) {
        setDishes((prevState) => ({
          ...prevState,
          data: AllDishes,
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDishes((prevState) => ({
        ...prevState,
        loadingApi: false,
      }));
    }
  };

  const selectDishEdit = (id: number) => {
    const findDish = Dishes.data.find((dish) => dish.id === id);
    if (findDish) {
      setselectedDish(findDish);
      OpenOrCloseModal(false);
    }
  };

  const addNewDish = (newDish: any) => {
    setDishes((prevState) => ({
      ...prevState,
      data: [...prevState.data, newDish],
    }));
  };

  const deleteDish = async (id: number) => {
    try {
      const data = await api.dishes.delete(id);
      if (data) {
        setDishes((prevState) => {
          const removeDish = prevState.data.filter((dish) => dish.id !== id);

          return {
            ...prevState,
            data: removeDish,
          };
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editDish = (dishEdited: any) => {
    setDishes((prevState) => {
      const editedDish = prevState.data.map((dish) => {
        if (dish.id === dishEdited.id) {
          return dishEdited;
        } else {
          return dish;
        }
      });

      return {
        ...prevState,
        data: editedDish,
      };
    });
  };

  const getAllAvaiables = () => {
    const avaiables = Dishes.data.filter((dish) => dish.isAvailable === true);
    return avaiables.length;
  };

  const getAllNotAvaiables = () => {
    const notAvaiables = Dishes.data.filter(
      (dish) => dish.isAvailable === false
    );
    return notAvaiables.length;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="flex flex-col w-full items-center justify-center">
        <div className="w-full bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
          <p className="font-bold text-[20px] text-gray-900 self-start ">
            Manage My Menu
          </p>
          <div className="w-full flex flex-row items-center justify-between ">
            <div className="px-[12px] py-[6px]  flex flex-row items-center shadow-sm bg-white rounded-sm gap-[16px]">
              <div className="flex-1 flex flex-col items-start">
                <p className="text-gray-400">Available</p>
                <p className="text-black">{getAllAvaiables()}</p>
              </div>
              <div className="w-[100px] flex flex-col items-start">
                <p className="text-gray-400">Not Available</p>
                <p className="text-black">{getAllNotAvaiables()}</p>
              </div>
              <div className="flex-1 flex flex-col items-start">
                <p className="text-gray-400">Total</p>
                <p className="text-black">{Dishes.data.length}</p>
              </div>
            </div>
            <button
              onClick={() => OpenOrCloseModal(true)}
              className="bg-gray-900 shadow-sm font-bold  gap-2 flex flex-row items-center  text-[14px] rounded-md py-[4px] px-[25px]"
            >
              <GiForkKnifeSpoon size={16} className="text-white " />
              Add dish
            </button>
          </div>
          <div className="w-full max-w-7xl mx-auto overflow-x-auto">
            <div className="w-full max-w-7xl mx-auto overflow-x-auto">
              <div className="bg-white shadow-md rounded-lg">
                <div className="h-[450px] overflow-y-auto ">
                  <table className="min-w-full divide-y divide-gray-200 ">
                    <thead className="bg-gray-50 sticky top-0 ">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Available
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 ">
                      {Dishes.loadingApi ? (
                        <tr>
                          <td colSpan={5} className="py-4 text-center">
                            <ClipLoader size={40} color="black" />
                          </td>
                        </tr>
                      ) : Dishes.data.length > 0 ? (
                        Dishes.data.map((platillo) => (
                          <tr className="text-gray-700" key={platillo.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {platillo.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              ${platillo.price}
                            </td>
                            <td className="px-6 py-4 truncate max-w-[250px]">
                              {platillo.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {platillo.isAvailable ? (
                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                                  Available
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs">
                                  Not Available
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                              <button
                                onClick={() => selectDishEdit(platillo.id)}
                                className="p-2 border rounded-md hover:bg-gray-200"
                              >
                                <CiEdit size={20} className="text-gray-600" />
                              </button>
                              <button
                                onClick={() => deleteDish(platillo.id)}
                                className="p-2 border rounded-md hover:bg-gray-200"
                              >
                                <MdDelete size={20} className="text-gray-600" />
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-4 text-center">
                            <p className="text-gray-400">No dishes available</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateOrEditDishModal
        addNewDish={addNewDish}
        editDish={editDish}
        dishData={selectedDish}
        isOpen={modalIsOpen}
        onClose={() => OpenOrCloseModal(true)}
      />
    </div>
  );
};

export default MenuModule;
