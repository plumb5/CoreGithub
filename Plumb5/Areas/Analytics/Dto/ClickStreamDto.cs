using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.Data;

namespace Plumb5.Areas.Analytics.Dto
{
    public record ClickStream_ContactInfoDto(string machineId, string contactId, string key, string deviceId);
    public record ClickStream_AggregateDataDto(string machineId, string key);
    public record ClickStream_RecentDataDto(string machineId, string key);
    public record ClickStream_ScoreDataDto(string machineId, string key);
    public record ClickStream_GroupsDataDto(string machineId, string contactId, string key);
    public record ClickStream_PercentageDataDto(string machineId, string key);
    public record ClickStream_PercentageDataScoringDto(string machineId, string key);
    public record ClickStream_ClickStreamDataDto(string machineId, string key);
    public record ClickStream_CityDataDto(string machineId, string key);
    public record ClickStream_PageDetailsDto(string sessionId);
    public record ClickStream_TransactionDetailsDto(string machineId, string key, int Start, int End);
    public record ClickStream_MobileAppDataDto(string deviceId, string contactId, string sessionId = "", string key = "");
    public record ClickStream_MobileVisitorDto(string machineId, string key = "");
    public record ClickStream_MobileVisitorLocationDto(string machineId, string key);
    public record ClickStream_AddNotesDto(string Note, string MachineId, int ContactId, string ImageName = "");
    public record ClickStream_BindNotesDto(string MachineId, string ContactId);
}
