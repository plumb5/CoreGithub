using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Controllers;
using Plumb5.Dto;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class LeadScoringController : BaseController
    {
        public LeadScoringController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("LeadScoring");
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> SaveScoreSettings([FromBody] LeadScoring_SaveScoreSettingsDto objDto)
        {
            using (var objBL = DLScoreSettings.GetDLScoreSettings(objDto.AccountId, SQLProvider))
            {
                if (objBL.GetDetails(objDto.ScoringAreaType, "") != null)
                {
                    await objBL.Delete(objDto.ScoringAreaType);
                }
                foreach (ScoreSettings score in objDto.scoreSettings)
                {
                    await objBL.Save(score);
                }

                return Json(true);
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetScoreSettingsDetails([FromBody] LeadScoring_GetScoreSettingsDetailsDto objDto)
        {
            ArrayList data = new ArrayList() { objDto.ScoringAreaType, objDto.ScoreName };
            HttpContext.Session.SetString("ScoringList", JsonConvert.SerializeObject(data));
            using (var objBL = DLScoreSettings.GetDLScoreSettings(objDto.AccountId, SQLProvider))
            {
                return Json(await objBL.GetDetails(objDto.ScoringAreaType, objDto.ScoreName));
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> SaveThresholdSettings([FromBody] LeadScoring_SaveThresholdSettingsDto objDto)
        {
            using (var objBL = DLLeadScoreThresholdSettings.GetDLLeadScoreThresholdSettings(objDto.AccountId, SQLProvider))
            {
                if ((await objBL.GetList()).ToList().Count > 0)
                {
                    await objBL.Delete();
                }
                foreach (LeadScoreThresholdSettings Threshold in objDto.ThresholdSettings)
                {
                    await objBL.Save(Threshold);
                }

                return Json(true);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteThreshold([FromBody] LeadScoring_DeleteThresholdDto objDto)
        {
            using (var objBL = DLLeadScoreThresholdSettings.GetDLLeadScoreThresholdSettings(objDto.AccountId, SQLProvider))
            {
                return Json(await objBL.Delete(objDto.id));
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetThresholdSettings([FromBody] LeadScoring_GetThresholdSettingsDto objDto)
        {
            using (var objBL = DLLeadScoreThresholdSettings.GetDLLeadScoreThresholdSettings(objDto.AccountId, SQLProvider))
            {
                return Json(await objBL.GetList());
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> SaveScore([FromBody] LeadScoring_SaveScoreDto objDto)
        {
            var areaname = objDto.Area == "score" ? "SaveScoreSettings" : objDto.Area == "thres" ? "SaveThresholdSettings" : "SaveDecaySettings";
            using (var objBL = DLLeadScoring.GetDLLeadScoring(objDto.AccountId, SQLProvider))
            {
                if (objDto.leadScoring.IsActiveScoreSettings == false && areaname == "SaveScoreSettings")
                {
                    using (var objBLSore = DLScoreSettings.GetDLScoreSettings(objDto.AccountId, SQLProvider))
                    {
                        await objBLSore.Delete("behaviour");
                        await objBLSore.Delete("demographic");
                    }
                }
                if (objDto.leadScoring.IsActiveThresholdSettings == false && areaname == "SaveThresholdSettings")
                {
                    using (var objBLThres = DLLeadScoreThresholdSettings.GetDLLeadScoreThresholdSettings(objDto.AccountId, SQLProvider))
                    {
                        await objBLThres.Delete();
                    }
                }
                if (objDto.leadScoring.IsActiveDecaySettings == false && areaname == "SaveDecaySettings")
                {
                    using (var objBLDecay = DLLeadScoreDecaySetting.GetDLLeadScoreDecaySetting(objDto.AccountId, SQLProvider))
                    {
                        await objBLDecay.Delete();
                    }
                }

                int result = 0;
                result = await objBL.Save(objDto.leadScoring, areaname);
                return Json(result);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetDetails([FromBody] LeadScoring_GetDetailsDto objDto)
        {
            using (var objBL = DLLeadScoring.GetDLLeadScoring(objDto.AccountId, SQLProvider))
            {
                return Json(await objBL.GetDetails());
            }
        }


        [Log]
        [HttpPost]
        public async Task<ActionResult> SaveDecaySetting([FromBody] LeadScoring_SaveDecaySettingDto objDto)
        {
            using (var objBL = DLLeadScoreDecaySetting.GetDLLeadScoreDecaySetting(objDto.AccountId, SQLProvider))
            {
                if ((await objBL.GetList()).ToList().Count > 0)
                {
                    await objBL.Delete();
                }
                foreach (LeadScoreDecaySetting decaySetting in objDto.DecaySettingList)
                {
                    await objBL.Save(decaySetting);
                }

                return Json(true);
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetDecaySetting([FromBody] LeadScoring_GetDecaySettingDto objDto)
        {
            using (var objBL = DLLeadScoreDecaySetting.GetDLLeadScoreDecaySetting(objDto.AccountId, SQLProvider))
            {
                return Json(await objBL.GetList());
            }
        }
        [HttpPost]
        public async Task<JsonResult> LeadScoringExport([FromBody] LeadScoring_LeadScoringExportDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DataSet dataSet = new DataSet();

                List<ScoreSettings> scoresettinglist = new List<ScoreSettings>();

                string ScoringAreaType = "";
                string ScoreName = "";
                if (HttpContext.Session.GetString("ScoringList") != null)
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("ScoringList"));
                    ScoringAreaType = data[0].ToString();
                    ScoreName = data[1].ToString();
                }

                using (var objBL = DLScoreSettings.GetDLScoreSettings(objDto.AccountId, SQLProvider))
                {
                    scoresettinglist = (await objBL.GetDetails(ScoringAreaType, ScoreName)).ToList();
                }

                var NewscoringListData = scoresettinglist.Select(x => new
                {
                    x.ScoreName,
                    x.Description,
                    x.Value,
                    x.Score
                });

                DataTable dtt = new DataTable();
                dtt = NewscoringListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "LeadScoring_" + ScoringAreaType + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;
                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (objDto.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }

        [HttpPost]
        public async Task<JsonResult> LeadScoring_GetContactCustomDetailsDto([FromBody] LeadScoring_GetContactCustomDetailsDto objDto)
        {
            using (var objBAL = DLContactExtraField.GetDLContactExtraField(objDto.AccountId, SQLProvider))
            {
                return Json(await objBAL.GetList());
            }
        }
    }
}
