using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CaptureForm.Dto;
using Plumb5.Areas.CaptureForm.Models;
using Plumb5.Controllers;

namespace Plumb5.Areas.CaptureForm.Controllers
{
    [Area("CaptureForm")]
    public class TaggedFormIntegrationController : BaseController
    {
        public TaggedFormIntegrationController(IConfiguration _configuration) : base(_configuration)
        { }
        [Log]
        [HttpPost]
        public async Task<FormScripts> SaveUpdateTaggedFormDetails([FromBody] TaggedFormIntegration_SaveUpdateTaggedFormDetailsDto objDto)
        {
            FormDetails formdetails = null;
            FormRules formrules = null;
            List<FormFields> formfields = null;
            FormResponseReportToSetting formresponseSettings = null;
            int FormId = 0;

            if (objDto.tagformdetails.formdetails.Id <= 0)
            {
                using (var objFormDetails = DLFormDetails.GetDLFormDetails(objDto.tagformdetails.AdsId,SQLProvider))
                {
                    formdetails = objDto.tagformdetails.formdetails;
                    formdetails.AppearOnLoadOnExitOnScroll = 0;
                    DateTime date = new DateTime();
                    var strYear = date.Month.ToString() + date.Day.ToString() + DateTime.Now.Millisecond.ToString();
                    formdetails.FormIdentifier = "Form Identifier-" + strYear;
                    formdetails.FormStatus = false;
                    formdetails.FormType = 1;
                    formdetails.OnPageOrInPage = false;
                    formdetails.EmbeddedFormOrPopUpFormOrTaggedForm = "TaggedForm";
                    FormId = await objFormDetails.Save(formdetails);
                }

                if (FormId > 0)
                {
                    objDto.tagformdetails.formscript.FormId = FormId;
                    objDto.tagformdetails.formscript.FormScript = objDto.tagformdetails.formscript.FormScript.Replace("<!--FormId-->", FormId.ToString());

                    using (var objFormRules = DLFormRules.GetDLFormRules(objDto.tagformdetails.AdsId,SQLProvider))
                    {
                        formrules = new FormRules() { FormId = FormId };
                        await objFormRules.Save(formrules);
                    }

                    using (var objDLResSetting = DLFormResponseReportToSetting.GetDLFormResponseReportToSetting(objDto.tagformdetails.AdsId,SQLProvider))
                    {
                        formresponseSettings = new FormResponseReportToSetting() { FormId = FormId };
                        await objDLResSetting.Save(formresponseSettings);
                    }

                    using (var objFormFields = DLFormFields.GetDLFormFields(objDto.tagformdetails.AdsId,SQLProvider))
                    {
                        formfields = objDto.tagformdetails.formfields;
                        if (formfields != null && formfields.Count > 0)
                        {
                            foreach (FormFields fieldDetails in formfields)
                            {
                                fieldDetails.FormId = FormId;
                                await objFormFields.Save(fieldDetails);
                            }
                        }
                    }

                    using (var objFormFieldsBindingDetails = DLFormFieldsBindingDetails.GetDLFormFieldsBindingDetails(objDto.tagformdetails.AdsId,SQLProvider))
                    {
                        FormFieldsBindingDetails fieldDetailsBindingDetails = new FormFieldsBindingDetails();
                        fieldDetailsBindingDetails.FormId = FormId;
                        fieldDetailsBindingDetails.FieldType = 25;
                        fieldDetailsBindingDetails.Name = "We are here to help you !";
                        fieldDetailsBindingDetails.Mandatory = false;
                        fieldDetailsBindingDetails.FieldShowOrHide = false;

                        await objFormFieldsBindingDetails.Save(fieldDetailsBindingDetails);

                        fieldDetailsBindingDetails = new FormFieldsBindingDetails();
                        fieldDetailsBindingDetails.FormId = FormId;
                        fieldDetailsBindingDetails.FieldType = 26;
                        fieldDetailsBindingDetails.Name = "Please leave your details !";
                        fieldDetailsBindingDetails.Mandatory = false;
                        fieldDetailsBindingDetails.FieldShowOrHide = false;

                        await objFormFieldsBindingDetails.Save(fieldDetailsBindingDetails);

                        int formfieldsBindingDetailsCount = objDto.tagformdetails.formfields.Count();

                        if (formfieldsBindingDetailsCount > 0)
                        {
                            for (int i = 0; i < formfieldsBindingDetailsCount; i++)
                            {
                                fieldDetailsBindingDetails = new FormFieldsBindingDetails();
                                fieldDetailsBindingDetails.FormId = FormId;
                                fieldDetailsBindingDetails.FieldType = objDto.tagformdetails.formfields[i].FieldType;
                                fieldDetailsBindingDetails.Name = objDto.tagformdetails.formfields[i].Name;
                                fieldDetailsBindingDetails.Mandatory = objDto.tagformdetails.formfields[i].Mandatory;
                                fieldDetailsBindingDetails.FieldShowOrHide = objDto.tagformdetails.formfields[i].FieldShowOrHide;
                                fieldDetailsBindingDetails.SubFields = objDto.tagformdetails.formfields[i].SubFields;
                                fieldDetailsBindingDetails.ContactMappingField = objDto.tagformdetails.formfields[i].ContactMappingField;
                                fieldDetailsBindingDetails.PhoneValidationType = objDto.tagformdetails.formfields[i].PhoneValidationType;
                                await objFormFieldsBindingDetails.Save(fieldDetailsBindingDetails);
                            }
                        }

                        fieldDetailsBindingDetails = new FormFieldsBindingDetails();
                        fieldDetailsBindingDetails.FormId = FormId;
                        fieldDetailsBindingDetails.FieldType = 24;
                        fieldDetailsBindingDetails.Name = "Submit";
                        fieldDetailsBindingDetails.Mandatory = false;
                        fieldDetailsBindingDetails.FieldShowOrHide = false;

                        await objFormFieldsBindingDetails.Save(fieldDetailsBindingDetails);
                    }
                }
            }
            else
            {
                //since they are re-configuring the tagged form so they might change the fields or field structure so we are deleting the fields and recreating it.
                Int16 DeleteFormId = (short)objDto.tagformdetails.formdetails.Id;
                using (var objFormFields = DLFormFields.GetDLFormFields(objDto.tagformdetails.AdsId,SQLProvider))
                {
                    await objFormFields.DeleteFields(DeleteFormId);
                }

                using (var objFormFieldsBindingDetails = DLFormFieldsBindingDetails.GetDLFormFieldsBindingDetails(objDto.tagformdetails.AdsId,SQLProvider))
                {
                    await objFormFieldsBindingDetails.DeleteFields(objDto.tagformdetails.formdetails.Id);
                }

                using (var objFormFields = DLFormFields.GetDLFormFields(objDto.tagformdetails.AdsId,SQLProvider))
                {
                    formfields = objDto.tagformdetails.formfields;
                    if (formfields != null && formfields.Count > 0)
                    {
                        foreach (FormFields fieldDetails in formfields)
                        {
                            fieldDetails.FormId = objDto.tagformdetails.formdetails.Id;
                            await objFormFields.Save(fieldDetails);
                        }
                    }
                }

                using (var objFormFieldsBindingDetails = DLFormFieldsBindingDetails.GetDLFormFieldsBindingDetails(objDto.tagformdetails.AdsId,SQLProvider))
                {
                    FormFieldsBindingDetails fieldDetailsBindingDetails = new FormFieldsBindingDetails();
                    fieldDetailsBindingDetails.FormId = objDto.tagformdetails.formdetails.Id;
                    fieldDetailsBindingDetails.FieldType = 25;
                    fieldDetailsBindingDetails.Name = "We are here to help you !";
                    fieldDetailsBindingDetails.Mandatory = false;
                    fieldDetailsBindingDetails.FieldShowOrHide = false;

                    await objFormFieldsBindingDetails.Save(fieldDetailsBindingDetails);

                    fieldDetailsBindingDetails = new FormFieldsBindingDetails();
                    fieldDetailsBindingDetails.FormId = objDto.tagformdetails.formdetails.Id;
                    fieldDetailsBindingDetails.FieldType = 26;
                    fieldDetailsBindingDetails.Name = "Please leave your details !";
                    fieldDetailsBindingDetails.Mandatory = false;
                    fieldDetailsBindingDetails.FieldShowOrHide = false;

                    await objFormFieldsBindingDetails.Save(fieldDetailsBindingDetails);

                    int formfieldsBindingDetailsCount = objDto.tagformdetails.formfields.Count();

                    if (formfieldsBindingDetailsCount > 0)
                    {
                        for (int i = 0; i < formfieldsBindingDetailsCount; i++)
                        {
                            fieldDetailsBindingDetails = new FormFieldsBindingDetails();
                            fieldDetailsBindingDetails.FormId = objDto.tagformdetails.formdetails.Id;
                            fieldDetailsBindingDetails.FieldType = objDto.tagformdetails.formfields[i].FieldType;
                            fieldDetailsBindingDetails.Name = objDto.tagformdetails.formfields[i].Name;
                            fieldDetailsBindingDetails.Mandatory = objDto.tagformdetails.formfields[i].Mandatory;
                            fieldDetailsBindingDetails.FieldShowOrHide = objDto.tagformdetails.formfields[i].FieldShowOrHide;
                            fieldDetailsBindingDetails.SubFields = objDto.tagformdetails.formfields[i].SubFields;
                            fieldDetailsBindingDetails.ContactMappingField = objDto.tagformdetails.formfields[i].ContactMappingField;
                            fieldDetailsBindingDetails.PhoneValidationType = objDto.tagformdetails.formfields[i].PhoneValidationType;
                            await objFormFieldsBindingDetails.Save(fieldDetailsBindingDetails);
                        }
                    }

                    fieldDetailsBindingDetails = new FormFieldsBindingDetails();
                    fieldDetailsBindingDetails.FormId = objDto.tagformdetails.formdetails.Id;
                    fieldDetailsBindingDetails.FieldType = 24;
                    fieldDetailsBindingDetails.Name = "Submit";
                    fieldDetailsBindingDetails.Mandatory = false;
                    fieldDetailsBindingDetails.FieldShowOrHide = false;

                    await objFormFieldsBindingDetails.Save(fieldDetailsBindingDetails);
                }
            }

            bool result = false;

            using (var objbFormScript = DLFormScripts.GetDLFormScripts(objDto.tagformdetails.AdsId,SQLProvider))
            {
                if (objDto.tagformdetails.formscript.Id <= 0)
                {
                    objDto.tagformdetails.formscript.Id = await objbFormScript.Save(objDto.tagformdetails.formscript);
                    result = objDto.tagformdetails.formscript.Id > 0 ? true : false;
                }
                else if (objDto.tagformdetails.formscript.Id > 0)
                {
                    result = await objbFormScript.Update(objDto.tagformdetails.formscript);
                }
            }
            return objDto.tagformdetails.formscript;
        }

        [Log]
        [HttpPost]
        public async Task<bool> DeleteField([FromBody] TaggedFormIntegration_DeleteFieldDto objDto)
        {
            var objField = DLFormFields.GetDLFormFields(objDto.AccountId, SQLProvider);
            bool status =  await objField.Delete(objDto.Id);

            return status;
        }

        [HttpPost]
        public async Task<List<ContactExtraField>> GetContactProperties([FromBody] TaggedFormIntegration_GetContactPropertiesDto objDto)
        {
            List<ContactExtraField> contactfieldslist = new List<ContactExtraField>();

            using (var objDL = DLContactExtraField.GetDLContactExtraField(objDto.accountId, SQLProvider))
            {
                contactfieldslist = await objDL.GetList();
            }

            return contactfieldslist;
        }
    }
}
