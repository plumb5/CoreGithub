����I'�����Pstring Microsoft.AspNetCore.Mvc.TagHelpers.DistributedCacheTagHelper.VaryByQuery��K��:����M'�����Pstring Microsoft.AspNetCore.Mvc.TagHelpers.DistributedCacheTagHelper.VaryByRoute��O��;����Q'�����Qstring Microsoft.AspNetCore.Mvc.TagHelpers.DistributedCacheTagHelper.VaryByCookie��S��<����Uo�����Mbool Microsoft.AspNetCore.Mvc.TagHelpers.DistributedCacheTagHelper.VaryByUser��W��=����Yo�����Pbool Microsoft.AspNetCore.Mvc.TagHelpers.DistributedCacheTagHelper.VaryByCulture��[��>����]�^�����^System.DateTimeOffset? Microsoft.AspNetCore.Mvc.TagHelpers.DistributedCacheTagHelper.ExpiresOn��`��?����b�c�����[System.TimeSpan? Microsoft.AspNetCore.Mvc.TagHelpers.DistributedCacheTagHelper.ExpiresAfter��e��@����g�c�����]System.TimeSpan? Microsoft.AspNetCore.Mvc.TagHelpers.DistributedCacheTagHelper.ExpiresSliding��i��A����ko�����Jbool Microsoft.AspNetCore.Mvc.TagHelpers.DistributedCacheTagHelper.Enabled��m��B���*��+�DistributedCacheTagHelper,�
-�����8Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper�
����(<member name="T:Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper">
            <summary>
            <see cref="T:Microsoft.AspNetCore.Razor.TagHelpers.ITagHelper" /> implementation targeting &lt;environment&gt; elements that conditionally renders
            content based on the current value of <see cref="P:Microsoft.AspNetCore.Hosting.IHostingEnvironment.EnvironmentName" />.
            If the environment is not listed in the specified <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper.Names" /> or <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper.Include" />,
            or if it is in <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper.Exclude" />, the content will not be rendered.
            </summary>
        </member>���environment� �����names'�����Estring Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper.Names���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper.Names">
            <summary>
            A comma separated list of environment names in which the content should be rendered.
            If the current environment is also in the <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper.Exclude" /> list, the content will not be rendered.
            </summary>
            <remarks>
            The specified environment names are compared case insensitively to the current value of
            <see cref="P:Microsoft.AspNetCore.Hosting.IHostingEnvironment.EnvironmentName" />.
            </remarks>
        </member>���Names����include'�����Gstring Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper.Include���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper.Include">
            <summary>
            A comma separated list of environment names in which the content should be rendered.
            If the current environment is also in the <see cref="P:Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper.Exclude" /> list, the content will not be rendered.
            </summary>
            <remarks>
            The specified environment names are compared case insensitively to the current value of
            <see cref="P:Microsoft.AspNetCore.Hosting.IHostingEnvironment.EnvironmentName" />.
            </remarks>
        </member>���Include����exclude'�����Gstring Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper.Exclude���<member name="P:Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper.Exclude">
            <summary>
            A comma separated list of environment names in which the content will not be rendered.
            </summary>
            <remarks>
            The specified environment names are compared case insensitively to the current value of
            <see cref="P:Microsoft.AspNetCore.Hosting.IHostingEnvironment.EnvironmentName" />.
            </remarks>
        </member>���Exclude���*��+�EnvironmentTagHelper,�
-�����7Microsoft.AspNetCore.Mvc.TagHelpers.FormActionTagHelper�
����z<member name="T:Microsoft.AspNetCore.Mvc.TagHelpers.FormActionTagHelper">
            <summary>
            <see cref="T:Microsoft.AspNetCore.Razor.TagHelpers.ITagHelper" /> implementation targeting &lt;button&gt; elements and &lt;input&gt; elements with
            their <c>type</c> attribute set to <c>image</c> or <c>submit</c>.
            </summary>
        </member>��� ��button� �� �� ��+������ �� �� ��+������ �� �� ��+������ �� �� ��+������ �� �� ��+������ �� �� ��+������ �� �� ��+������ �� �� ��+������ ���� ��+����input���s ¥image�s�+��� �� ��+��������s ����s�+��� �� ��+��������s ����