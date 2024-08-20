 
using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction; 
using System.Text;  
using Newtonsoft.Json;
using Microsoft.Data.SqlClient;
using Plumb5.Areas.Mail.Dto;
 
namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class UpdateContactDetailsController : BaseController
    {
        public UpdateContactDetailsController(IConfiguration _configuration) : base(_configuration)
        { }

        public IActionResult Index()
        {
            return View("UpdateContactDetails");
        }
        [HttpPost]
        public async Task<JsonResult> GetContact([FromBody] UpdateContactDetails_GetContactDto UpdateContactDetailsDto)
        { 
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            using (var objDL =   DLContact.GetContactDetails(domainDetails.AdsId,SQLProvider))
            {
                Contact contact = await objDL.GetDetails(UpdateContactDetailsDto.contact);

                if (UpdateContactDetailsDto.contact != null)
                {
                    UpdateContactDetailsDto.contact.Name = !string.IsNullOrEmpty(UpdateContactDetailsDto.contact.Name) ? Helper.MaskName(UpdateContactDetailsDto.contact.Name) : UpdateContactDetailsDto.contact.Name;
                    UpdateContactDetailsDto.contact.EmailId = !string.IsNullOrEmpty(UpdateContactDetailsDto.contact.EmailId) ? Helper.MaskEmailAddress(UpdateContactDetailsDto.contact.EmailId) : UpdateContactDetailsDto.contact.EmailId;
                    UpdateContactDetailsDto.contact.PhoneNumber = !string.IsNullOrEmpty(UpdateContactDetailsDto.contact.PhoneNumber) ? Helper.MaskPhoneNumber(UpdateContactDetailsDto.contact.PhoneNumber) : UpdateContactDetailsDto.contact.PhoneNumber;
                    UpdateContactDetailsDto.contact.AlternateEmailIds = !string.IsNullOrEmpty(UpdateContactDetailsDto.contact.AlternateEmailIds) ? Helper.MaskEmailAddress(UpdateContactDetailsDto.contact.AlternateEmailIds) : UpdateContactDetailsDto.contact.AlternateEmailIds;
                    UpdateContactDetailsDto.contact.AlternatePhoneNumbers = !string.IsNullOrEmpty(UpdateContactDetailsDto.contact.AlternatePhoneNumbers) ? Helper.MaskPhoneNumber(UpdateContactDetailsDto.contact.AlternatePhoneNumbers) : UpdateContactDetailsDto.contact.AlternatePhoneNumbers;
                }

                return Json(UpdateContactDetailsDto.contact);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateContact([FromBody] ABTestingReport_UpdateContactDto UpdateContactDetailsDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs            
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "UpdateContactDetails", "Mail", "UpdateContact", Helper.GetIP(), JsonConvert.SerializeObject(new { contact = contact, answerList = answerList }));
            //#endregion

            UpdateContactDetailsDto.contact.UserInfoUserId = user.UserId;
            UpdateContactDetailsDto.contact.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            int Age = 0;
            if (!String.IsNullOrEmpty(UpdateContactDetailsDto.contact.AgeRange) && int.TryParse(UpdateContactDetailsDto.contact.AgeRange, out Age))
            {
                UpdateContactDetailsDto.contact.Age = DateTime.Now.AddYears(-Age);
            }

            //Here the below function need to update Lms custom fields...
            ManageCustomFields objcustfields = new ManageCustomFields(domainDetails.AdsId,SQLProvider);
            objcustfields.UpdateCustomFields(UpdateContactDetailsDto.answerList, "UpdateLmsCustomFields", UpdateContactDetailsDto.contact.ContactId);

            try
            {
                using (var objDL =   DLContact.GetContactDetails(domainDetails.AdsId,SQLProvider))
                {
                    bool result = await objDL.Update(UpdateContactDetailsDto.contact);
                    if (result)
                    {
                        //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = result, Error = "Contact updated." }), "The contact has been updated");
                        return Json(new { Result = result, Error = "Contact updated." } );

                    }
                    else
                    {
                        //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = result, Error = "Problem in updating" }), "Unable to update a contact");
                        return Json(new { Result = result, Error = "Problem in updating" } );
                    }

                }
            }
            catch (SqlException ex)
            {
                if (ex.ToString().ToLower().Contains("duplicate key value"))
                {
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = false, Error = "Contact already exists" }), "Unable to update a contact");
                    return Json(new { Result = false, Error = "Contact already exists" } );
                }
                else
                {
                    //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = false, Error = ex.ToString() }), "Unable to update a contact");
                    return Json(new { Result = false, Error = ex.ToString() } );
                }

            }
            catch (Exception ex)
            {
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { Result = false, Error = ex.ToString() }), "Unable to update a contact");
                return Json(new { Result = false, Error = ex.ToString() } );
            }
        }
    }
}
