import { Suspense } from 'react'
import SettingsView from './_components/SettingsView'

export default function Page() {
  return (
    <Suspense>
      <SettingsView />
    </Suspense>
  )
}
