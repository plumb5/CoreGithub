using Newtonsoft.Json.Linq;

namespace Plumb5.Areas.Analytics.Models
{
    public class MailStaticTemplate
    {
        public int TemplateOrder { get; set; }
        public string TemplateDirectory { get; set; }
        public string TemplateHeading { get; set; }
        public string TemplateDescription { get; set; }
        public string TemplateHtmlPath { get; set; }
        public string TemplateJsonPath { get; set; }
        public string TemplatePreviewImagePath { get; set; }
        public string TemplatePreviewThumbImagePath { get; set; }
        public byte IsBasicPremium { get; set; }


        public string[] GetTemplateHeading(string jsonFileUrl)
        {
            string[] TemplateHeadingValue = new string[3];
            try
            {
                using (StreamReader file = File.OpenText(jsonFileUrl))
                {
                    string jsonString = file.ReadToEnd();
                    JObject jsonObject = JObject.Parse(jsonString);
                    TemplateHeadingValue[0] = Convert.ToString(jsonObject["page"]["title"]);
                    TemplateHeadingValue[1] = Convert.ToString(jsonObject["page"]["IsBasicPremium"]);
                    TemplateHeadingValue[2] = Convert.ToString(jsonObject["page"]["description"]);
                }
            }
            catch
            {
                //
            }
            return TemplateHeadingValue;
        }
    }
}
