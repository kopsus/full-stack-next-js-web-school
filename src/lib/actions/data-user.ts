"use server";

import prisma from "@/lib/prisma";
import { Role, Sex } from "@prisma/client";
import { Blood } from "@prisma/client";

type UserWithDetails = {
  id: number;
  username: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  img: string | null;
  blood_type: Blood | null;
  sex: Sex;
  birthday: Date;
  role: Role;
  created_at: Date;
  updated_at: Date;
  password: string;
  // Add relationships based on role
  grade?: { level: number };
  class?: { 
    name: string;
    supervisor?: { 
      first_name: string | null;
      last_name: string | null;
    };
  };
  parent?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone: string | null;
    address: string | null;
  };
  attendances?: { date: Date; present: boolean }[];
  results?: { score: number }[];
  classes?: { id: number; name: string; grade: { level: number }; students: any[] }[];
  subjects?: { id: number; name: string }[];
  lessons?: { id: number; name: string; subject: { name: string }; class: { name: string } }[];
  students?: {
    id: number;
    first_name: string | null;
    last_name: string | null;
    grade: { level: number };
    class: { name: string };
    attendances: { present: boolean, date: Date }[];
    results: { score: number }[];
  }[];
};

export const getDataUser = async (id: string, role: string): Promise<UserWithDetails | null> => {
  let user;

  switch (role) {
    case "ADMIN":
      user = await prisma.admin.findUnique({
        where: { id: parseInt(id) }
      });
      break;
    case "TEACHER": 
      user = await prisma.teacher.findUnique({
        where: { id: parseInt(id) },
        include: {
          classes: {
            include: {
              grade: true,
              students: true
            }
          },
          subjects: true,
          lessons: {
            include: {
              subject: true,
              class: true
            }
          },
          attendances: {
            orderBy: {
              date: 'desc'
            },
            take: 1
          }
        }
      });
      break;
    case "STUDENT":
      user = await prisma.student.findUnique({
        where: { id: parseInt(id) },
        include: {
          grade: true,
          class: {
            include: {
              supervisor: true,
              grade: true
            }
          },
          parent: true,
          attendances: {
            orderBy: {
              date: 'desc'
            },
            take: 1
          },
          results: {
            orderBy: {
              id: 'desc'  
            },
            take: 1,
            include: {
              exam: true,
              assignment: true
            }
          }
        }
      });
      break;
    case "PARENT":
      user = await prisma.parent.findUnique({
        where: { id: parseInt(id) },
        include: {
          students: {
            include: {
              grade: true,
              class: {
                include: {
                  supervisor: true,
                  grade: true
                }
              },
              attendances: {
                orderBy: {
                  date: 'desc'
                },
                take: 1
              },
              results: {
                orderBy: {
                  id: 'desc'
                },
                take: 1,
                include: {
                  exam: true,
                  assignment: true
                }
              }
            }
          }
        }
      });
      break;
    default:
      return null;
  }

  return user;
};
