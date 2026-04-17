
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const ConstantApi = {
  admin: {
    registerDeparment: BASE_URL + "/api/admin/register-department",

  },
  auth: {
    login: BASE_URL + "/api/auth/login",
    forgotPassword:BASE_URL+"/api/auth/forgot-password"


  },
  task: {
    uploadImage:BASE_URL+"/api/task/upload-image",
    createTask: BASE_URL + "/api/task/create-new-task",
    getTasksAssignedToMe: BASE_URL + "/api/task/get-tasks-assigned-to-me",
    getTasksCreatedByMe: BASE_URL + "/api/task/get-tasks-created-by-me",
    getTasksByDate: BASE_URL + "/api/task/by-date",
    markCompleteTask: BASE_URL + "/api/task/mark-complete-task",
    getAllDepartment:BASE_URL+"/api/task/get-all-department"

  }




}

export default ConstantApi



