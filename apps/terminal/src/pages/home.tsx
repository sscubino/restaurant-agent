import ProtectedLayout from "../components/ProtectedLayout"
import HomeModule from "../modules/home/home"

const Home = () => {
  return (
    <ProtectedLayout>
      <HomeModule/>
    </ProtectedLayout>
  )
}

export default Home