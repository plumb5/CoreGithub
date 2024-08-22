using P5GenralML;

namespace Plumb5.Areas.Journey.Dto
{
    public record CreateRule_SaveBasicDetailsDto(int AdsId, WorkFlowSetRules setRules);
    public record CreateRule_GetRuleDetailsDto(int AdsId, int RuleId);

}
