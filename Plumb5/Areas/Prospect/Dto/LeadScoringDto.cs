using Microsoft.AspNetCore.Mvc;
using P5GenralML;

namespace Plumb5.Areas.Prospect.Dto
{
    public record LeadScoring_SaveScoreSettingsDto(int AccountId, List<ScoreSettings> scoreSettings, string ScoringAreaType);
    public record LeadScoring_GetScoreSettingsDetailsDto(int AccountId, string ScoringAreaType, string ScoreName);
    public record LeadScoring_SaveThresholdSettingsDto(int AccountId, List<LeadScoreThresholdSettings> ThresholdSettings);
    public record LeadScoring_DeleteThresholdDto(int AccountId, int id);
    public record LeadScoring_GetThresholdSettingsDto(int AccountId);
    public record LeadScoring_SaveScoreDto(int AccountId, LeadScoring leadScoring, string Area);
    public record LeadScoring_GetDetailsDto(int AccountId);
    public record LeadScoring_SaveDecaySettingDto(int AccountId, List<LeadScoreDecaySetting> DecaySettingList);
    public record LeadScoring_GetDecaySettingDto(int AccountId);
    public record LeadScoring_LeadScoringExportDto(int AccountId, string FileType);
    public record LeadScoring_GetContactCustomDetailsDto(int AccountId);
}
