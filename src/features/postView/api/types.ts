
import {Avatar} from "@/features/publicUserApi/types";

export type User = {        //TODO: вынести в другой api слой, там где запрос usersProfile
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  region: string;
  dateOfBirth: string;
  aboutMe: string;
  avatars: Avatar[];
  createdAt: string;
}


