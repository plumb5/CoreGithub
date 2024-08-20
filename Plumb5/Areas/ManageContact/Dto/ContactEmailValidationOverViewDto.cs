using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.ManageContact.Dto
{
    public record ContactEmailValidationOverView_GetMaxCountDto(int accountId, int GroupId);
    public record ContactEmailValidationOverView_BindContactEmailValidationOverViewDto(int accountId, int GroupId, int OffSet, int FetchNext);
    public record ContactEmailValidationOverView_CheckCreditsDto(int accountId, int GroupId);
    public record ContactEmailValidationOverView_GetFileDetailsDto(int accountId, int ContactEmailValidationOverViewId);
    public record ContactEmailValidationOverView_GetOverAllMaxCountDto(int accountId, string fromDateTime, string toDateTime, string GroupName);
    public record ContactEmailValidationOverView_GetOverAllReportDetailsDto(int accountId, string fromDateTime, string toDateTime, string GroupName, int OffSet, int FetchNext);
    public record ContactEmailValidationOverView_GetAllGroupDetailsDto(int accountId);
    public record ContactEmailValidationOverView_SaveValidateGroupDto(int accountId, int[] GroupIds);
    public record ContactEmailValidationOverView_EmailValidationExportDto(int AccountId, int Duration, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType);
    public record ContactEmailValidationOverView_GetFileStatusDetailsDto(int AccountId, string File_Id);
    
}
