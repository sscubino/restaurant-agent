import ProtectedLayout from "../components/ProtectedLayout"
import SettingsModule from "../modules/settings/settings"

const Settings = () => {
  return (
    <ProtectedLayout>
      <SettingsModule/>
    </ProtectedLayout>
  )
}

export default Settings