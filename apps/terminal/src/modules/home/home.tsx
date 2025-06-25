import * as React from "react";
import { MdTableRestaurant } from "react-icons/md";
import ModalTables from "./components/ModalTables";
import CardOrder from "./components/CardOrder";
import api from "../../services/api/admin/admin";
import { toast } from "sonner";

const renderText = (text: string) => {
  return <p className="flex-1 flex flex-row items-start">{text}</p>;
};

const HomeModule = () => {
  const [stateModal, setStateModal] = React.useState<boolean>(false);
  const [allOrders, setAllOrders] = React.useState<any>([]);
  const limit = 10;
  const [offset, setOffset] = React.useState<number>(0);
  const [totalItems, setTotalItems] = React.useState<number>(0);
  const [isFetching, setIsFetching] = React.useState(false);
  const [firstCall, setFirstCall] = React.useState(true);

  const observerRef = React.useRef(null);

  const loadAllOrders = async () => {
    if (isFetching || (offset >= totalItems && !firstCall)) return;

    setIsFetching(true);
    try {
      const data = await api.order.getAll(offset, limit);
      setAllOrders((prevOrders: any) => [...prevOrders, ...data.data]);
      setTotalItems(data.total);
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
      if (firstCall) {
        setFirstCall(false);
      }
    }
  };

  const deleteOrder = async (orderId: number) => {
    try {
      const data = await api.order.delete(orderId);

      if (data.ok) {
        const newValuesOrders = allOrders.filter(
          (order: any) => order.id !== orderId
        );
        setAllOrders(newValuesOrders);
        toast.success(data.message);
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          loadAllOrders();
        }
      },
      { root: null, rootMargin: "10px", threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [isFetching]);

  const handleModal = (state: boolean) => {
    setStateModal(state);
  };

  return (
    <div className="h-full w-full px-[25px] py-[50px] flex flex-col items-center gap-[20px]">
      <p className="font-bold text-[20px] text-gray-900 self-start ">
        Orders Managment
      </p>

      <div className="w-full flex flex-row items-center gap-[20px] ">
        <div className="px-[20px] shadow-md h-[60px]  flex flex-row items-center bg-white rounded-sm gap-[16px]">
          <div className="flex-1 flex flex-col items-start">
            <p className="text-gray-400">Total</p>
            <p className="text-black">{totalItems}</p>
          </div>
        </div>
        <div className="">
          <button
            onClick={() => handleModal(true)}
            className="h-[46px] relative w-[150px] rounded-sm shadow-md  bg-gray-600 flex flex-row items-center justify-center"
          >
            <MdTableRestaurant
              size={20}
              className="text-white absolute left-[12px]"
            />
            Tables
          </button>
        </div>
        <div className=""></div>
        <div className=""></div>
      </div>

      <div className="flex p-[12px] shadow-md h-[500px] overflow-y-scroll flex-col w-full items-center bg-white rounded-[8px]">
        <div className="w-full px-[20px] py-[16px] bg-blue-100 text-gray-700 font-semibold grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_2fr] text-center">
          <div className="flex flex-row w-full items-center justify-start h-full">
            <div className="h-[15px] w-[15px] shadow-md rounded-full bg-gray-300"></div>
          </div>
          {renderText("Name")}
          {renderText("Type")}
          {renderText("Order ID")}
          {renderText("Price")}
          {renderText("Time")}
          <div className=""></div>
        </div>

        <div className="w-full h-full max-h-[100%] overflow-y-scroll flex flex-col items-center">
          {allOrders.map((order: any, index: number) => (
            <CardOrder
              key={index}
              deleteOrder={deleteOrder}
              orderData={order}
            />
          ))}
          <div ref={observerRef} className="h-10">
            {isFetching && (
              <p className="text-gray-500">Loading more orders...</p>
            )}
          </div>
          {allOrders.length === 0 && !isFetching && (
            <div className="text-center text-gray-500">
              {" "}
              There are no orders available
            </div>
          )}
        </div>
      </div>
      <ModalTables isOpen={stateModal} onClose={() => handleModal(false)} />
    </div>
  );
};

export default HomeModule;
