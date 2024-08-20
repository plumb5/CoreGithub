using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers; 
using System.Globalization;
using System.Collections;
using Plumb5.Areas.CustomEvents.Models;
using Plumb5.Areas.CustomEvents.Dto;

namespace Plumb5.Areas.CustomEvents.Controllers
{
    [Area("CustomEvents")]
    public class ViewCustomEventDataController : BaseController
    {
        public ViewCustomEventDataController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /CustomEvents/ViewCustomEventData/

        public IActionResult Index()
        {
            return View("ViewCustomEventData");
        }
        public async Task<JsonResult> GetEventscount([FromBody] ViewCustomEventData_GetEventscountDto ViewCustomEventDataDto)
        {
            HttpContext.Session.SetString("CustomEventOverViewId", JsonConvert.SerializeObject(ViewCustomEventDataDto.customeventoverviewid));
            HttpContext.Session.SetString("CustomEventMachineID", JsonConvert.SerializeObject(ViewCustomEventDataDto.machineid)); 
            DateTime FromDateTime = DateTime.ParseExact(ViewCustomEventDataDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(ViewCustomEventDataDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int returnVal;
            ArrayList data = new ArrayList() { ViewCustomEventDataDto.contact };
            HttpContext.Session.SetString("ContactDetails", JsonConvert.SerializeObject(data)); 
            ArrayList eventdata = new ArrayList() { ViewCustomEventDataDto.customevents };
            HttpContext.Session.SetString("customeventdetails", JsonConvert.SerializeObject(eventdata));
            using (var objDL = DLCustomEvents.GetDLCustomEvents(ViewCustomEventDataDto.accountId, SQLProvider))
            {
                returnVal = await objDL.GetEventscounts(FromDateTime, ToDateTime, ViewCustomEventDataDto.customeventoverviewid, ViewCustomEventDataDto.contact, ViewCustomEventDataDto.machineid, ViewCustomEventDataDto.customevents);
            }

            return Json(new
            {
                returnVal
            });
        }
        public async Task<JsonResult> GetEventsReportData([FromBody] ViewCustomEventData_GetEventsReportDataDto ViewCustomEventDataDto)
        {

            DateTime FromDateTime = DateTime.ParseExact(ViewCustomEventDataDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(ViewCustomEventDataDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<Customevents> CustomEventsCartDetails = null;

            using (var objDL = DLCustomEvents.GetDLCustomEvents(ViewCustomEventDataDto.accountId, SQLProvider))
            {
                CustomEventsCartDetails = (await objDL.GetEventsReportData(FromDateTime, ToDateTime, ViewCustomEventDataDto.customeventoverviewid, ViewCustomEventDataDto.ContactId, ViewCustomEventDataDto.OffSet, ViewCustomEventDataDto.FetchNext, ViewCustomEventDataDto.contact, ViewCustomEventDataDto.machineid, ViewCustomEventDataDto.customevents)).ToList();
            }

            return Json(CustomEventsCartDetails);
        }
        
        public async Task<JsonResult> MasterFilterEventscount([FromBody] ViewCustomEventData_MasterFilterEventscountDto ViewCustomEventDataDto)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            Contact contact = new Contact();
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            int UserInfoUserId = user.UserId;
            int UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            string machineid = "";
            HttpContext.Session.SetString("CustomEventOverViewId", JsonConvert.SerializeObject(ViewCustomEventDataDto.customeventoverviewid));
            HttpContext.Session.SetString("CustomEventMachineID", JsonConvert.SerializeObject(machineid));
             
            if (!string.IsNullOrEmpty(ViewCustomEventDataDto.fromDateTime))
                FromDateTime = DateTime.ParseExact(ViewCustomEventDataDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(ViewCustomEventDataDto.toDateTime))
                ToDateTime = DateTime.ParseExact(ViewCustomEventDataDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            int returnVal = 0;
            int newgroupid = 0;

            ArrayList data = new ArrayList() { contact };
            HttpContext.Session.SetString("ContactDetails", JsonConvert.SerializeObject(data));
             
            ArrayList eventdata = new ArrayList() { ViewCustomEventDataDto.customevents };
            HttpContext.Session.SetString("customeventdetails", JsonConvert.SerializeObject(eventdata));

            using (var objDL = DLCustomEvents.GetDLCustomEvents(ViewCustomEventDataDto.accountId, SQLProvider))
            {
                returnVal = await objDL.GetEventscounts(FromDateTime, ToDateTime, ViewCustomEventDataDto.customeventoverviewid, contact, machineid, ViewCustomEventDataDto.customevents);
            }
            if (returnVal > 0)
            {
                if (ViewCustomEventDataDto.creategroupchk == 1)
                {

                    Groups group = new Groups();

                    group.UserInfoUserId = UserInfoUserId;
                    group.UserGroupId = UserGroupId;
                    group.Name = ViewCustomEventDataDto.Newgroupname;
                    group.GroupDescription = ViewCustomEventDataDto.Newgroupdescription;
                    group.GroupType = 3;

                    using ( var objDAL =   DLGroups.GetDLGroups(ViewCustomEventDataDto.accountId,SQLProvider))
                    {
                        newgroupid = await objDAL.Save(group);
                    }

                    int StartCount = 0;
                    int EndCount = 0;

                    if (newgroupid > 0)
                    {
                        using (var objDLs = DLCustomEvents.GetDLCustomEvents(ViewCustomEventDataDto.accountId, SQLProvider)) 
                        {
                            await objDLs.SearchAndAddtoGroup(UserInfoUserId, UserGroupId, ViewCustomEventDataDto.customeventoverviewid, ViewCustomEventDataDto.customevents, newgroupid, FromDateTime, ToDateTime);
                        }
                    }
                }
            }

            ArrayList returnVals = new ArrayList() { returnVal, newgroupid };
            //return Json(returnVals, JsonRequestBehavior.AllowGet);
            return Json(new
            {
                returnVals
            });

        }
        public async Task<JsonResult> MasterFilterEventsReportData([FromBody] ViewCustomEventData_MasterFilterEventsReportDataDto ViewCustomEventDataDto)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(ViewCustomEventDataDto.fromDateTime))
                FromDateTime = DateTime.ParseExact(ViewCustomEventDataDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(ViewCustomEventDataDto.toDateTime))
                ToDateTime = DateTime.ParseExact(ViewCustomEventDataDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<Customevents> CustomEventsCartDetails = null;
            Contact contact = new Contact();
            string machineid = "";
            using (var objDL = DLCustomEvents.GetDLCustomEvents(ViewCustomEventDataDto.accountId, SQLProvider))
            {
                CustomEventsCartDetails =(await objDL.GetEventsReportData(FromDateTime, ToDateTime, ViewCustomEventDataDto.customeventoverviewid, 0, ViewCustomEventDataDto.OffSet, ViewCustomEventDataDto.FetchNext, contact, machineid, ViewCustomEventDataDto.customevents)).ToList();
            }

            return Json(CustomEventsCartDetails );
        }

        public async Task<ActionResult>  ExportCustomViewReport([FromBody] ViewCustomEventData_ExportCustomViewReportDto ViewCustomEventDataDto)
        {
            ExportViewEventsData exporttoexceldetails = new ExportViewEventsData(ViewCustomEventDataDto.AccountId,SQLProvider);
            DateTime FromDateTimes = DateTime.ParseExact(ViewCustomEventDataDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(ViewCustomEventDataDto.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int customEventOverViewId = Convert.ToInt32(HttpContext.Session.GetString("CustomEventOverViewId")); 
            string customEventMachineID = Convert.ToString(HttpContext.Session.GetString("CustomEventMachineID"));
            Customevents customevents = new Customevents();
            Contact contact = new Contact();

            if (HttpContext.Session.GetString("ContactDetails") != null)
            {
                ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("ContactDetails"));
                contact = JsonConvert.DeserializeObject<Contact>(data[0].ToString());
                 
            }
            if (HttpContext.Session.GetString("customeventdetails") != null) 
            {
                ArrayList extradata = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("customeventdetails"));
                customevents = JsonConvert.DeserializeObject<Customevents>(extradata[0].ToString());
                 
            }
           await  exporttoexceldetails.ExportCustomised(customEventOverViewId, FromDateTimes, ToDateTime, 0, ViewCustomEventDataDto.OffSet, ViewCustomEventDataDto.FetchNext, ViewCustomEventDataDto.FileType, contact, customEventMachineID, customevents, "CustomEvents");


            return Json(new { Status = true, exporttoexceldetails.MainPath } );
        }
        public async Task<JsonResult> GetEventsDetails([FromBody] ViewCustomEventData_GetEventsDetailsDto ViewCustomEventDataDto)
        {
            Customevents customevent = new Customevents() { Id = ViewCustomEventDataDto.id };
            Contact contact = new Contact();
            DateTime FromDateTime = DateTime.ParseExact(ViewCustomEventDataDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(ViewCustomEventDataDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<Customevents> CustomEventsCartDetails = null;
            string machineid = "";
            using (var objDL = DLCustomEvents.GetDLCustomEvents(ViewCustomEventDataDto.accountId, SQLProvider))
            {
                CustomEventsCartDetails = (await objDL.GetEventsReportData(FromDateTime, ToDateTime, ViewCustomEventDataDto.customeventoverviewid, ViewCustomEventDataDto.ContactId, ViewCustomEventDataDto.OffSet, ViewCustomEventDataDto.FetchNext, contact, machineid, customevent)).ToList();
            }
            return Json(CustomEventsCartDetails);
        }
        public async Task<JsonResult> UCPGetEventsReportData([FromBody] ViewCustomEventData_UCPGetEventsReportDataDto ViewCustomEventDataDto)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            FromDateTime = DateTime.ParseExact(ViewCustomEventDataDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            ToDateTime = DateTime.ParseExact(ViewCustomEventDataDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<Customevents> CustomEventsCartDetails = null;

            using (var objDL = DLCustomEvents.GetDLCustomEvents(ViewCustomEventDataDto.accountId, SQLProvider))
            {
                CustomEventsCartDetails =(await  objDL.UCPGetEventsReportData(FromDateTime, ToDateTime, ViewCustomEventDataDto.customeventoverviewid, ViewCustomEventDataDto.ContactId, ViewCustomEventDataDto.OffSet, ViewCustomEventDataDto.FetchNext, ViewCustomEventDataDto.contact, ViewCustomEventDataDto.machineid, ViewCustomEventDataDto.customevents)).ToList();
            }

            return Json(CustomEventsCartDetails);
        }
        public async Task<JsonResult> UCPGetEventnames([FromBody] ViewCustomEventData_UCPGetEventnamesDto ViewCustomEventDataDto)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(ViewCustomEventDataDto.fromDateTime))
                FromDateTime = DateTime.ParseExact(ViewCustomEventDataDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(ViewCustomEventDataDto.toDateTime))
                ToDateTime = DateTime.ParseExact(ViewCustomEventDataDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<Customevents> CustomEventsCartDetails = null;
            HttpContext.Session.SetString("CustomEventName", JsonConvert.SerializeObject(ViewCustomEventDataDto.CustomEventName));
            using (var objDL = DLCustomEvents.GetDLCustomEvents(ViewCustomEventDataDto.accountId, SQLProvider))
            {
                CustomEventsCartDetails = (await objDL.UCPGetEventsName(FromDateTime, ToDateTime, ViewCustomEventDataDto.customeventoverviewid, ViewCustomEventDataDto.ContactID, ViewCustomEventDataDto.CustomEventName, ViewCustomEventDataDto.OffSet, ViewCustomEventDataDto.FetchNext, ViewCustomEventDataDto.machineid)).ToList();
            }

            return Json(CustomEventsCartDetails );
        }
        public async Task<JsonResult> GetEventExtraFieldData([FromBody] ViewCustomEventData_GetEventExtraFieldDataDto ViewCustomEventDataDto)
        {
            Nullable<DateTime> FromDateTime = null;
            Nullable<DateTime> ToDateTime = null;
            if (!string.IsNullOrEmpty(ViewCustomEventDataDto.fromDateTime))
                FromDateTime = DateTime.ParseExact(ViewCustomEventDataDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(ViewCustomEventDataDto.toDateTime))
                ToDateTime = DateTime.ParseExact(ViewCustomEventDataDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<CustomEventExtraField> CustomExtraFieldDetails = null;
            List<CustomEventExtraField> _CustomExtraFieldDetails = new List<CustomEventExtraField>();

            using ( var objDL =   DLCustomEventExtraField.GetDLCustomEventExtraField(ViewCustomEventDataDto.accountId,SQLProvider))
            {
                CustomExtraFieldDetails = (await objDL.GetCustomEventExtraField(ViewCustomEventDataDto.customEventOverViewId, FromDateTime, ToDateTime, ViewCustomEventDataDto.contactid)).ToList();
            }

            return Json(CustomExtraFieldDetails );
        }

    }
}
