using Microsoft.AspNetCore.Http;
using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class UserPermissionOnPage
    {
        readonly int AdsId;
        private readonly string sqlVendor;
        PermissionsLevels? objPermissions;
        public PermissionsLevels? Permission;
        public UserPermissionOnPage(int adsid, string sqlVendor, PermissionsLevels? permissions)
        {
            AdsId = adsid;
            this.sqlVendor = sqlVendor;
            Permission = permissions;
            objPermissions = new PermissionsLevels();
        }



        //Checking User Permissions and User Group Permissions together
        public async Task<bool> IsUserHasPermission(string AreaName, int UserInfoUserId)
        {
            bool PermissionStatus = false;

            //100% we will get permission values from Session but for safety I have wriiten this
            if (Permission == null)
            {
                using var objDLPermission = DLPermissionsLevel.GetDLPermissionsLevel(this.sqlVendor);
                objPermissions = await objDLPermission.UserPermissionbyAccountId(UserInfoUserId, AdsId);
                //HttpContext.Current.Session["PermissionsLevels" + UserInfoUserId.ToString()] = objPermissions;
            }
            else
            {
                objPermissions = Permission;
            }

            if (objPermissions != null)
            {
                if (AreaName == "analytics" && objPermissions.Analytics)
                    PermissionStatus = true;
                else if ((AreaName == "form" || AreaName == "captureform") && objPermissions.Forms)
                    PermissionStatus = true;
                else if (AreaName == "mail" && objPermissions.EmailMarketing)
                    PermissionStatus = true;
                else if ((AreaName == "prospect") && objPermissions.LeadManagement)
                    PermissionStatus = true;
                else if (AreaName == "facebookpage" && objPermissions.Social)
                    PermissionStatus = true;
                else if (AreaName == "mobile" && objPermissions.Mobile)
                    PermissionStatus = true;
                else if (AreaName == "sms" && objPermissions.SMS)
                    PermissionStatus = true;
                else if (AreaName == "chat" && objPermissions.SiteChat)
                    PermissionStatus = true;
                else if (AreaName == "campaignapproval")
                    PermissionStatus = true;
                else if (AreaName == "journey" && objPermissions.WorkFlow)
                    PermissionStatus = true;
                else if (AreaName == "webpush" && objPermissions.WebPushNotification)
                    PermissionStatus = true;
                else if (AreaName == "dashboard")
                    PermissionStatus = true;
                else if (AreaName == "managecontact" && objPermissions.Contacts)
                    PermissionStatus = true;
                else if (AreaName == "mobileanalytics" && objPermissions.Mobile)
                    PermissionStatus = true;
                else if (AreaName == "mobileinapp" && objPermissions.MobileEngagement)
                    PermissionStatus = true;
                else if (AreaName == "mobilepushnotification" && objPermissions.MobilePushNotification)
                    PermissionStatus = true;
                else if (AreaName == "segmentbuilder" && objPermissions.Segmentation)
                    PermissionStatus = true;
                else if (AreaName == "customevents" && objPermissions.CustomEvents)
                    PermissionStatus = true;
                else if (AreaName == "revenue" && objPermissions.CustomEvents)
                    PermissionStatus = true;
                else if (AreaName == "whatsapp" && objPermissions.Whatsapp)
                    PermissionStatus = true;
            }
            else
            {
                PermissionStatus = true;
            }
            return PermissionStatus;
        }
    }
}
