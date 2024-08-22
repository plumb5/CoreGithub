using P5GenralDL;
using P5GenralML;

namespace Plumb5.Areas.CustomEvents.Models
{
    public class ManageCustomEventFields
    {
        #region Members
        public string P5ColumnName { get; set; }
        public string FrontEndName { get; set; }
        public string FieldMappingType { get; set; }
        public bool? IsNewField { get; set; }
        public string SqlProvider { get; }
        #endregion Members

        readonly int AdsId = 0;

        public ManageCustomEventFields(int adsid, string sqlProvider)
        {
            AdsId = adsid;
            SqlProvider = sqlProvider;
        }

        public ManageCustomEventFields()
        {
        }

        public async Task<List<ManageCustomEventFields>> GetCustomEventFieldsList(bool fresheventorrepeatevent, int Customevntsoverviewid)
        {
            List<ManageCustomEventFields> data = new List<ManageCustomEventFields>(); ;
            List<CustomEventExtraField> objlistcustomevents = new List<CustomEventExtraField>();

            List<string> alreadypresentfields = new List<string>();
            alreadypresentfields.Add("eventname");
            alreadypresentfields.Add("email-id");
            alreadypresentfields.Add("phonenumber");
            alreadypresentfields.Add("eventtime");

            ManageCustomEventFields field1 = new ManageCustomEventFields();
            field1.P5ColumnName = "EventName";
            field1.FrontEndName = "EventName";
            field1.FieldMappingType = "string";
            field1.IsNewField = false;
            data.Add(field1);

            ManageCustomEventFields field2 = new ManageCustomEventFields();
            field2.P5ColumnName = "EmailId";
            field2.FrontEndName = "Email-Id";
            field2.FieldMappingType = "string";
            field2.IsNewField = false;
            data.Add(field2);

            ManageCustomEventFields field3 = new ManageCustomEventFields();
            field3.P5ColumnName = "PhoneNumber";
            field3.FrontEndName = "PhoneNumber";
            field3.FieldMappingType = "string";
            field3.IsNewField = false;
            data.Add(field3);

            ManageCustomEventFields field4 = new ManageCustomEventFields();
            field4.P5ColumnName = "EventTime";
            field4.FrontEndName = "EventTime";
            field4.FieldMappingType = "string";
            field4.IsNewField = false;
            data.Add(field4);

            //Here we are checking if the event is a fresh event or repeat event
            if (!fresheventorrepeatevent)
            {
                //Repeat event
                using (var objBLnew = DLCustomEventExtraField.GetDLCustomEventExtraField(AdsId, SqlProvider))
                    objlistcustomevents = await objBLnew.GetList(0, null, Customevntsoverviewid);

                if (objlistcustomevents != null && objlistcustomevents.Count() > 0)
                {
                    for (int i = 0; i < objlistcustomevents.Count(); i++)
                    {
                        ManageCustomEventFields eachfield = new ManageCustomEventFields();
                        eachfield.P5ColumnName = objlistcustomevents[i].FieldName;
                        eachfield.FrontEndName = objlistcustomevents[i].FieldName;
                        eachfield.FieldMappingType = objlistcustomevents[i].FieldMappingType;
                        eachfield.IsNewField = false;
                        data.Add(eachfield);
                    }
                }
            }
            return data;
        }
    }
}
