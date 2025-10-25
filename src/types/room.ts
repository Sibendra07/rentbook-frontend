// types/room.ts
export interface Room {
  id: number;
  user: number;
  room_number: string;
  floor: number;
  room_type: string | null;
  size: string | null;
  base_rent_amount: string;
  base_security_deposit_amount: string;
  description: string | null;
  amenities: string | null;
  image: string | null;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoomFormData {
  room_number: string;
  floor: number;
  room_type?: string;
  size?: string;
  base_rent_amount: string;
  base_security_deposit_amount: string;
  description?: string;
  amenities?: string;
  image?: File | null;
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  is_active: boolean;
}

export const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'maintenance', label: 'Under Maintenance' },
  { value: 'reserved', label: 'Reserved' },
] as const;