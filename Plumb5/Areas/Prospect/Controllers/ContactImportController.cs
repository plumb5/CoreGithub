using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class ContactImportController : BaseController
    {
        public ContactImportController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Prospect/ContactImport/

        public async Task<ActionResult> Index()
        {
            HttpContext.Session.SetString("ContactImportOverview", "");
            HttpContext.Session.SetString("ContactImportRemoveContactsFromGroup", "");
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            bool IsOverrideAssignmentPermission = false;
            bool IsOverrideSourcePermission = false;

            if (user.IsSuperAdmin == 1)
            {
                IsOverrideAssignmentPermission = true;
                IsOverrideSourcePermission = true;
            }
            else
            {
                using var objDLPermission = DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);
                PermissionsLevels? permissions = await objDLPermission.UserPermissionbyAccountId(user.UserId, domainDetails.AdsId);

                if (permissions != null)
                {
                    PermissionSubLevels? subPermissionAssignment = new PermissionSubLevels();
                    PermissionSubLevels? subPermissionSource = new PermissionSubLevels();
                    using (var objDL = DLPermissionSubLevels.GetDLPermissionSubLevels(SQLProvider))
                    {
                        subPermissionAssignment = await objDL.GetDetails(new PermissionSubLevels() { PermissionLevelId = permissions.Id }, "RetainAssignment");
                        subPermissionSource = await objDL.GetDetails(new PermissionSubLevels() { PermissionLevelId = permissions.Id }, "RetainSource");
                    }
                    if (subPermissionAssignment != null && subPermissionAssignment.HasPermission)
                    {
                        IsOverrideAssignmentPermission = true;
                    }

                    if (subPermissionSource != null && subPermissionSource.HasPermission)
                    {
                        IsOverrideSourcePermission = true;
                    }
                }
            }
            ViewBag.IsOverrideAssignmentPermission = IsOverrideAssignmentPermission;
            ViewBag.IsOverrideSourcePermission = IsOverrideSourcePermission;
            return View("ContactImport");
        }
    }
}
