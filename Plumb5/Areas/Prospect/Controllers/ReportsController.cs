using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Areas.Prospect.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Collections.Generic;
using System.Data;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class ReportsController : BaseController
    {
        public ReportsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Prospect/Reports/

        public ActionResult MyReports()
        {
            return View();
        }

        public ActionResult ScheduledMailAlerts()
        {
            return View();
        }

        public ActionResult ScheduledSmsAlerts()
        {
            return View();
        }
        public ActionResult ScheduledWhatsappAlerts()
        {
            return View();
        }

        #region MyReports

        [HttpPost]
        public async Task<JsonResult> GetRecentSavedReportDetails([FromBody] ReportsDto_GetRecentSavedReportDetails commonDetails)
        {
            MLLmsFilterConditions? savedresponsedetails;
            using (var objLmsLeads = DLLmsFilterConditions.GetDLLmsFilterConditions(commonDetails.AccountId, SQLProvider))
            {
                savedresponsedetails = await objLmsLeads.GetRecentSavedReportDetails(await GetAllUsersByUserId(commonDetails.UserId, commonDetails.AccountId));
                return Json(savedresponsedetails);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetAllForms([FromBody] ReportsDto_GetAllForms commonDetails)
        {
            List<FormDetails> formDetails = new List<FormDetails>();
            using (var objLmsLeads = DLLmsCustomReport.GetDLLmsCustomReport(commonDetails.AccountId, SQLProvider))
            {
                formDetails = await objLmsLeads.GetAllForms();
                //return Json(new { formDetails = formDetails });

                return Json(formDetails);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetSavedReports([FromBody] ReportsDto_GetRecentSavedReportDetails commonDetails)
        {
            List<MLLmsFilterConditions> fieldDetails = null;

            using (var objDL = DLLmsFilterConditions.GetDLLmsFilterConditions(commonDetails.AccountId, SQLProvider))
            {
                fieldDetails = (await objDL.GetFilterName(await GetAllUsersByUserId(commonDetails.UserId, commonDetails.AccountId))).ToList();
            }
            return Json(fieldDetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveLmsFilterConditiondetails([FromBody] ReportsDto_SaveLmsFilterConditiondetails commonDetails)
        {
            using var objDL = DLLmsFilterConditions.GetDLLmsFilterConditions(commonDetails.AccountId, SQLProvider);

            if (commonDetails.filterConditions.Id == 0)
            {
                commonDetails.filterConditions.Id = await objDL.Save(commonDetails.filterConditions);
                if (commonDetails.filterConditions.Id > 0)
                    return Json(new { Status = 1, commonDetails.filterConditions });  //After Saved Successfully
                else
                    return Json(new { Status = 2, commonDetails.filterConditions });  //already existing for new 
            }
            else if (commonDetails.filterConditions.Id > 0)
            {
                if (await objDL.Update(commonDetails.filterConditions))
                    return Json(new { Status = 3, commonDetails.filterConditions });  //updated Successfully
                else
                    return Json(new { Status = 4, commonDetails.filterConditions });  //when updating with the same name

            }
            return Json(new { Status = -1, commonDetails.filterConditions });
        }

        [HttpPost]
        public async Task<JsonResult> GetFilterConditionDetails([FromBody] ReportsDto_GetFilterConditionDetails commonDetails)
        {
            using (var objLmsLeads = DLLmsFilterConditions.GetDLLmsFilterConditions(commonDetails.AccountId, SQLProvider))
            {
                return Json(await objLmsLeads.GetFilterConditionDetails(commonDetails.FilterConditionId));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteSavedSearch([FromBody] ReportsDto_DeleteSavedSearch commonDetails)
        {
            using (var objLmsLeads = DLLmsFilterConditions.GetDLLmsFilterConditions(commonDetails.AccountId, SQLProvider))
            {
                return Json(await objLmsLeads.DeleteSavedSearch(commonDetails.Id));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> MyReportsExport([FromBody] ReportsDto_MyReportsExport commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                List<MLLeadsDetails> customReports = new List<MLLeadsDetails>();
                LmsCustomReport filterLead = new LmsCustomReport();
                List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
                if (HttpContext.Session.GetString("LmsData") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("LmsData"));
                    filterLead = JsonConvert.DeserializeObject<LmsCustomReport>(data[0].ToString());  
                    userHierarchy = JsonConvert.DeserializeObject<List<MLUserHierarchy>> (data[1].ToString()); 
                }

                using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(commonDetails.AccountId, SQLProvider))
                {
                    customReports = await objDL.GetLeadsWithContact(filterLead, commonDetails.OffSet, commonDetails.FetchNext);
                }

                if (customReports != null && customReports.Count > 0)
                {
                    for (var i = 0; i < customReports.Count; i++)
                    {
                        customReports[i].Name = !String.IsNullOrEmpty(customReports[i].Name) ? Helper.MaskName(customReports[i].Name) : customReports[i].Name;
                        customReports[i].EmailId = !String.IsNullOrEmpty(customReports[i].EmailId) ? Helper.MaskEmailAddress(customReports[i].EmailId) : customReports[i].EmailId;
                        customReports[i].PhoneNumber = !String.IsNullOrEmpty(customReports[i].PhoneNumber) ? Helper.MaskPhoneNumber(customReports[i].PhoneNumber) : customReports[i].PhoneNumber;
                    }
                }

                LmsExport exporttoexceldetails = new LmsExport();
                await exporttoexceldetails.Export(commonDetails.AccountId, customReports, userHierarchy, commonDetails.FileType, SQLProvider);

                return Json(new { Status = true, exporttoexceldetails.MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }

        #endregion

        #region ScheduledMailAlert
        [HttpPost]
        public async Task<JsonResult> GetScheduledMailAlertMaxCount([FromBody] ReportsDto_GetScheduledMailAlertMaxCount commonDetails)
        {
            int returnVal;
            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AccountId, SQLProvider))
            {
                returnVal = await objDL.GetScheduledMailAlertMaxCount(commonDetails.Fromdate, commonDetails.Todate, await GetAllUsersByUserId(commonDetails.UserId, commonDetails.AccountId));
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<JsonResult> GetScheduledMailAlertDetails([FromBody] ReportsDto_GetScheduledMailAlertDetails commonDetails)
        {
            List<ContactMailSMSReminderDetails> mailSchedulelaterdetails = new List<ContactMailSMSReminderDetails>();

            string UserIdData = await GetAllUsersByUserId(commonDetails.UserId, commonDetails.AccountId);
            ArrayList exportdata = new ArrayList() { UserIdData };
            HttpContext.Session.SetString("ScheduledMailAlertsDetails", JsonConvert.SerializeObject(exportdata));

            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AccountId, SQLProvider))
            {
                mailSchedulelaterdetails = await objDL.GetScheduledMailAlertDetails(commonDetails.Fromdate, commonDetails.Todate, UserIdData, commonDetails.OffSet, commonDetails.FetchNext);
            }

            if (mailSchedulelaterdetails != null && mailSchedulelaterdetails.Count > 0)
            {
                for (var i = 0; i < mailSchedulelaterdetails.Count; i++)
                {
                    mailSchedulelaterdetails[i].Name = !String.IsNullOrEmpty(mailSchedulelaterdetails[i].Name) ? Helper.MaskName(mailSchedulelaterdetails[i].Name) : mailSchedulelaterdetails[i].Name;
                    mailSchedulelaterdetails[i].EmailId = !String.IsNullOrEmpty(mailSchedulelaterdetails[i].EmailId) ? Helper.MaskEmailAddress(mailSchedulelaterdetails[i].EmailId) : mailSchedulelaterdetails[i].EmailId;
                    mailSchedulelaterdetails[i].PhoneNumber = !String.IsNullOrEmpty(mailSchedulelaterdetails[i].PhoneNumber) ? Helper.MaskPhoneNumber(mailSchedulelaterdetails[i].PhoneNumber) : mailSchedulelaterdetails[i].PhoneNumber;
                }
            }

            return Json(mailSchedulelaterdetails);
        }

        [HttpPost]
        public async Task<JsonResult> GetMailTemplateContent([FromBody] ReportsDto_GetMailTemplateContent commonDetails)
        {
            List<ContactMailSMSReminderDetails> mailSchedulelaterdetails = null;

            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AccountId, SQLProvider))
            {
                mailSchedulelaterdetails = await objDL.GetMailTemplateContent(commonDetails.MailTemplateName, commonDetails.Id);
            }
            mailSchedulelaterdetails[0].TemplateContent = Helper.Base64Decode(mailSchedulelaterdetails[0].TemplateContent);
            return Json(new
            {
                mailSchedulelaterdetails
            });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ScheduledMailAlertsExport([FromBody] ReportsDto_ScheduledMailAlertsExport commonDetails)
        {
            DataSet dataSet = new DataSet();
            string UserIdData = "";
            List<ContactMailSMSReminderDetails> mailSchedulelaterdetails = null;
            if (HttpContext.Session.GetString("ScheduledMailAlertsDetails") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("ScheduledMailAlertsDetails"));
                UserIdData = data[0].ToString();
            }
            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AccountId, SQLProvider))
            {
                mailSchedulelaterdetails = await objDL.GetScheduledMailAlertDetails(commonDetails.FromDateTime, commonDetails.TodateTime, UserIdData, commonDetails.OffSet, commonDetails.FetchNext);
            }
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AccountId, SQLProvider);
            var NewListData = mailSchedulelaterdetails.Select(x => new
            {
                x.TemplateName,
                x.FromEmailId,
                x.FromName,
                EmailId = !String.IsNullOrEmpty(x.EmailId) ? Helper.MaskEmailAddress(x.EmailId) : x.EmailId,
                AlertScheduleDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.AlertScheduleDate.ToString())).ToString()
            });
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "ScheduledMailAlerts_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteScheduledMailAlerts([FromBody] ReportsDto_DeleteScheduledMailAlerts commonDetails)
        {
            bool result = false;
            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AdsId, SQLProvider))
            {
                result = await objDL.DeleteScheduledMailAlerts(commonDetails.Id);
            }
            return Json(result);
        }
        #endregion

        #region ScheduledSmsAlert
        [HttpPost]
        public async Task<JsonResult> GetScheduledSmsAlertMaxCount([FromBody] ReportsDto_GetScheduledSmsAlertMaxCount commonDetails)
        {
            int returnVal;

            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AccountId, SQLProvider))
            {
                returnVal = await objDL.GetScheduledSmsAlertMaxCount(commonDetails.Fromdate, commonDetails.Todate, await GetAllUsersByUserId(commonDetails.UserId, commonDetails.AccountId));
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<JsonResult> GetScheduledSmsAlertDetails([FromBody] ReportsDto_GetScheduledSmsAlertDetails commonDetails)
        {
            List<ContactMailSMSReminderDetails> smsSchedulelaterdetails = new List<ContactMailSMSReminderDetails>();
            string? UserIdData = await GetAllUsersByUserId(commonDetails.UserId, commonDetails.AccountId);
            ArrayList exportdata = new ArrayList() { UserIdData };
            HttpContext.Session.SetString("ScheduledSmsAlertsDetails", JsonConvert.SerializeObject(exportdata)); 

            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AccountId, SQLProvider))
            {
                smsSchedulelaterdetails = await objDL.GetScheduledSmsAlertDetails(commonDetails.Fromdate, commonDetails.Todate, UserIdData, commonDetails.OffSet, commonDetails.FetchNext);
            }

            if (smsSchedulelaterdetails != null && smsSchedulelaterdetails.Count > 0)
            {
                for (var i = 0; i < smsSchedulelaterdetails.Count; i++)
                {
                    smsSchedulelaterdetails[i].PhoneNumber = !String.IsNullOrEmpty(smsSchedulelaterdetails[i].PhoneNumber) ? Helper.MaskPhoneNumber(smsSchedulelaterdetails[i].PhoneNumber) : smsSchedulelaterdetails[i].PhoneNumber;
                }
            }

            return Json(smsSchedulelaterdetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ScheduledSmsAlertsExport([FromBody] ReportsDto_ScheduledSmsAlertsExport commonDetails)
        {
            DataSet dataSet = new DataSet();
            string UserIdData = "";
            List<ContactMailSMSReminderDetails> smsSchedulelaterdetails = null;
            if (HttpContext.Session.GetString("ScheduledSmsAlertsDetails") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("ScheduledSmsAlertsDetails"));
                UserIdData = data[0].ToString();
            }
            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AccountId, SQLProvider))
            {
                smsSchedulelaterdetails = await objDL.GetScheduledSmsAlertDetails(commonDetails.FromDateTime, commonDetails.TodateTime, UserIdData, commonDetails.OffSet, commonDetails.FetchNext);
            }
            string? TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AccountId, SQLProvider);
            var NewListData = smsSchedulelaterdetails.Select(x => new
            {
                x.TemplateContent,
                x.TemplateName,
                x.Name,
                PhoneNumber = !String.IsNullOrEmpty(x.PhoneNumber) ? Helper.MaskPhoneNumber(x.PhoneNumber) : x.PhoneNumber,
                AlertScheduleDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.AlertScheduleDate.ToString())).ToString()
            });
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "ScheduledSmsAlerts_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteScheduledSmsAlerts([FromBody] ReportsDto_DeleteScheduledSmsAlerts commonDetails)
        {
            bool result = false;
            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AdsId, SQLProvider))
            {
                result = await objDL.DeleteScheduledSmsAlerts(commonDetails.Id);
            }
            return Json(result);
        }
        #endregion

        #region ScheduledWhatsappAlert
        [HttpPost]
        public async Task<JsonResult> GetScheduledWhatsappAlertMaxCount([FromBody] ReportsDto_GetScheduledWhatsappAlertMaxCount commonDetails)
        {
            int returnVal;

            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AccountId, SQLProvider))
            {
                returnVal = await objDL.GetScheduledWhatsappAlertMaxCount(commonDetails.Fromdate, commonDetails.Todate, await GetAllUsersByUserId(commonDetails.UserId, commonDetails.AccountId));
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<JsonResult> GetScheduledWhatsappAlertDetails([FromBody] ReportsDto_GetScheduledWhatsappAlertDetails commonDetails)
        {
            List<ContactMailSMSReminderDetails> whatsappSchedulelaterdetails = new List<ContactMailSMSReminderDetails>();
            string UserIdData = await GetAllUsersByUserId(commonDetails.UserId, commonDetails.AccountId);
            ArrayList exportdata = new ArrayList() { UserIdData };

            HttpContext.Session.SetString("ScheduledWhatsappAlertsDetails", JsonConvert.SerializeObject(exportdata));

            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AccountId, SQLProvider))
            {
                whatsappSchedulelaterdetails = await objDL.GetScheduledWhatsappAlertDetails(commonDetails.Fromdate, commonDetails.Todate, UserIdData, commonDetails.OffSet, commonDetails.FetchNext);
            }

            if (whatsappSchedulelaterdetails != null && whatsappSchedulelaterdetails.Count > 0)
            {
                for (var i = 0; i < whatsappSchedulelaterdetails.Count; i++)
                {
                    whatsappSchedulelaterdetails[i].PhoneNumber = !String.IsNullOrEmpty(whatsappSchedulelaterdetails[i].PhoneNumber) ? Helper.MaskPhoneNumber(whatsappSchedulelaterdetails[i].PhoneNumber) : whatsappSchedulelaterdetails[i].PhoneNumber;
                }
            }

            return Json(whatsappSchedulelaterdetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ScheduledWhatsappAlertsExport([FromBody] ReportsDto_ScheduledWhatsappAlertsExport commonDetails)
        {
            DataSet dataSet = new DataSet();
            string UserIdData = "";
            List<ContactMailSMSReminderDetails> whatsappSchedulelaterdetails = null;
            if (HttpContext.Session.GetString("ScheduledWhatsappAlertsDetails") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("ScheduledWhatsappAlertsDetails"));
                UserIdData = data[0].ToString();
            }
            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AccountId, SQLProvider))
            {
                whatsappSchedulelaterdetails = await objDL.GetScheduledWhatsappAlertDetails(commonDetails.FromDateTime, commonDetails.TodateTime, UserIdData, commonDetails.OffSet, commonDetails.FetchNext);
            }
            string? TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AccountId, SQLProvider);
            var NewListData = whatsappSchedulelaterdetails.Select(x => new
            {
                x.TemplateContent,
                x.TemplateName,
                x.Name,
                PhoneNumber = !String.IsNullOrEmpty(x.PhoneNumber) ? Helper.MaskPhoneNumber(x.PhoneNumber) : x.PhoneNumber,
                AlertScheduleDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.AlertScheduleDate.ToString())).ToString()
            });
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "ScheduledWhatsappAlerts_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteScheduledWhatsappAlerts([FromBody] ReportsDto_DeleteScheduledWhatsappAlerts commonDetails)
        {
            bool result = false;
            using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(commonDetails.AdsId, SQLProvider))
            {
                result = await objDL.DeleteScheduledWhatsappAlerts(commonDetails.Id);
            }
            return Json(result);
        }
        #endregion












        public async Task<string?> GetAllUsersByUserId(int UserId, int AccountId)
        {
            string userId = "";
            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
            {
                userHierarchy = await objUserHierarchy.GetHisUsers(UserId, AccountId);
                userHierarchy.Add(await objUserHierarchy.GetHisDetails(UserId));
            }
            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

            List<int> usersId = new List<int>();
            if (userHierarchy != null)
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

            userId = string.Join(",", usersId.ToArray());

            if (String.IsNullOrEmpty(userId))
                userId = UserId.ToString();
            return userId;
        }

        [HttpPost]
        public async Task<JsonResult> GetHistoryReport([FromBody] ReportsDto_GetHistoryReport commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                LmsCustomReport filterLead = new LmsCustomReport();
                List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
                if (HttpContext.Session.GetString("LmsData") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("LmsData"));
                    filterLead = JsonConvert.DeserializeObject<LmsCustomReport>(data[0].ToString());
                    userHierarchy = JsonConvert.DeserializeObject<List<MLUserHierarchy>>(data[1].ToString());
                }

                if (filterLead.UserInfoUserId > 0)
                {
                    userHierarchy = new List<MLUserHierarchy>();
                    using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                    {
                        MLUserHierarchy? seniorUser = await objUserHierarchy.GetUsersSenior(filterLead.UserInfoUserId);
                        if (seniorUser != null)
                        {
                            userHierarchy = await objUserHierarchy.GetHisUsers(seniorUser.UserInfoUserId, commonDetails.AccountId);
                            userHierarchy.Add(await objUserHierarchy.GetHisDetails(seniorUser.UserInfoUserId));
                        }
                        else
                        {
                            userHierarchy = await objUserHierarchy.GetHisUsers(filterLead.UserInfoUserId, commonDetails.AccountId);
                            userHierarchy.Add(await objUserHierarchy.GetHisDetails(filterLead.UserInfoUserId));
                        }
                    }
                    userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
                }

                List<MLLeadsDetails> customReport = new List<MLLeadsDetails>();
                using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(commonDetails.AccountId, SQLProvider))
                {
                    customReport = await objDL.GetLeadsWithContact(filterLead, commonDetails.OffSet, commonDetails.FetchNext);
                }

                LmsExport exporttoexceldetails = new LmsExport();
                await exporttoexceldetails.HistoryExport(commonDetails.AccountId, customReport, userHierarchy, commonDetails.FileType, filterLead.StartDate, filterLead.EndDate, SQLProvider);

                return Json(new { Status = true, exporttoexceldetails.MainPath });
            }
            else
            {
                return Json(new { Status = -1 });
            }
        }
    }
}
