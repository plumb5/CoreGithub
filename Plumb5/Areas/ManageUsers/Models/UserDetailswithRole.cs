using P5GenralDL;
using P5GenralML;

namespace Plumb5.Areas.ManageUsers.Models
{
    public class UserDetailswithRole
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public bool ActiveStatus { get; set; }
        public string Role { get; set; }
    }

    public class UserDetails : IDisposable
    {
        public async Task<List<UserDetailswithRole>> GetUsersWithRoles(int UserId, string UserEmailId, int Offset, int FetchNext, int UserGroupId,string DbType)
        {
            List<UserDetailswithRole> userDetailswithRoles = new List<UserDetailswithRole>();
            List<MLUserInfo> mLUserInfo = null;
            List<PermissionsLevels> permissionsLevel = null;
            using (var objUserInfo = DLUserInfo.GetDLUserInfo(DbType))
                mLUserInfo =await objUserInfo.GetUserDetails(UserId, UserEmailId, Offset, FetchNext, UserGroupId);

            if (mLUserInfo != null && mLUserInfo.Count > 0)
            {
                List<int> RoleIds = mLUserInfo.Select(x => x.Role).Distinct().ToList();

                var objDLPermission = DLPermissionsLevel.GetDLPermissionsLevel(DbType);
                permissionsLevel =await objDLPermission.GetRolesByIds(RoleIds);

                if (permissionsLevel != null && permissionsLevel.Count > 0)
                {
                    userDetailswithRoles = (from MLUserInfo in mLUserInfo.AsEnumerable()
                                            join PermissionsLevel in permissionsLevel.AsEnumerable() on MLUserInfo.Role equals PermissionsLevel.Id
                                            select new UserDetailswithRole
                                            {
                                                UserId = MLUserInfo.UserId,
                                                FirstName = MLUserInfo.FirstName,
                                                LastName = MLUserInfo.LastName,
                                                EmailId = MLUserInfo.EmailId,
                                                ActiveStatus = MLUserInfo.ActiveStatus,
                                                Role = PermissionsLevel.Name
                                            }).OrderByDescending(x => x.UserId).ToList();
                }
                else
                {
                    userDetailswithRoles = (from MLUserInfo in mLUserInfo.AsEnumerable()
                                            select new UserDetailswithRole
                                            {
                                                UserId = MLUserInfo.UserId,
                                                FirstName = MLUserInfo.FirstName,
                                                LastName = MLUserInfo.LastName,
                                                EmailId = MLUserInfo.EmailId,
                                                ActiveStatus = MLUserInfo.ActiveStatus,
                                                Role = "NA"
                                            }).OrderByDescending(x => x.UserId).ToList();
                }
            }

            return userDetailswithRoles;
        }

        public async Task<List<UserDetailsHierarchyWithPermissions>> GetUsersWithSenior(int UserId, int UserGroupId, UserDetailsHierarchyWithPermissions userDetailsWithPermissions,string DbType)
        {
            P5GenralML.UserDetails objML = new P5GenralML.UserDetails() { MainUserId = UserId };
            List<P5GenralML.MLUserHierarchyWithPermissions> userHierarchy = null;
            List<UserInfo> userdetails = new List<UserInfo>();
            List<UserDetailsHierarchyWithPermissions> userHierarch_New = new List<UserDetailsHierarchyWithPermissions>();

            using (var objUserHierarchy = DLUserDetails.GetDLUserDetails(DbType))
            {
                userHierarchy =await objUserHierarchy.GetUserDetails(UserId, UserGroupId, userDetailsWithPermissions);
            }

            if (userHierarchy != null && userHierarchy.Count() > 0)
            {
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(y => y.First()).ToList();

                List<int> UserIds = userHierarchy.Select(x => x.SeniorUserId).Distinct().ToList();

                using (var objuser = DLUserInfo.GetDLUserInfo(DbType))
                {
                    userdetails = objuser.GetDetail(UserIds);
                }

                if (userdetails != null && userdetails.Count() > 0)
                {
                    userHierarch_New = (from MLUserHierarchyWithPermissions in userHierarchy.AsEnumerable()
                                        join UserInfo in userdetails.AsEnumerable() on MLUserHierarchyWithPermissions.SeniorUserId equals UserInfo.UserId
                                        into UserInformationValues
                                        from output in UserInformationValues.DefaultIfEmpty(new UserInfo())
                                        select new UserDetailsHierarchyWithPermissions
                                        {
                                            UserInfoUserId = MLUserHierarchyWithPermissions.UserInfoUserId,
                                            SeniorUserId = MLUserHierarchyWithPermissions.SeniorUserId,
                                            FirstName = MLUserHierarchyWithPermissions.FirstName,
                                            LastName = MLUserHierarchyWithPermissions.LastName,
                                            EmailId = MLUserHierarchyWithPermissions.EmailId,
                                            Senior = output.FirstName,
                                            IsAdmin = MLUserHierarchyWithPermissions.IsAdmin,
                                            ActiveStatus = MLUserHierarchyWithPermissions.ActiveStatus,
                                            PermissionLevelsId = MLUserHierarchyWithPermissions.PermissionLevelsId,
                                            RegistrationDate = MLUserHierarchyWithPermissions.RegistrationDate
                                        }).OrderByDescending(x => x.UserInfoUserId).ToList();
                }
            }
            return userHierarch_New;
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
