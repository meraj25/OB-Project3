import "express";

declare global {
  namespace Express {
    interface User {
      user_id: number;
      user_name: string;
      user_email: string;
    }

    interface Request {
      membership?: workspace_members & { roles: roles };
      allowedActions?: Action[];
    }
  }
}