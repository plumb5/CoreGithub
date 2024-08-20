         [0] Attributes OPTIONAL,
                  ...,
                  [[2: publicKey        [1] PublicKey OPTIONAL ]],
                  ...
              }
            
              PrivateKeyInfo ::= OneAsymmetricKey
            
              Version ::= INTEGER { v1(0), v2(1) } (v1, ..., v2)
            
              PrivateKeyAlgorithmIdentifier ::= AlgorithmIdentifier
                                                 { PUBLIC-KEY,
                                                   { PrivateKeyAlgorithms } }
            
              PrivateKey ::= OCTET STRING
                                 -- Content varies based on type of key.  The
                                 -- algorithm identifier dictates the format of
                                 -- the key.
            
              PublicKey ::= BIT STRING
                                 -- Content varies based on type of key.  The
                                 -- algorithm identifier dictates the format of
                                 -- the key.
            
              Attributes ::= SET OF Attribute { { OneAsymmetricKeyAttributes } }
              </pre>
        </member>
        <member name="P:Org.BouncyCastle.Asn1.Pkcs.PrivateKeyInfo.HasPublicKey">
            <summary>Return true if a public key is present, false otherwise.</summary>
        </member>
        <member name="M:Org.BouncyCastle.Asn1.Pkcs.PrivateKeyInfo.ParsePublicKey">
            <summary>For when the public key is an ASN.1 encoding.</summary>
        </member>
        <member name="P:Org.BouncyCastle.Asn1.Pkcs.PrivateKeyInfo.PublicKeyData">
            <summary>Return the public key as a raw bit string.</summary>
        </member>
        <member name="M:Org.BouncyCastle.Asn1.Pkcs.RsaesOaepParameters.#ctor">
            The default version
        </member>
        <member name="M:Org.BouncyCastle.Asn1.Pkcs.RsaesOaepParameters.ToAsn1Object">
             <pre>
              RSAES-OAEP-params ::= SEQUENCE {
                 hashAlgorithm      [0] OAEP-PSSDigestAlgorithms     DEFAULT sha1,
                 maskGenAlgorithm   [1] PKCS1MGFAlgorithms  DEFAULT mgf1SHA1,
                 pSourceAlgorithm   [2] PKCS1PSourceAlgorithms  DEFAULT pSpecifiedEmpty
               }
            
               OAEP-PSSDigestAlgorithms    ALGORITHM-IDENTIFIER ::= {
                 { OID id-sha1 PARAMETERS NULL   }|
                 { OID id-sha256 PARAMETERS NULL }|
                 { OID id-sha384 PARAMETERS NULL }|
                 { OID id-sha512 PARAMETERS NULL },
                 ...  -- Allows for future expansion --
               }
               PKCS1MGFAlgorithms    ALGORITHM-IDENTIFIER ::= {
                 { OID id-mgf1 PARA