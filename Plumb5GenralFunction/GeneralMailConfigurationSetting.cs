                       signingFor [3] EXPLICIT SigningFor
                           }
             <p/>
                           SigningFor ::= CHOICE
                           {
                             thirdPerson GeneralName,
                             certRef IssuerSerial
                           }
             </pre>
            
             @return an Asn1Object
        </member>
        <member name="T:Org.BouncyCastle.Asn1.IsisMtt.X509.ProfessionInfo">
            Professions, specializations, disciplines, fields of activity, etc.
            
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
            
            @see Org.BouncyCastle.Asn1.IsisMtt.X509.AdmissionSyntax
        </member>
        <member name="F:Org.BouncyCastle.Asn1.IsisMtt.X509.ProfessionInfo.Rechtsanwltin">
            Rechtsanw�ltin
        </member>
        <member name="F:Org.BouncyCastle.Asn1.IsisMtt.X509.ProfessionInfo.Rechtsanwalt">
            Rechtsanwalt
        </member>
        <member name="F:Org.BouncyCastle.Asn1.IsisMtt.X509.ProfessionInfo.Rechtsbeistand">
            Rechtsbeistand
        </memb