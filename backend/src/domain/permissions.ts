type Action =
  | "workspace:update" | "workspace:delete"
  | "member:invite" | "member:remove" | "member:changeRole"
  | "project:create" | "project:update" | "project:delete"
  | "issue:create" | "issue:update" | "issue:delete";


const permissions: Record<number, Action[]> = {
    1: ["workspace:update", "workspace:delete", "member:invite", "member:remove", "member:changeRole", "project:create", "project:update", "project:delete", "issue:create", "issue:update", "issue:delete"], 
    2: ["project:create", "project:update", "project:delete", "issue:create", "issue:update", "issue:delete"], 
    3: [ "issue:update"], 
    
};

const permission = (role_id: number, action: Action): boolean => {
    return permissions[role_id]?.includes(action) ?? false;
}

export { permissions,permission, Action };