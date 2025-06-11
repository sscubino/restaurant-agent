import * as React from 'react'
import Modal from "react-modal";
import Input from "../../../components/InputField";
import { IoCloseOutline } from "react-icons/io5";
import api from '../../../services/api/admin/admin';
import { customStyles } from '../../../utils/stylesModal';
import { toast } from 'sonner';

interface IModalProps {
    isOpen: boolean;
    onClose: () => void;
    dishData?: ICreateDish | null;
    editDish: (dish: any) => void;
    addNewDish: (dish: ICreateDish) => void;
}

interface ICreateDish {
    id?: number,
    name: string
    price: number
    desc: string
    availability?: boolean
}

const initialState = {
    name: '',
    price: 0,
    desc: ''
}


Modal.setAppElement('#root');

const CreateOrEditDishModal = ({ isOpen, onClose, dishData, editDish, addNewDish }: IModalProps) => {
    const [createDish, setCreateDish] = React.useState<ICreateDish>(initialState)
    const [errors, setErrors] = React.useState<Record<string, string>>()
    const [hasChanges, setHasChanges] = React.useState(false);

    React.useEffect(() => {
        if (dishData) {
            setCreateDish(dishData);
        } else {
            setCreateDish(initialState);
        }
    }, [dishData]);


    React.useEffect(() => {
        if (!dishData) {
            setHasChanges(true);
            return;
        }
        setHasChanges(JSON.stringify(createDish) !== JSON.stringify(dishData));
    }, [createDish, dishData])

    const handleChangeInput = (key: string, value: any) => {
        setCreateDish((prevState) => ({
            ...prevState,
            [key]: value
        }))
    }

    const handleCreateDish = async () => {
        try {
            if (createDish.name && createDish.price && createDish.desc) {
                const data = await api.dishes.create({ name: createDish.name, price: createDish.price, desc: createDish.desc })

                if (data) {
                    addNewDish({
                        name: data.name,
                        desc: data.desc,
                        availability: data.availability,
                        price: data.price,
                        id: data.id
                    })
                    setCreateDish(initialState)
                    toast.success('Dish created successfully')
                    onClose()
                }
            }

        } catch (error : any) {
            toast.error('Error:', error.response.data.message)
            console.log(errors);
        }
    }

    const handleEditDish = async () => {
        try {            
            if (createDish.name && createDish.price && createDish.desc && createDish.id) {                
                const resp = await api.dishes.update(createDish)

                if (resp) {
                    editDish(createDish)
                    toast.success('Dish successfully edited')
                    onClose()
                }
            }

        } catch (error : any) {
            toast.error('Error:', error.response.data.message)
            console.log(errors);
        }
    }


    const handleValidFunctions = async (e: any) => {
        e.preventDefault()
        validateErrors()

        try {

            if (dishData) {
                await handleEditDish()
            } else {
                await handleCreateDish()
            }

        } catch (error) {
            console.log(error);
        }

    }

    const validateErrors = () => {
        let errorsForm: Record<string, string> = {}

        if (!createDish.name) errorsForm.name = 'Please enter a valid name'
        if (!createDish.price) errorsForm.price = 'Please enter a valid price'
        if (!createDish.desc) errorsForm.desc = 'Please enter a valid description'

        setErrors(errorsForm)
    }


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customStyles}
            contentLabel="Example Modal"
        >
            <form onSubmit={handleValidFunctions} className="h-full w-[250px] flex flex-col items-center">
                <button onClick={onClose} className="cursor-pointer self-start">
                    <IoCloseOutline size={20} className="text-gray-800" />
                </button>
                <p className="text-[20px]  text-center font-bold text-gray-800">Create Dish</p>
                <Input
                    label="Name"
                    value={createDish.name}
                    type='text'
                    placeholder='Enter a name of dish'
                    width='100%'
                    onChange={(value: string) => handleChangeInput('name', value)}
                    error={errors?.name}
                    onFocus={() => setErrors(prev => ({ ...prev, name: '' }))}
                    onBlur={() => setErrors(prev => ({ ...prev, name: '' }))}
                />
                <Input
                    label="Price"
                    value={createDish.price}
                    type='number'
                    placeholder='Enter the price of dish'
                    width='100%'
                    onChange={(value) => handleChangeInput('price', value)}
                    error={errors?.price}
                    onFocus={() => setErrors(prev => ({ ...prev, price: '' }))}
                    onBlur={() => setErrors(prev => ({ ...prev, price: '' }))}
                />

                {
                    dishData &&
                    <div className='w-full flex flex-col mb-4'>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                        <select
                            value={createDish?.availability?.toString()}
                            onChange={(e) => handleChangeInput('availability', e.target.value === "true")}
                            className="border-gray-300 text-gray-700 px-2 border-[1px] shadow-md h-[42px] focus:outline-none rounded-md">
                            <option value="true">Available</option>
                            <option value="false">Not available</option>
                        </select>
                    </div>
                }

                <div className="w-full flex flex-col items-start">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={createDish.desc}
                        onChange={(e) => handleChangeInput('desc', e.target.value)}
                        className="w-full px-[12px] py-[8px] text-gray-900 focus:outline-none border-[1px] border-gray-300 shadow-md rounded-md"
                        name=""
                        placeholder='Enter a description'
                        rows={4}
                        id=""
                        onFocus={() => setErrors(prev => ({ ...prev, desc: '' }))}
                        onBlur={() => setErrors(prev => ({ ...prev, desc: '' }))}
                    ></textarea>
                    {
                        errors?.desc &&
                        <p className="text-sm text-red-500 mt-1">{errors.desc}</p>
                    }
                </div>

                <button style={{ background: !hasChanges ? 'gray' : 'black' }} disabled={!hasChanges} type='submit' role='button' className='w-full mt-5 rounded-md py-[8px]'>
                    <p className='text-white font-bold'>
                        {dishData ? "Save" : "Create"}
                    </p>
                </button>
            </form>
        </Modal>
    )
}

export default CreateOrEditDishModal