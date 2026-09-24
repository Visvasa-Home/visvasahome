from fastapi import Request, HTTPException, Depends
from typing import List, Optional
from shared.models import RoleEnum

class CurrentUser:
    def __init__(self, user_id: str, role: RoleEnum):
        self.id = user_id
        self.role = role

def get_current_user(request: Request) -> CurrentUser:
    """
    Dependency to get the current user from headers passed by the API Gateway.
    The Gateway validates the JWT and sets x-user-id and x-user-role.
    """
    user_id = request.headers.get("x-user-id")
    user_role_str = request.headers.get("x-user-role")

    if not user_id or not user_role_str:
        raise HTTPException(status_code=401, detail="Missing user authentication headers")
    
    try:
        role = RoleEnum(user_role_str)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid user role in headers")

    return CurrentUser(user_id=user_id, role=role)

def require_role(allowed_roles: List[RoleEnum]):
    """
    Dependency factory to restrict access based on RoleEnum.
    Usage: @app.get("/admin", dependencies=[Depends(require_role([RoleEnum.ADMIN]))])
    """
    def role_checker(current_user: CurrentUser = Depends(get_current_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403, 
                detail=f"Forbidden: Requires one of {[r.value for r in allowed_roles]}"
            )
        return current_user
    
    return role_checker
