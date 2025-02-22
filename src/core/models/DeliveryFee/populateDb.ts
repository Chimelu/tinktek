import  {RegionModel}  from "../index"; // Adjust the path based on your project structure

const regionsData = [
  // Nigeria Geopolitical Zones
  { country: "Nigeria", region: "North Central", deliveryFee: 500 },
  { country: "Nigeria", region: "North East", deliveryFee: 700 },
  { country: "Nigeria", region: "North West", deliveryFee: 650 },
  { country: "Nigeria", region: "South East", deliveryFee: 550 },
  { country: "Nigeria", region: "South South", deliveryFee: 600 },
  { country: "Nigeria", region: "South West", deliveryFee: 500 },

  // South Africa Regions
  { country: "South Africa", region: "Eastern Cape", deliveryFee: 800 },
  { country: "South Africa", region: "Free State", deliveryFee: 750 },
  { country: "South Africa", region: "Gauteng", deliveryFee: 850 },
  { country: "South Africa", region: "KwaZulu-Natal", deliveryFee: 900 },
  { country: "South Africa", region: "Limpopo", deliveryFee: 780 },
  { country: "South Africa", region: "Mpumalanga", deliveryFee: 820 },
  { country: "South Africa", region: "North West", deliveryFee: 740 },
  { country: "South Africa", region: "Northern Cape", deliveryFee: 720 },
  { country: "South Africa", region: "Western Cape", deliveryFee: 880 },
];

export const seedRegions = async () => {
  try {
    for (const data of regionsData) {
      const existingRegion = await RegionModel.findOne({
        where: { country: data.country, region: data.region },
      });

      if (!existingRegion) {
        await RegionModel.create(data); // Only insert if it doesn't exist
      }
    }
    console.log("Regions seeded successfully.");  
  } catch (error) {
  }
};




