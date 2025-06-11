import ProtectedLayout from "../components/ProtectedLayout"
import MenuModule from "../modules/menu/menu"

const Menu = () => {
  return (
    <ProtectedLayout>
      <MenuModule/>
    </ProtectedLayout>
  )
}

export default Menu