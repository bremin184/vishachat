import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    gender: 'male',
    status: 'online',
    age: 25,
    country: 'USA',
  },
  {
    id: '2',
    name: 'Sofia Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    gender: 'female',
    status: 'online',
    age: 23,
    country: 'Spain',
  },
  {
    id: '3',
    name: 'James Wilson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    gender: 'male',
    status: 'busy',
    age: 28,
    country: 'UK',
  },
  {
    id: '4',
    name: 'Emma Johnson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    gender: 'female',
    status: 'online',
    age: 26,
    country: 'Canada',
  },
  {
    id: '5',
    name: 'Lucas Kim',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    gender: 'male',
    status: 'online',
    age: 24,
    country: 'South Korea',
  },
  {
    id: '6',
    name: 'Mia Thompson',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    gender: 'female',
    status: 'away',
    age: 22,
    country: 'Australia',
  },
  {
    id: '7',
    name: 'Noah Garcia',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    gender: 'male',
    status: 'online',
    age: 27,
    country: 'Mexico',
  },
  {
    id: '8',
    name: 'Olivia Brown',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    gender: 'female',
    status: 'online',
    age: 25,
    country: 'France',
  },
];

export const getOnlineUsers = () => mockUsers.filter((u) => u.status === 'online');
export const getUserById = (id: string) => mockUsers.find((u) => u.id === id);
