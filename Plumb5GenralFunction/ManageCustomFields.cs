using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class ManageCustomFields
    {
        int AdsId = 0;
        private readonly string? SqlVendor;

        public ManageCustomFields(int adsid, string? sqlVendor)
        {
            AdsId = adsid;
            SqlVendor = sqlVendor;
        }

        public async void UpdateCustomFields(Object[] answer, string Type, int ContactId, List<FormFields> fieldList = null)
        {
            int FieldIndexForContact = -1;
            //int FieldIndexForLms = -1;
            int AnswerIndex = -1;

            List<ContactExtraField> contactextraField = new List<ContactExtraField>();

            Contact? contact = new Contact() { ContactId = ContactId };
            using var objContact = DLContact.GetContactDetails(AdsId, SqlVendor);
            using var objBAL = DLContactExtraField.GetDLContactExtraField(AdsId, SqlVendor);
            contact = await objContact.GetContactDetails(contact);
            contact.AllFormIds = null;

            contactextraField = await objBAL.GetList();  //Get Contact Custom Fields

            if (Type == "CaptureForm")
            {
                try
                {
                    if ((contactextraField != null && contactextraField.Count > 0))
                    {
                        List<FormFields> formFields = fieldList.Where(x => x.FieldType > 3).ToList();
                        if (formFields != null && formFields.Count > 0)
                        {
                            for (int i = 0; i < formFields.Count; i++)
                            {
                                AnswerIndex = fieldList.Select((field, index) => new { field, index }).First(x => x.field.Id == formFields[i].Id).index;
                                if ((contactextraField != null && contactextraField.Count > 0) && contactextraField.Any(x => x.FieldName.Trim().ToLower() == formFields[i].Name.Trim().ToLower()))
                                {
                                    FieldIndexForContact = contactextraField.Select((field, index) => new { field, index }).First(x => x.field.FieldName.Trim().ToLower() == formFields[i].Name.Trim().ToLower()).index;

                                    if (AnswerIndex < answer.Length && FieldIndexForContact <= 19 && !string.IsNullOrEmpty(answer[AnswerIndex].ToString()))
                                    {
                                        PropertyInfo pInfo = contact.GetType().GetProperty("CustomField" + (FieldIndexForContact + 1));
                                        pInfo.SetValue(contact, Helper.RemoveSpecialCharacters(answer[AnswerIndex].ToString()), null);
                                    }
                                }
                            }
                            objContact.Update(contact);
                        }
                    }
                }
                catch (Exception ex)
                {
                    using (ErrorUpdation objError = new ErrorUpdation("ErrorLogCaptureFormMapping"))
                    {
                        objError.AddError(ex.Message.ToString(), "AdsId ---->" + AdsId.ToString() + "", DateTime.Now.ToString(), "", "");
                    }
                }
            }
            else if (Type == "UpdateContactCustomFields")
            {
                try
                {
                    if ((contactextraField != null && contactextraField.Count > 0))
                    {
                        for (int i = 0; i < contactextraField.Count; i++)
                        {
                            if (contactextraField.Any(x => x.FieldName.Trim().ToLower() == contactextraField[i].FieldName.Trim().ToLower()))
                            {
                                FieldIndexForContact = contactextraField.Select((field, index) => new { field, index }).First(x => x.field.FieldName.Trim().ToLower() == contactextraField[i].FieldName.Trim().ToLower()).index;

                                if (i < answer.Length && FieldIndexForContact <= 19 && !string.IsNullOrEmpty(answer[i].ToString()))
                                {
                                    PropertyInfo pInfo = contact.GetType().GetProperty("CustomField" + (FieldIndexForContact + 1));
                                    pInfo.SetValue(contact, Helper.RemoveSpecialCharacters(answer[i].ToString()), null);
                                }
                            }
                        }
                        objContact.Update(contact);
                    }
                }
                catch (Exception ex)
                {
                    using (ErrorUpdation objError = new ErrorUpdation("ErrorLogContactCustomFieldsMapping"))
                    {
                        objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "", "");
                    }
                }
            }
        }

        public async void UpdateContactExtraDetails(int ContactId, Dictionary<string, string> CustomList)
        {
            int FieldIndexForContact = -1;
            //int FieldIndexForLms = -1;

            List<ContactExtraField> contactextraField = new List<ContactExtraField>();
            using (var objBAL = DLContactExtraField.GetDLContactExtraField(AdsId, SqlVendor))
            {
                contactextraField = await objBAL.GetList();
            }


            Contact contact = new Contact() { ContactId = ContactId };

            if (CustomList != null && CustomList.Count > 0)
            {
                foreach (var pair in CustomList)
                {
                    string fieldName = pair.Key.Trim().ToLower();
                    string fieldValue = Helper.RemoveSpecialCharacters(pair.Value.ToString());

                    if (contact.GetType().GetProperty(fieldName, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance) != null)
                    {
                        contact.GetType().GetProperty(fieldName, BindingFlags.SetProperty | BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance).SetValue(contact, fieldValue, null);
                    }

                    else if ((contactextraField != null && contactextraField.Count > 0) && (contactextraField.Any(x => x.FieldName.Trim().ToLower() == fieldName)))
                    {
                        FieldIndexForContact = contactextraField.Select((field, index) => new { field, index }).First(x => x.field.FieldName.Trim().ToLower() == fieldName).index;

                        if (FieldIndexForContact <= 19 && !string.IsNullOrEmpty(fieldValue))
                        {
                            PropertyInfo pInfo = contact.GetType().GetProperty("CustomField" + (FieldIndexForContact + 1));
                            pInfo.SetValue(contact, fieldValue, null);
                        }
                    }

                }

                using (var objContact = DLContact.GetContactDetails(AdsId, SqlVendor))
                {
                    await objContact.Update(contact);
                }
            }
        }
    }
}
