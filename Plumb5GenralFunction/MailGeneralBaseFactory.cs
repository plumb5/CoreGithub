d by the given object identifier.
        </member>
        <member name="P:Org.BouncyCastle.Asn1.Nist.NistNamedCurves.Names">
            returns an enumeration containing the name strings for curves
            contained in this structure.
        </member>
        <member name="F:Org.BouncyCastle.Asn1.Nist.NistObjectIdentifiers.IdDsaWithSha3_224">
            2.16.840.1.101.3.4.3.5 
        </member>
        <member name="F:Org.BouncyCastle.Asn1.Nist.NistObjectIdentifiers.IdDsaWithSha3_256">
            2.16.840.1.101.3.4.3.6 
        </member>
        <member name="F:Org.BouncyCastle.Asn1.Nist.NistObjectIdentifiers.IdDsaWithSha3_384">
            2.16.840.1.101.3.4.3.7 
        </member>
        <member name="F:Org.BouncyCastle.Asn1.Nist.NistObjectIdentifiers.IdDsaWithSha3_512">
            2.16.840.1.101.3.4.3.8 
        </member>
        <member name="F:Org.BouncyCastle.Asn1.Nist.NistObjectIdentifiers.IdEcdsaWithSha3_224">
            2.16.840.1.101.3.4.3.9 
        </member>
        <member name="F:Org.BouncyCastle.Asn1.Nist.NistObjectIdentifiers.IdEcdsaWithSha3_256">
            2.16.840.1.101.3.4.3.10 
        </member>
        <member name="F:Org.BouncyCastle.Asn1.Nist.NistObjectIdentifiers.IdEcdsaWithSha3_384">
            2.16.840.1.101.3.4.3.11 
        </member>
        <member name="F:Org.BouncyCastle.Asn1.Nist.NistObjectIdentifiers.IdEcdsaWithSha3_512">
            2.16.840.1.101.3.4.3.12 
        </member>
        <member name="F:Org.BouncyCastle.Asn1.Nist.NistObjectIdentifiers.IdRsassaPkcs1V15WithSha3_224">
            2.16.840.1.101.3.4.3.9 
        </member>
        <member name="F:Org.BouncyCastle.Asn1.Nist.NistObjectIdentifiers.IdRsassaPkcs1V15WithSha3_256">
            2.16.840.1.101.3.4.3.10 
        </member>
        <member name="F:Org.BouncyCastle.Asn1.Nist.NistObjectIdentifiers.IdRsassaPkcs1V15WithSha3_384">
            2.16.840.1.101.3.4.3.11 
        </member>
        <member name="F:Org.BouncyCastle.Asn1.Nist.NistObjectIdentifiers.IdRsassaPkcs1V15WithSha3_512">
            2.16.840.1.101.3.4.3.12 
        </member>
        <member name="T:Org.BouncyCastle.Asn1.Ntt.NttObjectIdentifiers">
            <summary>From RFC 3657</summary>
        </member>
        <member name="M:Org.BouncyCastle.Asn1.Ocsp.BasicOcspResponse.ToAsn1Object">
            Produce an object suitable for an Asn1OutputStream.
            <pre>
            BasicOcspResponse       ::= Sequence {
                 tbsResponseData      ResponseData,
                 signatureAlgorithm   AlgorithmIdentifier,
                 signature            BIT STRING,
                 certs                [0] EXPLICIT Sequence OF Certificate OPTIONAL }
            </pre>
        </member>
        <member name="M:Org.BouncyCastle.Asn1.Ocsp.CertID.ToAsn1Object">
            Produce an object suitable for an Asn1OutputStream.
            <pre>
            CertID          ::=     Sequence {
                hashAlgorithm       AlgorithmIdentifier,
                issuerNameHash      OCTET STRING, -- Hash of Issuer's DN
                issuerKeyHash       OCTET STRING, --