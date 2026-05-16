export const DELIVERY_ZONES = {
  dhaka: {
    label:     "Dhaka",
    zone:      "dhaka",
    districts: ["Dhaka"],
  },
  subDhaka: {
    label:     "Sub Dhaka",
    zone:      "subDhaka",
    districts: [
      "Gazipur",
      "Narayanganj",
      "Manikganj",
      "Munshiganj",
      "Narsingdi",
      "Savar",
    ],
  },
  outsideDhaka: {
    label:     "Outside Dhaka",
    zone:      "outsideDhaka",
    districts: [
      "Chittagong", "Cox's Bazar", "Comilla", "Noakhali", "Feni",
      "Lakshmipur", "Chandpur", "Brahmanbaria",
      "Sylhet", "Moulvibazar", "Habiganj", "Sunamganj",
      "Rajshahi", "Bogura", "Pabna", "Sirajganj", "Natore",
      "Naogaon", "Chapai Nawabganj", "Joypurhat",
      "Khulna", "Jessore", "Satkhira", "Bagerhat", "Narail",
      "Magura", "Jhenaidah", "Kushtia", "Chuadanga", "Meherpur",
      "Barishal", "Patuakhali", "Pirojpur", "Jhalokati", "Bhola", "Barguna",
      "Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Nilphamari",
      "Lalmonirhat", "Thakurgaon", "Panchagarh",
      "Mymensingh", "Jamalpur", "Sherpur", "Netrokona",
      "Faridpur", "Gopalganj", "Madaripur", "Shariatpur",
      "Rajbari", "Kishoreganj", "Tangail",
    ],
  },
}

export const ALL_DISTRICTS = [
  ...DELIVERY_ZONES.dhaka.districts,
  ...DELIVERY_ZONES.subDhaka.districts,
  ...DELIVERY_ZONES.outsideDhaka.districts,
].sort()

export function getZoneByDistrict(district: string): string {
  if (DELIVERY_ZONES.dhaka.districts.includes(district))
    return "dhaka"
  if (DELIVERY_ZONES.subDhaka.districts.includes(district))
    return "subDhaka"
  return "outsideDhaka"
}

export function getZoneLabel(zone: string): string {
  return DELIVERY_ZONES[zone as keyof typeof DELIVERY_ZONES]?.label ?? "Outside Dhaka"
}