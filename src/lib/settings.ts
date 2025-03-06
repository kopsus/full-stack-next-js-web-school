export const ITEM_PER_PAGE = 10

type RouteAccessMap = {
  [key: string]: string[];
};

export const routeAccessMap: RouteAccessMap = {
  "/admin(.*)": ["ADMIN"],
  "/student(.*)": ["STUDENT"],
  "/teacher(.*)": ["TEACHER"],
  "/parent(.*)": ["PARENT"],
  "/list/teachers": ["ADMIN", "TEACHER"],
  "/list/students": ["ADMIN", "TEACHER"],
  "/list/parents": ["ADMIN", "TEACHER"],
  "/list/subjects": ["ADMIN"],
  "/list/classes": ["ADMIN", "TEACHER"],
  "/list/exams": ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
  "/list/assignments": ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
  "/list/results": ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
  "/list/attendance": ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
  "/list/events": ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
  "/list/announcements": ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
};