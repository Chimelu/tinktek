export const ACTIONS = {
  SUBSCRIBE: "SUBSCRIBE",
  UNSUBSCRIBE: "UNSUBSCRIBE",
  SEND_TO_MANY_PROFILES: "SEND_TO_MANY_PROFILES",
  SEND_TO_WAYAGRAM_PROFILES: "SEND_TO_WAYAGRAM_PROFILES",
  SEND_TO_ONE_PROFILE: "SEND_TO_ONE_PROFILE",
  SEND_TO_ONE_PROFILE_2: "SEND_TO_ONE_PROFILE_2",
  SEND_TO_MANY_TOPICS: "SEND_TO_MANY_TOPICS",
  SEND_TO_ONE_TOPIC: "SEND_TO_ONE_TOPIC",
} as const;



export enum COUNTRY {
  NIGERIA = "nigeria",
  SOUTH_AFRICA = "south_africa",
}

export enum BUYER_REQUEST_DELIVERY_TYPE {
  PICKUP = "pickup",
  DELIVERY = "delivery",
}




export enum DELIVERY_STATUS {
  PENDING = "pending",
  PROCESSING = "processing",
  READY_FOR_DISPATCH = "ready-for-dispatch",
  IN_TRANSIT = "in-transit",
  OUT_FOR_DELIVERY = "out-for-delivery",
  DELIVERED = "delivered",
}

export enum PICKUP_STATUS {
  PENDING = "pending",
  READY_FOR_PICKUP = "ready-for-pickup",
  PICKUP_SCHEDULED = "pickup-scheduled",
  PICKUP_COMPLETED = "pickup-completed",
}
