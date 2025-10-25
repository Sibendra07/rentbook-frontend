// src/pages/RoomCreate.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import type{ RoomFormData } from '../../types/room';
import { roomService } from '../../services/roomservice';
import RoomForm from '../../components/rooms/RoomForm';

const RoomCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = async (data: RoomFormData) => {
    await roomService.createRoom(data);
    // Navigation is handled in RoomForm on success
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <RoomForm onSubmit={handleCreate} />
    </div>
  );
};

export default RoomCreate;