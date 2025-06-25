import { ITables } from "./ModalTables";
import { FaUsers } from "react-icons/fa";

interface ICardTable {
  data: ITables;
  changeStatusTable: (itemId: number) => void;
  toggleSelect: (itemId: number) => void;
  isSelected: boolean;
  isSelectionMode: boolean;
}

const CardTable = ({
  data,
  changeStatusTable,
  toggleSelect,
  isSelected,
  isSelectionMode,
}: ICardTable) => {
  const bg = data.isAvailable ? "#33b49b" : "#d3d3d3";

  return (
    <div
      role="button"
      className={`relative h-[128px] w-[128px] flex flex-col items-center gap-[4px] cursor-pointer`}
      onClick={() => !isSelectionMode && changeStatusTable(data.id)}
    >
      <div
        style={{ background: bg }}
        className="w-[60px] h-[10px] rounded-full"
      ></div>
      <div className="flex flex-row items-center gap-[4px]">
        <div
          style={{ background: bg }}
          className="w-[10px] h-[60px] rounded-full"
        ></div>
        <div
          style={{ background: bg }}
          className="w-[70px] shadow-md h-[70px] rounded-md flex flex-row items-center justify-center"
        >
          <p className="text-white text-[12px] font-bold">#{data.name}</p>
        </div>
        <div
          style={{ background: bg }}
          className="w-[10px] h-[60px] rounded-full"
        ></div>
      </div>
      <div
        style={{ background: bg }}
        className="w-[60px] h-[10px] rounded-full"
      ></div>
      {isSelectionMode && (
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelect(data.id)}
          className="mt-[12px] w-4 h-4 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
      )}
      <div className="absolute bottom-[50px] left-[35px] z-10 flex flex-row items-center text-[12px]">
        <FaUsers className="text-white" size={14} />:{data.capacity}
      </div>
    </div>
  );
};

export default CardTable;
