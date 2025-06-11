import { MdKeyboardArrowDown } from "react-icons/md";
import * as React from 'react'
import { MdKeyboardArrowUp } from "react-icons/md";
import moment from "moment";
import { CiCalendar } from "react-icons/ci";
import { CiForkAndKnife } from "react-icons/ci";
import { CiLocationOn } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

interface Dish {
    id: number;
    name: string;
    desc: string;
    availability: boolean;
    price: number;
}

interface ProductOrder {
    id: string;
    quantity: number;
    price: number;
    dish: Dish;
    detail: string;
}

interface ITable {
    id: number,
    name: string,
    capacity: number,
    availability: boolean
}

interface IOrder {
    id: number;
    date: string;
    typeOrder: "pick_up" | "delivery" | "dine_in";
    direction: string | null;
    tableId: ITable | null;
    total: number | null;
    productOrder: ProductOrder[];
}

interface ICardOrder {
    orderData: IOrder
    deleteOrder: (orderId: number) => void
}

const renderText = (text: any) => {
    return <p className="flex-1 flex flex-row items-start">
        {text}
    </p>
}

const CardOrder = ({ orderData, deleteOrder }: ICardOrder) => {
    const [expanded, setExpanded] = React.useState<boolean>(false)

    const { date, typeOrder, id, total } = orderData
    const dateFormated = moment(date).format("DD/MM/YYYY HH:mm")
    return (
        <div className="w-full flex flex-col ">
            <div
                className="w-full text-[14px] px-[20px] py-[16px] grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_2fr] text-center border-b border-b-gray-200 text-gray-900"
            >
                <div className="flex flex-row w-full items-center justify-start h-full">
                    <div className="h-[15px] w-[15px] shadow-md rounded-full bg-gray-300"></div>
                </div>
                {renderText("order")}
                {renderText(typeOrder)}
                {renderText(id)}
                {renderText(total ?? "Not applicable")}
                {renderText(dateFormated)}
                <div className="flex flex-row items-center justify-end w-full">
                    <button onClick={() => setExpanded((prevState) => !prevState)} className="h-[20px] w-[20px] flex flex-row items-center justify-center rounded-full bg-gray-400">
                        {
                            expanded ?
                                <MdKeyboardArrowUp size={14} className="text-gray-50" />
                                :
                                <MdKeyboardArrowDown size={14} className="text-gray-50" />
                        }
                    </button>
                </div>
            </div>
            {
                expanded &&
                <div
                    className="w-full py-[12px] bg-white flex flex-col items-center justify-center border-b-gray-200 border-b-[1px]"
                >
                    <div className="w-[600px]  border-[1px] border-gray-200 shadow-md rounded-md flex-1 p-[20px] flex flex-col items-center  text-gray-900">
                        <div className="w-full flex flex-row justify-between items-center mb-[12px] ">
                            <p className="font-bold">Order Details</p>
                            <button onClick={() => deleteOrder(orderData.id)} className="cursor-pointer">
                                <MdDelete size={20} className="text-gray-900" />
                            </button>

                        </div>
                        <div className="w-full flex flex-row  items-start justify-between">
                            <div className="flex flex-col items-start gap-[6px]">
                                <div className=" flex flex-row items-center gap-[12px]">
                                    <CiCalendar size={20} />
                                    <p>{dateFormated}</p>
                                </div>
                                {
                                    orderData.tableId &&
                                    <div className=" flex flex-row items-center gap-[12px]">
                                        <CiForkAndKnife size={20} />
                                        <p>Table: {orderData.tableId.name} (Capacity:{orderData.tableId.capacity})</p>
                                    </div>
                                }
                                {
                                    orderData.direction &&
                                    <div className=" flex flex-row items-center gap-[12px]">
                                        <CiLocationOn size={20} />
                                        <p>{orderData.direction}</p>
                                    </div>
                                }
                            </div>
                            <div className="flex text-[10px] flex-row items-center justify-center px-2 py-[4px] rounded-full border-[1px] border-gray-300">
                                <p className="font-bold">{orderData.typeOrder}</p>
                            </div>
                        </div>
                        {
                            orderData.typeOrder !== "dine_in" &&
                            <div className="flex flex-col w-full my-[20px]">
                                <div className="w-full grid grid-cols-[40%_20%_20%_20%] border-b-[1px] text-gray-500 border-gray-200">
                                    <div className="p-3 flex items-center">
                                        <p>Dish</p>
                                    </div>
                                    <div className="p-3 flex items-center justify-center">
                                        <p>Quantity</p>
                                    </div>
                                    <div className="p-3 flex items-center justify-center">
                                        <p>Price</p>
                                    </div>
                                    <div className="p-3 flex items-center justify-center">
                                        <p>Sub Total</p>
                                    </div>
                                </div>
                                {
                                    orderData.productOrder.map((eleemnt, index) => {
                                        return <div key={index} className="w-full grid grid-cols-[40%_20%_20%_20%] border-b-[1px] text-gray-900 font-medium border-gray-200">
                                            <div className="p-3 flex items-center">
                                                <p>{eleemnt.dish.name} { eleemnt.detail && "(" + eleemnt.detail + ")"}</p>
                                            </div>
                                            <div className="p-3 flex items-center justify-center">
                                                <p>{eleemnt.quantity}</p>
                                            </div>
                                            <div className="p-3 flex items-center justify-center">
                                                <p>{eleemnt.price}</p>
                                            </div>
                                            <div className="p-3 flex items-center justify-center">
                                                <p>{eleemnt.price * eleemnt.quantity}</p>
                                            </div>
                                        </div>
                                    })
                                }
                            </div>
                        }

                        {
                            orderData.typeOrder !== "dine_in" &&
                            <div className="flex flex-row justify-end w-full font-bold">
                                Total: {orderData.total ?? '150'}
                            </div>

                        }
                    </div>
                </div>
            }
        </div>
    )
}

export default CardOrder