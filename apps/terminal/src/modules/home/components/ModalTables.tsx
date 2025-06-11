import * as React from 'react';
import Modal from "react-modal";
import { customStyles } from "../../../utils/stylesModal";
import api from '../../../services/api/admin/admin';
import { toast } from 'sonner';
import CardTable from './CardTable';
import ModalAddTables from './ModalAddTable';

interface IModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface ITables {
    capacity: number;
    availability: boolean;
    id: number;
    name: string;
}

Modal.setAppElement('#root');

const ModalTables = ({ isOpen, onClose }: IModalProps) => {
    const [tables, setTables] = React.useState<ITables[]>([]);
    const [selectedTables, setSelectedTables] = React.useState<number[]>([]);
    const [isSelectionMode, setIsSelectionMode] = React.useState(false);
    const [stateModal, setStateModal] = React.useState<boolean>(false)

    const handleModal = (state: boolean) => {
        setStateModal(state)
    }
    React.useEffect(() => {
        const fetchTables = async () => {
            try {
                const resp = await api.tables.findAll();
                setTables(resp.data);
            } catch (error) {
                toast.error("Error fetching tables");
            }
        };
        fetchTables();
    }, []);

    const toggleSelect = (id: number) => {
        setSelectedTables((prev) =>
            prev.includes(id) ? prev.filter((tableId) => tableId !== id) : [...prev, id]
        );
    };

    const changeStatusTable = async (id: number) => {
        if (isSelectionMode) return;
        try {
            const tableIndex = tables.findIndex((table) => table.id === id);
            if (tableIndex !== -1) {
                const updatedTables = [...tables];
                updatedTables[tableIndex].availability = !updatedTables[tableIndex].availability;
                setTables(updatedTables);
                await api.tables.update(id, { availability: updatedTables[tableIndex].availability });
            }
        } catch (error) {
            toast.error("Error changing table status");
        }
    };

    const deleteSelectedTables = async () => {
        try {
            await Promise.all(selectedTables.map((id) => api.tables.delete(id)));
            setTables((prev) => prev.filter((table) => !selectedTables.includes(table.id)));
            setSelectedTables([]);
            toast.success("Tables deleted successfully");
        } catch (error) {
            toast.error("Error deleting tables");
        }
    };

    const CountAvailable = () => {
        return tables.filter((item) => item.availability === true).length
    }

    const addNewTable = (newItem : ITables) => {
        setTables((prevState)=> ([
            ...prevState,
            newItem
        ]))
    }

    return (
        <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Tables">
            <div className="flex flex-col items-center min-w-[350px]">
                <p className="text-gray-900 font-bold text-[25px] ">Tables</p>
                <div className='w-full flex flex-col'>
                    <div className='w-full flex flex-row justify-between items-start my-[20px]'>
                        <div className=' flex flex-col items-start text-gray-900'>
                            <div className='flex flex-row gap-[12px] items-center'>
                                <div className='bg-[#33b49b] w-[16px] h-[16px] rounded-full'></div>
                                <p>Available x {CountAvailable()}</p>
                            </div>
                            <div className='flex flex-row gap-[12px] items-center'>
                                <div className='bg-[#d3d3d3] w-[16px] h-[16px] rounded-full'></div>
                                <p>Not available x {tables.length - CountAvailable()}</p>
                            </div>
                        </div>
                        <button onClick={()=> handleModal(true)} className='bg-black w-[100px] py-[4px] rounded-sm shadow-md'>Add Table</button>
                    </div>
                    <div className="flex flex-row-reverse justify-between w-full mb-4">
                        <button
                            className="mr-0 text-gray-500 border-[1px] border-gray-500 min-w-[100px] px-[20px] py-[4px] bg-white rounded shadow-md"
                            onClick={() => setIsSelectionMode(!isSelectionMode)}
                        >
                            {isSelectionMode ? "Cancel Selection" : "Select"}
                        </button>
                        {isSelectionMode && selectedTables.length > 0 && (
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={deleteSelectedTables}
                            >
                                Delete Selected
                            </button>
                        )}

                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    {tables.map((table) => (
                        <CardTable
                            key={table.id}
                            data={table}
                            changeStatusTable={changeStatusTable}
                            toggleSelect={toggleSelect}
                            isSelected={selectedTables.includes(table.id)}
                            isSelectionMode={isSelectionMode}
                        />
                    ))}
                </div>
            </div>
            <ModalAddTables isOpen={stateModal} onClose={()=> handleModal(false)} addNewTable={addNewTable} />
        </Modal>
    );
};

export default ModalTables;

