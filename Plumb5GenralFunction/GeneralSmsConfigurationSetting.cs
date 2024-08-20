   Constructor from Asn1Sequence.
             <p/>
             <p/>
             <pre>
                           ProfessionInfo ::= SEQUENCE
                           {
                             namingAuthority [0] EXPLICIT NamingAuthority OPTIONAL,
                             professionItems SEQUENCE OF DirectoryString (SIZE(1..128)),
                             professionOids SEQUENCE OF OBJECT IDENTIFIER OPTIONAL,
                             registrationNumber PrintableString(SIZE(1..128)) OPTIONAL,
                             addProfessionInfo OCTET STRING OPTIONAL
                           }
             </pre>
            
             @param seq The ASN.1 sequence.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.ProfessionInfo.#ctor(Org.BouncyCastle.Asn1.IsisMtt.X509.NamingAuthority,Org.BouncyCastle.Asn1.X500.DirectoryString[],Org.BouncyCastle.Asn1.DerObjectIdentifier[],System.String,Org.BouncyCastle.Asn1.Asn1OctetString)">
             Constructor from given details.
             <p/>
             <code>professionItems</code> is mandatory, all other parameters are
             optional.
            
             @param namingAuthority    The naming authority.
             @param professionItems    Directory strings of the profession.
             @param professionOids     DERObjectIdentfier objects for the
                                       profession.
             @param registrationNumber Registration number.
             @param addProfessionInfo  Additional infos in encoded form.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.ProfessionInfo.ToAsn1Object">
             Produce an object suitable for an Asn1OutputStream.
             <p/>
             Returns:
             <p/>
             <pre>
                           ProfessionInfo ::= SEQUENCE
                           {
                             namingAuthority [0] EXPLICIT NamingAuthority OPTIONAL,
                             professionItems SEQUENCE OF DirectoryString (SIZE(1..128)),
                             professionOids SEQUENCE OF OBJECT IDENTIFIER OPTIONAL,
                             registrationNumber PrintableString(SIZE(1..128)) OPTIONAL,
                             addProfessionInfo OCTET STRING OPTIONAL
                           }
             </pre>
            
             @return an Asn1Object
        </member>
        <member name="P:Org.BouncyCastle.Asn1.IsisMtt.X509.ProfessionInfo.AddProfessionInfo">
            @return Returns the addProfessionInfo.
        </member>
        <member name="P:Org.BouncyCastle.Asn1.IsisMtt.X509.ProfessionInfo.NamingAuthority">
            @return Returns the namingAuthority.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.I