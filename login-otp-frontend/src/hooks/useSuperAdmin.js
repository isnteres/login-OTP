import { useState } from "react"

const SUPERADMIN_PASSWORD = "superadmin2026"

export function useSuperAdmin() {
  const [granted, setGranted] = useState({
    sistema_analitica: false,
    sistema_auditoria: false,
  })

  const verify = (password) => password === SUPERADMIN_PASSWORD

  const grant = (section) => {
    setGranted(prev => ({ ...prev, [section]: true }))
  }

  const isGranted = (section) => granted[section] === true

  return { verify, grant, isGranted }
}
