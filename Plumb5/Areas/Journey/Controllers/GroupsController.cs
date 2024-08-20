using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Journey.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Data;

namespace Plumb5.Areas.Journey.Controllers
{
    [Area("Journey")]
    public class GroupsController : BaseController
    {
        public GroupsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Journey/Groups/

        public ActionResult Index()
        {
            return View("Groups");
        }

        public ActionResult Contacts()
        {
            return View("Contact");
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] Group_GetMaxCount commonDetails)
        {
            using (var obj = DLWorkFlowGroup.GetDLWorkFlowGroup(commonDetails.accountId, SQLProvider))
            {
                return Json(await obj.GetMaxCount(commonDetails.groups));
            }
        }

        [HttpPost]
        public async Task<JsonResult> BindGroups([FromBody] Group_BindGroups commonDetails)
        {
            using (var obj = DLWorkFlowGroup.GetDLWorkFlowGroup(commonDetails.accountId, SQLProvider))
            {
                return Json(await obj.GetListDetails(commonDetails.groups, commonDetails.OffSet, commonDetails.FetchNext));
            }
        }

        [HttpPost]
        public async Task<JsonResult> MaxCount([FromBody] Group_MaxCount commonDetails)
        {
            using (var obj = DLWorkFlowGroup.GetDLWorkFlowGroup(commonDetails.accountId, SQLProvider))
            {
                int TotalVal = await obj.MaxCount(commonDetails.groupids, commonDetails.Isbelong);
                return Json(TotalVal);
            }
        }

        [HttpPost]
        public async Task<JsonResult> BindGropsDetails([FromBody] Group_BindGropsDetails commonDetails)
        {
            using (var obj = DLWorkFlowGroup.GetDLWorkFlowGroup(commonDetails.accountId, SQLProvider))
            {
                string getdata = null;
                DataSet datatable = await obj.GetGroupDetails(commonDetails.groupids, commonDetails.Offset, commonDetails.FetchNext, commonDetails.Isbelong, commonDetails.actiontype);
                if (datatable.Tables.Count > 0)
                {
                    getdata = JsonConvert.SerializeObject(datatable.Tables[0], Formatting.Indented);
                }
                return Json(getdata);
            }
        }

        [HttpPost]
        public async Task<JsonResult> BindContacts([FromBody] Group_BindContacts commonDetails)
        {
            List<Contact> contactList = new List<Contact>();
            using (var obj = DLContact.GetContactDetails(commonDetails.accountId, SQLProvider))
            {
                Contact contact = new Contact();
                contactList = (await obj.GET(contact, 0, 0, 0, 0, commonDetails.contacts, null)).ToList();

                foreach (var hist in contactList)
                {
                    hist.Name = !string.IsNullOrEmpty(hist.Name) ? Helper.MaskName(hist.Name) : hist.Name;
                    hist.EmailId = !string.IsNullOrEmpty(hist.EmailId) ? Helper.MaskEmailAddress(hist.EmailId) : hist.EmailId;
                    hist.PhoneNumber = !string.IsNullOrEmpty(hist.PhoneNumber) ? Helper.MaskPhoneNumber(hist.PhoneNumber) : hist.PhoneNumber;
                }

                return Json(contactList);
            }
        }

        [HttpPost]
        public async Task<JsonResult> BindGroupsContact([FromBody] Group_BindGroupsContact commonDetails)
        {
            List<MLWorkFlowContactGroup> contactList = new List<MLWorkFlowContactGroup>();

            if (commonDetails.GroupId > 0 && commonDetails.Action > 0)
            {
                using (var obj = DLWorkFlowGroup.GetDLWorkFlowGroup(commonDetails.accountId, SQLProvider))
                {
                    contactList = await obj.GetWorkFlowContactListDetails(commonDetails.GroupId, commonDetails.Action, commonDetails.OffSet, commonDetails.FetchNext);
                }
            }
            return Json(contactList);
        }

        [HttpPost]
        public async Task<JsonResult> GetContacts([FromBody] Group_GetContacts commonDetails)
        {
            Contact contact = new Contact();
            System.Collections.Generic.List<Contact> contactList = new System.Collections.Generic.List<Contact>();
            using (var obj = DLContact.GetContactDetails(commonDetails.accountId, SQLProvider))
            {
                contactList = (await obj.GET(contact, 0, 0, 0, 0, commonDetails.ContactIds)).ToList();

                foreach (var hist in contactList)
                {
                    hist.Name = !string.IsNullOrEmpty(hist.Name) ? Helper.MaskName(hist.Name) : hist.Name;
                    hist.EmailId = !string.IsNullOrEmpty(hist.EmailId) ? Helper.MaskEmailAddress(hist.EmailId) : hist.EmailId;
                    hist.PhoneNumber = !string.IsNullOrEmpty(hist.PhoneNumber) ? Helper.MaskPhoneNumber(hist.PhoneNumber) : hist.PhoneNumber;
                }
            }

            return Json(contactList);
        }

        [HttpPost]
        public async Task<JsonResult> GetContactMaxCount([FromBody] Group_GetContactMaxCount commonDetails)
        {

            int returnVal;
            using (var objDL = DLContact.GetContactDetails(commonDetails.accountId, SQLProvider))
            {
                returnVal = 0;//await objDL.MaxCount(commonDetails.contact, commonDetails.AgeRange1, commonDetails.AgeRange2, commonDetails.GroupId, commonDetails.DateRange1, commonDetails.DateRange2, commonDetails.GroupDate, commonDetails.IsSmsNAcheck);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<JsonResult> GetDetails([FromBody] Group_GetDetails commonDetails)
        {
            using (var objDL = DLContact.GetContactDetails(commonDetails.accountId, SQLProvider))
            {


                List<Contact> contactList = null;//await objDL.GetAllContact(commonDetails.contact, commonDetails.FetchNext, commonDetails.OffSet, commonDetails.AgeRange1, commonDetails.AgeRange2, commonDetails.GroupId, commonDetails.DateRange1, commonDetails.DateRange2, commonDetails.GroupDate, commonDetails.IsSmsNAcheck);

                contactList = (from item in contactList
                               let name = item.Name = !string.IsNullOrEmpty(item.Name) ? Helper.MaskName(item.Name) : item.Name
                               let email = item.EmailId = !string.IsNullOrEmpty(item.EmailId) ? Helper.MaskEmailAddress(item.EmailId) : item.EmailId
                               let phonenumber = item.PhoneNumber = !string.IsNullOrEmpty(item.PhoneNumber) ? Helper.MaskPhoneNumber(item.PhoneNumber) : item.PhoneNumber
                               let alternateemail = item.AlternateEmailIds = !string.IsNullOrEmpty(item.AlternateEmailIds) ? Helper.MaskEmailAddress(item.AlternateEmailIds) : item.AlternateEmailIds
                               let alternatephonenumber = item.AlternatePhoneNumbers = !string.IsNullOrEmpty(item.AlternatePhoneNumbers) ? Helper.MaskPhoneNumber(item.AlternatePhoneNumbers) : item.AlternatePhoneNumbers
                               select item).ToList();

                return Json(contactList);
            }
        }
    }
}
