export const DIVISIONS: Record<string, string[]> = {
  Dhaka: [
    "Dhaka",
    "Gazipur",
    "Narayanganj",
    "Narsingdi",
    "Munshiganj",
    "Manikganj",
    "Tangail",
    "Faridpur",
  ],
  Chattogram: [
    "Chattogram",
    "Cox's Bazar",
    "Cumilla",
    "Feni",
    "Noakhali",
    "Brahmanbaria",
    "Rangamati",
  ],
  Rajshahi: ["Rajshahi", "Bogura", "Pabna", "Naogaon", "Natore", "Sirajganj"],
  Khulna: ["Khulna", "Jashore", "Kushtia", "Satkhira", "Bagerhat"],
  Barishal: ["Barishal", "Patuakhali", "Bhola", "Pirojpur"],
  Sylhet: ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Thakurgaon"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"],
};

export const DIVISION_NAMES = Object.keys(DIVISIONS);

/** Areas served by the inside-Dhaka courier rate */
export const INSIDE_DHAKA_DISTRICTS = ["Dhaka"];
