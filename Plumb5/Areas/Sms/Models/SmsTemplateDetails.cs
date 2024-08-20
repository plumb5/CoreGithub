using P5GenralDL;
using P5GenralML;
using System.ComponentModel.DataAnnotations;

namespace Plumb5.Areas.Sms.Models
{
    public class SmsTemplateDetails
    {
        int AdsId;

        public SmsTemplateDetails()
        {
        }
        public SmsTemplateDetails(int adsId)
        {
            AdsId = adsId;
        }

        #region Members
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string TemplateName { get; set; }
        public string TemplateDescription { get; set; }
        public int SmsCampaignId { get; set; }
        public string CampaignName { get; set; }
        public string MessageContent { get; set; }
        public int TotalSent { get; set; }
        public int TotalDelivered { get; set; }
        public int TotalClick { get; set; }
        public int TotalUnsubscribe { get; set; }

        [DisplayFormat(DataFormatString = "{0:MMM dd yyyy hh:mm:ss tt}", ApplyFormatInEditMode = true)]
        public Nullable<DateTime> CreatedDate { get; set; }
        public string VendorTemplateId { get; set; }

        public string DLTUploadMessageFile { get; set; }
        public bool IsPromotionalOrTransactionalType { get; set; }

        #endregion Members

        public async Task<List<SmsTemplateDetails>> GetSmsTemplateDetails(SmsTemplate smsTemplate, int OffSet, int FetchNext,string DbType)
        {
            List<SmsTemplate> smsTemplateDetails = null;
            List<CampaignIdentifier> smsCampaignDetails = null;
            List<UserInfo> UserDetails = null;
            List<SmsTemplateDetails> Data = new List<SmsTemplateDetails>();

            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(AdsId,DbType))
            {
                smsTemplateDetails =(await objDL.GetTemplateDetails(smsTemplate, OffSet, FetchNext)).ToList();
            }

            List<int> smsCampaignIdList = smsTemplateDetails.Select(x => x.SmsCampaignId).Distinct().ToList();

            if (smsCampaignIdList.Count > 0)
            {
                using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(AdsId, DbType))
                {
                    smsCampaignDetails =await objDL.GetAllCampaigns(smsCampaignIdList);
                }

                IEnumerable<int> result = smsCampaignDetails.Select(x => x.UserInfoUserId).Distinct();

                using (var objDL = DLUserInfo.GetDLUserInfo(DbType))
                {
                    UserDetails = objDL.GetDetail(result);
                }

                Data = (from SmsTemplate in smsTemplateDetails
                        join CampaignIdentifier in smsCampaignDetails on SmsTemplate.SmsCampaignId equals CampaignIdentifier.Id
                        select new SmsTemplateDetails
                        {
                            Id = SmsTemplate.Id,
                            TemplateName = SmsTemplate.Name,
                            CampaignName = CampaignIdentifier.Name,
                            SmsCampaignId = SmsTemplate.SmsCampaignId,
                            MessageContent = SmsTemplate.MessageContent,
                            CreatedDate = SmsTemplate.CreatedDate,
                            TemplateDescription = SmsTemplate.Description,
                            VendorTemplateId = SmsTemplate.VendorTemplateId,
                            DLTUploadMessageFile = SmsTemplate.DLTUploadMessageFile,
                            IsPromotionalOrTransactionalType = SmsTemplate.IsPromotionalOrTransactionalType
                        }).ToList();
            }
            return Data;
        }

        public async Task<List<SmsTemplateDetails>> GetSmsTemplateArchiveDetails(SmsTemplate smsTemplate, int OffSet, int FetchNext,string DbType)
        {
            List<SmsTemplate> smsTemplateDetails = null;
            List<CampaignIdentifier> smsCampaignDetails = null;
            List<UserInfo> UserDetails = null;
            List<SmsTemplateDetails> Data = new List<SmsTemplateDetails>();

            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(AdsId, DbType))
            {
                smsTemplateDetails =(await objDL.GetArchiveTemplateDetails(smsTemplate, OffSet, FetchNext)).ToList();
            }

            List<int> smsCampaignIdList = smsTemplateDetails.Select(x => x.SmsCampaignId).Distinct().ToList();

            if (smsCampaignIdList.Count > 0)
            {
                using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(AdsId,DbType))
                {
                    smsCampaignDetails = await objDL.GetAllCampaigns(smsCampaignIdList);
                }

                IEnumerable<int> result = smsCampaignDetails.Select(x => x.UserInfoUserId).Distinct();

                using (var objDL = DLUserInfo.GetDLUserInfo(DbType))
                {
                    UserDetails = objDL.GetDetail(result);
                }

                Data = (from SmsTemplate in smsTemplateDetails
                        join CampaignIdentifier in smsCampaignDetails on SmsTemplate.SmsCampaignId equals CampaignIdentifier.Id
                        select new SmsTemplateDetails
                        {
                            Id = SmsTemplate.Id,
                            TemplateName = SmsTemplate.Name,
                            CampaignName = CampaignIdentifier.Name,
                            SmsCampaignId = SmsTemplate.SmsCampaignId,
                            MessageContent = SmsTemplate.MessageContent,
                            CreatedDate = SmsTemplate.CreatedDate,
                            TemplateDescription = SmsTemplate.Description,
                            VendorTemplateId = SmsTemplate.VendorTemplateId,
                            DLTUploadMessageFile = SmsTemplate.DLTUploadMessageFile,
                            IsPromotionalOrTransactionalType = SmsTemplate.IsPromotionalOrTransactionalType
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
