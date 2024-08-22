namespace Plumb5.Areas.Mail.Dto
{
    public record UnSubscribePage_SaveorUpdateTemplateDto(string FinalTemplate, string UpperTemplateContent, string MiddleTemplate, string LowerTemplate);
    public record UnSubscribePage_GetGroupListDto(int ContactId); 
}
