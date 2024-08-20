soft.AspNetCore.Mvc.TagHelpers.FormTagHelper�
����<member name="T:Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper">
            <summary>
            <see cref="T:Microsoft.AspNetCore.Razor.TagHelpers.ITagHelper" /> implementation targeting &lt;form&gt; elements.
            </summary>
        </member>���form� �����'�����?string Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Action�ٸ<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Action">
            <summary>
            The name of the action method.
            </summary>
        </member>��,����'�����Cstring Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Controller�ٹ<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Controller">
            <summary>
            The name of the controller.
            </summary>
        </member>��-����'�����=string Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Area�٭<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Area">
            <summary>
            The name of the area.
            </summary>
        </member>��.����'�����=string Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Page�٭<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Page">
            <summary>
            The name of the page.
            </summary>
        </member>��/����'�����Dstring Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.PageHandler�ټ<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.PageHandler">
            <summary>
            The name of the page handler.
            </summary>
        </member>��0����asp-antiforgery�System.Boolean?�����MSystem.Boolean? Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Antiforgery���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Antiforgery">
            <summary>
            Whether the antiforgery token should be generated.
            </summary>
            <value>Defaults to <c>false</c> if user provides an <c>action</c> attribute
            or if the <c>method</c> is <see cref="F:Microsoft.AspNetCore.Mvc.Rendering.FormMethod.Get" />; <c>true</c> otherwise.</value>
        </member>���Antiforgery����'�����Astring Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Fragment�ٺ<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Fragment">
            <summary>
            Gets or sets the URL fragment.
            </summary>
        </member>��3����'�����>string Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Route���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Route">
            <summary>
            Name of the route.
            </summary>
            <remarks>
            Must be <c>null</c> if <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Action" /> or <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.Controller" /> is non-<c>null</c>.
            </remarks>
        </member>��4�����4���'قSystem.Collections.Generic.IDictionary<System.String, System.String> Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.RouteValues���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.FormTagHelper.RouteValues">
            <summary>
            Additional parameters for the route.
            </summary>
        </member>��5���*��+�FormTagHelper,�
-�����2Microsoft.AspNetCore.Mvc.TagHelpers.ImageTagHelper�
�Ӓ��<member name="T:Microsoft.AspNetCore.Mvc.TagHelpers.ImageTagHelper">
            <summary>
            <see cref="T:Microsoft.AspNetCore.Razor.TagHelpers.ITagHelper" /> implementation targeting &lt;img&gt; elements that supports file versioning.
            </summary>
            <remarks>
            The tag helper won't process for cases with just the 'src' attribute.
            </remarks>
        </member>���img���asp-append-version �� ���+���src �� ���+�������'�����=string Microsoft.AspNetCore.Mvc.TagHelpers.ImageTagHelper.Src��<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.ImageTagHelper.Src">
            <summary>
            Source of the image.
            </summary>
            <remarks>
            Passed through to the generated HTML in all cases.
            </remarks>
        </member>���Src�����o�����Ebool Microsoft.AspNetCore.Mvc.TagHelpers.ImageTagHelper.AppendVersion��x<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.ImageTagHelper.AppendVersion">
            <summary>
            Value indicating if file version should be appended to the src urls.
            </summary>
            <remarks>
            If <c>true</c> then a query string "v" with the encoded content of the file is added.
            </remarks>
        </member>���AppendVersion���*��+�ImageTagHelper,�
-�����2Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper�
�ߒ�'<member name="T:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper">
            <summary>
            <see cref="T:Microsoft.AspNetCore.Razor.TagHelpers.ITagHelper" /> implementation targeting &lt;input&gt; elements with an <c>asp-for</c> attribute.
            </summary>
        </member>�������asp-for �� ���+��������5Microsoft.AspNetCore.Mvc.ViewFeatures.ModelExpression�����lMicrosoft.AspNetCore.Mvc.ViewFeatures.ModelExpression Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.For���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.For">
            <summary>
            An expression to be evaluated against the current model.
            </summary>
        </member>�������asp-format'�����@string Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.Format��%<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.Format">
            <summary>
            The format string (see <see href="https://msdn.microsoft.com/en-us/library/txafckwd.aspx" />) used to format the
            <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.For" /> result. Sets the generated "value" attribute to that formatted string.
            </summary>
            <remarks>
            Not used if the provided (see <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.InputTypeName" />) or calculated "type" attribute value is
            <c>checkbox</c>, <c>password</c>, or <c>radio</c>. That is, <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.Format" /> is used when calling
            <see cref="M:Microsoft.AspNetCore.Mvc.ViewFeatures.IHtmlGenerator.GenerateTextBox(Microsoft.AspNetCore.Mvc.Rendering.ViewContext,Microsoft.AspNetCore.Mvc.ViewFeatures.ModelExplorer,System.String,System.Object,System.String,System.Object)" />.
            </remarks>
        </member>���Format����s'�����Gstring Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.InputTypeName��i<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.InputTypeName">
            <summary>
            The type of the &lt;input&gt; element.
            </summary>
            <remarks>
            Passed through to the generated HTML in all cases. Also used to determine the <see cref="T:Microsoft.AspNetCore.Mvc.ViewFeatures.IHtmlGenerator" />
            helper to call and the default <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.Format" /> value. A default <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.Format" /> is not calculated
            if the provided (see <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.InputTypeName" />) or calculated "type" attribute value is <c>checkbox</c>,
            <c>hidden</c>, <c>password</c>, or <c>radio</c>.
            </remarks>
        </member>���InputTypeName�����'�����Bstring Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.FormName���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.FormName">
            <summary>
            The name of the associated form
            </summary>
            <remarks>
            Used to associate a hidden checkbox tag to the respecting form when <see cref="T:Microsoft.AspNetCore.Mvc.Rendering.CheckBoxHiddenInputRenderMode" /> is not <see cref="F:Microsoft.AspNetCore.Mvc.Rendering.CheckBoxHiddenInputRenderMode.None" />.
            </remarks>
        </member>��̆�����'�����>string Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.Name��<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.Name">
            <summary>
            The name of the &lt;input&gt; element.
            </summary>
            <remarks>
            Passed through to the generated HTML in all cases. Also used to determine whether <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.For" /> is
            valid with an empty <see cref="P:Microsoft.AspNetCore.Mvc.ViewFeatures.ModelExpression.Name" />.
            </remarks>
        </member>��H����value'�����?string Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.Value���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.Value">
            <summary>
            The value of the &lt;input&gt; element.
            </summary>
            <remarks>
            Passed through to the generated HTML in all cases. Also used to determine the generated "checked" attribute
            if <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.InputTagHelper.InputTypeName" /> is "radio". Must not be <c>null</c> in that case.
            </remarks>
        </member>��̑���*��+�InputTagHelper,�
-�����2Microsoft.AspNetCore.Mvc.TagHelpers.LabelTagHelper�
����'<member name="T:Microsoft.AspNetCore.Mvc.TagHelpers.LabelTagHelper">
            <summary>
            <see cref="T:Microsoft.AspNetCore.Razor.TagHelpers.ITagHelper" /> implementation targeting &lt;label&gt; elements with an <c>asp-for</c> attribute.
            </summary>
        </member>���label� ��� �� ���+��������������lMicrosoft.AspNetCore.Mvc.ViewFeatures.ModelExpression Microsoft.AspNetCore.Mvc.TagHelpers.LabelTagHelper.For���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.LabelTagHelper.For">
            <summary>
            An expression to be evaluated against the current model.
            </summary>
        </member>��T���*��+�LabelTagHelper,�
-�����1Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper�
�����<member name="T:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper">
            <summary>
            <see cref="T:Microsoft.AspNetCore.Razor.TagHelpers.ITagHelper" /> implementation targeting &lt;link&gt; elements that supports fallback href paths.
            </summary>
            <remarks>
            The tag helper won't process for cases with just the 'href' attribute.
            </remarks>
        </member>���link���asp-href-include �� ���+��������asp-href-exclude �� ���+��������asp-fallback-href �� ���+��������asp-fallback-href-include �� � �+��������asp-fallback-href-exclude �� ��+��������asp-fallback-test-class �� ��+��������asp-fallback-test-property �� ��+��������asp-fallback-test-value �� ��+��������� �� ���+������href'�����=string Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.Href��&<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.Href">
            <summary>
            Address of the linked resource.
            </summary>
            <remarks>
            Passed through to the generated HTML in all cases.
            </remarks>
        </member>���Href�����'�����Dstring Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.HrefInclude��G<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.HrefInclude">
            <summary>
            A comma separated list of globbed file patterns of CSS stylesheets to load.
            The glob patterns are assessed relative to the application's 'webroot' setting.
            </summary>
        </member>���HrefInclude�����'�����Dstring Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.HrefExclude���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.HrefExclude">
            <summary>
            A comma separated list of globbed file patterns of CSS stylesheets to exclude from loading.
            The glob patterns are assessed relative to the application's 'webroot' setting.
            Must be used in conjunction with <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.HrefInclude" />.
            </summary>
        </member>���HrefExclude�����'�����Estring Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHref���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHref">
            <summary>
            The URL of a CSS stylesheet to fallback to in the case the primary one fails.
            </summary>
        </member>���FallbackHref����asp-suppress-fallback-integrityo�����Pbool Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.SuppressFallbackIntegrity��L<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.SuppressFallbackIntegrity">
            <summary>
            Boolean value that determines if an integrity hash will be compared with <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHref" /> value.
            </summary>
        </member>���SuppressFallbackIntegrity������������OSystem.Boolean? Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.AppendVersion��x<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.AppendVersion">
            <summary>
            Value indicating if file version should be appended to the href urls.
            </summary>
            <remarks>
            If <c>true</c> then a query string "v" with the encoded content of the file is added.
            </remarks>
        </member>��R���� '�����Lstring Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHrefInclude���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHrefInclude">
            <summary>
            A comma separated list of globbed file patterns of CSS stylesheets to fallback to in the case the primary
            one fails.
            The glob patterns are assessed relative to the application's 'webroot' setting.
            </summary>
        </member>���FallbackHrefInclude����'�����Lstring Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHrefExclude��<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHrefExclude">
            <summary>
            A comma separated list of globbed file patterns of CSS stylesheets to exclude from the fallback list, in
            the case the primary one fails.
            The glob patterns are assessed relative to the application's 'webroot' setting.
            Must be used in conjunction with <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHrefInclude" />.
            </summary>
        </member>���FallbackHrefExclude����'�����Jstring Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackTestClass���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackTestClass">
            <summary>
            The class name defined in the stylesheet to use for the fallback test.
            Must be used in conjunction with <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackTestProperty" /> and <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackTestValue" />,
            and either <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHref" /> or <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHrefInclude" />.
            </summary>
        </member>���FallbackTestClass����'�����Mstring Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackTestProperty��{<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackTestProperty">
            <summary>
            The CSS property name to use for the fallback test.
            Must be used in conjunction with <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackTestClass" /> and <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackTestValue" />,
            and either <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHref" /> or <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHrefInclude" />.
            </summary>
        </member>���FallbackTestProperty����'�����Jstring Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackTestValue��|<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackTestValue">
            <summary>
            The CSS property value to use for the fallback test.
            Must be used in conjunction with <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackTestClass" /> and <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackTestProperty" />,
            and either <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHref" /> or <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.LinkTagHelper.FallbackHrefInclude" />.
            </summary>
        </member>���FallbackTestValue���*��+�LinkTagHelper,�
-�����3Microsoft.AspNetCore.Mvc.TagHelpers.OptionTagHelper�
�(���<member name="T:Microsoft.AspNetCore.Mvc.TagHelpers.OptionTagHelper">
            <summary>
            <see cref="T:Microsoft.AspNetCore.Razor.TagHelpers.ITagHelper" /> implementation targeting &lt;option&gt; elements.
            </summary>
            <remarks>
            This <see cref="T:Microsoft.AspNetCore.Razor.TagHelpers.ITagHelper" /> works in conjunction with <see cref="T:Microsoft.AspNetCore.Mvc.TagHelpers.SelectTagHelper" />. It reads elements
            content but does not modify that content. The only modification it makes is to add a <c>selected</c> attribute
            in some cases.
            </remarks>
        </member>���option� ������'�����@string Microsoft.AspNetCore.Mvc.TagHelpers.OptionTagHelper.Value��;<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.OptionTagHelper.Value">
            <summary>
            Specifies a value for the &lt;option&gt; element.
            </summary>
            <remarks>
            Passed through to the generated HTML in all cases.
            </remarks>
        </member>��X���*�(+�OptionTagHelper,�
-�����4Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper�
�.�٭<member name="T:Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper">
            <summary>
            Renders a partial view.
            </summary>
        </member>���partial���� �� ���+�������'�����@string Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.Name���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.Name">
            <summary>
            The name or path of the partial view that is rendered to the response.
            </summary>
        </member>��H����for�������nMicrosoft.AspNetCore.Mvc.ViewFeatures.ModelExpression Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.For��<<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.For">
            <summary>
            An expression to be evaluated against the current model. Cannot be used together with <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.Model" />.
            </summary>
        </member>��T����model�����Aobject Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.Model��,<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.Model">
            <summary>
            The model to pass into the partial view. Cannot be used together with <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.For" />.
            </summary>
        </member>��s����optionalo�����Bbool Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.Optional��7<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.Optional">
            <summary>
            When optional, executing the tag helper will no-op if the view cannot be located.
            Otherwise will throw stating the view could not be found.
            </summary>
        </member>���Optional����fallback-name'�����Hstring Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.FallbackName��(<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.FallbackName">
            <summary>
            View to lookup if the view specified by <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.Name" /> cannot be located.
            </summary>
        </member>���FallbackName����view-data�8Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary�êview-data-�vMicrosoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.ViewData��	<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.PartialTagHelper.ViewData">
            <summary>
            A <see cref="T:Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary" /> to pass into the partial view.
            </summary>
        </member>���ViewData���*�.+�PartialTagHelper,�
-�����BMicrosoft.AspNetCore.Mvc.TagHelpers.PersistComponentStateTagHelper�
�H��6<member name="T:Microsoft.AspNetCore.Mvc.TagHelpers.PersistComponentStateTagHelper">
            <summary>
            A <see cref="T:Microsoft.AspNetCore.Razor.TagHelpers.TagHelper" /> that saves the state of Razor components rendered on the page up to that point.
            </summary>
        </member>���persist-component-state������persist-mode�4Microsoft.AspNetCore.Mvc.TagHelpers.PersistenceMode?����هMicrosoft.AspNetCore.Mvc.TagHelpers.PersistenceMode? Microsoft.AspNetCore.Mvc.TagHelpers.PersistComponentStateTagHelper.PersistenceMode��B<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.PersistComponentStateTagHelper.PersistenceMode">
            <summary>
            Gets or sets the <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.PersistComponentStateTagHelper.PersistenceMode" /> for the state to persist.
            </summary>
        </member>���PersistenceMode���*�H+�PersistComponentStateTagHelper,�
-�����3Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper�
�Q���<member name="T:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper">
            <summary>
            <see cref="T:Microsoft.AspNetCore.Razor.TagHelpers.ITagHelper" /> implementation targeting &lt;script&gt; elements that supports fallback src paths.
            </summary>
            <remarks>
            The tag helper won't process for cases with just the 'src' attribute.
            </remarks>
        </member>���script� ��asp-src-include �� �T�+����S� ��asp-src-exclude �� �U�+����S� ��asp-fallback-src �� �V�+����S� ��asp-fallback-src-include �� �W�+����S� ��asp-fallback-src-exclude �� �X�+����S� ��asp-fallback-test �� �Y�+����S� ��� �� ���+�������'�����>string Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.Src��.<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.Src">
            <summary>
            Address of the external script to use.
            </summary>
            <remarks>
            Passed through to the generated HTML in all cases.
            </remarks>
        </member>��Q����T'�����Estring Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.SrcInclude��K<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.SrcInclude">
            <summary>
            A comma separated list of globbed file patterns of JavaScript scripts to load.
            The glob patterns are assessed relative to the application's 'webroot' setting.
            </summary>
        </member>���SrcInclude����U'�����Estring Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.SrcExclude���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.SrcExclude">
            <summary>
            A comma separated list of globbed file patterns of JavaScript scripts to exclude from loading.
            The glob patterns are assessed relative to the application's 'webroot' setting.
            Must be used in conjunction with <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.SrcInclude" />.
            </summary>
        </member>���SrcExclude����V'�����Fstring Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.FallbackSrc���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.FallbackSrc">
            <summary>
            The URL of a Script tag to fallback to in the case the primary one fails.
            </summary>
        </member>���FallbackSrc����o�����Rbool Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.SuppressFallbackIntegrity��O<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.SuppressFallbackIntegrity">
            <summary>
            Boolean value that determines if an integrity hash will be compared with <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.FallbackSrc" /> value.
            </summary>
        </member>��_������������QSystem.Boolean? Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.AppendVersion��a<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.AppendVersion">
            <summary>
            Value indicating if file version should be appended to src urls.
            </summary>
            <remarks>
            A query string "v" with the encoded content of the file is added.
            </remarks>
        </member>��R����W'�����Mstring Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.FallbackSrcInclude���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.FallbackSrcInclude">
            <summary>
            A comma separated list of globbed file patterns of JavaScript scripts to fallback to in the case the
            primary one fails.
            The glob patterns are assessed relative to the application's 'webroot' setting.
            </summary>
        </member>���FallbackSrcInclude����X'�����Mstring Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.FallbackSrcExclude��$<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.FallbackSrcExclude">
            <summary>
            A comma separated list of globbed file patterns of JavaScript scripts to exclude from the fallback list, in
            the case the primary one fails.
            The glob patterns are assessed relative to the application's 'webroot' setting.
            Must be used in conjunction with <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.FallbackSrcInclude" />.
            </summary>
        </member>���FallbackSrcExclude����Y'�����Qstring Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.FallbackTestExpression���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper.FallbackTestExpression">
            <summary>
            The script method defined in the primary script to use for the fallback test.
            </summary>
        </member>���FallbackTestExpression���*�Q+�ScriptTagHelper,�
-�����3Microsoft.AspNetCore.Mvc.TagHelpers.SelectTagHelper�
�s��N<member name="T:Microsoft.AspNetCore.Mvc.TagHelpers.SelectTagHelper">
            <summary>
            <see cref="T:Microsoft.AspNetCore.Razor.TagHelpers.ITagHelper" /> implementation targeting &lt;select&gt; elements with <c>asp-for</c> and/or
            <c>asp-items</c> attribute(s).
            </summary>
        </member>���select� ��� �� ���+����u� ��asp-items �� �v�+��������������mMicrosoft.AspNetCore.Mvc.ViewFeatures.ModelExpression Microsoft.AspNetCore.Mvc.TagHelpers.SelectTagHelper.For���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.SelectTagHelper.For">
            <summary>
            An expression to be evaluated against the current model.
            </summary>
        </member>��T����v�YSystem.Collections.Generic.IEnumerable<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem>����ٓSystem.Collections.Generic.IEnumerable<Microsoft.AspNetCore.Mvc.Rendering.SelectListItem> Microsoft.AspNetCore.Mvc.TagHelpers.SelectTagHelper.Items��a<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.SelectTagHelper.Items">
            <summary>
            A collection of <see cref="T:Microsoft.AspNetCore.Mvc.Rendering.SelectListItem" /> objects used to populate the &lt;select&gt; element with
            &lt;optgroup&gt; and &lt;option&gt; elements.
            </summary>
        </member>���������'�����?string Microsoft.AspNetCore.Mvc.TagHelpers.SelectTagHelper.Name��<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.SelectTagHelper.Name">
            <summary>
            The name of the &lt;input&gt; element.
            </summary>
            <remarks>
            Passed through to the generated HTML in all cases. Also used to 