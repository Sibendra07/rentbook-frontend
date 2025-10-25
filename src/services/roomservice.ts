// src/services/room.service.ts
// Uses shared api client with auth

import api from './api.client';
import type { Room, RoomFormData } from '../types/room';

export const roomService = {
  // Get all rooms
  async getAllRooms(includeDeleted = false): Promise<Room[]> {
    const response = await api.get<Room[]>('/rooms/', {
      params: { include_deleted: includeDeleted },
    });
    return response.data;
  },

  // Get single room
  async getRoom(id: number): Promise<Room> {
    const response = await api.get<Room>(`/rooms/${id}/`);
    return response.data;
  },

  // Create room
  async createRoom(data: RoomFormData): Promise<Room> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await api.post<Room>('/rooms/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update room
  async updateRoom(id: number, data: Partial<RoomFormData>): Promise<Room> {
    const formData = new FormData();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await api.patch<Room>(`/rooms/${id}/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Soft delete
  async softDeleteRoom(id: number): Promise<void> {
    await api.delete(`/rooms/${id}/`);
  },

  // Hard delete
  async hardDeleteRoom(id: number): Promise<void> {
    await api.delete(`/rooms/${id}/hard-delete/`);
  },

  // Restore room
  async restoreRoom(id: number): Promise<Room> {
    const response = await api.post<Room>(`/rooms/${id}/restore/`);
    return response.data;
  },
};