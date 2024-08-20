using P5GenralDL;
using P5GenralML;

namespace Plumb5.Areas.ManageUsers.Models
{
    public class Roles
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string PermissionDescription { get; set; }
        public string CreatedEmailId { get; set; }
        public DateTime CreatedDate { get; set; }
    }

    public class RolesDetails : IDisposable
    {
        public async Task<List<Roles>> GetRolesDetails(int UserId, string RoleName, int OffSet, int FetchNext,string DbType)
        {
            
            List<Roles> roles = new List<Roles>();
            var objDL = DLPermissionsLevel.GetDLPermissionsLevel(DbType);
            var permissionsList =await objDL.GetPermissionsList(OffSet, FetchNext, UserId, RoleName);

            if (permissionsList != null && permissionsList.Count > 0)
            {
                IEnumerable<int> CreatedByUserIds = permissionsList.Select(x => x.CreatedByUserId).Distinct().ToList();
                List<UserInfo> userInfoList = null;
                using (var userInfo = DLUserInfo.GetDLUserInfo(DbType))
                {
                    userInfoList = userInfo.GetDetail(CreatedByUserIds);

                    if (userInfoList != null && userInfoList.Count > 0)
                    {
                        roles = (from RolesList in permissionsList.AsEnumerable()
                                 join UserInfoList in userInfoList.AsEnumerable() on RolesList.CreatedByUserId equals UserInfoList.UserId
                                 select new Roles
                                 {
                                     Id = RolesList.Id,
                                     Name = RolesList.Name,
                                     PermissionDescription = RolesList.PermissionDescription,
                                     CreatedEmailId = UserInfoList.EmailId,
                                     CreatedDate = RolesList.CreatedDate
                                 }).OrderByDescending(x => x.Id).ToList();
                    }
                    else
                    {
                        roles = (from RolesList in permissionsList.AsEnumerable()
                                 select new Roles
                                 {
                                     Id = RolesList.Id,
                                     Name = RolesList.Name,
                                     PermissionDescription = RolesList.PermissionDescription,
                                     CreatedEmailId = "NA",
                                     CreatedDate = RolesList.CreatedDate
                                 }).OrderByDescending(x => x.Id).ToList();
                    }
                }
            }

            return roles;
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {

                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
