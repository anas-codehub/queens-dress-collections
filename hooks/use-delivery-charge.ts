import { useState, useEffect } from "react"
import { getZoneByDistrict } from "@/lib/districts"

type DeliveryZone = {
  zone:   string
  label:  string
  charge: number
}

export function useDeliveryCharge(district: string) {
  const [zones,   setZones]   = useState<DeliveryZone[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/delivery")
      .then((r) => r.json())
      .then((data) => {
        setZones(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const zone         = getZoneByDistrict(district)
  const zoneData     = zones.find((z) => z.zone === zone)
  const charge       = zoneData?.charge ?? (zone === "dhaka" ? 60 : zone === "subDhaka" ? 100 : 120)
  const zoneLabel    = zoneData?.label  ?? zone

  return { charge, zoneLabel, loading }
}