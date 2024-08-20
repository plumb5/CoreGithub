using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class LeadPropertiesController : BaseController
    {
        public LeadPropertiesController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Prospect/LeadProperties/

        public IActionResult Index()
        {
            return View("LeadProperties");
        }

        public async Task<JsonResult> GetPropertySetting([FromBody] LeadProperties_GetPropertySettingDto LeadPropertiesDto)
        {
            List<MLContactFieldEditSetting> ContactFieldSettingList;
            using (var objDL =   DLContactFieldEditSetting.GetDLContactFieldEditSetting(LeadPropertiesDto.AccountId, SQLProvider))
            {
                ContactFieldSettingList = (await objDL.GetFullList()).ToList();
            }

            return Json(ContactFieldSettingList);
        }

        public async Task<JsonResult> GetAllProperty([FromBody] LeadProperties_GetAllPropertyDto LeadPropertiesDto)
        {
            List<ContactFieldProperty> ContactFieldPropertyList;
            using (var objDL =   DLContactFieldProperty.GetDLContactFieldProperty(LeadPropertiesDto.AccountId, SQLProvider))
            {
                ContactFieldPropertyList = (await objDL.GetAll());
            }

            return Json(ContactFieldPropertyList);
        }

        public async Task<JsonResult> GetSelectedContactField([FromBody] LeadProperties_GetSelectedContactFieldDto LeadPropertiesDto)
        {
            List<ContactFieldProperty> ContactFieldPropertyList;
            using (var objDL = DLContactFieldProperty.GetDLContactFieldProperty(LeadPropertiesDto.AccountId, SQLProvider))
            {
                ContactFieldPropertyList = (await objDL.GetSelectedContactField()).ToList();
            }

            return Json(ContactFieldPropertyList);
        }

        [Log]
        public async Task<JsonResult> SaveSettingProperty([FromBody] LeadProperties_SaveSettingPropertyDto LeadPropertiesDto)
        {
            using (var objDL = DLContactFieldEditSetting.GetDLContactFieldEditSetting(LeadPropertiesDto.AccountId, SQLProvider))
            {
                if (LeadPropertiesDto.SettingList != null && LeadPropertiesDto.SettingList.Count > 0)
                {
                    for (int i = 0; i < LeadPropertiesDto.SettingList.Count; i++)
                    {
                        await objDL.SaveProperty(LeadPropertiesDto.SettingList[i]);
                    }
                }

                if (LeadPropertiesDto.DeleteIdList != null && LeadPropertiesDto.DeleteIdList.Count > 0)
                {
                    for (int j = 0; j < LeadPropertiesDto.DeleteIdList.Count; j++)
                    {
                        await objDL.DeleteProperty(LeadPropertiesDto.DeleteIdList[j]);
                    }
                }
            }

            return Json(true);
        }

        [Log]
        public async Task<JsonResult> UpdateDisplayOrder([FromBody] LeadProperties_UpdateDisplayOrderDto LeadPropertiesDto)
        {
            if (LeadPropertiesDto.SettingList != null && LeadPropertiesDto.SettingList.Count > 0)
            {
                using (var objDL = DLContactFieldEditSetting.GetDLContactFieldEditSetting(LeadPropertiesDto.AccountId, SQLProvider)) 
                {
                    for (int i = 0; i < LeadPropertiesDto.SettingList.Count; i++)
                    {
                        await objDL.UpdateDisplayOrder(LeadPropertiesDto.SettingList[i]);
                    }
                }
            }

            return Json(true);
        }
        public async Task<JsonResult> SaveupdateLmsheaderflag([FromBody] LeadProperties_SaveupdateLmsheaderflagDto LeadPropertiesDto)
        {
            using (var objDL = DLContactFieldEditSetting.GetDLContactFieldEditSetting(LeadPropertiesDto.AccountId, SQLProvider)) 
            {

               await objDL.SaveupdateLmsheaderflag(LeadPropertiesDto.headerflag); 

            }
            return Json(true);
        }
        public async Task<JsonResult> GetLMSHeaderFlag([FromBody] LeadProperties_GetLMSHeaderFlagDto LeadPropertiesDto)
        {
            using (var objLmsLeads =   DLLmsCustomReport.GetDLLmsCustomReport(LeadPropertiesDto.AccountId,SQLProvider))
            {
                return Json(await objLmsLeads.Getheaderflag());
            }
        }

        [Log]
        public async Task<JsonResult> UpdateIsSearchByColumn([FromBody] LeadProperties_UpdateIsSearchByColumnDto LeadPropertiesDto)
        {
            bool IsResult = false;
            using (var objDL = DLContactFieldEditSetting.GetDLContactFieldEditSetting(LeadPropertiesDto.AccountId, SQLProvider))
                IsResult = await objDL.UpdateProperty(LeadPropertiesDto.c);
            return Json(IsResult);
        }

        [Log]
        public async Task<JsonResult> UpdateIsPublisherField([FromBody] LeadProperties_UpdateIsPublisherFieldDto LeadPropertiesDto)
        {
            bool IsResult = false;
            using (var objDL = DLContactFieldEditSetting.GetDLContactFieldEditSetting(LeadPropertiesDto.AccountId, SQLProvider))
                IsResult = await objDL.UpdatePublisherField(LeadPropertiesDto.c);
            return Json(IsResult);
        }

        public async Task<JsonResult> GetMasterFilterColumns([FromBody] LeadProperties_GetMasterFilterColumnsDto LeadPropertiesDto)
        {
            List<ContactFieldProperty> ContactFieldPropertyList;
            using (var objDL = DLContactFieldProperty.GetDLContactFieldProperty(LeadPropertiesDto.AccountId,SQLProvider))
            {
                ContactFieldPropertyList =await  objDL.GetMasterFilterColumns();
            }

            return Json(ContactFieldPropertyList);
        }
    }
}
