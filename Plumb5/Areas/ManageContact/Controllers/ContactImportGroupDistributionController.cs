using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Data;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class ContactImportGroupDistributionController : BaseController
    {
        public ContactImportGroupDistributionController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("ContactImportGroupDistribution");
        }

        [HttpPost]
        public async Task<ActionResult> GetContactImportGroupWiseData([FromBody] ContactImportGroupDistribution_GetContactImportGroupWiseDataDto details)
        {
            List<GroupImportOverview> GroupImportOverviewList = null;
            dynamic ImportOverviewList = null;
            using (var objDL = DLGroupImportOverview.GetDLGroupImportOverview(details.accountId, SQLProvider))
            {
                GroupImportOverviewList = await objDL.GetList(new GroupImportOverview() { ContactImportOverviewId = details.ContactImportOverviewId }, null, null);

                if (GroupImportOverviewList != null && GroupImportOverviewList.Count > 0)
                {
                    IEnumerable<int> GroupIdList = GroupImportOverviewList.Select(x => x.GroupId).Distinct();
                    List<string> fieldName = new List<string>() { "Id", "Name" };
                    using (var groupsbl = DLGroups.GetDLGroups(details.accountId, SQLProvider))
                    {
                        List<Groups> groupList = await groupsbl.GetCustomisedGroupList(GroupIdList, fieldName);
                        ImportOverviewList = (from overviewList in GroupImportOverviewList
                                              join groups in groupList
                                              on overviewList.GroupId equals groups.Id
                                              select new
                                              {
                                                  GroupName = groups.Name,
                                                  overviewList.GroupId,
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


        [Log]
        [HttpPost]
        public async Task<JsonResult> ContactLevelRejectFileExport([FromBody] ContactImportGroupDistribution_ContactLevelRejectFileExportDto details)
        {
            DataSet contactSampleDataSet = new DataSet();
            List<GroupImportRejectDetails> groupImportRejects = null;

            using (var objDL = DLGroupImportRejectDetails.GetDLGroupImportRejectDetails(details.AccountId, SQLProvider))
            {
                groupImportRejects = await objDL.GetList(new GroupImportRejectDetails() { ContactImportOverviewId = details.ImportId, GroupId = details.GroupId, RejectionType = "ContactLevel" });
            }

            var NewListData = groupImportRejects.Select(x => new
            {
                x.EmailId,
                x.PhoneNumber,
                x.FileRowNumber,
                x.RejectedReason,
                x.RejectionType
            }).CopyToDataTableExport();

            contactSampleDataSet.Tables.Add(NewListData);
            string FileName = "P5ContactLevelRejectFile_" + Convert.ToString(details.AccountId) + "_" + Convert.ToString(details.ImportId) + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (details.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(contactSampleDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(contactSampleDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> GroupLevelRejectFileExport([FromBody] ContactImportGroupDistribution_GroupLevelRejectFileExportDto details)
        {
            DataSet contactSampleDataSet = new DataSet();
            List<GroupImportRejectDetails> groupImportRejects = null;

            using (var objDL = DLGroupImportRejectDetails.GetDLGroupImportRejectDetails(details.AccountId, SQLProvider))
            {
                groupImportRejects = await objDL.GetList(new GroupImportRejectDetails() { ContactImportOverviewId = details.ImportId, GroupId = details.GroupId, RejectionType = "GroupLevel" });
            }

            var NewListData = groupImportRejects.Select(x => new
            {
                x.EmailId,
                x.PhoneNumber,
                x.FileRowNumber,
                x.RejectedReason,
                x.RejectionType
            }).CopyToDataTableExport();

            contactSampleDataSet.Tables.Add(NewListData);
            string FileName = "P5GroupLevelRejectFile_" + Convert.ToString(details.AccountId) + "_" + Convert.ToString(details.ImportId) + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (details.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(contactSampleDataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(contactSampleDataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
    }
}
