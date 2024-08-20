using P5GenralDL;
using P5GenralML;

namespace Plumb5.Areas.WebPush.Models
{
    public class WebPushTemplateDetails
    {
        int AdsId;
        string sqlprovider;

        public WebPushTemplateDetails()
        {
        }
        public WebPushTemplateDetails(int adsId, string Sqlprovider)
        {
            AdsId = adsId;
            sqlprovider = Sqlprovider;
        }

        #region Members
        public int Id { get; set; }
        public string TemplateName { get; set; }
        public string TemplateDescription { get; set; }
        public int CampaignId { get; set; }
        public string CampaignName { get; set; }
        public string Title { get; set; }
        public string MessageContent { get; set; }
        public string IconImage { get; set; }
        public string BannerImage { get; set; }
        public string Button1_Label { get; set; }
        public string Button2_Label { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }

        #endregion Members

        public async Task<IEnumerable<WebPushTemplateDetails>> GetWebPushTemplateDetails(WebPushTemplate webpushTemplate, int OffSet, int FetchNext)
        {
            List<WebPushTemplate> webpushTemplateDetails = null;
            List<CampaignIdentifier> CampaignDetails = null;
            List<UserInfo> UserDetails = null;
            List<WebPushTemplateDetails> Data = new List<WebPushTemplateDetails>();

            using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(AdsId, sqlprovider))
            {
                webpushTemplateDetails = await objDL.GetAllTemplates(webpushTemplate, OffSet, FetchNext);
            }

            List<int> CampaignIdList = webpushTemplateDetails.Select(x => x.CampaignId).Distinct().ToList();

            if (CampaignIdList.Count > 0)
            {
                using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(AdsId, sqlprovider))
                {
                    CampaignDetails = await objDL.GetAllCampaigns(CampaignIdList);
                }

                IEnumerable<int> result = CampaignDetails.Select(x => x.UserInfoUserId).Distinct();

                using (var objDL = DLUserInfo.GetDLUserInfo(sqlprovider))
                {
                    UserDetails = objDL.GetDetail(result);
                }

                Data = (from pushTemplate in webpushTemplateDetails
                        join CampaignIdentifier in CampaignDetails on pushTemplate.CampaignId equals CampaignIdentifier.Id
                        select new WebPushTemplateDetails
                        {
                            Id = pushTemplate.Id,
                            TemplateName = pushTemplate.TemplateName,
                            CampaignName = CampaignIdentifier.Name,
                            CampaignId = pushTemplate.CampaignId,
                            TemplateDescription = pushTemplate.TemplateDescription,
                            Title = pushTemplate.Title,
                            MessageContent = pushTemplate.MessageContent,
                            IconImage = pushTemplate.IconImage,
                            BannerImage = pushTemplate.BannerImage,
                            Button1_Label = pushTemplate.Button1_Label,
                            Button2_Label = pushTemplate.Button2_Label,
                            CreatedDate = pushTemplate.CreatedDate
                        }).ToList();
            }
            return Data;
        }

        public async Task<IEnumerable<WebPushTemplateDetails>> GetWebPushArchiveTemplateDetails(WebPushTemplate webpushTemplate, int OffSet, int FetchNext)
        {
            List<WebPushTemplate> webpushTemplateDetails = null;
            List<CampaignIdentifier> CampaignDetails = null;
            List<UserInfo> UserDetails = null;
            List<WebPushTemplateDetails> Data = new List<WebPushTemplateDetails>();

            using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(AdsId, sqlprovider))
            {
                webpushTemplateDetails = await objDL.GetAllArchiveTemplates(webpushTemplate, OffSet, FetchNext);
            }

            List<int> CampaignIdList = webpushTemplateDetails.Select(x => x.CampaignId).Distinct().ToList();

            if (CampaignIdList.Count > 0)
            {
                using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(AdsId, sqlprovider))
                {
                    CampaignDetails = await objDL.GetAllCampaigns(CampaignIdList);
                }

                IEnumerable<int> result = CampaignDetails.Select(x => x.UserInfoUserId).Distinct();

                using (var objDL = DLUserInfo.GetDLUserInfo(sqlprovider))
                {
                    UserDetails = objDL.GetDetail(result);
                }

                Data = (from pushTemplate in webpushTemplateDetails
                        join CampaignIdentifier in CampaignDetails on pushTemplate.CampaignId equals CampaignIdentifier.Id
                        select new WebPushTemplateDetails
                        {
                            Id = pushTemplate.Id,
                            TemplateName = pushTemplate.TemplateName,
                            CampaignName = CampaignIdentifier.Name,
                            CampaignId = pushTemplate.CampaignId,
                            TemplateDescription = pushTemplate.TemplateDescription,
                            Title = pushTemplate.Title,
                            MessageContent = pushTemplate.MessageContent,
                            IconImage = pushTemplate.IconImage,
                            BannerImage = pushTemplate.BannerImage,
                            Button1_Label = pushTemplate.Button1_Label,
                            Button2_Label = pushTemplate.Button2_Label,
                            CreatedDate = pushTemplate.CreatedDate
                        }).ToList();
            }
            return Data;
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {

                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
