import ProtectedLayout from "../components/ProtectedLayout"
import CallsModule from "../modules/calls/calls"

const Calls = () => {
  return (
    <ProtectedLayout>
      <CallsModule/>
    </ProtectedLayout>
  )
}

export default Calls