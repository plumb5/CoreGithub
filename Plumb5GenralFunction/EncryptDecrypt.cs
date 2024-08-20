using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class EncryptDecrypt
    {
        //Symmetric (Same) key AES Algorithm for Encryption and Decryption

        private const string EncryptionKey = "PLUMB5@12345";// Please never change this value suddenly, you have to take down time for this and it may effect current campaigns
        public static string Encrypt(string textToEncrypt)
        {
            try
            {
                byte[] clearBytes = Encoding.Unicode.GetBytes(textToEncrypt);
                using (Aes encryptor = Aes.Create())
                {
                    Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                    encryptor.Key = pdb.GetBytes(32);
                    encryptor.IV = pdb.GetBytes(16);
                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                        {
                            cs.Write(clearBytes, 0, clearBytes.Length);
                            cs.Close();
                        }
                        textToEncrypt = Convert.ToBase64String(ms.ToArray());
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("EncryptDecrypt"))
                {
                    objError.AddError(ex.ToString(), textToEncrypt, DateTime.Now.ToString(), "Error", "Encrypt function");
                }
            }
            return textToEncrypt;
        }

        public static string Decrypt(string encryptedText)
        {
            try
            {
                byte[] cipherBytes = Convert.FromBase64String(encryptedText);
                using (Aes encryptor = Aes.Create())
                {
                    Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(EncryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                    encryptor.Key = pdb.GetBytes(32);
                    encryptor.IV = pdb.GetBytes(16);
                    using (MemoryStream ms = new MemoryStream())
                    {
                        using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                        {
                            cs.Write(cipherBytes, 0, cipherBytes.Length);
                            cs.Close();
                        }
                        encryptedText = Encoding.Unicode.GetString(ms.ToArray());
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("EncryptDecrypt"))
                {
                    objError.AddError(ex.ToString(), encryptedText, DateTime.Now.ToString(), "Error", "Decrypt function");
                }
            }
            return encryptedText;
        }
    }
}
