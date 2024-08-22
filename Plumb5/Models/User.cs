using P5GenralML;

namespace Plumb5.Models
{
    public class User
    {
        public UserInfo userInfo { get; set; }
        public List<UserHierarchy> userHierarchyList { get; set; }
        public List<UserInfo> userInfoList { get; set; }
    }

    public class UsersModule
    {
        public List<UserInfo> userInfo { get; set; }
        public List<UserAccounts> usersAccount { get; set; }
        public List<UserAccounts> UserAccounts { get; set; }
        public List<PermissionsLevels> permission { get; set; }
        public UserDetails UserDetails { get; set; }
    }
}
