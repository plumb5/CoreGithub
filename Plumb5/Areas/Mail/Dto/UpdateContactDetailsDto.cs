using P5GenralML;

namespace Plumb5.Areas.Mail.Dto
{   
    public record UpdateContactDetails_GetContactDto(Contact contact);
    public record ABTestingReport_UpdateContactDto(Contact contact, string[] answerList);
}
