using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;
using System.Data;
using System.IO.Compression;
using Plumb5.Areas.ManageContact.Dto;

namespace Plumb5.Areas.ManageContact
{
    [Area("ManageContact")]
    public class ContactImportSourceDistributionController : BaseController
    {
        public ContactImportSourceDistributionController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /ManageContact/ContactImportSourceDistribution/

        public IActionResult Index()
        {
            return View("ContactImportSourceDistribution");
        }
        [HttpPost]
        public async Task<ActionResult> GetContactImportSourceWiseData([FromBody] ContactImportSourceDistribution_GetContactImportSourceWiseDataDto ContactImportSourceDistributiondto)
        {
            List<LmsGroupImportOverview> LmsGroupImportOverviewList = null;
            dynamic ImportOverviewList = null;
            using (var objDL = DLLmsGroupImportOverview.GetDLLmsGroupImportOverview(ContactImportSourceDistributiondto.accountId, SQLProvider))
            {
                LmsGroupImportOverviewList = (await objDL.GetList(new LmsGroupImportOverview() { ContactImportOverviewId = ContactImportSourceDistributiondto.ContactImportOverviewId }, null, null)).ToList();

                if (LmsGroupImportOverviewList != null && LmsGroupImportOverviewList.Count > 0)
                {
                    IEnumerable<int> GroupIdList = LmsGroupImportOverviewList.Select(x => x.LmsGroupId).Distinct();
                    List<string> fieldName = new List<string>() { "Id", "Name" };
                    using (var groupsbl = DLLmsGroup.GetDLLmsGroup(ContactImportSourceDistributiondto.accountId, SQLProvider))
                    {
                        List<LmsGroup> groupList = (await groupsbl.GetCustomisedGroupList(GroupIdList, fieldName)).ToList();
                        ImportOverviewList = (from overviewList in LmsGroupImportOverviewList
                                              join groups in groupList
                                              on overviewList.LmsGroupId equals groups.Id
                                              select new
                                              {
                                                  GroupName = groups.Name,
                                                  overviewList.LmsGroupId,
                                                  overviewList.ContactImportOverviewId,
                                                  overviewList.SuccessCount,
                                                  overviewList.RejectedCount,
                                                  overviewList.ContactErrorRejectedCount,
                                                  overviewList.CreatedDate,
                                                  overviewList.UpdatedDate
                                              }).ToList();
                    }
                }
            }
            return Json(ImportOverviewList);
        }


        [HttpPost]
        public async Task<JsonResult> ContactLevelRejectFileExport([FromBody] ContactImportSourceDistribution_ContactLevelRejectFileExportDto ContactImportSourceDistributiondto)
        {
            DataSet contactSampleDataSet = new DataSet();
            List<LmsGroupImportRejectDetails> lmsGroupImportRejects = null;

            using (var objDL = DLLmsGroupImportRejectDetails.GetDLLmsGroupImportRejectDetails(ContactImportSourceDistributiondto.AccountId, SQLProvider))
            {
                lmsGroupImportRejects = (await objDL.GetList(new LmsGroupImportRejectDetails() { ContactImportOverviewId = ContactImportSourceDistributiondto.ImportId, LmsGroupId = ContactImportSourceDistributiondto.GroupId, RejectionType = "ContactLevel" }, null, null)).ToList();
            }

            var NewListData = lmsGroupImportRejects.Select(x => new
            {
                x.EmailId,
                x.PhoneNumber,
                x.FileRowNumber,
                x.RejectedReason,
                x.RejectionType
            }).CopyToDataTableExport();

            contactSampleDataSet.Tables.Add(NewListData);
            string FileName = "P5ContactLevelRejectFile_" + Convert.ToString(ContactImportSourceDistributiondto.AccountId) + "_" + Convert.ToString(ContactImportSourceDistributiondto.ImportId) + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + ContactImportSourceDistributiondto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (ContactImportSourceDistributiondto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(contactSampleDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(contactSampleDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        [HttpPost]
        public async Task<JsonResult> SourceLevelRejectFileExport([FromBody] ContactImportSourceDistribution_SourceLevelRejectFileExportDto ContactImportSourceDistributiondto)
        {
            DataSet contactSampleDataSet = new DataSet();
            List<LmsGroupImportRejectDetails> lmsGroupImportRejects = null;

            using (var objDL = DLLmsGroupImportRejectDetails.GetDLLmsGroupImportRejectDetails(ContactImportSourceDistributiondto.AccountId, SQLProvider))
            {
                lmsGroupImportRejects = (await objDL.GetList(new LmsGroupImportRejectDetails() { ContactImportOverviewId = ContactImportSourceDistributiondto.ImportId, LmsGroupId = ContactImportSourceDistributiondto.GroupId, RejectionType = "SourceLevel" }, null, null)).ToList();
            }

            var NewListData = lmsGroupImportRejects.Select(x => new
            {
                x.EmailId,
                x.PhoneNumber,
                x.FileRowNumber,
                x.RejectedReason,
                x.RejectionType
            }).CopyToDataTableExport();

            contactSampleDataSet.Tables.Add(NewListData);
            string FileName = "P5SourceLevelRejectFile_" + Convert.ToString(ContactImportSourceDistributiondto.AccountId) + "_" + Convert.ToString(ContactImportSourceDistributiondto.ImportId) + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + ContactImportSourceDistributiondto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (ContactImportSourceDistributiondto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(contactSampleDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(contactSampleDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
    }
}
