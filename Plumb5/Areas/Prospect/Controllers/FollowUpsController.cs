using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Areas.Prospect.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class FollowUpsController : BaseController
    {
        public FollowUpsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("PlannedFollowUps");
        }

        public IActionResult CompletedFollowUps()
        {
            return View("CompletedFollowUps");
        }

        public IActionResult MissedFollowUps()
        {
            return View("MissedFollowUps");
        }

        [HttpPost]
        public async Task<JsonResult> GetFollowUpNotification([FromBody] FollowUps_GetFollowUpNotificationDto followdetails)
        {
            List<Contact> contactDetails = new List<Contact>();

            DateTime StartDate = DateTime.ParseExact(DateTime.Now.ToUniversalTime().ToString("yyyy-MM-dd HH:mm:00"), "yyyy-MM-dd HH:mm:00", CultureInfo.InvariantCulture);
            DateTime EndDate = DateTime.ParseExact(DateTime.Now.ToUniversalTime().AddMinutes(15).ToString("yyyy-MM-dd HH:mm:00"), "yyyy-MM-dd HH:mm:00", CultureInfo.InvariantCulture);

            List<int> UserHierarchyList = new List<int>();
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();

            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = await objUserHierarchy.GetHisUsers(followdetails.UserId, followdetails.accountId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(followdetails.UserId));
            }
            UserHierarchyList = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            string UserIdList = UserHierarchyList != null && UserHierarchyList.Count > 0 ? string.Join(",", UserHierarchyList) : followdetails.UserId.ToString();

            using (var objDLMyFollowUps = DLMyFollowUps.GetDLMyFollowUps(followdetails.accountId, SQLProvider))
            {
                contactDetails = await objDLMyFollowUps.GetFollowUpNotification(UserIdList, StartDate, EndDate);
            }

            if (contactDetails != null && contactDetails.Count > 0)
            {
                foreach (var contactDetail in contactDetails)
                {
                    string details = "Follow Up planned for";
                    if (!String.IsNullOrEmpty(contactDetail.EmailId))
                        details += " EmailId : " + contactDetail.EmailId;
                    if (!String.IsNullOrEmpty(contactDetail.PhoneNumber))
                        details += " PhoneNumber : " + contactDetail.PhoneNumber;

                    if (contactDetail.FollowUpDate != null)
                        details += " in " + Convert.ToDateTime(contactDetail.FollowUpDate).Subtract(StartDate).Minutes.ToString() + " minutes";

                    Notifications notificationsExits = new Notifications();
                    using (var objbl = DLNotifications.GetDLNotifications(followdetails.accountId, SQLProvider))
                    {
                        notificationsExits = await objbl.GetNotificationsByUserId(followdetails.UserId, contactDetail.ContactId, "FollowUps");
                    }

                    if (notificationsExits != null)
                    {
                        Notifications notifications = new Notifications()
                        {
                            Id = notificationsExits.Id,
                            UserInfoUserId = followdetails.UserId,
                            Heading = "Follow Up",
                            Details = details,
                            PageUrl = "FollowUps",
                            IsThatSeen = false,
                            ContactId = contactDetail.ContactId
                        };

                        using (var objbl = DLNotifications.GetDLNotifications(followdetails.accountId, SQLProvider))
                        {
                            objbl.Update(notifications);
                        }
                    }
                    else
                    {
                        Notifications notifications = new Notifications()
                        {
                            UserInfoUserId = followdetails.UserId,
                            Heading = "Follow Up",
                            Details = details,
                            PageUrl = "FollowUps",
                            IsThatSeen = false,
                            ContactId = contactDetail.ContactId
                        };

                        using (var objbl = DLNotifications.GetDLNotifications(followdetails.accountId, SQLProvider))
                        {
                            await objbl.Save(notifications);
                        }
                    }
                }
            }

            return Json(true);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> LeadsExport([FromBody] FollowUps_LeadsExportDto leadexportdetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)

            {
                List<MLLeadsDetails> customReports = new List<MLLeadsDetails>();
                LmsCustomReport filterLead = new LmsCustomReport();
                List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
                if (HttpContext.Session.GetString("LmsData") != null && HttpContext.Session.GetString("LmsData") != "null")
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("LmsData"));
                    filterLead = JsonConvert.DeserializeObject<LmsCustomReport>(data[0].ToString());
                    userHierarchy = JsonConvert.DeserializeObject<List<MLUserHierarchy>>(data[1].ToString());
                
                }

                using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(leadexportdetails.AccountId, SQLProvider))
                {
                    customReports = await objDL.GetLeadsWithContact(filterLead, leadexportdetails.OffSet, leadexportdetails.FetchNext);
                }

                for (var i = 0; i < customReports.Count; i++)
                {
                    customReports[i].Name = !String.IsNullOrEmpty(customReports[i].Name) ? Helper.MaskName(customReports[i].Name) : customReports[i].Name;
                    customReports[i].EmailId = !String.IsNullOrEmpty(customReports[i].EmailId) ? Helper.MaskEmailAddress(customReports[i].EmailId) : customReports[i].EmailId;
                    customReports[i].PhoneNumber = !String.IsNullOrEmpty(customReports[i].PhoneNumber) ? Helper.MaskPhoneNumber(customReports[i].PhoneNumber) : customReports[i].PhoneNumber;
                }

                LmsExport exporttoexceldetails = new LmsExport();
                await exporttoexceldetails.Export(leadexportdetails.AccountId, customReports, userHierarchy, leadexportdetails.FileType, SQLProvider);

                return Json(new { Status = true, exporttoexceldetails.MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }
    }
}
