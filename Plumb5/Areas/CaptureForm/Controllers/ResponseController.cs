using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using System.Data;
using Plumb5GenralFunction;
using NPOI.SS.Formula.Functions;
using System.Globalization;
using System.Collections;
using System.Reflection;
using System.Text;
using Plumb5.Areas.CaptureForm.Dto;
using Org.BouncyCastle.Asn1.Ocsp;
using Plumb5.Areas.CaptureForm.Models;


namespace Plumb5.Areas.CaptureForm.Controllers
{
    [Area("CaptureForm")]
    public class ResponseController : BaseController
    {
        public ResponseController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /CaptureForm/Response/

        public IActionResult EmbeddedForms()
        {
            return View("EmbeddedForms");
        }

        public IActionResult PopUpForms()
        {
            return View("PopUpForms");
        }

        public IActionResult TaggedForms()
        {
            return View("TaggedForms");
        }

        public async Task<ActionResult> GetFormMaxCount([FromBody] Response_GetFormMaxCountDto Responsedto)
        {
            DateTime FromDateTime = DateTime.ParseExact(Responsedto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(Responsedto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            FormDetails formDetails = new FormDetails() { EmbeddedFormOrPopUpFormOrTaggedForm = Responsedto.EmbeddedFormOrPopUpFormOrTaggedForm };
            using (var objDl = DLFormDetails.GetDLFormDetails(Responsedto.AdsId, SQLProvider))
            {
                return Json(await objDl.GetMaxCount(formDetails, FromDateTime, ToDateTime));

            }
        }

        public async Task<JsonResult> GetFormFields([FromBody] Response_GetFormFieldsDto Responsedto)
        {
            List<FormFields> allFields = new List<FormFields>();
            //DomainInfo account = (DomainInfo)Session["AccountInfo"];
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            ArrayList allFormField = new ArrayList();

            FormDetails formDetail = new FormDetails();
            formDetail.UserInfoUserId = user.UserId;
            List<string> fields = new List<string>() { "Id" };

            using (var objDLform = DLFormDetails.GetDLFormDetails(Responsedto.AdsId, SQLProvider))
            {
                List<FormDetails> formsList = await objDLform.GET(formDetail, -1, -1, null, fields, false, UserInfoUserIdList, user.IsSuperAdmin);
                using (var objDL = DLFormFields.GetDLFormFields(Responsedto.AdsId, SQLProvider))
                {
                    for (int i = 0; i < formsList.Count; i++)
                    {
                        List<FormFields> formFields = (await objDL.GET(formsList[i].Id)).ToList();
                        allFormField.Add(formFields);
                    }
                }
                return Json(allFormField);
            }

        }


        public async Task<ActionResult> GetMaxCount([FromBody] Response_GetMaxCountDto Responsedto)
        {
            DateTime FromDateTime = DateTime.ParseExact(Responsedto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(Responsedto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            //DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            int maxCount;
            using (var objDL = DLFormResponses.GetDLFormResponses(Responsedto.AdsId, SQLProvider))
            {
                maxCount = await objDL.MaxCount(FromDateTime, ToDateTime, Responsedto.EmbeddedFormOrPopUpFormOrTaggedForm, user.UserId, UserInfoUserIdList, user.IsSuperAdmin, Responsedto.VisitorType);

            }

            return Json(maxCount);
        }

        public async Task<ActionResult> GetResponses([FromBody] Response_GetResponsesDto Responsedto)
        {
            //DomainInfo domainDetails = (DomainInfo)Session["AccountInfo"];
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;

            ArrayList data = new ArrayList() { Responsedto.FormId, Responsedto.fromDateTime, Responsedto.toDateTime, Responsedto.EmbeddedFormOrPopUpFormOrTaggedForm, Responsedto.VisitorType };

            HttpContext.Session.SetString("ResponseDetails", JsonConvert.SerializeObject(data));
            DateTime FromDateTime = DateTime.ParseExact(Responsedto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(Responsedto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<MLFormResponseWithFormDetails> listOfData = new List<MLFormResponseWithFormDetails>();
            using (var objDL = DLFormResponses.GetDLFormResponses(Responsedto.AdsId, SQLProvider))
            {
                listOfData = (await objDL.FormResponseDetails(Responsedto.FormId, Responsedto.OffSet, Responsedto.FetchNext, FromDateTime, ToDateTime, Responsedto.EmbeddedFormOrPopUpFormOrTaggedForm, user.UserId, UserInfoUserIdList, user.IsSuperAdmin, Responsedto.VisitorType)).ToList();

            }


            try
            {
                if (listOfData != null && listOfData.Count() > 0)
                {
                    for (int i = 0; i < listOfData.Count(); i++)
                    {
                        if (listOfData[i].EmailId != null && listOfData[i].EmailId != "" && listOfData[i].EmailId.Length > 0)
                            listOfData[i].EmailId = Helper.MaskEmailAddress(listOfData[i].EmailId);

                        if (listOfData[i].FormType == 12)
                        {
                            using (var obj = DLFormFields.GetDLFormFields(Responsedto.AdsId, SQLProvider))
                            {
                                List<FormFields> fieldList = (await obj.GET(listOfData[i].FormId)).ToList();
                                int EmailIdFieldIndex = -1, PhoneNumberFieldIndex = -1;

                                if (fieldList != null && fieldList.Count() > 0)
                                {
                                    if (fieldList.Any(x => x.FieldType == 2))
                                        EmailIdFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 2).index;
                                    if (fieldList.Any(x => x.FieldType == 3))
                                        PhoneNumberFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 3).index;

                                    if (EmailIdFieldIndex > -1)
                                    {
                                        if (listOfData[i].GetType().GetProperty("Field" + (EmailIdFieldIndex + 1) + "").GetValue(listOfData[i], null) != null)
                                        {
                                            PropertyInfo prop = listOfData[i].GetType().GetProperty("Field" + (EmailIdFieldIndex + 1) + "");
                                            prop.SetValue(listOfData[i], Helper.MaskEmailAddress(prop.GetValue(listOfData[i], null).ToString()), null);
                                        }
                                    }

                                    if (PhoneNumberFieldIndex > -1)
                                    {
                                        if (listOfData[i].GetType().GetProperty("Field" + (PhoneNumberFieldIndex + 1) + "").GetValue(listOfData[i], null) != null)
                                        {
                                            PropertyInfo prop = listOfData[i].GetType().GetProperty("Field" + (PhoneNumberFieldIndex + 1) + "");
                                            prop.SetValue(listOfData[i], Helper.MaskPhoneNumber(prop.GetValue(listOfData[i], null).ToString()), null);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch
            {
                //
            }
            return Json(listOfData);
        }

        public async Task<JsonResult> GetPollResponseData([FromBody] Response_GetPollResponseDataDto Responsedto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            DateTime FromDateTime = DateTime.ParseExact(Responsedto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(Responsedto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<FormResponses> listOfData = new List<FormResponses>();
            List<string> answerdata = new List<string>();

            FormResponses FormResp = new FormResponses();
            FormResp.FormId = Responsedto.FormId;
            FormResp.UserInfoUserId = user.UserId;
            using (var objDL = DLFormResponses.GetDLFormResponses(domainDetails.AdsId, SQLProvider))
            {
                listOfData = (await objDL.GetDetails(FormResp, Responsedto.OffSet, Responsedto.FetchNext, FromDateTime, ToDateTime, null, UserInfoUserIdList, user.IsSuperAdmin)).ToList();

            }
            answerdata = listOfData.SelectMany(x => x.Field1.Split('|').ToList()).ToList();
            answerdata = answerdata.Select(p => p.Trim()).ToList();

            return Json(answerdata);
        }

        public async Task<JsonResult> GetCustomMaxCount([FromBody] Response_GetCustomMaxCountDto Responsedto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            Responsedto.formResponses.UserInfoUserId = user.UserId;
            int Count = 0;
            using (var objDL = DLFormResponses.GetDLFormResponses(domainDetails.AdsId, SQLProvider))
            {
                Count = await objDL.GetCustomMaxCount(Responsedto.formResponses, Responsedto.FromDate, Responsedto.ToDate, Responsedto.EmbeddedFormOrPopUpFormOrTaggedForm, UserInfoUserIdList, user.IsSuperAdmin);
            }
            return Json(Count);
        }

        public async Task<ActionResult> GetCustomResponses([FromBody] Response_GetCustomResponsesDto Responsedto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            ArrayList data = new ArrayList() { Responsedto.formResponses, Responsedto.FromDate, Responsedto.ToDate, Responsedto.EmbeddedFormOrPopUpFormOrTaggedForm };

            HttpContext.Session.SetString("FormCustomResponses", JsonConvert.SerializeObject(data));
            List<MLFormResponseWithFormDetails> listOfData = new List<MLFormResponseWithFormDetails>();

            using (var objDL = DLFormResponses.GetDLFormResponses(domainDetails.AdsId, SQLProvider))
            {
                listOfData = (await objDL.GetCustomResponses(Responsedto.formResponses, Responsedto.OffSet, Responsedto.FetchNext, Responsedto.FromDate, Responsedto.ToDate, Responsedto.EmbeddedFormOrPopUpFormOrTaggedForm, UserInfoUserIdList, user.IsSuperAdmin)).ToList().OrderByDescending(x => x.TrackDate).ToList();
            }
            try
            {
                if (listOfData != null && listOfData.Count() > 0)
                {
                    for (int i = 0; i < listOfData.Count(); i++)
                    {
                        if (listOfData[i].EmailId != null && listOfData[i].EmailId != "" && listOfData[i].EmailId.Length > 0)
                            listOfData[i].EmailId = Helper.MaskEmailAddress(listOfData[i].EmailId);

                        using (var obj = DLFormFields.GetDLFormFields(domainDetails.AdsId, SQLProvider))
                        {
                            List<FormFields> fieldList = (await obj.GET(listOfData[i].FormId)).ToList();

                            int NameIdFieldIndex = -1, EmailIdFieldIndex = -1, PhoneNumberFieldIndex = -1;

                            if (fieldList != null && fieldList.Count() > 0)
                            {
                                if (fieldList.Any(x => x.FieldType == 1))
                                    NameIdFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 1).index;
                                if (fieldList.Any(x => x.FieldType == 2))
                                    EmailIdFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 2).index;
                                if (fieldList.Any(x => x.FieldType == 3))
                                    PhoneNumberFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 3).index;

                                if (NameIdFieldIndex > -1)
                                {
                                    if (listOfData[i].GetType().GetProperty("Field" + (NameIdFieldIndex + 1) + "").GetValue(listOfData[i], null) != null)
                                    {
                                        PropertyInfo prop = listOfData[i].GetType().GetProperty("Field" + (NameIdFieldIndex + 1) + "");
                                        prop.SetValue(listOfData[i], Helper.MaskName(prop.GetValue(listOfData[i], null).ToString()), null);
                                    }
                                }

                                if (EmailIdFieldIndex > -1)
                                {
                                    if (listOfData[i].GetType().GetProperty("Field" + (EmailIdFieldIndex + 1) + "").GetValue(listOfData[i], null) != null)
                                    {
                                        PropertyInfo prop = listOfData[i].GetType().GetProperty("Field" + (EmailIdFieldIndex + 1) + "");
                                        prop.SetValue(listOfData[i], Helper.MaskEmailAddress(prop.GetValue(listOfData[i], null).ToString()), null);
                                    }
                                }

                                if (PhoneNumberFieldIndex > -1)
                                {
                                    if (listOfData[i].GetType().GetProperty("Field" + (PhoneNumberFieldIndex + 1) + "").GetValue(listOfData[i], null) != null)
                                    {
                                        PropertyInfo prop = listOfData[i].GetType().GetProperty("Field" + (PhoneNumberFieldIndex + 1) + "");
                                        prop.SetValue(listOfData[i], Helper.MaskPhoneNumber(prop.GetValue(listOfData[i], null).ToString()), null);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch
            {
                //
            }

            return Json(listOfData);
        }

        [Log]
        public async Task<JsonResult> Update([FromBody] Response_UpdateDto Responsedto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            //#region Logs            
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(AdsId, user.UserId, user.UserName, user.EmailId, "Response", "CaptureForm", "Update", Helper.GetIP(), JsonConvert.SerializeObject(new { Id = Id }));
            //#endregion
            using (var objDL = DLFormResponses.GetDLFormResponses(Responsedto.AdsId, SQLProvider))
            {
                bool status = await objDL.Update(Responsedto.Id);
                //if (status)
                //    LogMessage = "The response details has been updated";
                //else
                //    LogMessage = "Unable to update a response details ";
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { status = status }), LogMessage);
                return Json(status);
            }


        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] Response_ExportDto Responsedto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                List<MLFormResponseWithFormDetails> listOfData = new List<MLFormResponseWithFormDetails>();
                MLGeneralFormFilter formFilterDetails = new MLGeneralFormFilter();
                if (HttpContext.Session.GetString("ResponseDetails") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("ResponseDetails"));
                    formFilterDetails.FormId = Convert.ToInt32(data[0]);
                    formFilterDetails.FromDate = DateTime.ParseExact((string?)data[1], "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    formFilterDetails.ToDate = DateTime.ParseExact((string?)data[2], "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    formFilterDetails.EmbeddedFormOrPopUpFormOrTaggedForm = (string?)data[3];
                    formFilterDetails.VisitorType = Convert.ToInt32(data[4]);
                }

                using (var objDL = DLFormResponses.GetDLFormResponses(domainDetails.AdsId, SQLProvider))
                {
                    listOfData = (await objDL.FormResponseDetails(formFilterDetails.FormId, Responsedto.OffSet, Responsedto.FetchNext, formFilterDetails.FromDate, formFilterDetails.ToDate, formFilterDetails.EmbeddedFormOrPopUpFormOrTaggedForm, 0, null, null, formFilterDetails.VisitorType)).ToList();
                }

                ExportToExcelCustomised exporttoexceldetails = new ExportToExcelCustomised(domainDetails.AdsId, SQLProvider);
                exporttoexceldetails.ExportCustomised(listOfData, Responsedto.FileType);

                return Json(new { Status = true, exporttoexceldetails.MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> FormResponseExport([FromBody] Response_FormResponseExportDto Responsedto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                FormResponses formResponses = new FormResponses();
                List<MLFormResponseWithFormDetails> listOfData = new List<MLFormResponseWithFormDetails>();

                string FromDate = "", ToDate = "", EmbeddedFormOrPopUpFormOrTaggedForm = String.Empty;
                if (HttpContext.Session.GetString("FormCustomResponses") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("FormCustomResponses"));
                    formResponses = JsonConvert.DeserializeObject<FormResponses>(data[0].ToString());
                    //formResponses = (FormResponses)data[0];
                    FromDate = (string?)data[1];
                    ToDate = (string?)data[2];
                    EmbeddedFormOrPopUpFormOrTaggedForm = data[3].ToString();
                }

                using (var objDL = DLFormResponses.GetDLFormResponses(domainDetails.AdsId, SQLProvider))
                {
                    listOfData = (await objDL.GetCustomResponses(formResponses, Responsedto.OffSet, Responsedto.FetchNext, FromDate, ToDate, EmbeddedFormOrPopUpFormOrTaggedForm)).ToList();
                }

                try
                {
                    if (listOfData != null && listOfData.Count() > 0)
                    {
                        for (int i = 0; i < listOfData.Count(); i++)
                        {
                            if (listOfData[i].EmailId != null && listOfData[i].EmailId != "" && listOfData[i].EmailId.Length > 0)
                                listOfData[i].EmailId = Helper.MaskEmailAddress(listOfData[i].EmailId);
                            using (var obj = DLFormFields.GetDLFormFields(domainDetails.AdsId, SQLProvider))
                            {
                                List<FormFields> fieldList = (await obj.GET(listOfData[i].FormId)).ToList();

                                int NameIdFieldIndex = -1, EmailIdFieldIndex = -1, PhoneNumberFieldIndex = -1;

                                if (fieldList != null && fieldList.Count() > 0)
                                {
                                    if (fieldList.Any(x => x.FieldType == 1))
                                        NameIdFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 1).index;
                                    if (fieldList.Any(x => x.FieldType == 2))
                                        EmailIdFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 2).index;
                                    if (fieldList.Any(x => x.FieldType == 3))
                                        PhoneNumberFieldIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 3).index;

                                    if (NameIdFieldIndex > -1)
                                    {
                                        if (listOfData[i].GetType().GetProperty("Field" + (NameIdFieldIndex + 1) + "").GetValue(listOfData[i], null) != null)
                                        {
                                            PropertyInfo prop = listOfData[i].GetType().GetProperty("Field" + (NameIdFieldIndex + 1) + "");
                                            prop.SetValue(listOfData[i], Helper.MaskName(prop.GetValue(listOfData[i], null).ToString()), null);
                                        }
                                    }

                                    if (EmailIdFieldIndex > -1)
                                    {
                                        if (listOfData[i].GetType().GetProperty("Field" + (EmailIdFieldIndex + 1) + "").GetValue(listOfData[i], null) != null)
                                        {
                                            PropertyInfo prop = listOfData[i].GetType().GetProperty("Field" + (EmailIdFieldIndex + 1) + "");
                                            prop.SetValue(listOfData[i], Helper.MaskEmailAddress(prop.GetValue(listOfData[i], null).ToString()), null);
                                        }
                                    }

                                    if (PhoneNumberFieldIndex > -1)
                                    {
                                        if (listOfData[i].GetType().GetProperty("Field" + (PhoneNumberFieldIndex + 1) + "").GetValue(listOfData[i], null) != null)
                                        {
                                            PropertyInfo prop = listOfData[i].GetType().GetProperty("Field" + (PhoneNumberFieldIndex + 1) + "");
                                            prop.SetValue(listOfData[i], Helper.MaskPhoneNumber(prop.GetValue(listOfData[i], null).ToString()), null);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                catch
                {
                    //
                }


                ExportToExcelCustomised exporttoexceldetails = new ExportToExcelCustomised(domainDetails.AdsId, SQLProvider);
                exporttoexceldetails.ExportCustomised(listOfData, Responsedto.FileType);

                return Json(new { Status = true, MainPath = exporttoexceldetails.MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> FormResponseAllExport([FromBody] Response_FormResponseAllExportDto Responsedto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                FormResponses formResponses = new FormResponses();
                List<MLFormResponseWithFormDetails> listOfData = new List<MLFormResponseWithFormDetails>();

                string FromDate = "", ToDate = "", EmbeddedFormOrPopUpFormOrTaggedForm = String.Empty;
                if (HttpContext.Session.GetString("FormCustomResponses") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("FormCustomResponses"));
                    formResponses = JsonConvert.DeserializeObject<FormResponses>(data[0].ToString());
                    //formResponses = (FormResponses)data[0];
                    FromDate = (string?)data[1];
                    ToDate = (string?)data[2];
                    EmbeddedFormOrPopUpFormOrTaggedForm = null;
                }

                using (var objDL = DLFormResponses.GetDLFormResponses(domainDetails.AdsId, SQLProvider))
                {
                    listOfData = (await objDL.GetCustomResponses(formResponses, Responsedto.OffSet, Responsedto.FetchNext, FromDate, ToDate, EmbeddedFormOrPopUpFormOrTaggedForm)).ToList();
                }

                ExportToExcelCustomised exporttoexceldetails = new ExportToExcelCustomised(domainDetails.AdsId, SQLProvider);
                exporttoexceldetails.ExportCustomised(listOfData, Responsedto.FileType);

                return Json(new { Status = true, exporttoexceldetails.MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> FormReportExport([FromBody] Response_FormReportExportDto Responsedto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                // Create a DataSet and put both tables in it.
                DataSet dataSet = new DataSet("General");
                List<MLFormDashboard> listOfData = new List<MLFormDashboard>();

                string fromDateTime = "", toDateTime = "", EmbeddedFormOrPopUpFormOrTaggedForm = String.Empty;
                int FormId = 0;
                if (HttpContext.Session.GetString("GetFormByReport") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("GetFormByReport"));
                    fromDateTime = (string?)data[0];
                    toDateTime = (string?)data[1];
                    EmbeddedFormOrPopUpFormOrTaggedForm = data[2].ToString();
                    FormId = Convert.ToInt32(data[3]);
                }

                DateTime FromDateTime = DateTime.ParseExact(fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDateTime = DateTime.ParseExact(toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                using (var objDL = DLFormDashboard.GetDLFormDashboard(domainDetails.AdsId, SQLProvider))
                {
                    listOfData = (await objDL.GetFormByReport(Responsedto.OffSet, Responsedto.FetchNext, FromDateTime, ToDateTime, EmbeddedFormOrPopUpFormOrTaggedForm, FormId)).ToList();
                }

                var NewListData = listOfData.Select(x => new
                {
                    x.FormName,
                    Impressions = x.ViewedCount,
                    Responses = x.ResponseCount,
                    Closed = x.ClosedCount,
                    ConversionRate = x.ViewedCount > 0 ? Math.Round(Convert.ToDecimal((x.ResponseCount / x.ViewedCount) * 100)) : 0,
                    x.CreatedDate
                });
                DataTable dtt = new DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "FormReport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + Responsedto.FileType;
                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (Responsedto.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }
    }
}
