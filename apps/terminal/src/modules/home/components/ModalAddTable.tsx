import * as React from "react";
import Modal from "react-modal";
import { customStyles } from "../../../utils/stylesModal";
import Input from "../../../components/InputField";
import api from "../../../services/api/admin/admin";
import { toast } from "sonner";

interface IModalProps {
  isOpen: boolean;
  onClose: () => void;
  addNewTable: (table: ITables) => void;
}

export interface ITables {
  capacity: number;
  isAvailable: boolean;
  id: number;
  name: string;
}

Modal.setAppElement("#root");

const initialState = {
  name: "",
  capacity: 2,
  isAvailable: true,
};

const ModalAddTables = ({ isOpen, onClose, addNewTable }: IModalProps) => {
  const [formData, setFormData] = React.useState(initialState);
  const [errors, setErrors] = React.useState({ name: "", capacity: "" });

  const handleSetData = (key: string, value: any) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const validateErrors = () => {
    let errors: any = {};
    if (!formData.name) {
      errors.name = "Name is required";
    }
    if (formData.capacity <= 0) {
      errors.capacity = "Capacity must be greater than 0";
    }
    setErrors(errors);
  };

  const handleSubmit = async () => {
    try {
      validateErrors();

      if (!errors.capacity && !errors.name) {
        console.log("formData", formData);
        const resp = await api.tables.create(formData);
        console.log("resp", resp);

        addNewTable({
          isAvailable: resp.isAvailable,
          capacity: resp.capacity,
          id: resp.id,
          name: resp.name,
        });
        toast.success("Table created succesfully");
        setFormData(initialState);
        onClose();
      }
    } catch (error) {
      toast.error("Error creating table");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Add Table"
    >
      <div className="flex flex-col items-center w-[250px]">
        <p className="text-gray-900 font-bold text-[20px] mb-[20px]">
          Add Table
        </p>
        <Input
          label="Name"
          type="text"
          onChange={(value) => handleSetData("name", value)}
          value={formData.name}
          placeholder="Enter table name"
          width="100%"
          error={errors.name}
          onFocus={() => setErrors((prev) => ({ ...prev, name: "" }))}
        />
        <Input
          label="Capacity"
          type="number"
          onChange={(value) => handleSetData("capacity", value)}
          value={formData.capacity}
          placeholder="Enter capacity"
          width="100%"
          error={errors.capacity}
          onFocus={() => setErrors((prev) => ({ ...prev, capacity: "" }))}
        />
        <button
          className="bg-gray-800 text-white w-full py-3 rounded mt-4"
          onClick={handleSubmit}
        >
          Add Table
        </button>
      </div>
    </Modal>
  );
};

export default ModalAddTables;
