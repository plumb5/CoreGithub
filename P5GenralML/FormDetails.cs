using System;

namespace P5GenralML
{
    public class FormDetails
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public Int16 FormCampaignId { get; set; }
        public Int16 FormType { get; set; }
        public Boolean? FormStatus { get; set; }
        public Int16 FormPriority { get; set; }
        public string? Heading { get; set; }
        public string? SubHeading { get; set; }
        public string? PageContentForEmbed { get; set; }
        public Boolean IsMainBackgroundDesignCustom { get; set; }
        public string? MainBackgroundDesign { get; set; }
        public string? TitleCss { get; set; }
        public Boolean IsTitleCssCustom { get; set; }
        public string? DescriptionCss { get; set; }
        public Boolean IsDescriptionCustomCss { get; set; }
        public string? LabelCss { get; set; }
        public Boolean IsLabelCustomCss { get; set; }
        public string? TextboxDropCss { get; set; }
        public Boolean IsTextboxDropCustomCss { get; set; }
        public string? ButtonCss { get; set; }
        public Boolean IsButtonCustomCss { get; set; }
        public string? ErrorCss { get; set; }
        public Boolean IsErrorCustomCss { get; set; }
        public string? CloseCss { get; set; }
        public Boolean IsCloseCustomCss { get; set; }
        public string? ButtonName { get; set; }
        public Boolean? OnPageOrInPage { get; set; }
        public Int16 AppearenceEffect { get; set; }
        public Int16 PositionAlign { get; set; }
        public Int16 AppearenceSpeed { get; set; }
        public Int16 TopOrBottomPadding { get; set; }
        public Int16 RightOrLeftPadding { get; set; }
        public int TimeDelay { get; set; }
        public string? AppearSound { get; set; }
        public string? ThankYouMessage { get; set; }
        public Int16 HideEffect { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Boolean BackgroundPxOPer { get; set; }
        public string? PlaceHolderClass { get; set; }
        public string? BackgroundFadeColor { get; set; }
        public Int16? AppearOnLoadOnExitOnScroll { get; set; }
        public Int16 ShowOnScrollDownHeight { get; set; }
        public Int16 AppearEffectOfFields { get; set; }
        public string? GeneralCss { get; set; }
        public string? GeneralParentCss { get; set; }
        public string? OuterMainStyle { get; set; }
        public string? RowListStyle { get; set; }
        public string? RowStyle { get; set; }
        public string? OuterLabelStyle { get; set; }
        public string? OuterInputStyle { get; set; }
        public string? OuterButtonStyle { get; set; }
        public string? RadioButtonLabelCss { get; set; }
        public string? RadioButtonFieldsCss { get; set; }
        public string? CheckBoxLabelCss { get; set; }
        public string? CheckBoxFieldsCss { get; set; }
        public bool IsNewDivOrOldTable { get; set; }
        public string? ClientCampaignIdentifier { get; set; }
        public int CampaignIdentifier { get; set; }
        public string? CampaignIdentifierName { get; set; }
        public bool? IsWebOrMobileForm { get; set; }
        public bool IsOTPForm { get; set; }
        public int OTPFormId { get; set; }
        public string? FormIdentifier { get; set; }
        public Boolean IsMinimiseButton { get; set; }  //darshan
        public Boolean IsMinimiseCustomCss { get; set; }//darshan
        public string? MinimiseCss { get; set; }//darshan
        public string? EmbeddedFormOrPopUpFormOrTaggedForm { get; set; }//darshan
        public DateTime? UpdatedDate { get; set; }

        public Boolean ButtonPxOrPer { get; set; }
        public string? CloseDesignType { get; set; }
        public string? CloseAlignmentSetting { get; set; }
        public Boolean IsBackgroundUploadImageOrOnlineUrl { get; set; }
        public string? BannerImageDesignCss { get; set; }
        public Boolean IsBannerImageDesignCustom { get; set; }
        public Boolean IsBannerImageHidden { get; set; }
        public string? RadioCheckBoxFieldsCss { get; set; }
        public Boolean IsRadioCheckBoxFieldsCssCustom { get; set; }
        public int OTPGenerationLimits { get; set; }
        public bool OTPPageRestrictions { get; set; }
        public string? ImageAppearanceAlignment { get; set; }
        public int AutoClose { get; set; }
        public bool IsClickToCallForm { get; set; }
        public bool IsVerifiedEmail { get; set; }
        public bool IsAutoWhatsApp { get; set; }
        public string? BlockEmailIds { get; set; }
    }
}
