alName OPTIONAL
                          namingAuthority [1] EXPLICIT NamingAuthority OPTIONAL
                          professionInfos SEQUENCE OF ProfessionInfo
                        }
             </pre>
            
             @param seq The ASN.1 sequence.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.Admissions.#ctor(Org.BouncyCastle.Asn1.X509.GeneralName,Org.BouncyCastle.Asn1.IsisMtt.X509.NamingAuthority,Org.BouncyCastle.Asn1.IsisMtt.X509.ProfessionInfo[])">
             Constructor from a given details.
             <p/>
             Parameter <code>professionInfos</code> is mandatory.
            
             @param admissionAuthority The admission authority.
             @param namingAuthority    The naming authority.
             @param professionInfos    The profession infos.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.Admissions.ToAsn1Object">
             Produce an object suitable for an Asn1OutputStream.
             <p/>
             Returns:
             <p/>
             <pre>
                   Admissions ::= SEQUENCE
                   {
                     admissionAuthority [0] EXPLICIT GeneralName OPTIONAL
                     namingAuthority [1] EXPLICIT NamingAuthority OPTIONAL
                     professionInfos SEQUENCE OF ProfessionInfo
                   }
             <p/>
             </pre>
            
             @return an Asn1Object
        </member>
        <member name="T:Org.BouncyCastle.Asn1.IsisMtt.X509.AdmissionSyntax">
             Attribute to indicate admissions to certain professions.
             <p/>
             <pre>
                 AdmissionSyntax ::= SEQUENCE
                 {
                   admissionAuthority GeneralName OPTIONAL,
                   contentsOfAdmissions SEQUENCE OF Admissions
                 }
             <p/>
                 Admissions ::= SEQUENCE
                 {
                   admissionAuthority [0] EXPLICIT GeneralName OPTIONAL
                   namingAuthority [1] EXPLICIT NamingAuthority OPTIONAL
                   professionInfos SEQUENCE OF ProfessionInfo
                 }
             <p/>
                 NamingAuthority ::= SEQUENCE
                 {
                   namingAuthorityId OBJECT IDENTIFIER OPTIONAL,
                   namingAuthorityUrl IA5String OPTIONAL,
                   namingAuthorityText DirectoryString(SIZE(1..128)) OPTIONAL
                 }
             <p/>
                 ProfessionInfo ::= SEQUENCE
                 {
                   namingAuthority [0] EXPLICIT NamingAuthority OPTIONAL,
                   professionItems SEQUENCE OF DirectoryString (SIZE(1..128)),
                   professionOIDs SEQUENCE OF OBJECT IDENTIFIER OPTIONAL,
                   registrationNumber PrintableString(SIZE(1..128)) OPTIONAL,
                   addProfessionInfo OCTET STRING OPTIONAL
                 }
             </pre>
             <p/>
             <p/>
             ISIS-MTT PROFILE: The relatively complex structure of AdmissionSyntax
             supports the following concepts and requirements:
             <ul>
             <li> External institutions (e.g. professional associations, chambers, unions,
             administrative bodies, companies, etc.), which are responsible for granting
             and verifying professional admissions, are indicated by means of the data
             field admissionAuthority. An admission authority is indicated by a
             GeneralName object. Here an X.501 directory name (distinguished name) can be
             indicated in the field directoryName, a URL address can be indicated in the
             field uniformResourceIdentifier, and an object identifier can be indicated in
             the field registeredId.</li>
             <li> The names of authorities which are responsible for the administration of
             title registers are indicated in the data field namingAuthority. The name of
             the authority can be identified by an object identifier in the field
             namingAuthorityId, by means of a text string in the field
             namingAuthorityText, by means of a URL address in the field
             namingAuthorityUrl, or by a combination of them. For example, the text string
             can contain the name of the authority, the country and the name of the title
             register. The URL-option refers to a web page which contains lists with
             officially registered professions (text and possibly OID) as well as
             further information on these professions. Object identifiers for the
             component namingAuthorityId are grouped under the OID-branch
             id-isis-at-namingAuthorities and must be applied for.</li>
             <li>See http://www.teletrust.de/anwend.asp?Id=30200&amp;Sprache=E_&amp;HomePG=0
             for an application form and http://www.teletrust.de/links.asp?id=30220,11
             for an overview of registered naming authorities.</li>
             <li> By means of the data type ProfessionInfo certain professions,
             specializations, disciplines, fields of activity, etc. are identified. A
             profession is represented by one or more text strings, resp. profession OIDs
             in the fields professionItems and professionOIDs and by a registration number
             in the field registrationNumber. An indication in text form must always be
             present, whereas the other indications are optional. The component
             addProfessionInfo may contain additional applicationspecific information in
             DER-encoded form.</li>
             </ul>
             <p/>
             By means of different namingAuthority-OIDs or profession OIDs hierarchies of
             professions, specializations, disciplines, fields of activity, etc. can be
             expressed. The issuing admission authority should always be indicated (field
             admissionAuthority), whenever a registration number is presented. Still,
             information on admissions can be given without indicating an admission or a
             naming authority by the exclusive use of the component professionItems. In
             this case the certification authority is responsible for the verification of
             the admission information.
             <p/>
             <p/>
             <p/>
             This attribute is single-valued. Still, several admissions can be captured in
             the sequence structure of the component contentsOfAdmissions of
             AdmissionSyntax or in the component professionInfos of Admissions. The
             component admissionAuthority of AdmissionSyntax serves as default value for
             the component admissionAuthority of Admissions. Within the latter component
             the default value can be overwritten, in case that another authority is
             responsible. The component namingAuthority of Admissions serves as a default
             value for the component namingAuthority of ProfessionInfo. Within the latter
             component the default value can be overwritten, in case that another naming
             authority needs to be recorded.
             <p/>
             The length of the string objects is limited to 128 characters. It is
             recommended to indicate a namingAuthorityURL in all issued attribute
             certificates. If a namingAuthorityURL is indicated, the field professionItems
             of ProfessionInfo should contain only registered titles. If the field
             professionOIDs exists, it has to contain the OIDs of the professions listed
             in professionItems in the same order. In general, the field professionInfos
             should contain only one entry, unless the admissions that are to be listed
             are logically connected (e.g. they have been issued under the same admission
             number).
            
             @see Org.BouncyCastle.Asn1.IsisMtt.X509.Admissions
             @see Org.BouncyCastle.Asn1.IsisMtt.X509.ProfessionInfo
             @see Org.BouncyCastle.Asn1.IsisMtt.X509.NamingAuthority
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.AdmissionSyntax.#ctor(Org.BouncyCastle.Asn1.Asn1Sequence)">
             Constructor from Asn1Sequence.
             <p/>
             The sequence is of type ProcurationSyntax:
             <p/>
             <pre>
                 AdmissionSyntax ::= SEQUENCE
                 {
                   admissionAuthority GeneralName OPTIONAL,
                   contentsOfAdmissions SEQUENCE OF Admissions
                 }
             <p/>
                 Admissions ::= SEQUENCE
                 {
                   admissionAuthority [0] EXPLICIT GeneralName OPTIONAL
                   namingAuthority [1] EXPLICIT NamingAuthority OPTIONAL
                   professionInfos SEQUENCE OF ProfessionInfo
                 }
             <p/>
                 NamingAuthority ::= SEQUENCE
                 {
                   namingAuthorityId OBJECT IDENTIFIER OPTIONAL,
                   namingAuthorityUrl IA5String OPTIONAL,
                   namingAuthorityText DirectoryString(SIZE(1..128)) OPTIONAL
                 }
             <p/>
                 ProfessionInfo ::= SEQUENCE
                 {
                   namingAuthority [0] EXPLICIT NamingAuthority OPTIONAL,
                   professionItems SEQUENCE OF DirectoryString (SIZE(1..128)),
                   professionOIDs SEQUENCE OF OBJECT IDENTIFIER OPTIONAL,
                   registrationNumber PrintableString(SIZE(1..128)) OPTIONAL,
                   addProfessionInfo OCTET STRING OPTIONAL
                 }
             </pre>
            
             @param seq The ASN.1 sequence.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.AdmissionSyntax.#ctor(Org.BouncyCastle.Asn1.X509.GeneralName,Org.BouncyCastle.Asn1.Asn1Sequence)">
             Constructor from given details.
            
             @param admissionAuthority   The admission authority.
             @param contentsOfAdmissions The admissions.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.AdmissionSyntax.ToAsn1Object">
             Produce an object suitable for an Asn1OutputStream.
             <p/>
             Returns:
             <p/>
             <pre>
                 AdmissionSyntax ::= SEQUENCE
                 {
                   admissionAuthority GeneralName OPTIONAL,
                   contentsOfAdmissions SEQUENCE OF Admissions
                 }
             <p/>
                 Admissions ::= SEQUENCE
                 {
                   admissionAuthority [0] EXPLICIT GeneralName OPTIONAL
                   namingAuthority [1] EXPLICIT NamingAuthority OPTIONAL
                   professionInfos SEQUENCE OF ProfessionInfo
                 }
             <p/>
                 NamingAuthority ::= SEQUENCE
                 {
                   namingAuthorityId OBJECT IDENTIFIER OPTIONAL,
                   namingAuthorityUrl IA5String OPTIONAL,
                   namingAuthorityText DirectoryString(SIZE(1..128)) OPTIONAL
                 }
             <p/>
                 ProfessionInfo ::= SEQUENCE
                 {
                   namingAuthority [0] EXPLICIT NamingAuthority OPTIONAL,
                   professionItems SEQUENCE OF DirectoryString (SIZE(1..128)),
                   professionOIDs SEQUENCE OF OBJECT IDENTIFIER OPTIONAL,
                   registrationNumber PrintableString(SIZE(1..128)) OPTIONAL,
                   addProfessionInfo OCTET STRING OPTIONAL
                 }
             </pre>
            
             @return an Asn1Object
        </member>
        <member name="P:Org.BouncyCastle.Asn1.IsisMtt.X509.AdmissionSyntax.AdmissionAuthority">
            @return Returns the admissionAuthority if present, null otherwise.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.AdmissionSyntax.GetContentsOfAdmissions">
            @return Returns the contentsOfAdmissions.
        </member>
        <member name="T:Org.BouncyCastle.Asn1.IsisMtt.X509.DeclarationOfMajority">
            A declaration of majority.
            <p/>
            <pre>
                      DeclarationOfMajoritySyntax ::= CHOICE
                      {
                        notYoungerThan [0] IMPLICIT INTEGER,
                        fullAgeAtCountry [1] IMPLICIT SEQUENCE
                        {
                          fullAge BOOLEAN DEFAULT TRUE,
                          country PrintableString (SIZE(2))
                        }
                        dateOfBirth [2] IMPLICIT GeneralizedTime
                      }
            </pre>
            <p/>
            fullAgeAtCountry indicates the majority of the owner with respect to the laws
            of a specific country.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.DeclarationOfMajority.ToAsn1Object">
             Produce an object suitable for an Asn1OutputStream.
             <p/>
             Returns:
             <p/>
             <pre>
                       DeclarationOfMajoritySyntax ::= CHOICE
                       {
                         notYoungerThan [0] IMPLICIT INTEGER,
                         fullAgeAtCountry [1] IMPLICIT SEQUENCE
                         {
                           fullAge BOOLEAN DEFAULT TRUE,
                           country PrintableString (SIZE(2))
                         }
                         dateOfBirth [2] IMPLICIT GeneralizedTime
                       }
             </pre>
            
             @return an Asn1Object
        </member>
        <member name="P:Org.BouncyCastle.Asn1.IsisMtt.X509.DeclarationOfMajority.NotYoungerThan">
            @return notYoungerThan if that's what we are, -1 otherwise
        </member>
        <member name="T:Org.BouncyCastle.Asn1.IsisMtt.X509.MonetaryLimit">
            Monetary limit for transactions. The QcEuMonetaryLimit QC statement MUST be
            used in new certificates in place of the extension/attribute MonetaryLimit
            since January 1, 2004. For the sake of backward compatibility with
            certificates already in use, components SHOULD support MonetaryLimit (as well
            as QcEuLimitValue).
            <p/>
            Indicates a monetary limit within which the certificate holder is authorized
            to act. (This value DOES NOT express a limit on the liability of the
            certification authority).
            <p/>
            <pre>
               MonetaryLimitSyntax ::= SEQUENCE
               {
                 currency PrintableString (SIZE(3)),
                 amount INTEGER,
                 exponent INTEGER
               }
            </pre>
            <p/>
            currency must be the ISO code.
            <p/>
            value = amount�10*exponent
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.MonetaryLimit.#ctor(System.String,System.Int32,System.Int32)">
             Constructor from a given details.
             <p/>
             <p/>
             value = amount�10^exponent
            
             @param currency The currency. Must be the ISO code.
             @param amount   The amount
             @param exponent The exponent
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.MonetaryLimit.ToAsn1Object">
             Produce an object suitable for an Asn1OutputStream.
             <p/>
             Returns:
             <p/>
             <pre>
                MonetaryLimitSyntax ::= SEQUENCE
                {
                  currency PrintableString (SIZE(3)),
                  amount INTEGER,
                  exponent INTEGER
                }
             </pre>
            
             @return an Asn1Object
        </member>
        <member name="T:Org.BouncyCastle.Asn1.IsisMtt.X509.NamingAuthority">
            Names of authorities which are responsible for the administration of title
            registers.
            
            <pre>
                        NamingAuthority ::= SEQUENCE 
                        {
                          namingAuthorityID OBJECT IDENTIFIER OPTIONAL,
                          namingAuthorityUrl IA5String OPTIONAL,
                          namingAuthorityText DirectoryString(SIZE(1..128)) OPTIONAL
                        }
            </pre>
            @see Org.BouncyCastle.Asn1.IsisMtt.X509.AdmissionSyntax
            
        </member>
        <member name="F:Org.BouncyCastle.Asn1.IsisMtt.X509.NamingAuthority.IdIsisMttATNamingAuthoritiesRechtWirtschaftSteuern">
            Profession OIDs should always be defined under the OID branch of the
            responsible naming authority. At the time of this writing, the work group
            �Recht, Wirtschaft, Steuern� (�Law, Economy, Taxes�) is registered as the
            first naming authority under the OID id-isismtt-at-namingAuthorities.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.NamingAuthority.#ctor(Org.BouncyCastle.Asn1.Asn1Sequence)">
             Constructor from Asn1Sequence.
             <p/>
             <p/>
             <pre>
                         NamingAuthority ::= SEQUENCE
                         {
                           namingAuthorityID OBJECT IDENTIFIER OPTIONAL,
                           namingAuthorityUrl IA5String OPTIONAL,
                           namingAuthorityText DirectoryString(SIZE(1..128)) OPTIONAL
                         }
             </pre>
            
             @param seq The ASN.1 sequence.
        </member>
        <member name="P:Org.BouncyCastle.Asn1.IsisMtt.X509.NamingAuthority.NamingAuthorityID">
            @return Returns the namingAuthorityID.
        </member>
        <member name="P:Org.BouncyCastle.Asn1.IsisMtt.X509.NamingAuthority.NamingAuthorityText">
            @return Returns the namingAuthorityText.
        </member>
        <member name="P:Org.BouncyCastle.Asn1.IsisMtt.X509.NamingAuthority.NamingAuthorityUrl">
            @return Returns the namingAuthorityUrl.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.NamingAuthority.#ctor(Org.BouncyCastle.Asn1.DerObjectIdentifier,System.String,Org.BouncyCastle.Asn1.X500.DirectoryString)">
             Constructor from given details.
             <p/>
             All parameters can be combined.
            
             @param namingAuthorityID   ObjectIdentifier for naming authority.
             @param namingAuthorityUrl  URL for naming authority.
             @param namingAuthorityText Textual representation of naming authority.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.NamingAuthority.ToAsn1Object">
             Produce an object suitable for an Asn1OutputStream.
             <p/>
             Returns:
             <p/>
             <pre>
                         NamingAuthority ::= SEQUENCE
                         {
                           namingAuthorityID OBJECT IDENTIFIER OPTIONAL,
                           namingAuthorityUrl IA5String OPTIONAL,
                           namingAuthorityText DirectoryString(SIZE(1..128)) OPTIONAL
                         }
             </pre>
            
             @return an Asn1Object
        </member>
        <member name="T:Org.BouncyCastle.Asn1.IsisMtt.X509.ProcurationSyntax">
            Attribute to indicate that the certificate holder may sign in the name of a
            third person.
            <p>
            ISIS-MTT PROFILE: The corresponding ProcurationSyntax contains either the
            name of the person who is represented (subcomponent thirdPerson) or a
            reference to his/her base certificate (in the component signingFor,
            subcomponent certRef), furthermore the optional components country and
            typeSubstitution to indicate the country whose laws apply, and respectively
            the type of procuration (e.g. manager, procuration, custody).
            </p>
            <p>
            ISIS-MTT PROFILE: The GeneralName MUST be of type directoryName and MAY only
            contain: - RFC3039 attributes, except pseudonym (countryName, commonName,
            surname, givenName, serialNumber, organizationName, organizationalUnitName,
            stateOrProvincename, localityName, postalAddress) and - SubjectDirectoryName
            attributes (title, dateOfBirth, placeOfBirth, gender, countryOfCitizenship,
            countryOfResidence and NameAtBirth).
            </p>
            <pre>
                          ProcurationSyntax ::= SEQUENCE {
                            country [1] EXPLICIT PrintableString(SIZE(2)) OPTIONAL,
                            typeOfSubstitution [2] EXPLICIT DirectoryString (SIZE(1..128)) OPTIONAL,
                            signingFor [3] EXPLICIT SigningFor 
                          }
                          
                          SigningFor ::= CHOICE 
                          { 
                            thirdPerson GeneralName,
                            certRef IssuerSerial 
                          }
            </pre>
            
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.ProcurationSyntax.#ctor(Org.BouncyCastle.Asn1.Asn1Sequence)">
             Constructor from Asn1Sequence.
             <p/>
             The sequence is of type ProcurationSyntax:
             <p/>
             <pre>
                           ProcurationSyntax ::= SEQUENCE {
                             country [1] EXPLICIT PrintableString(SIZE(2)) OPTIONAL,
                             typeOfSubstitution [2] EXPLICIT DirectoryString (SIZE(1..128)) OPTIONAL,
                             signingFor [3] EXPLICIT SigningFor
                           }
             <p/>
                           SigningFor ::= CHOICE
                           {
                             thirdPerson GeneralName,
                             certRef IssuerSerial
                           }
             </pre>
            
             @param seq The ASN.1 sequence.
        </member>