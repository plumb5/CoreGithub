le.Asn1.IsisMtt.X509.Restriction.#ctor(System.String)">
             Constructor from a given details.
            
             @param restriction The description of the restriction.
        </member>
        <member name="M:Org.BouncyCastle.Asn1.IsisMtt.X509.Restriction.ToAsn1Object">
             Produce an object suitable for an Asn1OutputStream.
             <p/>
             Returns:
             <p/>
             <pre>
                  RestrictionSyntax ::= DirectoryString (SIZE(1..1024))
             <p/>
             </pre>
            
             @return an Asn1Object
        </member>
        <member name="M:Org.BouncyCastle.Asn1.Misc.Cast5CbcParameters.ToAsn1Object">
            Produce an object suitable for an Asn1OutputStream.
            <pre>
            cast5CBCParameters ::= Sequence {
                                      iv         OCTET STRING DEFAULT 0,
                                             -- Initialization vector
    