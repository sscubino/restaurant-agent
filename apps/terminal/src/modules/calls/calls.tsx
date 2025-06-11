import * as React from 'react'
import { CallData } from './types'
import api from '../../services/api/admin/admin'
import { ClipLoader } from 'react-spinners'
import moment from 'moment'

const renderText = (text: string) => {
  return (
    <p className="flex-1 flex flex-row items-start text-[12px]">
      {text}
    </p>
  )
}

const CallsModule = () => {
  const [calls, setCalls] = React.useState<CallData[]>([])
  const limit = 10
  const [offset, setOffset] = React.useState<number>(0)
  // Inicializamos totalItems con -1 para indicar que aún no se ha hecho la carga inicial
  const [totalItems, setTotalItems] = React.useState<number>(-1)
  const [isFetching, setIsFetching] = React.useState(false)

  const observerRef = React.useRef<HTMLDivElement | null>(null)

  const getAllCalls = async () => {
    // Solo se evita la llamada si ya se ha obtenido un total (totalItems !== -1) y se han cargado todos los elementos
    if (isFetching || (totalItems !== -1 && offset >= totalItems)) return;
    console.log('paso');
    
    setIsFetching(true)
    try {
      const data = await api.calls.getAll(offset, limit)
      if (data) {
        console.log('entro');
        
        // Si no se obtuvieron llamadas, data.data.length podría ser 0, pero aún así actualizamos totalItems
        setCalls((prev) => [...prev, ...data.data]);
        setOffset((prev) => prev + limit);
        setTotalItems(data.totalItems ?? 0);
      }
    } catch (error) {
      console.error("Error fetching calls:", error)
    } finally {
      setIsFetching(false)
    }
  }
  
  // Observer para cargar más datos al hacer scroll
  React.useEffect(() => {
    const currentElement = observerRef.current
    if (!currentElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          getAllCalls()
        }
      },
      { root: null, rootMargin: "10px", threshold: 1.0 }
    )

    observer.observe(currentElement)

    return () => {
      observer.unobserve(currentElement)
    }
  }, [isFetching, calls, totalItems])
  
  // Llamada inicial para obtener los datos al montar el componente
  React.useEffect(() => {
    getAllCalls(); 
  }, []);

  return (
    <div className="w-full max-w-7xl h-full flex flex-col items-center justify-center px-[25px] py-[50px] gap-[20px]">
      <p className="font-bold text-[20px] text-gray-900 self-start">
        Calls History
      </p>
      <div className="flex p-[12px] w-full shadow-md flex-col items-center bg-white rounded-[8px]">
        <div className="w-full px-[20px] py-[16px] bg-blue-100 text-gray-700 font-semibold grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] text-center">
          {renderText("CALL ID")}
          {renderText("FROM NUMBER")}
          {renderText("TO NUMBER")}
          {renderText("DIRECTION")}
          {renderText("DURATION")}
          {renderText("FROM COUNTRY")}
          {renderText("TO COUNTRY")}
          {renderText("TIME")}
        </div>
        <div className="w-full h-[400px] max-h-[400px] overflow-y-scroll">
          <div className="w-full">
            {calls.map((call, index) => (
              <div
                key={index}
                className="w-full px-[20px] py-[16px] text-gray-700 font-semibold grid grid-cols-[80px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] text-center"
              >
                {renderText(call.id.toString())}
                {renderText(call.from)}
                {renderText(call.to)}
                {renderText(call.direction)}
                {renderText(call.duration)}
                {renderText(call.fromCountry)}
                {renderText(call.toCountry)}
                {renderText(moment(call.timestamp).format('DD/MM/YYYY HH:mm'))}
              </div>
            ))}
            { (totalItems === -1 || calls.length < totalItems) && (
              <div
                ref={observerRef}
                className="h-10 flex items-center justify-center"
              >
                {isFetching && <ClipLoader size={20} color="gray" />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CallsModule
